import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

export async function getCloudFrontSignedUrl(key: string, expiryMs: number) {
  return getSignedUrl({
    url: `${process.env.AWS_CLOUDFRONT_URL}/${key}`,
    keyPairId: process.env.AWS_CLOUDFRONT_KEY_PAIR_ID,
    privateKey: process.env.AWS_CLOUDFRONT_PRIVATE_KEY,
    dateLessThan: (new Date(Date.now() + expiryMs)).toISOString(),
  });
}
