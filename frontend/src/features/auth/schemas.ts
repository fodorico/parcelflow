import { z } from 'zod'
import { CountryCode } from '../../api/generated/model'
import type { Translation } from '../../i18n/locales/en'

/** Zod messages are keys of `validation` in the translations, translated when shown. */
export type ValidationKey = keyof Translation['validation']

function message(key: ValidationKey) {
  return { message: key }
}

// Same limits as the API (backend/app/schemas.py).
const email = z
  .string()
  .trim()
  .min(1, message('required'))
  .pipe(z.email(message('email')))

export const loginSchema = z.object({
  email,
  password: z.string().min(1, message('required')).max(128, message('passwordTooLong')),
})
export type LoginValues = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  fullName: z.string().trim().min(1, message('required')).max(120, message('tooLong')),
  email,
  password: z.string().min(10, message('passwordTooShort')).max(128, message('passwordTooLong')),
  countryCode: z.enum(CountryCode),
})
export type SignupValues = z.infer<typeof signupSchema>
