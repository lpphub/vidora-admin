import type { LucideIcon } from 'lucide-react'
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Component,
  Film,
  FolderTree,
  LayoutDashboard,
  RefreshCw,
  Settings,
  Tag,
  Users,
  Video,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

interface MenuItem {
  icon: LucideIcon
  label: string
  path?: string
  id?: string
  badge?: { label: string; variant: 'red' | 'blue' }
  children?: { label: string; path: string }[]
}

const menuItems: MenuItem[] = [
  { icon: LayoutDashboard, label: '工作台', path: '/dashboard' },
  {
    icon: Film,
    label: '内容管理',
    id: 'content-management',
    children: [
      { label: '内容列表', path: '/contents' },
      { label: '内容审核', path: '/contents/review' },
    ],
  },
  {
    icon: Video,
    label: '视频中心',
    id: 'video-center',
    children: [
      { label: '视频列表', path: '/videos' },
      { label: '上传管理', path: '/videos/upload' },
    ],
  },
  { icon: RefreshCw, label: '转码任务', path: '/transcode' },
  { icon: FolderTree, label: '分类管理', path: '/categories' },
  { icon: Calendar, label: '日历', path: '/calendar', badge: { label: '+12', variant: 'red' } },
  { icon: Tag, label: '项目标签', path: '/tags', badge: { label: 'New', variant: 'blue' } },
  { icon: Users, label: '用户管理', path: '/users' },
  {
    icon: Settings,
    label: '系统设置',
    path: '/settings',
  },
  { icon: Component, label: '组件展示', path: '/components' },
]

function MenuLink({
  item,
  collapsed,
  icon: Icon,
  level = 0,
  badge,
}: {
  item: { label: string; path: string }
  collapsed: boolean
  icon?: LucideIcon
  level?: number
  badge?: { label: string; variant: 'red' | 'blue' }
}) {
  const location = useLocation()
  const isActive = location.pathname === item.path

  return (
    <Link
      to={item.path}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
        'transition-all duration-150 cursor-pointer',
        isActive
          ? level === 0
            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
            : 'bg-accent text-accent-foreground'
          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
      )}
    >
      {Icon && <Icon size={18} className='shrink-0' />}
      <span
        className={cn(
          'flex-1 whitespace-nowrap transition-opacity duration-200',
          collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
        )}
      >
        {item.label}
      </span>
      {badge && !collapsed && (
        <Badge
          className={cn(
            'px-2 py-0.5 text-xs font-medium rounded-full',
            badge.variant === 'red'
              ? 'bg-red-500 text-white hover:bg-red-500'
              : 'bg-blue-500 text-white hover:bg-blue-500'
          )}
        >
          {badge.label}
        </Badge>
      )}
    </Link>
  )
}

function MenuItemWithChildren({ item, collapsed }: { item: MenuItem; collapsed: boolean }) {
  const location = useLocation()
  const [expanded, setExpanded] = useState(() =>
    item.children?.some(child => location.pathname === child.path)
  )
  const [showTooltip, setShowTooltip] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const hasActiveChild = item.children?.some(child => location.pathname === child.path)

  const tooltipPosition = buttonRef.current
    ? {
        top: buttonRef.current.getBoundingClientRect().top,
        left: buttonRef.current.getBoundingClientRect().right + 8,
      }
    : { top: 0, left: 0 }

  return (
    <div className='relative'>
      <button
        ref={buttonRef}
        type='button'
        onClick={() => !collapsed && setExpanded(!expanded)}
        onMouseEnter={() => collapsed && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => collapsed && setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        className={cn(
          'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium',
          'transition-all duration-150 cursor-pointer',
          hasActiveChild
            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
        )}
      >
        <item.icon size={18} className='shrink-0' />
        <span
          className={cn(
            'flex-1 text-left whitespace-nowrap transition-opacity duration-200',
            collapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
          )}
        >
          {item.label}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            'shrink-0 transition-transform duration-200',
            expanded && !collapsed && 'rotate-180',
            collapsed && 'opacity-0 w-0'
          )}
        />
      </button>

      {/* 展开状态的子菜单 */}
      <div
        className={cn(
          'transition-all duration-200 ease-in-out',
          expanded && !collapsed
            ? 'max-h-40 opacity-100 mt-1'
            : 'max-h-0 opacity-0 pointer-events-none'
        )}
      >
        <div className='ml-6 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-3'>
          {item.children?.map(child => (
            <MenuLink key={child.path} item={child} collapsed={collapsed} level={1} />
          ))}
        </div>
      </div>

      {/* 收起状态的 Tooltip 子菜单 - 使用 Portal */}
      {collapsed &&
        showTooltip &&
        createPortal(
          <div
            className='fixed z-50 min-w-[160px] rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-1.5 shadow-lg animate-in fade-in-0 zoom-in-95 duration-150'
            style={{ top: tooltipPosition.top, left: tooltipPosition.left }}
          >
            <div className='px-2 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100'>
              {item.label}
            </div>
            <div className='h-px bg-gray-200 dark:bg-gray-700 my-1' />
            {item.children?.map(child => {
              const isActive = location.pathname === child.path
              return (
                <Link
                  key={child.path}
                  to={child.path}
                  className={cn(
                    'flex items-center rounded-md px-2 py-1.5 text-sm outline-none transition-colors cursor-pointer',
                    isActive
                      ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )}
                >
                  {child.label}
                </Link>
              )
            })}
          </div>,
          document.body
        )}
    </div>
  )
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900',
        'transition-[width] duration-300 ease-in-out',
        collapsed ? 'w-[60px]' : 'w-[240px]'
      )}
    >
      {/* Header */}
      <div className='flex h-16 items-center px-4'>
        <div
          className={cn(
            'overflow-hidden transition-all duration-300',
            collapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
          )}
        >
          <Link to='/' className='flex items-center gap-2 whitespace-nowrap'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500'>
              <span className='text-lg font-bold text-white'>V</span>
            </div>
            <span className='text-xl font-bold text-gray-900 dark:text-white'>Vidora</span>
          </Link>
        </div>
        <Button
          variant='ghost'
          size='icon'
          onClick={onToggle}
          className={cn(
            'h-8 w-8 shrink-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
            collapsed ? 'mx-auto' : 'ml-auto'
          )}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className='h-[calc(100vh-64px)]'>
        <nav className='space-y-1 p-3'>
          {menuItems.map(item => {
            if (item.path) {
              return (
                <MenuLink
                  key={item.path}
                  item={{ label: item.label, path: item.path }}
                  collapsed={collapsed}
                  icon={item.icon}
                  badge={item.badge}
                />
              )
            }
            if (item.children) {
              return (
                <MenuItemWithChildren
                  key={item.id || item.label}
                  item={item}
                  collapsed={collapsed}
                />
              )
            }
            return null
          })}
        </nav>
      </ScrollArea>
    </aside>
  )
}
