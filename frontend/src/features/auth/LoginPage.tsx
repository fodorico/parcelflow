import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router'
import { errorMessage } from '../../api/errors'
import { useLogin } from '../../api/generated/api'
import { DemoLogin } from './DemoLogin'
import { FormField } from './FormField'
import { loginSchema, type LoginValues } from './schemas'
import { safeNext, useOnLoggedIn } from './session'

export function LoginPage() {
  const { t } = useTranslation()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))
  const onLoggedIn = useOnLoggedIn()
  const login = useLogin({
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
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  const signupLink = next ? `/signup?next=${encodeURIComponent(next)}` : '/signup'

  return (
    <div className="mx-auto grid w-full max-w-4xl gap-6 px-4 py-10 md:grid-cols-2">
      <section className="card border border-base-300 bg-base-100">
        <form
          className="card-body gap-4"
          noValidate
          onSubmit={(event) => {
            void handleSubmit((values) => {
              login.mutate({ data: values })
            })(event)
          }}
        >
          <h1 className="card-title text-2xl">{t('auth.logIn.title')}</h1>
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
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
          {login.isError && (
            <p role="alert" className="text-sm text-error-readable">
              {errorMessage(login.error)}
            </p>
          )}
          <button type="submit" className="btn btn-primary" disabled={login.isPending}>
            {t('auth.logIn.submit')}
          </button>
          <p className="text-sm">
            {t('auth.logIn.noAccount')}{' '}
            <Link to={signupLink} className="link link-readable">
              {t('auth.logIn.signUpLink')}
            </Link>
          </p>
        </form>
      </section>
      <DemoLogin next={next} />
    </div>
  )
}
