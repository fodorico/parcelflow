import { useTranslation } from 'react-i18next'
import { useHealth } from '../api/generated/api'

export function ApiStatus() {
  const { t } = useTranslation()
  const { isPending, isError } = useHealth()

  const [badge, label] = isPending
    ? ['badge-ghost', t('apiStatus.checking')]
    : isError
      ? ['badge-error', t('apiStatus.offline')]
      : ['badge-success', t('apiStatus.online')]

  return (
    <p role="status" className={`badge ${badge}`}>
      {label}
    </p>
  )
}
