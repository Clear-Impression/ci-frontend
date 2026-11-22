'use server';

import {
  checkApplication,
  resumeType,
  workDays,
  type ApplicationState,
  type ApplicationValues,
} from '@/data/careers';
import { getJobOpening } from '@/lib/careers';

const uuidPattern = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

function readText(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === 'string' ? value.trim() : '';
}

// Check the application on the server, then send it and the resume to the backend API.
export async function submitApplication(
  _previous: ApplicationState,
  formData: FormData,
): Promise<ApplicationState> {
  const values: ApplicationValues = {
    name: readText(formData, 'name'),
    email: readText(formData, 'email'),
    phone: readText(formData, 'phone'),
    city: readText(formData, 'city'),
    license: readText(formData, 'license'),
    // Only real day names, in week order.
    days: workDays.filter((day) => formData.getAll('days').includes(day)),
    startDate: readText(formData, 'startDate'),
    experience: readText(formData, 'experience'),
  };

  // Bots tend to fill every field, including this hidden one. Quietly accept and drop it.
  if (readText(formData, 'website')) {
    return { status: 'success' };
  }

  const file = formData.get('resume');
  const resume = file instanceof File && file.size > 0 ? file : null;

  const errors = checkApplication(values, resume);
  if (values.startDate && !/^\d{4}-\d{2}-\d{2}$/.test(values.startDate))
    errors.startDate = 'Please pick a date from the calendar.';
  if (Object.keys(errors).length > 0) {
    return { status: 'invalid', errors, values };
  }

  // The role may have been paused or deleted in Sanity since the page loaded.
  const opening = await getJobOpening(readText(formData, 'role'));
  if (!opening) return { status: 'closed', values };

  // The form makes this key once per application, so a retry is never saved twice.
  const submissionKey = readText(formData, 'submissionKey');
  if (!uuidPattern.test(submissionKey) || !resume) return { status: 'error', values };

  // Same backend address the FAQ page uses. It stays on the server.
  const baseUrl = (process.env.API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

  try {
    const data = Buffer.from(await resume.arrayBuffer()).toString('base64');
    const response = await fetch(`${baseUrl}/api/v1/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        submission_key: submissionKey,
        role_slug: opening.slug,
        role_title: opening.title,
        name: values.name,
        email: values.email,
        phone: values.phone,
        city: values.city || null,
        has_license: values.license === 'yes',
        available_days: values.days,
        start_date: values.startDate || null,
        experience: values.experience || null,
        resume: {
          filename: resume.name,
          content_type: resumeType(resume.name),
          data,
        },
      }),
      cache: 'no-store',
      // The backend emails the resume before it answers, so allow a little longer.
      signal: AbortSignal.timeout(25_000),
    });

    // 201 is a new application, 200 is a retry the backend already saved.
    if (response.status === 200 || response.status === 201) {
      return { status: 'success', firstName: values.name?.split(/\s+/)[0] };
    }

    // The fields match the form's checks, so a 422 here means the file itself.
    if (response.status === 422) {
      return {
        status: 'invalid',
        errors: { resume: 'We couldn’t read that resume. Please attach a PDF, DOC, or DOCX file.' },
        values,
      };
    }

    // 404 (older backend) or 503 (database not set up) means it can't be saved right now.
    if (response.status === 404 || response.status === 503) return { status: 'unavailable', values };

    return { status: 'error', values };
  } catch {
    // The backend is not running or could not be reached.
    return { status: 'unavailable', values };
  }
}
