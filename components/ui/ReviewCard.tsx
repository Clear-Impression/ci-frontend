import type { Review } from '@/data/reviews';

export default function ReviewCard({ name, rating, quote }: Review) {
  return (
    <figure className='flex h-full flex-col rounded-2xl border border-[#200b38]/10 bg-[#faf7fd] p-6 sm:p-8'>
      {/* Read the rating once instead of announcing each star. */}
      <p className='text-lg tracking-widest text-[#6c3fb8]'>
        <span className='sr-only'>{rating} out of 5 stars</span>
        <span aria-hidden='true'>
          {'★'.repeat(rating)}
          {'☆'.repeat(5 - rating)}
        </span>
      </p>
      <blockquote className='mt-5 flex-1 text-base leading-8 text-[#200b38]'>
        <p>“{quote}”</p>
      </blockquote>
      <figcaption className='mt-6 border-t border-[#200b38]/10 pt-5 text-sm font-semibold text-[#200b38]'>
        {name}
      </figcaption>
    </figure>
  );
}
