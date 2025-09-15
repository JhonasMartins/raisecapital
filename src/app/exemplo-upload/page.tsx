'use client'

import { useState } from 'react'
import { FileUpload, type UploadedFile } from '@/components/ui/file-upload'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

export default function ExemploUploadPage() {
  const [uploadedDocuments, setUploadedDocuments] = useState<UploadedFile[]>([])
  const [uploadedImages, setUploadedImages] = useState<UploadedFile[]>([])

  const handleDocumentUpload = (files: UploadedFile[]) => {
    setUploadedDocuments(prev => [...prev, ...files])
    toast.success(`${files.length} documento(s) enviado(s) com sucesso!`)
  }

  const handleImageUpload = (files: UploadedFile[]) => {
    setUploadedImages(prev => [...prev, ...files])
    toast.success(`${files.length} imagem(s) enviada(s) com sucesso!`)
  }

  const handleUploadError = (error: string) => {
    toast.error(error)
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Exemplo de Upload de Arquivos</h1>
        <p className="text-muted-foreground">
          Demonstração do componente de upload integrado com Supabase Storage
        </p>
      </div>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="images">Imagens</TabsTrigger>
          <TabsTrigger value="mixed">Upload Misto</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload de Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                bucket="documents"
                path="exemplo"
                accept=".pdf,.doc,.docx,.txt"
                maxSize={50}
                maxFiles={10}
                onUploadComplete={handleDocumentUpload}
                onUploadError={handleUploadError}
              />
            </CardContent>
          </Card>

          {uploadedDocuments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Documentos Enviados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {uploadedDocuments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">Documento</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(file.url, '_blank')}
                        >
                          Visualizar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="images" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload de Imagens</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                bucket="avatars"
                path="exemplo"
                accept="image/*"
                maxSize={10}
                maxFiles={5}
                onUploadComplete={handleImageUpload}
                onUploadError={handleUploadError}
              />
            </CardContent>
          </Card>

          {uploadedImages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Imagens Enviadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uploadedImages.map((file, index) => (
                    <div key={index} className="space-y-2">
                      <div className="aspect-video relative overflow-hidden rounded border">
                        <img
                          src={file.url}
                          alt={file.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-sm truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="mixed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Misto (Qualquer Arquivo)</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                bucket="documents"
                path="exemplo/misto"
                maxSize={25}
                maxFiles={8}
                onUploadComplete={(files) => {
                  toast.success(`${files.length} arquivo(s) enviado(s)!`)
                }}
                onUploadError={handleUploadError}
                showPreview={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Informações Técnicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Buckets Configurados:</h4>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">documents</Badge>
              <Badge variant="outline">avatars</Badge>
              <Badge variant="outline">offers</Badge>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Funcionalidades:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Drag & drop de arquivos</li>
              <li>• Validação de tipo e tamanho</li>
              <li>• Progress bar durante upload</li>
              <li>• Preview de arquivos enviados</li>
              <li>• Remoção de arquivos</li>
              <li>• URLs públicas automáticas</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}