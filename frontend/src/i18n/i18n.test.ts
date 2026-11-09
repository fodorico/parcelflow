import { describe, expect, it } from 'vitest'
import { toSupportedLanguage } from '.'
import { en } from './locales/en'
import { es419 } from './locales/es-419'

function keys(value: object, prefix = ''): string[] {
  return Object.entries(value).flatMap(([key, child]) =>
    typeof child === 'object' && child !== null
      ? keys(child as object, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  )
}

describe('toSupportedLanguage', () => {
  it.each(['es', 'es-AR', 'es-MX', 'ES-es', 'es-419'])(
    'maps %s to Latin American Spanish',
    (tag) => {
      expect(toSupportedLanguage(tag)).toBe('es-419')
    },
  )

  it.each(['en', 'en-US', 'pt-BR', 'fr'])('maps %s to English', (tag) => {
    expect(toSupportedLanguage(tag)).toBe('en')
  })
})

describe('translations', () => {
  it('have the same keys in every language', () => {
    expect(keys(es419)).toEqual(keys(en))
  })

  it('have no empty texts', () => {
    for (const locale of [en, es419]) {
      for (const key of keys(locale)) {
        const text = key
          .split('.')
          .reduce<unknown>((node, part) => (node as Record<string, unknown>)[part], locale)
        expect(text, key).not.toBe('')
      }
    }
  })
})
