import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createPageMetadata } from '@/lib/seo';
import { getBlogBySlug, getBlogs, getBlogDescriptionText } from '@/lib/blog';
import ClearerViewCta from '@/components/ui/ClearerViewCta';
import { company } from '@/data/company';
import BlogContent from '@/components/blog/BlogContent';
import { getServices } from '@/lib/services';


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

  const baseMetadata = createPageMetadata({
    path: `/blog/${blog.slug}`,
    title: `${blog.title} | Clear Impression`,
    description: getBlogDescriptionText(blog.description),
  });

  const image = blog.image?.url
    ? {
        url: blog.image.url,
        alt: blog.image.alt ?? blog.title,
      }
    : undefined;

  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      type: 'article',
      publishedTime: `${blog.date}T00:00:00.000Z`,
      images: image ? [image] : baseMetadata.openGraph?.images,
    },
    twitter: {
      ...baseMetadata.twitter,
      images: image ? [image] : baseMetadata.twitter?.images,
    },
  };
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

function createBlogStructuredData(blog: NonNullable<Awaited<ReturnType<typeof getBlogBySlug>>>) {
  const url = new URL(`/blog/${blog.slug}`, company.website).href;
  const image = blog.image?.url ? [blog.image.url] : undefined;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        url,
        mainEntityOfPage: url,
        headline: blog.title,
        description: getBlogDescriptionText(blog.description),
        datePublished: `${blog.date}T00:00:00.000Z`,
        ...(image ? {image} : {}),
        publisher: {
          '@type': 'Organization',
          name: company.name,
          url: company.website,
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: company.website,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Blog',
            item: new URL('/blog', company.website).href,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: blog.title,
            item: url,
          },
        ],
      },
    ],
  };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const { blogs: slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  const residentialServiceSlug = 'residential-window-washing';
  const showResidentialService =
    blog.slug === '5-benefits-of-professional-window-cleaning-in-phoenix' &&
    (await getServices()).some((service) => service.slug === residentialServiceSlug);

  const structuredData = JSON.stringify(createBlogStructuredData(blog)).replace(
    /</g,
    '\\u003c',
  );

  return (
    <main className='flex-1 bg-white text-[#200b38]'>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{__html: structuredData}}
      />
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
              alt={blog.image.alt ?? blog.title}
              width={1200}
              height={400}
              priority
              sizes='(max-width: 1280px) 100vw, 1200px'
              className='aspect-3/1 w-full rounded-2xl object-cover'
            />

            {blog.image.caption && (
              <figcaption className='mt-3 text-sm text-gray-600'>
                {blog.image.caption}
              </figcaption>
            )}
          </figure>
        )}
        <div className='text-lg'>
          <BlogContent description={blog.description} />
          {showResidentialService && (
            <p className='mt-5 leading-8 text-gray-700'>
              See what we clean and how we work in our{' '}
              <Link
                href={`/services/${residentialServiceSlug}`}
                className='font-semibold text-[#6c3fb8] underline underline-offset-4 hover:text-[#200b38]'>
                residential window cleaning service
              </Link>
              .
            </p>
          )}
        </div>
      </article>

      {/* Contact slug */}
      <section className='mx-auto max-w-7xl px-6 pt-8 pb-16 sm:px-8 sm:pt-10 sm:pb-20'>
        <ClearerViewCta />
      </section>

    </main>
  );
}
