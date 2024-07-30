"use server";

import { AddPostRequestBody } from "@/app/api/posts/route";
import generateSASToken, { containerName } from "@/lib/generateSASToken";
import uploadFileToS3 from "@/lib/webStorage";

import { Post } from "@/mongodb/models/post";
import { IUser } from "@/types/user";
import { BlobServiceClient } from "@azure/storage-blob";
import { currentUser } from "@clerk/nextjs/server";
import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";

export default async function createPostAction(formData: FormData) {
  const user = await currentUser();
  const postInput = formData.get("postInput") as string;
  const image = formData.get("image") as File;
  let image_url: string | undefined = undefined;

  if (!postInput) {
    throw new Error("Post input is required");
  }

  if (!user?.id) {
    throw new Error("User not authenticated");
  }

  const userDB: IUser = {
    userId: user.id,
    userImage: user.imageUrl,
    firstName: user.firstName || "",
    lastName: user.lastName || "",
  };

  try {
    if (image.size > 0) {
      console.log("Uploading image to S3 Bucket Storage...", image);

      // console.log("Uploading image to Azure Blob Storage...", image);

      // const accountName = process.env.AZURE_STORAGE_NAME;

      // const sasToken = await generateSASToken();

      // const blobServiceClient = new BlobServiceClient(
      //   `https://${accountName}.blob.core.windows.net?${sasToken}`
      // );

      // const containerClient =
      //   blobServiceClient.getContainerClient(containerName);

      // generate current timestamp
      const timestamp = new Date().getTime();
      const file_name = `${randomUUID()}_${timestamp}.png`;

      // const blockBlobClient = containerClient.getBlockBlobClient(file_name);

      const imageBuffer = await image.arrayBuffer();
      // const res = await blockBlobClient.uploadData(imageBuffer);
      const res = await uploadFileToS3(imageBuffer, file_name);

      // image_url = res._response.request.url;
      image_url = res;

      console.log("File uploaded successfully!", image_url);

      const body: AddPostRequestBody = {
        user: userDB,
        text: postInput,
        imageUrl: image_url,
      };

      await Post.create(body);
    } else {
      const body: AddPostRequestBody = {
        user: userDB,
        text: postInput,
      };

      await Post.create(body);
    }
  } catch (error: any) {
    throw new Error("Failed to create post", error);
  }

  revalidatePath("/");
}