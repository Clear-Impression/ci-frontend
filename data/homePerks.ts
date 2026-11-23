import { googleRating } from './reviews';

// "What to expect next": shown on the estimate page after someone sends a request.

export type PerkIcon = 'bell' | 'van' | 'calendar' | 'star' | 'tag' | 'gift';

export const homePerks = {
  eyebrow: 'What to expect next',
  title: 'You’ll always know',
  highlight: 'what’s next.',
  lead: 'From the day you book to the minute we pull up, we keep you posted by text and email. No phone tag.',
  perks: [
    {
      icon: 'bell',
      title: 'Reminders before your visit',
      text: 'An email and a text with your date and arrival window.',
    },
    {
      icon: 'van',
      title: 'A text when we’re on the way',
      text: 'No waiting around wondering when we’ll arrive.',
    },
    {
      icon: 'calendar',
      title: 'Reschedule with a text',
      text: 'Plans change. Reply to any message to move your visit.',
    },
    {
      icon: 'star',
      title: `Rated ${googleRating.score.toFixed(1)} on Google`,
      text: `${googleRating.count} reviews. BBB accredited and Angi approved.`,
    },
    {
      icon: 'tag',
      title: 'Upfront pricing',
      text: 'The price we confirm is the price you pay.',
    },
  ] satisfies { icon: PerkIcon; title: string; text: string }[],
};
