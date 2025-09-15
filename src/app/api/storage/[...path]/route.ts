import { NextRequest, NextResponse } from 'next/server'
import { readFile, access } from 'fs/promises'
import { join } from 'path'
import { lookup } from 'mime-types'

const STORAGE_BASE_DIR = join(process.cwd(), 'storage')

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = params.path.join('/')
    const fullPath = join(STORAGE_BASE_DIR, filePath)
    
    // Check if file exists
    try {
      await access(fullPath)
    } catch {
      return new NextResponse('File not found', { status: 404 })
    }
    
    // Read file
    const fileBuffer = await readFile(fullPath)
    
    // Get MIME type
    const mimeType = lookup(fullPath) || 'application/octet-stream'
    
    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving file:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}