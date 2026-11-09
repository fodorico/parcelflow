import i18n from '../i18n'
import { ApiError } from './http'

/** Human-readable message, in the current language, for an error from the API or the network. */
export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 429) return i18n.t('errors.tooManyRequests')
    if (error.status >= 500) return i18n.t('errors.server')
    return error.message
  }
  return i18n.t('errors.network')
}
