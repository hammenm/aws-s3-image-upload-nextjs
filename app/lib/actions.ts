'use server';
import { getCloudFrontSignedUrl } from "@/app/lib/cloudfront";
import { deleteFileS3, preSignUploadFile } from '@/app/lib/s3';

// This is temporary until @types/react-dom is updated
export type State = {
  message?: string | null;
  key?: string;
  url?: string;
};

export async function uploadFile(prevState: State, formData: FormData) {
  const file = formData.get('file') as File;
  const userid = formData.get('userid') as string;
  const siteid = formData.get('siteid') as string;
  const expiration = formData.get('expiration') as string;
  const expiryMs = parseInt(expiration, 10) * 60 * 1000;

  if (!file) {
    return { message: 'Please select a file to upload.' };
  }

  const folder = `sites/${siteid}/users/${userid}`;

  const { key, url, fields } = await preSignUploadFile(folder, file.type);
  const formDataUpload = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    formDataUpload.append(key, value);
  });
  formDataUpload.append('file', file);

  const uploadResponse = await fetch(url, {
    method: 'POST',
    body: formDataUpload,
  });

  if (uploadResponse.ok) {
    return {
      message: 'Upload successful!',
      key,
      url: await getCloudFrontSignedUrl(key, expiryMs),
    };
  } else {
    console.error('Response body:', await uploadResponse.text());
    return { message: 'Upload failed.' };
  }
}

export async function deleteFile(key: string) {
  try {
    await deleteFileS3(key);
    return { message: 'File deleted.' };
  } catch (error) {
    console.error('Error deleting file:', error);
    return { message: 'Error deleting file.' };
  }
}
