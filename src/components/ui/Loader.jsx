import { Loader as LoaderIcon } from 'lucide-react'

export function Loader() {
  return (
    <div className='w-screen h-screen flex items-center justify-center bg-background'>
      <LoaderIcon className='animate-spin text-primary' size={32} />
    </div>
  )
}