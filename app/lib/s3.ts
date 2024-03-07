import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

export async function preSignUploadFile(folder, contentType) {
  const client = new S3Client({ region: process.env.AWS_REGION });
  const key = `${folder}/${uuidv4()}`

  const { url, fields } = await createPresignedPost(client, {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
    Conditions: [
      ['content-length-range', 0, 10485760], // up to 10 MB
      ['starts-with', '$Content-Type', contentType],
    ],
    Fields: {
      'Content-Type': contentType,
    },
    Expires: 600, // Seconds before the presigned post expires. 3600 by default.
  })

  return { key, url, fields }
}

export async function deleteFileS3(key) {
  const client = new S3Client({ region: process.env.AWS_REGION });
  await client.send(new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  }))
}
