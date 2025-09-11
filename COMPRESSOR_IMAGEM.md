# Sistema de Compressão de Imagens

O endpoint `/api/upload` agora comprime automaticamente todas as imagens enviadas para reduzir tamanho mantendo a qualidade.

## Compressão por Formato

- **PNG**: Compressão lossless (sem perda de dados) com nível máximo
- **JPEG**: Compressão inteligente com qualidade 85 e encoding progressivo
- **WebP**: Compressão com qualidade 85 mantendo boa aparência visual  
- **AVIF**: Compressão com qualidade 45 (formato mais eficiente)

## Comportamento Inteligente

- Se a compressão resultar em arquivo maior, mantém o original
- A imagem passa por rotação automática baseada em EXIF
- PDFs e outros arquivos não são afetados

## Configuração via Variáveis de Ambiente

```env
# Ativar logs detalhados de compressão
UPLOAD_DEBUG=true

# Modo estritamente sem perdas (desativa compressão JPEG/WebP/AVIF)
UPLOAD_IMAGE_STRICT_LOSSLESS=true

# Qualidades customizadas (1-100)
UPLOAD_IMAGE_JPEG_QUALITY=85
UPLOAD_IMAGE_WEBP_QUALITY=85  
UPLOAD_IMAGE_AVIF_QUALITY=45
```

## Como Funciona

1. Usuário envia imagem via formulário
2. Sistema detecta se é imagem pelo MIME type
3. Aplica compressão apropriada usando Sharp
4. Compara tamanhos e usa o menor
5. Armazena no destino (DB, Blob ou filesystem)

## Exemplo de Uso no Frontend

```javascript
const formData = new FormData()
formData.append('file', imageFile)

const response = await fetch('/api/upload', {
  method: 'POST',
  body: formData
})

const { url, filename } = await response.json()
// Imagem já está comprimida e otimizada
```

## Benefícios

- ✅ Redução automática de tamanho
- ✅ Manutenção da qualidade visual
- ✅ Transparente para o usuário
- ✅ Configurável por ambiente
- ✅ Fallback seguro se compressão falhar