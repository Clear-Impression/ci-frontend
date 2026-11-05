'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCurrent } from '@/lib/navigation';

type NavLinkProps = {
  href: string;
  className?: string;
  children: React.ReactNode;
};

// A header link that stays gold while the visitor is on its page.
export default function NavLink({ href, className = '', children }: NavLinkProps) {
  const current = getCurrent(usePathname(), href);

  return (
    <Link
      href={href}
      aria-current={current}
      data-active={current ? '' : undefined}
      className={`nav-tab ${className}`}>
      <span className='nav-label'>{children}</span>
    </Link>
  );
}
