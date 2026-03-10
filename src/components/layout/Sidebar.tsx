import {
  ArrowLeftToLine,
  ArrowRightToLine,
  ChevronRight,
  FolderTree,
  Key,
  LayoutDashboard,
  Settings,
  Shield,
  Tag,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

export interface NavItem {
  title: string
  path: string
  icon?: React.ReactNode
  children?: NavItem[]
}

export interface NavGroup {
  name: string
  items: NavItem[]
}

export const NAVIGATION_CONFIG: NavGroup[] = [
  {
    name: 'groups.navigation',
    items: [{ title: 'items.dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> }],
  },
  {
    name: 'groups.features',
    items: [
      { title: 'items.tagManagement', path: '/tags', icon: <Tag size={20} /> },
      {
        title: 'items.categoryManagement',
        path: '/categories',
        icon: <FolderTree size={20} />,
      },
    ],
  },
  {
    name: 'groups.system',
    items: [
      {
        title: 'items.systemSettings',
        path: '/system',
        icon: <Settings size={20} />,
        children: [
          { title: 'items.userManagement', path: '/system/users', icon: <Users size={18} /> },
          { title: 'items.roleManagement', path: '/system/roles', icon: <Shield size={18} /> },
          {
            title: 'items.permissionManagement',
            path: '/system/permissions',
            icon: <Key size={18} />,
          },
        ],
      },
    ],
  },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { t } = useTranslation('sidebar')
  const location = useLocation()

  return (
    <nav
      className={cn(
        'fixed inset-y-0 left-0 flex flex-col h-full bg-background border-r z-40',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Header - Logo */}
      <div className='relative flex items-center h-16 px-3'>
        <Link to='/' className={cn('flex items-center gap-4 justify-center')}>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500'>
            <span className='text-lg font-bold text-white'>V</span>
          </div>
          {!collapsed && (
            <span className='text-lg font-bold text-gray-900 dark:text-white'>Vidora</span>
          )}
        </Link>
        {/* Toggle Button - on border line */}
        <button
          type='button'
          onClick={onToggle}
          className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-50 flex h-6 w-6 items-center justify-center rounded-full border bg-background hover:bg-gray-100 dark:hover:bg-gray-800 shadow-sm'
        >
          {collapsed ? <ArrowRightToLine size={14} /> : <ArrowLeftToLine size={14} />}
        </button>
      </div>

      {/* Navigation */}
      <ScrollArea className='flex-1 px-2 py-2'>
        {NAVIGATION_CONFIG.map(group => (
          <div key={group.name} className='mb-4'>
            {!collapsed && (
              <div className='px-3 py-2 text-xs text-gray-500 dark:text-gray-400'>
                {t(group.name)}
              </div>
            )}
            <div className='space-y-1'>
              {group.items.map(item => (
                <NavItemComponent
                  key={item.path}
                  item={item}
                  collapsed={collapsed}
                  location={location}
                  t={t}
                />
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>
    </nav>
  )
}

function NavItemComponent({
  item,
  collapsed,
  location,
  t,
}: {
  item: NavItem
  collapsed: boolean
  location: ReturnType<typeof useLocation>
  t: (key: string) => string
}) {
  const hasChildren = item.children && item.children.length > 0
  const isChildActive =
    hasChildren && item.children!.some(child => location.pathname === child.path)
  const isParentActive =
    location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
  const isActive = hasChildren ? isChildActive : isParentActive
  const [expanded, setExpanded] = useState(isChildActive)

  // Sync expanded state with isChildActive when URL changes
  useEffect(() => {
    if (isChildActive) {
      setExpanded(true)
    }
  }, [isChildActive])

  const content = (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
        isActive
          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
          : 'hover:bg-gray-100 dark:hover:bg-gray-800'
      )}
    >
      {item.icon}
      {!collapsed && (
        <>
          <span className='flex-1'>{t(item.title)}</span>
          {hasChildren && (
            <ChevronRight
              size={14}
              className={cn('transition-transform', expanded && 'rotate-90')}
            />
          )}
        </>
      )}
    </div>
  )

  if (collapsed) {
    return (
      <Link to={item.path} className='block'>
        {content}
      </Link>
    )
  }

  if (hasChildren) {
    return (
      <div>
        <button type='button' onClick={() => setExpanded(!expanded)} className='w-full text-left'>
          {content}
        </button>
        {expanded && (
          <div className='ml-4 mt-1 space-y-1'>
            {item.children!.map(child => (
              <Link
                key={child.path}
                to={child.path}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors',
                  location.pathname === child.path
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                {child.icon}
                {t(child.title)}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link to={item.path} className='block'>
      {content}
    </Link>
  )
}
