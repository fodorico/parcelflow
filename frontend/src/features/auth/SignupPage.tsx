import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router'
import { errorMessage } from '../../api/errors'
import { useSignup } from '../../api/generated/api'
import { COUNTRY_CODES, countryName } from '../../i18n/countries'
import { toSupportedLanguage } from '../../i18n'
import { FormField } from './FormField'
import { signupSchema, type SignupValues } from './schemas'
import { safeNext, useOnLoggedIn } from './session'

export function SignupPage() {
  const { t, i18n } = useTranslation()
  const countryId = useId()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))
  const onLoggedIn = useOnLoggedIn()
  const signup = useSignup({
    mutation: {
      onSuccess: (user) => {
        onLoggedIn(user, next)
      },
    },
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { countryCode: 'AR' },
  })

  return (
    <div className="mx-auto w-full max-w-md px-4 py-10">
      <section className="card border border-base-300 bg-base-100">
        <form
          className="card-body gap-4"
          noValidate
          onSubmit={(event) => {
            void handleSubmit(({ fullName, email, password, countryCode }) => {
              signup.mutate({
                data: {
                  full_name: fullName,
                  email,
                  password,
                  country_code: countryCode,
                  language: toSupportedLanguage(i18n.language),
                },
              })
            })(event)
          }}
        >
          <div>
            <h1 className="card-title text-2xl">{t('auth.signUp.title')}</h1>
            <p className="text-sm text-base-content/80">{t('auth.signUp.subtitle')}</p>
          </div>
          <FormField
            label={t('auth.fields.fullName')}
            autoComplete="name"
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          <FormField
            label={t('auth.fields.email')}
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />
          <FormField
            label={t('auth.fields.password')}
            type="password"
            autoComplete="new-password"
            hint={t('auth.passwordHint')}
            error={errors.password?.message}
            {...register('password')}
          />
          <div className="flex flex-col gap-1">
            <label htmlFor={countryId} className="text-sm font-medium">
              {t('auth.fields.country')}
            </label>
            <select id={countryId} className="select w-full" {...register('countryCode')}>
              {COUNTRY_CODES.map((code) => (
                <option key={code} value={code}>
                  {countryName(code, i18n.language)}
                </option>
              ))}
            </select>
          </div>
          {signup.isError && (
            <p role="alert" className="text-sm text-error-readable">
              {errorMessage(signup.error)}
            </p>
          )}
          <button type="submit" className="btn btn-primary" disabled={signup.isPending}>
            {t('auth.signUp.submit')}
          </button>
          <p className="text-sm">
            {t('auth.signUp.haveAccount')}{' '}
            <Link to="/login" className="link link-readable">
              {t('auth.signUp.logInLink')}
            </Link>
          </p>
        </form>
      </section>
    </div>
  )
}
