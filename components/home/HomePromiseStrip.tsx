type HomePromiseStripProps = {
  eyebrow: string;
  items: readonly { title: string; text: string }[];
};

// The Clear Impression Promise along the bottom of the hero, over the video.
// Each promise sits in front of a big outlined gold number, and the whole
// strip links down to the full promise further down the page.
export default function HomePromiseStrip({ eyebrow, items }: HomePromiseStripProps) {
  return (
    <section
      aria-label={eyebrow}
      className='hx-pstrip'>
      <div className='hx-container'>
        <p className='hx-pstrip-label'>{eyebrow}</p>
      </div>
      <ol className='hx-container hx-pstrip-list'>
        {items.map((item, index) => (
          <li key={item.title}>
            <a href='#promise'>
              <i aria-hidden='true'>{index + 1}</i>
              <b>{item.title}</b>
              <span>{item.text}</span>
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
