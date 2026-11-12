// The Clear Impression Promise on the homepage.
//
// CONFIRM WITH OUR SPONSOR: these are public commitments to customers, so
// every line below should be something the business actually does. Edit the
// wording here and the homepage updates.

export type PromiseIcon = 'clock' | 'tag' | 'sparkle' | 'return';

export const promise = {
  eyebrow: 'The Clear Impression Promise',
  title: ['Four things we never', 'cut corners on.'],
  intro:
    'Your home and your time matter more than our schedule. Same promise on every job, big or small.',
  items: [
    {
      icon: 'clock',
      title: 'Show up when we say',
      text: "You'll get a text when we're on the way, and we arrive in the time window we gave you.",
    },
    {
      icon: 'tag',
      title: 'Your quote is your price',
      text: 'The price we confirm is the price on the invoice. Nothing gets added halfway through.',
    },
    {
      icon: 'sparkle',
      title: 'Leave it better',
      text: 'Drop cloths and shoe covers inside, frames and sills wiped, and nothing left behind but clear glass.',
    },
    {
      icon: 'return',
      title: "If it's not right, we come back",
      text: 'Spot a streak after we leave? Call or text us and we will come back and fix it, free.',
    },
  ] satisfies { icon: PromiseIcon; title: string; text: string }[],
};
