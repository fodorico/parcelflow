import { CountryCode } from '../api/generated/model'

export const COUNTRY_CODES = Object.values(CountryCode)

/** The country's name in `language`, from the browser's own data (no translations to keep). */
export function countryName(code: CountryCode, language: string): string {
  return new Intl.DisplayNames([language], { type: 'region' }).of(code) ?? code
}
