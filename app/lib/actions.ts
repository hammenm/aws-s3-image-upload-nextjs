'use server';
import { preSignUploadFile } from '@/app/lib/s3';

// This is temporary until @types/react-dom is updated
export type State = {
  message?: string | null;
};

export async function uploadFile(prevState: State, formData: FormData) {
  const file = formData.get('file') as File;

  if (!file) {
    return { message: 'Please select a file to upload.' };
  }

  const { url, fields } = await preSignUploadFile(file.name, file.type);
  const formDataUpload = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formDataUpload.append(key, value as string);
  });
  formDataUpload.append('file', file);

  const uploadResponse = await fetch(url, {
    method: 'POST',
    body: formDataUpload,
  });

  if (uploadResponse.ok) {
    return { message: 'Upload successful!' };
  } else {
    console.error('Response body:', await uploadResponse.text());
    return { message: 'Upload failed.' };
  }
}
