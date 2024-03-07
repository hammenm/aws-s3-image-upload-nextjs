'use server';
import { getCloudFrontSignedUrl } from "@/app/lib/cloudfront";
import { preSignUploadFile } from '@/app/lib/s3';

// This is temporary until @types/react-dom is updated
export type State = {
  message?: string | null;
  url?: string;
};

export async function uploadFile(prevState: State, formData: FormData) {
  const file = formData.get('file') as File;
  const userid = formData.get('userid') as string;
  const siteid = formData.get('siteid') as string;

  if (!file) {
    return { message: 'Please select a file to upload.' };
  }

  const folder = `sites/${siteid}/users/${userid}`;

  const { key, url, fields } = await preSignUploadFile(file.name, folder, file.type);
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
    return {
      message: 'Upload successful!',
      url: await getCloudFrontSignedUrl(key, 10 * 60 * 1000)
    };
  } else {
    console.error('Response body:', await uploadResponse.text());
    return { message: 'Upload failed.' };
  }
}
