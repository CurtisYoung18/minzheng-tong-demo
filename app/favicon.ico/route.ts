import { NextResponse } from "next/server"
import { readFile } from "fs/promises"
import { join } from "path"

export async function GET() {
  try {
    // Try to serve the light icon as favicon.ico
    const iconPath = join(process.cwd(), "public", "icon-light-32x32.png")
    const iconBuffer = await readFile(iconPath)
    
    return new NextResponse(iconBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    // Return 204 No Content if icon not found
    return new NextResponse(null, { status: 204 })
  }
}

