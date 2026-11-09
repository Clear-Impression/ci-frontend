import styles from '@/app/estimate/estimate.module.css';

type OdometerProps = {
  text: string;
  className?: string;
};

// Rolling numbers: each digit is a column of 0-9 that slides to its value.
// Screen readers get the plain text once instead of the moving parts.
export default function Odometer({ text, className = '' }: OdometerProps) {
  const chars = text.split('');
  return (
    <span className={`${styles.odometer} ${className}`}>
      <span className='sr-only'>{text}</span>
      <span aria-hidden='true' className='inline-flex'>
        {chars.map((char, index) => {
          // Key from the right so the ones digit stays the ones digit.
          const key = chars.length - index;
          if (!/\d/.test(char)) {
            return <span key={`c${key}`}>{char}</span>;
          }
          return (
            <span
              key={`d${key}`}
              className={styles.odoColumn}>
              <span
                className={styles.odoStrip}
                style={
                  {
                    transform: `translateY(-${Number(char) * 10}%)`,
                    transitionDelay: `${key * 40}ms`,
                  } as React.CSSProperties
                }>
                {'0123456789'.split('').map((digit) => (
                  <span key={digit}>{digit}</span>
                ))}
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
