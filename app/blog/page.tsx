import { createPageMetadata } from '@/lib/seo';
import { blogIntro } from '@/data/blog';
import Image from 'next/image';
import Link from 'next/link';
import { getBlogs } from '@/lib/blog';
import ClearerViewCta from '@/components/ui/ClearerViewCta';


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

        <section className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20'>
          <div className='grid gap-8 md:grid-cols-1 lg:grid-cols-2'>
            {(await getBlogs()).map((blog) => (
              <article
                key={blog.slug}
                className='overflow-hidden rounded-2xl bg-[#f7f4fb] shadow-sm'>
                {blog.image?.url && (
                  <Image
                    src={blog.image.url}
                    alt={blog.image.alt ?? ''}
                    width={1200}
                    height={1200}
                    className='aspect-3/1 w-full object-cover'
                  />
                )}

                <div className='p-6'>
                  <time
                    dateTime={blog.date}
                    className='text-sm font-semibold uppercase tracking-widest text-[#6c3fb8]'>
                    {new Intl.DateTimeFormat('en-US', {
                      dateStyle: 'long',
                      timeZone: 'UTC',
                    }).format(new Date(`${blog.date}T00:00:00Z`))}
                  </time>
                  <h2 className='text-2xl font-semibold text-[#200b38]'>
                    {blog.title}
                  </h2>

                  <p className='mt-4 line-clamp-3 leading-7 text-gray-700'>
                    {blog.description}
                  </p>

                  <Link
                    href={`/blog/${blog.slug}`}
                    className='mt-6 inline-block font-semibold text-[#6c3fb8]'>
                    Read more
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
        
        {/* Footer element to guide user to make quote reused from home page */}
        <section className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20'>
          <ClearerViewCta />
        </section>

      </main>
    );
}