import { UploadDropzone } from '@/features/video/upload/components/UploadDropzone'
import { UploadQueue } from '@/features/video/upload/components/UploadQueue'
import { useUploadScheduler } from '@/features/video/upload/hooks/useUploadScheduler'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

export default function UploadCenter() {
  const { cancelTask } = useUploadScheduler()

  return (
    <div className='flex flex-col gap-4'>
      <Card>
        <CardHeader>
          <CardTitle>上传中心</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadDropzone />
        </CardContent>
      </Card>
      <UploadQueue cancelTask={cancelTask} />
    </div>
  )
}
