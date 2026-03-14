import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { useCreateEpisode, useCreateSeason } from '../hooks'
import type { Season } from '../types'

interface SeasonManagerProps {
  videoId: string
  seasons: Season[]
}

export function SeasonManager({ videoId, seasons }: SeasonManagerProps) {
  const [addSeasonOpen, setAddSeasonOpen] = useState(false)
  const [addEpisodeOpen, setAddEpisodeOpen] = useState<string | null>(null)
  const [seasonTitle, setSeasonTitle] = useState('')
  const [episodeTitle, setEpisodeTitle] = useState('')

  const createSeason = useCreateSeason()
  const createEpisode = useCreateEpisode()

  const handleAddSeason = () => {
    const maxSeason = seasons.reduce((max, s) => Math.max(max, s.seasonNumber), 0)
    createSeason.mutate(
      { videoId, data: { seasonNumber: maxSeason + 1, title: seasonTitle || undefined } },
      {
        onSuccess: () => {
          setAddSeasonOpen(false)
          setSeasonTitle('')
        },
      }
    )
  }

  const handleAddEpisode = (seasonId: string) => {
    const season = seasons.find(s => s.id === seasonId)
    const maxEpisode = season?.episodes.reduce((max, e) => Math.max(max, e.episodeNumber), 0) ?? 0
    createEpisode.mutate(
      {
        videoId,
        seasonId,
        data: { episodeNumber: maxEpisode + 1, title: episodeTitle || undefined },
      },
      {
        onSuccess: () => {
          setAddEpisodeOpen(null)
          setEpisodeTitle('')
        },
      }
    )
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-end'>
        <Button onClick={() => setAddSeasonOpen(true)}>
          <Plus className='mr-1 h-4 w-4' />
          添加季
        </Button>
      </div>

      {seasons.length === 0 ? (
        <div className='text-center py-8 text-muted-foreground'>暂无季集数据</div>
      ) : (
        seasons.map(season => (
          <div key={season.id} className='border rounded-lg'>
            <div className='flex items-center justify-between p-4 border-b bg-muted/30'>
              <div>
                <h3 className='font-medium'>
                  第 {season.seasonNumber} 季
                  {season.title && (
                    <span className='ml-2 text-muted-foreground'>({season.title})</span>
                  )}
                </h3>
              </div>
              <Button variant='outline' size='sm' onClick={() => setAddEpisodeOpen(season.id)}>
                <Plus className='mr-1 h-3 w-3' />
                添加集
              </Button>
            </div>
            <div className='divide-y'>
              {season.episodes.length === 0 ? (
                <div className='p-4 text-center text-muted-foreground text-sm'>暂无集数据</div>
              ) : (
                season.episodes.map(episode => (
                  <div
                    key={episode.id}
                    className='flex items-center justify-between p-3 hover:bg-muted/30'
                  >
                    <div className='flex items-center gap-3'>
                      <span className='text-sm font-medium w-16'>
                        第 {episode.episodeNumber} 集
                      </span>
                      <span className='text-sm'>{episode.title || '未命名'}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      {episode.duration && (
                        <span className='text-xs text-muted-foreground'>
                          {Math.floor(episode.duration / 60)}分钟
                        </span>
                      )}
                      <Button variant='ghost' size='icon-xs'>
                        <Trash2 className='h-3 w-3' />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))
      )}

      <Dialog open={addSeasonOpen} onOpenChange={setAddSeasonOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加季</DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>季标题（可选）</label>
              <Input
                placeholder='例如：第一季'
                value={seasonTitle}
                onChange={e => setSeasonTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setAddSeasonOpen(false)}>
              取消
            </Button>
            <Button onClick={handleAddSeason} disabled={createSeason.isPending}>
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!addEpisodeOpen} onOpenChange={() => setAddEpisodeOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>添加集</DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>集标题（可选）</label>
              <Input
                placeholder='例如：第一集'
                value={episodeTitle}
                onChange={e => setEpisodeTitle(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setAddEpisodeOpen(null)}>
              取消
            </Button>
            <Button
              onClick={() => addEpisodeOpen && handleAddEpisode(addEpisodeOpen)}
              disabled={createEpisode.isPending}
            >
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
