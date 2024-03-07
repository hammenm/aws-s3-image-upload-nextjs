'use client';

import { useFormState } from 'react-dom';
import { uploadFile } from '@/app/lib/actions';
import { SubmitButton } from "@/app/components/submit-button";

export default function Page() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(uploadFile, initialState);

  return (
    <main>
      <h1>Upload a File to S3</h1>
      <form action={dispatch}>
        <select id="userid" name="userid">
          <option value="userid1">userid1</option>
          <option value="userid2">userid2</option>
        </select>
        <select id="siteid" name="siteid">
          <option value="siteid1">siteid1</option>
          <option value="siteid2">siteid2</option>
        </select>
        <input
          id="file"
          name="file"
          type="file"
          accept="image/png, image/jpeg"
        />
        <div id="message" aria-live="polite" aria-atomic="true">
          {state?.message && <p>{state.message}</p>}
        </div>
        <SubmitButton />
      </form>
    </main>
  )
}
