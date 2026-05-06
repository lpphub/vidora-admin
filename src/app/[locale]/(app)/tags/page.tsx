import { getTranslations } from 'next-intl/server'
import { TagsClient } from './_components/TagsClient'

export default async function TagsPage() {
  const t = await getTranslations('tags')
  const tc = await getTranslations('common')

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

  return <TagsClient translations={translations} />
}
