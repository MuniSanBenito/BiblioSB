'use client'

import Link, { type LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentPropsWithoutRef } from 'react'

type NavLinkProps = LinkProps &
  Omit<ComponentPropsWithoutRef<'a'>, keyof LinkProps> & {
    exact?: boolean
    activeProps?: ComponentPropsWithoutRef<'a'>
  }

export function NavLink({
  href,
  exact = false,
  className = '',
  activeProps,
  children,
  ...rest
}: NavLinkProps) {
  const pathname = usePathname()
  const targetPath = typeof href === 'string' ? href : (href.pathname ?? '')

  // Normalizamos barras finales por si acaso
  const normalize = (p: string) => (p.length > 1 ? p.replace(/\/$/, '') : p)
  const current = normalize(pathname)
  const target = normalize(targetPath)

  // Equivalente a activeOptions: { exact: true | false }
  const isActive = exact
    ? current === target
    : current === target || current.startsWith(`${target}/`)

  const mergedClassName = [className, isActive ? activeProps?.className : '']
    .filter(Boolean)
    .join(' ')

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      {...rest}
      {...(isActive ? activeProps : undefined)}
      className={mergedClassName || undefined}
    >
      {children}
    </Link>
  )
}
