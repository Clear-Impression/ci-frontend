import Reveal from '@/components/services/Reveal';
import type { HomeStep } from '@/data/home';
import styles from '@/app/home.module.css';

type HomeStepsProps = {
  eyebrow: string;
  title: string;
  steps: readonly HomeStep[];
};

export default function HomeSteps({ eyebrow, title, steps }: HomeStepsProps) {
  return (
    <section
      aria-labelledby='home-steps-heading'
      className='mx-auto max-w-7xl px-6 py-20 sm:px-8 sm:py-24'>
      <Reveal className='max-w-2xl'>
        <p className='text-sm font-semibold uppercase tracking-widest text-[#6c3fb8]'>
          {eyebrow}
        </p>
        <h2
          id='home-steps-heading'
          className='mt-3 text-3xl font-semibold tracking-tight sm:text-4xl'>
          <span className='line-mask'>
            <span className='line-rise'>{title}</span>
          </span>
        </h2>
      </Reveal>

      {/* The connecting line is only shown beside the four-column layout. */}
      <Reveal className='relative mt-14'>
        <span
          aria-hidden='true'
          className={`${styles.stepsLine} absolute left-7 right-[calc(25%-3.25rem)] top-7 hidden h-0.5 rounded-full bg-[#efb52b] lg:block`}
        />
        <ol className='grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8'>
          {steps.map((step, index) => (
            <li
              key={step.title}
              className={`${styles.rise} relative`}
              style={{ '--i': index + 1 } as React.CSSProperties}>
              <span
                aria-hidden='true'
                className='relative grid size-14 place-items-center rounded-full bg-[#200b38] text-xl font-semibold text-[#efb52b] ring-8 ring-white'>
                {index + 1}
              </span>
              <h3 className='mt-6 text-xl font-semibold text-[#200b38]'>
                {step.title}
              </h3>
              <p className='mt-2 leading-relaxed text-gray-600'>{step.text}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
