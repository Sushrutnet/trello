import {ID ,storage } from "@/appwrite";

const uploadImage =async (file:File) => {
    if(!file) return;
    const fileUploaded = await storage.createFile(
        "64ff2f20735d6b40c504",
        ID.unique(),
        file
    );
    return fileUploaded
}

export default uploadImage