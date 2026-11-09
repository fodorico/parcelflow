import { ErrorReadDetail } from './generated/model'
import i18n from '../i18n'
import { ApiError } from './http'

function isErrorCode(value: string): value is ErrorReadDetail {
  return Object.values<string>(ErrorReadDetail).includes(value)
}

/** Human-readable message, in the current language, for an error from the API or the network. */
export function errorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    // The API answers with an error code; the text lives in the translations.
    if (isErrorCode(error.message)) return i18n.t(`errors.${error.message}`)
    if (error.status === 422) return i18n.t('errors.invalidData')
    if (error.status === 429) return i18n.t('errors.tooManyRequests')
    if (error.status >= 500) return i18n.t('errors.server')
    return error.message
  }
  return i18n.t('errors.network')
}
