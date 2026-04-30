'use client'

import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import * as React from 'react'
import { useMemo } from 'react'
import { NAVIGATION_CONFIG, type NavItem } from '@/components/layout/Sidebar'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface BreadcrumbItemData {
  key: string
  title: string
  items: Array<{
    key: string
    title: string
  }>
}

interface NavBreadcrumbProps {
  maxItems?: number
}

function findBreadcrumbPath(pathname: string, items: NavItem[]): BreadcrumbItemData[] {
  for (const item of items) {
    if (item.path === pathname) {
      const children =
        item.children?.map(child => ({
          key: child.path,
          title: child.title,
        })) ?? []
      return [{ key: item.path, title: item.title, items: children }]
    }
    if (item.children) {
      const found = findBreadcrumbPath(pathname, item.children)
      if (found.length > 0) {
        const children =
          item.children?.map(child => ({
            key: child.path,
            title: child.title,
          })) ?? []
        return [{ key: item.path, title: item.title, items: children }, ...found]
      }
    }
  }
  return []
}

export function NavBreadcrumb({ maxItems = 3 }: NavBreadcrumbProps) {
  const t = useTranslations('sidebar')
  const pathname = usePathname()

  // Flatten all nav items from groups
  const allNavItems = useMemo(() => {
    const items: NavItem[] = []
    for (const group of NAVIGATION_CONFIG) {
      for (const item of group.items) {
        items.push(item)
      }
    }
    return items
  }, [])

  const breadcrumbs = useMemo(() => {
    // Remove locale prefix from pathname for matching
    const pathParts = pathname.split('/').filter(Boolean)
    const cleanPath = pathParts.length > 1 ? `/${pathParts.slice(1).join('/')}` : '/'
    return findBreadcrumbPath(cleanPath, allNavItems)
  }, [pathname, allNavItems])

  const renderBreadcrumbItem = (item: BreadcrumbItemData, isLast: boolean) => {
    const hasItems = item.items && item.items.length > 0

    if (hasItems) {
      return (
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center gap-1 cursor-pointer'>
              {t(item.title)}
              <ChevronDown className='h-4 w-4' />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              {item.items.map(subItem => (
                <DropdownMenuItem key={subItem.key} asChild>
                  <Link href={subItem.key}>{t(subItem.title)}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
      )
    }

    return (
      <BreadcrumbItem>
        {isLast ? (
          <BreadcrumbPage>{t(item.title)}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink asChild>
            <Link href={item.key}>{t(item.title)}</Link>
          </BreadcrumbLink>
        )}
      </BreadcrumbItem>
    )
  }

  const renderBreadcrumbs = () => {
    if (breadcrumbs.length <= maxItems) {
      return breadcrumbs.map((item, index) => (
        <React.Fragment key={item.key}>
          {renderBreadcrumbItem(item, index === breadcrumbs.length - 1)}
          {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
        </React.Fragment>
      ))
    }

    const firstItem = breadcrumbs[0]
    const lastItems = breadcrumbs.slice(-(maxItems - 1))
    const hiddenItems = breadcrumbs.slice(1, -(maxItems - 1))

    return (
      <>
        {renderBreadcrumbItem(firstItem, false)}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className='flex items-center gap-1 cursor-pointer'>
              <BreadcrumbEllipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              {hiddenItems.map(item => (
                <DropdownMenuItem key={item.key} asChild>
                  <Link href={item.key}>{t(item.title)}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {lastItems.map((item, index) => (
          <React.Fragment key={item.key}>
            {renderBreadcrumbItem(item, index === lastItems.length - 1)}
            {index < lastItems.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </>
    )
  }

  if (breadcrumbs.length === 0) return null

  return (
    <Breadcrumb>
      <BreadcrumbList>{renderBreadcrumbs()}</BreadcrumbList>
    </Breadcrumb>
  )
}
