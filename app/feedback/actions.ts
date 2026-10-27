'use server';

import {
  feedbackLimits,
  type FeedbackField,
  type FeedbackState,
} from '@/data/feedback';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readText(formData: FormData, field: FeedbackField | 'website') {
  const value = formData.get(field);
  return typeof value === 'string' ? value.trim() : '';
}

// Check the form on the server, then send it to the backend API.
export async function submitFeedback(
  _previous: FeedbackState,
  formData: FormData,
): Promise<FeedbackState> {
  const values = {
    name: readText(formData, 'name'),
    email: readText(formData, 'email'),
    message: readText(formData, 'message'),
  };

  // Bots tend to fill every field, including this hidden one. Quietly accept and drop it.
  if (readText(formData, 'website')) {
    return { status: 'success' };
  }

  const errors: FeedbackState['errors'] = {};
  if (!values.name) errors.name = 'Please enter your name.';
  else if (values.name.length > feedbackLimits.name)
    errors.name = `Please keep your name under ${feedbackLimits.name} characters.`;

  if (!values.email) errors.email = 'Please enter your email address.';
  else if (!emailPattern.test(values.email) || values.email.length > feedbackLimits.email)
    errors.email = 'Please enter a valid email address, like name@example.com.';

  if (values.message.length < 10)
    errors.message = 'Please share a little more detail (at least 10 characters).';
  else if (values.message.length > feedbackLimits.message)
    errors.message = `Please keep your feedback under ${feedbackLimits.message} characters.`;

  if (Object.keys(errors).length > 0) {
    return { status: 'invalid', errors, values };
  }

  // Same backend address the FAQ page uses. It stays on the server.
  const baseUrl = (process.env.API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

  try {
    const response = await fetch(`${baseUrl}/api/v1/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
      cache: 'no-store',
      signal: AbortSignal.timeout(10_000),
    });

    if (response.ok) return { status: 'success' };

    // 404 means the backend endpoint has not been built yet.
    if (response.status === 404) return { status: 'unavailable', values };

    return { status: 'error', values };
  } catch {
    // The backend is not running or could not be reached.
    return { status: 'unavailable', values };
  }
}
