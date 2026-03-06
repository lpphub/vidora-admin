import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'

const Main = () => {
  return (
    <main className='flex-auto w-full flex flex-col px-4 sm:px-6 py-4 sm:py-6 md:px-8 mx-auto xl:max-w-7xl'>
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
    </main>
  )
}

export default Main
