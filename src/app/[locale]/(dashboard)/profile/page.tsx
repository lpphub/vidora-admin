'use client'

import { Key, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import General from '@/features/profile/components/General'
import Security from '@/features/profile/components/Security'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

function Profile() {
  const t = useTranslations('profile')

  return (
    <div className='p-6'>
      <Tabs defaultValue='general'>
        <TabsList>
          <TabsTrigger value='general'>
            <div className='flex items-center'>
              <User size={18} className='mr-2' />
              <span>{t('tabs.general')}</span>
            </div>
          </TabsTrigger>
          <TabsTrigger value='security'>
            <div className='flex items-center'>
              <Key size={18} className='mr-2' />
              <span>{t('tabs.security')}</span>
            </div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value='general'>
          <General />
        </TabsContent>
        <TabsContent value='security'>
          <Security />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Profile
