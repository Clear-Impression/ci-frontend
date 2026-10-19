import type { TermsSection } from '@/data/terms';

type TermsContentProps = {
  introduction: readonly string[];
  sections: readonly TermsSection[];
};

export default function TermsContent({ introduction, sections }: TermsContentProps) {
  return (
    <article aria-label='Full appointment and service terms' className='min-w-0 rounded-2xl border border-[#200b38]/10 bg-white px-6 py-8 shadow-sm sm:p-10 lg:p-12'>
      {/* Keep the introduction and every policy visible without opening accordions. */}
      <div className='space-y-4 border-b border-[#200b38]/10 pb-8 text-sm leading-7 text-[#686170] sm:text-base sm:leading-8'>
        {introduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </div>

      {sections.map((section) => (
        <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`} className='scroll-mt-8 border-b border-[#200b38]/10 py-8 last:border-b-0 last:pb-0'>
          <h2 id={`${section.id}-heading`} className='flex items-start gap-3 text-lg font-semibold leading-7 tracking-tight text-[#200b38] sm:text-xl'>
            <span className='shrink-0 text-[#6c3fb8]'>{String(section.number).padStart(2, '0')}.</span>
            {section.title}
          </h2>
          {/* Preserve the PDF paragraphs and use a proper list for access requirements. */}
          <div className='mt-4 space-y-4 text-sm leading-7 text-[#686170] sm:text-base sm:leading-8'>
            {section.blocks.map((block, index) => block.kind === 'list' ? (
              <ul key={index} className='list-disc space-y-2 pl-5 marker:text-[#6c3fb8]'>
                {block.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            ) : (
              <p key={index}>{block.text}</p>
            ))}
          </div>
        </section>
      ))}
    </article>
  );
}
