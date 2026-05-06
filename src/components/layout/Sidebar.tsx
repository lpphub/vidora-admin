'use client'

import { ChevronRight, Key, LayoutDashboard, Settings, Shield, Tag, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { TooltipProvider } from '@/components/ui/tooltip'

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
    items: [{ title: 'items.dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> }],
  },
  {
    name: 'groups.features',
    items: [{ title: 'items.tagManagement', path: '/tags', icon: <Tag size={18} /> }],
  },
  {
    name: 'groups.system',
    items: [
      {
        title: 'items.systemSettings',
        path: '/system',
        icon: <Settings size={18} />,
        children: [
          { title: 'items.userManagement', path: '/system/users', icon: <Users size={16} /> },
          { title: 'items.roleManagement', path: '/system/roles', icon: <Shield size={16} /> },
          {
            title: 'items.permissionManagement',
            path: '/system/permissions',
            icon: <Key size={16} />,
          },
        ],
      },
    ],
  },
]

const locales = ['zh', 'en']

/** Strip locale prefix from pathname: /zh/dashboard → /dashboard */
function stripLocale(pathname: string): string {
  for (const l of locales) {
    if (pathname.startsWith(`/${l}/`)) return pathname.slice(`/${l}`.length)
    if (pathname === `/${l}`) return '/'
  }
  return pathname
}

function isChildActive(item: NavItem, cleanPath: string): boolean {
  return item.children?.some(child => cleanPath === child.path) ?? false
}

export function AppSidebar() {
  const t = useTranslations('sidebar')
  const pathname = usePathname()
  const cleanPath = stripLocale(pathname)

  return (
    <TooltipProvider>
      <Sidebar collapsible='icon'>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size='lg' asChild>
                <Link href='/'>
                  <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
                    <span className='text-sm font-bold'>V</span>
                  </div>
                  <span className='text-base font-bold'>Vidora</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {NAVIGATION_CONFIG.map(group => (
            <SidebarGroup key={group.name}>
              <SidebarGroupLabel>{t(group.name)}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map(item => (
                    <NavItemComponent key={item.path} item={item} cleanPath={cleanPath} t={t} />
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </TooltipProvider>
  )
}

function NavItemComponent({
  item,
  cleanPath,
  t,
}: {
  item: NavItem
  cleanPath: string
  t: (key: string) => string
}) {
  const hasChildren = item.children && item.children.length > 0
  const childActive = isChildActive(item, cleanPath)
  const isParentActive = cleanPath === item.path || cleanPath.startsWith(`${item.path}/`)
  const isActive = hasChildren ? childActive : isParentActive

  if (hasChildren) {
    return (
      <Collapsible defaultOpen={childActive} className='group/collapsible'>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton isActive={isActive} tooltip={t(item.title)}>
              {item.icon}
              <span>{t(item.title)}</span>
              <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children!.map(child => (
                <SidebarMenuSubItem key={child.path}>
                  <SidebarMenuSubButton asChild isActive={cleanPath === child.path}>
                    <Link href={child.path}>
                      {child.icon}
                      <span>{t(child.title)}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={t(item.title)}>
        <Link href={item.path}>
          {item.icon}
          <span>{t(item.title)}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
