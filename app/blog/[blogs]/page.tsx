import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo';
import { getBlogBySlug, getBlogs } from '@/lib/blog';
import ClearerViewCta from '@/components/ui/ClearerViewCta';


type BlogPageProps = {
  params: Promise<{ blogs: string }>;
};

export async function generateStaticParams() {
  const blogs = await getBlogs();

  return blogs.map((blog) => ({
    blogs: blog.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { blogs: slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  return createPageMetadata({
    path: `/blog/${blog.slug}`,
    title: `${blog.title} | Clear Impression`,
    description: blog.description,
  });
}

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

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { blogs: slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  return (
    <main className='flex-1 bg-white text-[#200b38]'>
      {/* Same header used on about page with modified data */}
      <section className='relative isolate overflow-hidden bg-[#200b38] text-white'>
          <div aria-hidden='true' className='about-glow absolute inset-0 -z-10' />
          <div className='focus-out mx-auto flex min-h-88 max-w-7xl flex-col justify-center px-6 py-10 sm:min-h-80 sm:px-8 sm:py-12'>
          <h1 className='mt-0 max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl'>
              <Words text={blog.title} className='focus-word' />
          </h1>
          <p className='focus-in focus-in-late mt-6 max-w-2xl text-lg text-white/80'>
            <time
              dateTime={blog.date}
              className='mt-0 block text-sm font-semibold uppercase tracking-widest text-[#efb52b]'>
              {new Intl.DateTimeFormat('en-US', {
                dateStyle: 'long',
                timeZone: 'UTC',
              }).format(new Date(`${blog.date}T00:00:00Z`))}
            </time>
          </p>
          </div>
      </section>

      <article className='mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-20'>
        {blog.image?.url && (
          <figure>
            <Image
              src={blog.image.url}
              alt={blog.image.alt ?? ''}
              width={1200}
              height={400}
              className='aspect-3/1 w-full rounded-2xl object-cover'
            />

            {blog.image.caption && (
              <figcaption className='mt-3 text-sm text-gray-600'>
                {blog.image.caption}
              </figcaption>
            )}
          </figure>
        )}
        <p className='mt-5 whitespace-pre-line text-lg leading-8 text-gray-700'>
          {blog.description}
        </p>
      </article>

      {/* Contact slug */}
      <section className='mx-auto max-w-7xl px-6 py-16 sm:px-8 sm:py-20'>
        <ClearerViewCta />
      </section>

    </main>
  );
}