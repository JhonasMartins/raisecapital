import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zaybwuyceusiktocgrff.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpheWJ3dXljZXVzaWt0b2NncmZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTU1MTUsImV4cCI6MjA3MzUzMTUxNX0.6Ncn2mvDwBY-VNCMwiYN3_aJuULxDkbUAzUGRvpgu9g'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Storage helper functions
export const uploadFile = async (
  bucket: string,
  path: string,
  file: File,
  options?: {
    cacheControl?: string
    contentType?: string
    upsert?: boolean
  }
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: options?.cacheControl || '3600',
      contentType: options?.contentType || file.type,
      upsert: options?.upsert || false
    })

  if (error) {
    throw new Error(`Erro ao fazer upload: ${error.message}`)
  }

  return data
}

export const getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}

export const deleteFile = async (bucket: string, path: string) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])

  if (error) {
    throw new Error(`Erro ao deletar arquivo: ${error.message}`)
  }

  return true
}

export const listFiles = async (bucket: string, path?: string) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(path || '', {
      limit: 100,
      offset: 0
    })

  if (error) {
    throw new Error(`Erro ao listar arquivos: ${error.message}`)
  }

  return data
}

// Bucket names constants
export const STORAGE_BUCKETS = {
  AVATARS: 'avatars',
  DOCUMENTS: 'documents',
  OFFERS: 'offers'
} as const

export type StorageBucket = typeof STORAGE_BUCKETS[keyof typeof STORAGE_BUCKETS]