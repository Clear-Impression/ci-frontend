// Keep About page copy here so it can move to a CMS later.
export const aboutIntro = {
  eyebrow: 'Our Story',
  title: 'From college roots to Mesa’s trusted choice',
  lead: 'At Clear Impression, we believe a clear view can change your whole perspective.',
} as const;

export const aboutStory = [
  {
    heading: 'How it started',
    paragraphs: [
      'It started in 2018, when our founder, Niels, began washing windows while juggling college classes.',
      'What began as a way to help neighbors soon became a passion for transforming homes and delivering a level of service that was hard to find anywhere else.',
    ],
  },
  {
    heading: 'Growing with our customers',
    paragraphs: [
      'As we grew, so did our expertise. Windows are still at the heart of what we do, but homeowners across the Valley told us they wanted one reliable partner for their whole exterior.',
      'So we expanded our skills and equipment to care for more of your home, making sure every part of its exterior gets the same attention to quality.',
    ],
  },
] as const;

export const aboutPromise = {
  heading: 'The Clear Impression Promise',
  tagline: 'Unlock the beauty beyond the glass.',
  paragraphs: [
    'To us, that means more than removing dirt and grime. It’s the feeling of walking into a bright, clean home and knowing the job was done right the first time.',
    'We know that inviting someone to work on your home takes trust. Our team treats your home with the same care and respect we give our own.',
  ],
} as const;

// Short points pulled from the promise so visitors can scan them.
export const aboutValues = [
  {
    title: 'Honesty first',
    description: 'Clear communication and fair pricing, with no surprises.',
  },
  {
    title: '100% satisfaction',
    description: 'We are not done until you are happy with the result.',
  },
  {
    title: 'Attention to detail',
    description: 'Proven techniques for a streak-free shine and a spotless finish.',
  },
] as const;

export const aboutClosing = {
  heading: 'Ready for a clearer view?',
  text: 'Whether it’s a single-family home or a large exterior project in Mesa, our goal stays the same: honest, quality work that earns your trust for years to come.',
} as const;