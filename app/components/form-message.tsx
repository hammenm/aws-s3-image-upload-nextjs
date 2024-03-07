'use client'

import { useFormStatus } from 'react-dom'
import { State } from '@/app/lib/actions';

export function FormMessage({ state }: { state: State }) {
  const { pending } = useFormStatus();

  if (pending) {
    return null;
  }

  return (
    <div>
      <div id="message" aria-live="polite" aria-atomic="true">
        {state?.message && <p>{state.message}</p>}
      </div>
      <div id="link" aria-live="polite" aria-atomic="true">
        {
          state?.url && (
            <a href={state
              .url}
               target="_blank"
               rel="noopener noreferrer"
            >
              Open the uploaded file
            </a>
          )
        }
      </div>
    </div>
  )
}
