import { createPageMetadata } from '@/lib/seo';
import HomeClosing from '@/components/home/HomeClosing';
import { homeClosing, homeSteps } from '@/data/home';
import { blogIntro } from '@/data/blog';

export const metadata = createPageMetadata({
  path: '/blog',
  title: 'Blog | Clear Impression Services',
  description: 'Tips and insights from Clear Impression.',
});

function Words({ text, className }: { text: string; className: string }) {
  return text.split(' ').map((word, index, words) => (
    <span key={`${word}-${index}`}>
      <span
        className={className}
        style={{ '--w': index } as React.CSSProperties}>
        {word}
      </span>
      {index < words.length - 1 ? ' ' : null}
    </span>
  ));
}

export default async function BlogPage() {
    return (
        <main className='flex-1 bg-white text-gray-900'>
        {/* Same header used on about page with modified data */}
        <section className='relative isolate overflow-hidden bg-[#200b38] text-white'>
            <div aria-hidden='true' className='about-glow absolute inset-0 -z-10' />
            <div className='focus-out mx-auto flex min-h-88 max-w-7xl flex-col justify-center px-6 py-10 sm:min-h-80 sm:px-8 sm:py-12'>
            <p className='focus-in text-sm font-semibold uppercase tracking-widest text-[#efb52b]'>
                {blogIntro.eyebrow}
            </p>
            <h1 className='mt-3 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl'>
                <Words text={blogIntro.title} className='focus-word' />
            </h1>
            <p className='focus-in focus-in-late mt-6 max-w-2xl text-lg text-white/80'>
                {blogIntro.lead}
            </p>
            </div>
        </section>

        {/* Remove once blog page is implemented */}
        <section className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20'>
            <div className='rounded-2xl bg-[#f7f4fb] px-6 py-12 text-center sm:px-12'>
                <p className='text-sm font-semibold uppercase tracking-widest text-[#6c3fb8]'>
                    Coming soon
                </p>
                <h2 className='mt-3 text-2xl font-semibold text-[#200b38] sm:text-3xl'>
                    Window cleaning advice is on the way!
                </h2>
                <p className='mx-auto mt-4 max-w-2xl text-gray-700'>
                    We are putting together practical tips, seasonal reminders, and updates from our team.
                </p>
            </div>
        </section>
        {/* End remove */}
        
        {/* Footer element to guide user to make quote reused from home page */}
        <div id='get-started' className='mt-5'>
          <HomeClosing
            {...homeClosing}
            steps={homeSteps.steps}
          />
        </div>

        </main>
    );
}