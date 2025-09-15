// Client-side storage utilities
export type StorageBucket = 'documents' | 'images' | 'videos' | 'general'

// Client-side functions that call API routes
export async function uploadFile(
  bucket: StorageBucket,
  file: File,
  fileName?: string
): Promise<{ path: string; url: string }> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('bucket', bucket)
  if (fileName) {
    formData.append('fileName', fileName)
  }

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`)
  }

  return response.json()
}

export async function deleteFile(filePath: string): Promise<void> {
  const response = await fetch('/api/upload', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ filePath }),
  })

  if (!response.ok) {
    throw new Error(`Delete failed: ${response.statusText}`)
  }
}

export function getPublicUrl(filePath: string): string {
  return `/api/storage/${filePath}`
}