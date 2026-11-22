export const featuredQuestions = [
  'How much does professional window cleaning cost in Arizona?',
  'What areas do you service?',
  'How long does window cleaning take?',
  'Do you clean screens and window tracks?',
  'What happens if it rains right after my windows are cleaned?',
] as const;

// Match the published question text without duplicating the answers.
export const faqTopics = [
  {
    label: 'Pricing & scheduling',
    questions: [
      featuredQuestions[0],
      featuredQuestions[2],
      'Do second-story windows cost more?',
      'Do you offer recurring maintenance plans?',
      'Is exterior-only cleaning cheaper?',
      'What time of year is best for window cleaning?',
    ],
  },
  {
    label: 'Services & coverage',
    questions: [
      featuredQuestions[1],
      featuredQuestions[3],
      'What cleaning process do you use? Do you use ladders?',
      'Why is it important to have windows cleaned professionally?',
      'Why is soft washing safer than pressure washing?',
      'Do you clean storefront windows?',
      'Do luxury homes require special window cleaning?',
      'Why choose Clear Impression Services?',
      'Do HOA communities require exterior maintenance?',
    ],
  },
  {
    label: 'Care & weather',
    questions: [
      featuredQuestions[4],
      'Why do Arizona windows require special care?',
      'Do dirty solar panels lose efficiency?',
      'Can dirty windows reduce curb appeal?',
      'Should windows be cleaned before selling a home?',
      'Can monsoon dust damage windows?',
      'Can window cleaning remove pollen?',
      'Do birds and bugs stain windows?',
      'Can rain make windows dirty again?',
      'Can cloudy windows mean failed seals?',
      'Can dirty windows affect indoor lighting?',
      'Should solar panels be cleaned after monsoon season?',
      'Can dirty screens make windows look dirty?',
      'Can dirty tracks affect window operation?',
      'Can dirty windows reduce natural light?',
    ],
  },
] as const;
