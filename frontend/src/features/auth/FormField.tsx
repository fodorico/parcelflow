import { useId, type InputHTMLAttributes, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import type { ValidationKey } from './schemas'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  /** A validation key from the form schema. */
  error?: string
  hint?: ReactNode
}

export function FormField({ label, error, hint, ...input }: Props) {
  const { t } = useTranslation()
  const id = useId()
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        className={`input w-full ${error ? 'input-error' : ''}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        {...input}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-error-readable">
          {t(`validation.${error as ValidationKey}`)}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-sm text-base-content/80">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
