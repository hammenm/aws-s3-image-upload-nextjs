'use client';

import { useFormState } from 'react-dom';
import { uploadFile } from '@/app/lib/actions';

export default function Page() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(uploadFile, initialState);

  return (
    <main>
      <h1>Upload a File to S3</h1>
      <form action={dispatch}>
        <input
          id="file"
          name="file"
          type="file"
          accept="image/png, image/jpeg"
        />
        <div id="message" aria-live="polite" aria-atomic="true">
          {state?.message && <p>{state.message}</p>}
        </div>
        <button type="submit">
          Upload
        </button>
      </form>
    </main>
  )
}
