import { createPageMetadata } from '@/lib/seo';
import PriceCalculator from '@/components/estimate/PriceCalculator';
import { getLocations } from '@/lib/locations';
import { getPageHeader } from '@/lib/page-headers';
import { getEstimatePricing } from '@/lib/estimate-pricing';
import EstimateFlow from '@/components/estimate/EstimateFlow';
import { getAvailability } from '@/lib/availability';
import { company } from '@/data/company';
import { googleRating } from '@/data/reviews';
import { servingSince } from '@/data/home';
import { clearPricePromise } from '@/data/packages';
import { jakarta } from '../fonts';
import './estimate-page.css';

const title = 'Get a Free Quote | Clear Impression';
const description =
  'See your window cleaning price in about two minutes, pick a package and request a day. Serving the Phoenix metro area.';

export const metadata = createPageMetadata({
  path: '/estimate',
  title,
  description,
});

// Open days come from our Google Calendar; check again every 10 minutes.
export const revalidate = 600;

const nextSteps = [
  { title: 'You send a request', text: 'Your package, price and preferred day come straight to us.' },
  { title: 'We review it', text: 'We check your details. Jobs like house washing or hard water get a confirmed price here.' },
  { title: 'We call to confirm', text: 'We agree on the time and the final price. Nothing changes without your OK.' },
  { title: 'Cleaning day', text: 'We clean, you check our work, then pay by cash, check or Zelle.' },
];

const questions = [
  { q: 'Is this my final price?', a: clearPricePromise.text },
  {
    q: 'Am I booked once I send a request?',
    a: 'Not yet. Your request holds your preferred day, and we call to confirm the time and the details.',
  },
  {
    q: 'Why do some services say “needs review”?',
    a: 'Hard water stains, house washing and chandeliers vary a lot from home to home, so we look at the details or a photo before giving you a price.',
  },
  { q: 'How do I pay?', a: 'On cleaning day, by cash, check or Zelle. There’s nothing to pay when you request an estimate.' },
  {
    q: 'What’s the difference between Silver and Gold?',
    a: 'Silver cleans your windows inside and out. Gold adds washed screens, detailed tracks, an exterior house wash, priority scheduling and a 7-day touch-up guarantee.',
  },
];

export default async function EstimatePage() {
  const [header, { cities }, tabs] = await Promise.all([
    getPageHeader('estimate'), getLocations(), getEstimatePricing(),
  ]);
  const availability = await getAvailability();

  return (
    // The shared layout already supplies the website's header and footer.
    <main className={`${jakarta.variable} ep flex-1`}>
      <section className='ep-hero'>
        <div className='ep-container ep-hero-inner'>
          <div>
            <p className='ep-eyebrow'>Free quote</p>
            <h1>
              Your window cleaning price, <em>one easy question at a time.</em>
            </h1>
            <p className='ep-lead'>
              Tell us about your home, pick a package and request a day. It takes about two minutes, and nothing is
              booked until we call you to confirm.
            </p>
          </div>
          <dl className='ep-facts'>
            <div>
              <dt>Google rating</dt>
              <dd>
                {googleRating.score.toFixed(1)} <span aria-hidden='true'>★</span>
              </dd>
            </div>
            <div>
              <dt>Reviews</dt>
              <dd>{googleRating.count}</dd>
            </div>
            <div>
              <dt>Serving since</dt>
              <dd>{servingSince}</dd>
            </div>
          </dl>
        </div>
      </section>

      <div
        id='estimate'
        className='ep-container ep-estimator'>
        <EstimateFlow availability={availability} />
      </div>

      <section
        className='ep-container ep-band'
        aria-labelledby='ep-next'>
        <div className='ep-head'>
          <p className='ep-eyebrow ep-eyebrow-green'>What happens next</p>
          <h2 id='ep-next'>
            From request to <em>spotless glass.</em>
          </h2>
        </div>
        <ol className='ep-next'>
          {nextSteps.map((item) => (
            <li key={item.title}>
              <b>{item.title}</b>
              <span>{item.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section
        className='ep-container ep-band'
        aria-labelledby='ep-club'>
        <div className='ep-club'>
          <div className='ep-club-copy'>
            <p className='ep-eyebrow'>Clear Club</p>
            <h2 id='ep-club'>
              Keep them clear <em>all year.</em>
            </h2>
            <p>
              Arizona dust and monsoon storms come back fast. Clear Club members get regular cleanings on a schedule
              that suits them, and save on every visit after the first. You can join after your first cleaning;
              there’s nothing to sign up for today.
            </p>
          </div>
          <div className='ep-plans'>
            <div className='ep-plan'>
              <div>
                <b>Every 3 months</b>
                <span>Best for dusty yards and busy streets</span>
              </div>
              <span className='ep-save'>Member pricing</span>
            </div>
            <div className='ep-plan'>
              <div>
                <b>Every 6 months</b>
                <span>Spring and fall, before and after monsoon</span>
              </div>
              <span className='ep-save'>Member pricing</span>
            </div>
          </div>
        </div>
      </section>

      <section
        className='ep-container ep-band ep-two'
        aria-labelledby='ep-faq'>
        <div className='ep-head'>
          <p className='ep-eyebrow ep-eyebrow-green'>Questions</p>
          <h2 id='ep-faq'>
            About your <em>estimate.</em>
          </h2>
          <p>
            Still unsure? Call or text <a href={company.phoneHref}>{company.phone}</a> and talk to a real person.
          </p>
        </div>
        <div className='ep-faq'>
          {questions.map((item, index) => (
            <details
              key={item.q}
              open={index === 0}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
