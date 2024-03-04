import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { S3Client } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

export async function preSignUploadFile(filename, contentType) {
  const client = new S3Client({ region: process.env.AWS_REGION })
  const { url, fields } = await createPresignedPost(client, {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: uuidv4(),
    Conditions: [
      ['content-length-range', 0, 10485760], // up to 10 MB
      ['starts-with', '$Content-Type', contentType],
    ],
    Fields: {
      'Content-Type': contentType,
      'x-amz-meta-filename': filename,
      'x-amz-meta-userid': '1234',
      'x-amz-meta-siteid': '5678',
    },
    Expires: 600, // Seconds before the presigned post expires. 3600 by default.
  })

  return { url, fields }
}
