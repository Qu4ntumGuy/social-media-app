const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY,
  },
});

export default async function uploadFileToS3(file: ArrayBuffer, key: String) {
  const params = {
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
    Key: key,
    Body: file,
  };

  const command = new PutObjectCommand(params);

  try {
    const data = await s3Client.send(command);
    console.log("Successfully uploaded file", data);
    const url = `https://${params.Bucket}.s3.${s3Client.config.region}.amazonaws.com/${params.Key}`;
    // const url = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    return url;
  } catch (error) {
    console.error("Error uploading file", error);
  }
}
