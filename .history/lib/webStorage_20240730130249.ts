const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// export default async function uploadFile(file, key) {
//   const params = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: key,
//     Body: file,
//   };

//   const command = new PutObjectCommand(params);

//   try {
//     const data = await s3Client.send(command);
//     console.log('Successfully uploaded file', data);
//   } catch (error) {
//     console.error('Error uploading file', error);
//   }
// }
