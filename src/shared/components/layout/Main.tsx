import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { SkeletonPage } from '@/pages/base/SkeletonPage'

const Main = () => {
  return (
    <main className='flex-auto w-full flex flex-col px-4 sm:px-6 py-4 sm:py-6 md:px-8 mx-auto xl:max-w-7xl overflow-auto'>
      <Suspense fallback={<SkeletonPage />}>
        <Outlet />
      </Suspense>
    </main>
  )
}

export default Main
