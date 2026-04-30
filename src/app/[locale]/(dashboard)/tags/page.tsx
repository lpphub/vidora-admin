import { getTranslations } from 'next-intl/server'
import { fetchApi } from '@/lib/api'
import type { Tag } from '@/types/tag'
import { TagsClient } from './_components/TagsClient'

export default async function TagsPage() {
  const t = await getTranslations('tags')
  const tc = await getTranslations('common')
  let initialTags: Tag[] = []

  if (process.env.NODE_ENV === 'development') {
    const { MOCK_TAGS } = await import('./_components/mock-tags')
    initialTags = MOCK_TAGS
  } else {
    try {
      const { cookies } = await import('next/headers')
      initialTags = await fetchApi.get<Tag[]>('tags', await cookies())
    } catch {
      // fallback to empty, client will fetch via TanStack Query
    }
  }

  const translations = {
    title: t('title'),
    addTitle: t('form.addTitle'),
    deleteSuccess: t('messages.deleteSuccess'),
    deleteFailed: t('messages.deleteFailed'),
    updateSuccess: t('messages.updateSuccess'),
    updateFailed: t('messages.updateFailed'),
    createSuccess: t('messages.createSuccess'),
    createFailed: t('messages.createFailed'),
    searchPlaceholder: t('search.placeholder'),
    table: {
      name: t('table.name'),
      color: t('table.color'),
      usageCount: t('table.usageCount'),
      createdAt: t('table.createdAt'),
      actions: t('table.actions'),
    },
    form: {
      editTitle: t('form.editTitle'),
      addTitle: t('form.addTitle'),
      name: t('form.name'),
      namePlaceholder: t('form.namePlaceholder'),
      nameRequired: t('form.nameRequired'),
      color: t('form.color'),
      colorRequired: t('form.colorRequired'),
      cancel: tc('actions.cancel'),
      save: tc('actions.save'),
    },
  }

  return <TagsClient initialTags={initialTags} translations={translations} />
}
