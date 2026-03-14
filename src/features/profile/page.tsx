import { Key, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import General from './components/General'
import Security from './components/Security'

function Profile() {
  const { t } = useTranslation('profile')

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
