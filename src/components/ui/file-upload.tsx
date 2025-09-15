'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Upload, File, Image, FileText } from 'lucide-react'
import { uploadFile, getPublicUrl, deleteFile, type StorageBucket } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  bucket: StorageBucket
  path?: string
  accept?: string
  maxSize?: number // in MB
  maxFiles?: number
  onUploadComplete?: (files: UploadedFile[]) => void
  onUploadError?: (error: string) => void
  className?: string
  disabled?: boolean
  showPreview?: boolean
}

export interface UploadedFile {
  name: string
  path: string
  url: string
  size: number
  type: string
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const getFileIcon = (type: string) => {
  if (type.startsWith('image/')) return <Image className="h-4 w-4" />
  if (type.includes('pdf')) return <FileText className="h-4 w-4" />
  return <File className="h-4 w-4" />
}

export function FileUpload({
  bucket,
  path = '',
  accept,
  maxSize = 10, // 10MB default
  maxFiles = 5,
  onUploadComplete,
  onUploadError,
  className,
  disabled = false,
  showPreview = true
}: FileUploadProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (disabled) return

    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [disabled])

  const handleFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        onUploadError?.(`Arquivo ${file.name} é muito grande. Máximo: ${maxSize}MB`)
        return false
      }

      // Check file type if accept is specified
      if (accept && !accept.split(',').some(type => 
        file.type.match(type.trim().replace('*', '.*'))
      )) {
        onUploadError?.(`Tipo de arquivo ${file.name} não é aceito`)
        return false
      }

      return true
    })

    const totalFiles = files.length + validFiles.length
    if (totalFiles > maxFiles) {
      onUploadError?.(`Máximo de ${maxFiles} arquivos permitidos`)
      return
    }

    setFiles(prev => [...prev, ...validFiles])
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const removeUploadedFile = async (index: number) => {
    const file = uploadedFiles[index]
    try {
      await deleteFile(bucket, file.path)
      setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    } catch (error) {
      onUploadError?.(`Erro ao remover arquivo: ${error}`)
    }
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setUploading(true)
    setUploadProgress(0)

    try {
      const uploaded: UploadedFile[] = []
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const timestamp = Date.now()
        const fileName = `${timestamp}_${file.name}`
        const filePath = path ? `${path}/${fileName}` : fileName

        const data = await uploadFile(bucket, filePath, file)
        const publicUrl = getPublicUrl(bucket, data.path)

        uploaded.push({
          name: file.name,
          path: data.path,
          url: publicUrl,
          size: file.size,
          type: file.type
        })

        setUploadProgress(((i + 1) / files.length) * 100)
      }

      setUploadedFiles(prev => [...prev, ...uploaded])
      setFiles([])
      onUploadComplete?.(uploaded)
    } catch (error) {
      onUploadError?.(`Erro no upload: ${error}`)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop Zone */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
          dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-primary/50'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-2">
          Arraste arquivos aqui ou clique para selecionar
        </p>
        <p className="text-xs text-muted-foreground">
          Máximo: {maxFiles} arquivos, {maxSize}MB cada
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* Files to Upload */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">Arquivos para upload</h4>
              <Button
                onClick={uploadFiles}
                disabled={uploading || disabled}
                size="sm"
              >
                {uploading ? 'Enviando...' : 'Enviar'}
              </Button>
            </div>
            
            {uploading && (
              <div className="mb-3">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round(uploadProgress)}% concluído
                </p>
              </div>
            )}

            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && showPreview && (
        <Card>
          <CardContent className="p-4">
            <h4 className="text-sm font-medium mb-3">Arquivos enviados</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center space-x-2">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      Enviado
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      Ver
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeUploadedFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}