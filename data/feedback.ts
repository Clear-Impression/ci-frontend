// Feedback form copy and limits, shared by the page, form, and server action.
export const feedbackLimits = {
  name: 100,
  email: 254,
  message: 2000,
} as const;

export const feedbackPage = {
  eyebrow: 'Feedback',
  title: 'Help us do even better',
  description:
    'Tell us how your service went or what we could improve. Every message is read by our team.',
} as const;

export type FeedbackField = 'name' | 'email' | 'message';

export type FeedbackState = {
  status: 'idle' | 'success' | 'invalid' | 'unavailable' | 'error';
  errors?: Partial<Record<FeedbackField, string>>;
  // Sent back so the form keeps what the visitor typed if something fails.
  values?: Partial<Record<FeedbackField, string>>;
};
