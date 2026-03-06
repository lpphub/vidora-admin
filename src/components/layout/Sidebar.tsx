import {
  ArrowLeftToLine,
  ArrowRightToLine,
  ChevronRight,
  Film,
  FolderTree,
  LayoutDashboard,
  RefreshCw,
  Settings,
  Tag,
  Users,
  Video,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

type SidebarItem = {
  title: string
  path: string
  icon: React.ReactNode
  children?: { title: string; path: string }[]
}

type SidebarGroup = {
  name: string
  items: SidebarItem[]
}

const sidebarData: SidebarGroup[] = [
  {
    name: '导航',
    items: [{ title: '工作台', path: '/dashboard', icon: <LayoutDashboard size={20} /> }],
  },
  {
    name: '内容管理',
    items: [
      {
        title: '内容管理',
        path: '/contents',
        icon: <Film size={20} />,
        children: [
          { title: '内容列表', path: '/contents' },
          { title: '内容审核', path: '/contents/review' },
        ],
      },
      {
        title: '视频中心',
        path: '/videos',
        icon: <Video size={20} />,
        children: [
          { title: '视频列表', path: '/videos' },
          { title: '上传管理', path: '/videos/upload' },
        ],
      },
      { title: '转码任务', path: '/transcode', icon: <RefreshCw size={20} /> },
      { title: '分类管理', path: '/categories', icon: <FolderTree size={20} /> },
      { title: '项目标签', path: '/tags', icon: <Tag size={20} /> },
    ],
  },
  {
    name: '系统',
    items: [
      { title: '用户管理', path: '/users', icon: <Users size={20} /> },
      { title: '系统设置', path: '/settings', icon: <Settings size={20} /> },
    ],
  },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
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
        {sidebarData.map(group => (
          <div key={group.name} className='mb-4'>
            {!collapsed && (
              <div className='px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400'>
                {group.name}
              </div>
            )}
            <div className='space-y-1'>
              {group.items.map(item => (
                <NavItem key={item.path} item={item} collapsed={collapsed} location={location} />
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>
    </nav>
  )
}

function NavItem({
  item,
  collapsed,
  location,
}: {
  item: SidebarItem
  collapsed: boolean
  location: ReturnType<typeof useLocation>
}) {
  const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
  const [expanded, setExpanded] = useState(false)
  const hasChildren = item.children && item.children.length > 0

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
          <span className='flex-1'>{item.title}</span>
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
                  'block px-3 py-1.5 rounded-md text-sm transition-colors',
                  location.pathname === child.path
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                {child.title}
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
