import { useUploadScheduler } from '@/features/video/hooks'
import { UploadDropzone, UploadQueue } from '@/features/video/upload/components'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'

export function UploadTab() {
  const { cancelTask } = useUploadScheduler()

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>源视频上传</CardTitle>
        </CardHeader>
        <CardContent>
          <UploadDropzone />
        </CardContent>
      </Card>

      <UploadQueue cancelTask={cancelTask} />
    </div>
  )
}
