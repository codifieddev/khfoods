import { getMediaModel } from "@/models";
import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const Media = await getMediaModel();
    const media = await Media.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ data: media, success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message, success: false }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await authenticateAdmin();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const names = formData.getAll("name") as string[];
    const alts = formData.getAll("altText") as string[];
    const folders = formData.getAll("foldername") as string[];

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // already exists
    }

    const savedMedia = [];
    const Media = await getMediaModel();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const name = names[i] || file.name;
      const alt = alts[i] || name;
      const folder = folders[i] || "Boutique";

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const fileName = `${Date.now()}-${name.replace(/[^a-z0-9.]/gi, "_").toLowerCase()}`;
      const filePath = path.join(uploadDir, fileName);
      
      await writeFile(filePath, buffer);
      
      const mediaDoc = {
        filename: fileName,
        url: `/uploads/${fileName}`,
        alt: alt,
        foldername: folder,
        size: file.size,
        type: file.type || "image/jpeg",
        createdAt: new Date(),
      };

      const result = await Media.insertOne(mediaDoc);
      savedMedia.push({ ...mediaDoc, id: result.insertedId, _id: result.insertedId });
    }

    return NextResponse.json({ 
      success: true, 
      data: savedMedia,
      message: `${files.length} ASSETS DEPLOYED TO BOUTIQUE ARCHIVE`
    }, { status: 201 });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ message: error.message, success: false }, { status: 500 });
  }
}
