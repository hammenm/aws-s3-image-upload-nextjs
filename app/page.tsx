'use client';

import { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { uploadFile, deleteFile } from '@/app/lib/actions';
import { FormMessage } from "@/app/components/form-message";
import { SubmitButton } from "@/app/components/submit-button";

type Upload = {
  key: string;
  url: string;
};

export default function Page() {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(uploadFile, initialState);
  const [uploads, setUploads] = useState<Upload[]>([]);

  useEffect(() => {
    if (state.key && state.url) {
      setUploads((prev) => [...prev, {key: state.key, url: state.url}]);
    }
  }, [state.key, state.url]);

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
        <label htmlFor="expiration">Expiration (minutes)</label>
        <input
          id="expiration"
          name="expiration"
          type="number"
          min="1"
          max="120"
          step="1"
          placeholder="10"
          defaultValue={10}
        />
        <input
          id="file"
          name="file"
          type="file"
          accept="image/png, image/jpeg"
        />
        <FormMessage state={state} />
        <SubmitButton />
      </form>
      <h2>Uploads</h2>
      <ul>
        {uploads.map((upload) => (
          <li key={upload.key}>
            <a href={upload.url}>{upload.key}</a>
            <button onClick={async () => {
              await deleteFile(upload.key).then(() => {
                setUploads((prev) => prev.filter((u) => u.key !== upload.key));
              }
            )}
            }>Delete</button>
          </li>
        ))}
      </ul>
    </main>
  )
}
