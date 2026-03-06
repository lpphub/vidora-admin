import { ChevronDown } from 'lucide-react'
import * as React from 'react'
import { useCallback, useMemo } from 'react'
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
  label: string
  items: Array<{
    key: string
    label: string
  }>
}

interface NavItem {
  path: string
  title: string
  children?: NavItem[]
}

// Navigation data for breadcrumb generation
const navData: NavItem[] = [
  { path: '/dashboard', title: '工作台' },
  { path: '/contents', title: '内容列表' },
  { path: '/contents/review', title: '内容审核' },
  { path: '/videos', title: '视频列表' },
  { path: '/videos/upload', title: '上传管理' },
  { path: '/transcode', title: '转码任务' },
  { path: '/categories', title: '分类管理' },
  { path: '/calendar', title: '日历' },
  { path: '/tags', title: '项目标签' },
  { path: '/users', title: '用户管理' },
  { path: '/settings', title: '系统设置' },
  { path: '/components', title: '组件展示' },
]

interface NavBreadcrumbProps {
  maxItems?: number
}

export function NavBreadcrumb({ maxItems = 3 }: NavBreadcrumbProps) {
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
            label: child.title,
          })) ?? []

        return {
          key: currentItem.path,
          label: currentItem.title,
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
              {item.label}
              <ChevronDown className='h-4 w-4' />
            </DropdownMenuTrigger>
            <DropdownMenuContent align='start'>
              {item.items.map(subItem => (
                <DropdownMenuItem key={subItem.key} asChild>
                  <Link to={subItem.key}>{subItem.label}</Link>
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
          <BreadcrumbPage>{item.label}</BreadcrumbPage>
        ) : (
          <BreadcrumbLink asChild>
            <Link to={item.key}>{item.label}</Link>
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
                  <Link to={item.key}>{item.label}</Link>
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
