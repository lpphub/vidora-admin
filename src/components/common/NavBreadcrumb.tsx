import { ChevronDown } from 'lucide-react'
import * as React from 'react'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useMatches } from 'react-router-dom'
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

interface NavItem {
  path: string
  title: string
  children?: NavItem[]
}

// Navigation data for breadcrumb generation
const navData: NavItem[] = [
  { path: '/dashboard', title: 'items.dashboard' },
  { path: '/contents', title: 'items.contentList' },
  { path: '/contents/review', title: 'items.contentReview' },
  { path: '/videos', title: 'items.videoList' },
  { path: '/videos/upload', title: 'items.uploadManagement' },
  { path: '/transcode', title: 'items.transcodeTasks' },
  { path: '/categories', title: 'items.categoryManagement' },
  { path: '/calendar', title: 'items.calendar' },
  { path: '/tags', title: 'items.tagManagement' },
  { path: '/users', title: 'items.userManagement' },
  { path: '/settings', title: 'items.systemSettings' },
  { path: '/components', title: 'items.components' },
]

interface NavBreadcrumbProps {
  maxItems?: number
}

export function NavBreadcrumb({ maxItems = 3 }: NavBreadcrumbProps) {
  const { t } = useTranslation('sidebar')
  const matches = useMatches()

  const findPathInNavData = useCallback((path: string, items: NavItem[]): NavItem[] => {
    for (const item of items) {
      if (item.path === path) {
        return [item]
      }
      if (item.children) {
        const found = findPathInNavData(path, item.children)
        if (found.length > 0) {
          return [item, ...found]
        }
      }
    }
    return []
  }, [])

  const breadcrumbs = useMemo(() => {
    const paths = matches.filter(item => item.pathname !== '/').map(item => item.pathname)

    return paths
      .map(path => {
        const pathItems = findPathInNavData(path, navData)

        if (pathItems.length === 0) return null

        const currentItem = pathItems[pathItems.length - 1]
        const children =
          currentItem.children?.map(child => ({
            key: child.path,
            title: child.title,
          })) ?? []

        return {
          key: currentItem.path,
          title: currentItem.title,
          items: children,
        }
      })
      .filter((item): item is BreadcrumbItemData => item !== null)
  }, [matches, findPathInNavData])

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
                  <Link to={subItem.key}>{t(subItem.title)}</Link>
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
            <Link to={item.key}>{t(item.title)}</Link>
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

    // Show first item, ellipsis, and last maxItems-1 items
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
                  <Link to={item.key}>{t(item.title)}</Link>
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
