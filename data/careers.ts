// Careers page copy, form limits, and types, shared by the pages, the form,
// and the server action. Job openings are edited in Sanity.
export const careersPage = {
  eyebrow: 'Careers',
  title: 'Join the Clear Impression crew',
  description:
    'We’re a local window cleaning team based in Mesa. Pick a role below and apply online in about five minutes.',
} as const;

// Copy to confirm with Niels before launch.
export const careersPerks = [
  {
    title: 'Local routes',
    text: 'Homes and businesses across the Phoenix metro, starting from Mesa.',
    icon: 'M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  },
  {
    title: 'Trained on the job',
    text: 'Learn our methods working next to the owner before you go solo.',
    icon: 'M4 19.5V6a2 2 0 0 1 2-2h12v15.5H6a2 2 0 0 0-2 2zM8 8h6',
  },
  {
    title: 'Schedules that fit',
    text: 'Tell us the days you can work when you apply.',
    icon: 'M5.5 5h13a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2zM3.5 10h17M8 3v4M16 3v4',
  },
] as const;

export const hiringSteps = [
  { title: 'Apply online', text: 'A short form and your resume. About five minutes.' },
  { title: 'We reach out', text: 'Niels reads every application and follows up by phone or email.' },
  { title: 'Meet the team', text: 'A quick conversation, then we set your first day.' },
] as const;

export const careersClosing = {
  heading: 'Looking for a cleaning instead?',
  text: 'Get a free quote for your home or business, no surprises.',
} as const;

// The first roles, copied into Sanity once by the seed script
// (npm run seed:job-openings in studio/). The website itself reads roles
// from Sanity only, so editing this list later changes nothing on the site.
export const starterJobOpenings: JobOpening[] = [
  {
    title: 'Window cleaning technician',
    slug: 'window-cleaning-technician',
    employmentType: 'Full-time or part-time',
    pay: null,
    summary:
      'Clean windows, screens, and tracks at homes and storefronts across the Phoenix metro. Ladder work and friendly customer contact.',
    duties: [
      'Clean windows, screens, and tracks, inside and out',
      'Work from ladders on one and two-story homes',
      'Treat every customer’s home with care',
    ],
    requirements: [
      'Valid driver’s license and reliable transportation',
      'Comfortable on ladders and working outdoors',
      'On time, friendly, and detail oriented',
    ],
    schedule: 'Weekday daytime jobs, some Saturdays.',
  },
  {
    title: 'Seasonal helper',
    slug: 'seasonal-helper',
    employmentType: 'Seasonal',
    pay: null,
    summary:
      'Extra hands for our busiest months. Help the crew with screens, solar panels, and hard water stain removal.',
    duties: [
      'Help the crew with screens, solar panels, and hard water stains',
      'Load, unload, and look after the equipment',
    ],
    requirements: [
      'Valid driver’s license and reliable transportation',
      'Comfortable working outdoors in the heat',
    ],
    schedule: null,
  },
];

export const applicationLimits = {
  name: 100,
  email: 254,
  phone: 32,
  city: 100,
  experience: 1000,
} as const;

// Vercel turns away requests over 4.5 MB, so the file stays under that.
export const resumeLimit = {
  bytes: 4 * 1024 * 1024,
  label: '4 MB',
} as const;

// The resume types the backend accepts, by file extension.
export const resumeTypes: Record<string, string> = {
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export const resumeAccept = '.pdf,.doc,.docx';

export const workDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

export type JobOpening = {
  title: string;
  slug: string;
  employmentType: string;
  pay: string | null;
  summary: string;
  duties: string[];
  requirements: string[];
  schedule: string | null;
};

export type ApplicationField =
  | 'name'
  | 'email'
  | 'phone'
  | 'city'
  | 'license'
  | 'days'
  | 'startDate'
  | 'experience'
  | 'resume';

// Everything the form sends except the file, which the form keeps itself.
export type ApplicationValues = {
  name?: string;
  email?: string;
  phone?: string;
  city?: string;
  license?: string;
  days?: string[];
  startDate?: string;
  experience?: string;
};

export type ApplicationState = {
  status: 'idle' | 'success' | 'invalid' | 'closed' | 'unavailable' | 'error';
  errors?: Partial<Record<ApplicationField, string>>;
  // Sent back so the form keeps what the visitor typed if something fails.
  values?: ApplicationValues;
  firstName?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// The file's type, from its extension, or null when it isn't allowed.
export function resumeType(filename: string): string | null {
  const extension = filename.toLowerCase().split('.').pop() ?? '';
  return filename.includes('.') ? resumeTypes[extension] ?? null : null;
}

// Same rules on the form and the server, so people see problems before they send.
export function checkApplication(values: ApplicationValues, resume: { name: string; size: number } | null) {
  const errors: Partial<Record<ApplicationField, string>> = {};
  const name = values.name?.trim() ?? '';
  const email = values.email?.trim() ?? '';
  const phoneDigits = (values.phone ?? '').replace(/\D/g, '');

  if (!name) errors.name = 'Please enter your name.';
  else if (name.length > applicationLimits.name)
    errors.name = `Please keep your name under ${applicationLimits.name} characters.`;

  if (!email) errors.email = 'Please enter your email address.';
  else if (!emailPattern.test(email) || email.length > applicationLimits.email)
    errors.email = 'Please enter a valid email address, like name@example.com.';

  if (!values.phone?.trim()) errors.phone = 'Please enter your phone number.';
  else if (phoneDigits.length < 10 || phoneDigits.length > 11 || !/^\+?[0-9(). -]+$/.test(values.phone.trim()))
    errors.phone = 'Please enter a 10-digit phone number, like (480) 555-0123.';

  if ((values.city?.trim().length ?? 0) > applicationLimits.city)
    errors.city = `Please keep your city under ${applicationLimits.city} characters.`;

  if (values.license !== 'yes' && values.license !== 'no') errors.license = 'Please choose yes or no.';

  if (!values.days?.length) errors.days = 'Please pick at least one day.';

  if ((values.experience?.length ?? 0) > applicationLimits.experience)
    errors.experience = `Please keep this under ${applicationLimits.experience.toLocaleString()} characters.`;

  if (!resume || resume.size === 0) errors.resume = 'Please attach your resume.';
  else if (!resumeType(resume.name)) errors.resume = 'Please attach a PDF, DOC, or DOCX file.';
  else if (resume.size > resumeLimit.bytes)
    errors.resume = `That file is over ${resumeLimit.label}. Please attach a smaller one.`;

  return errors;
}
