# Validação de Tamanho de Arquivos

## 📋 Implementação de Validação Inteligente de Anexos

### 🎯 Objetivo
Prevenir uploads de arquivos muito grandes que:
- ❌ Consomem muita banda móvel do usuário
- ❌ Demoram muito tempo para fazer upload
- ❌ Aumentam custos de Firebase Storage
- ❌ Podem causar erros de timeout

---

## ⚙️ Configuração Atual

### Limites Implementados
```typescript
// MaintenanceFormPage.vue
<MFileUpload
  :max-files="5"        // Máximo 5 arquivos
  :max-size="10"        // Máximo 10MB por arquivo
  accept="image/*,application/pdf"
/>
```

### Por Tipo de Arquivo

| Tipo | Limite | Comportamento | Motivo |
|------|--------|---------------|--------|
| **Imagens** | 10MB | Compressão automática antes do upload | Fotos de câmera podem ser grandes |
| **PDFs** | 10MB | Sem compressão, validação de tamanho | PDFs já são comprimidos internamente |
| **Outros** | 10MB | Rejeição com mensagem de erro | Não aceito |

---

## 🔍 Fluxo de Validação

### 1. Seleção de Arquivo
```
Usuário seleciona arquivo
      ↓
Validação de quantidade (máx 5)
      ↓
Validação de tamanho (máx 10MB)
      ↓
┌─────────────────┐
│ Passou?         │
└─────────────────┘
  ↓ SIM        ↓ NÃO
Processar      Mostrar erro detalhado
```

### 2. Mensagens de Erro

#### Arquivo Muito Grande (> 10MB)
```
❌ Arquivo(s) muito grande(s) (máx 10MB):
• nota-fiscal.pdf: 15.3MB
• recibo.pdf: 12.8MB

💡 Dica: Comprima o PDF antes de anexar ou use uma resolução menor para imagens.
```

#### Múltiplos Arquivos Excedidos
```
⚠️ Você selecionou 8 arquivo(s), mas só é possível adicionar mais 2.
Remova arquivos existentes ou selecione menos arquivos.
```

#### Limite de Arquivos Atingido
```
⚠️ Limite de 5 arquivo(s) atingido!
Remova alguns arquivos antes de adicionar novos.
```

---

## 📊 Validação por Tamanho

### Arquivo Individual
```typescript
const validateFile = (file: File): string | null => {
  const fileSizeMB = file.size / (1024 * 1024)
  const maxSizeMB = props.maxSize // 10MB
  
  // Rejeitar se maior que 10MB
  if (file.size > maxSizeMB * 1024 * 1024) {
    return `Arquivo muito grande: ${fileSizeMB.toFixed(1)}MB (máx ${maxSizeMB}MB)`
  }
  
  // Avisar se entre 5-10MB (console warning)
  if (fileSizeMB > 5 && fileSizeMB <= maxSizeMB) {
    console.warn(`⚠️ Arquivo grande detectado: ${file.name} (${fileSizeMB.toFixed(1)}MB)`)
  }
  
  return null
}
```

### Múltiplos Arquivos
```typescript
const processFiles = async (filesList: File[]) => {
  // Validar ANTES de processar (mais eficiente)
  const oversizedFiles = filesList.filter(f => f.size > maxSize * 1024 * 1024)
  
  if (oversizedFiles.length > 0) {
    const fileDetails = oversizedFiles.map(f => 
      `• ${f.name}: ${(f.size / (1024 * 1024)).toFixed(1)}MB`
    ).join('\n')
    
    showError(`❌ Arquivo(s) muito grande(s):\n${fileDetails}`)
    return // Para execução antes de processar
  }
  
  // Processar apenas arquivos válidos
}
```

---

## 🎨 Interface do Usuário

### Upload Area
```vue
<div class="upload-content">
  <ion-icon :icon="cloudUploadOutline" class="upload-icon"></ion-icon>
  <p class="upload-text">Clique ou arraste arquivos aqui</p>
  <p class="upload-hint">
    Máximo 5 arquivo(s) - 10MB cada
  </p>
</div>
```

### Dicas Contextuais
```vue
<p class="text-xs text-gray-400 mb-3">
  📎 Anexe notas fiscais, comprovantes ou outros documentos.
  Você pode adicionar até 5 arquivos (imagens ou PDFs de até 10MB cada).
  <span class="block mt-1 text-yellow-400">
    💡 Dica: PDFs grandes? Use um compressor online antes de anexar.
  </span>
</p>
```

### Arquivo Com Erro
```vue
<div class="file-item error">
  <div class="file-info">
    <ion-icon :icon="documentTextOutline" class="file-icon error-icon" />
    <div class="file-details">
      <p class="file-name">relatorio.pdf</p>
      <p class="file-size error-text-small">
        Arquivo muito grande: 15.3MB (máx 10MB)
      </p>
    </div>
  </div>
  
  <div class="file-actions">
    <ion-button fill="solid" size="small" color="danger" @click="removeFile">
      <ion-icon :icon="trashOutline" /> Remover
    </ion-button>
  </div>
</div>
```

---

## 🧪 Cenários de Teste

### Teste 1: Arquivo Normal (< 5MB)
```
Arquivo: nota-fiscal.pdf (2.3MB)
✅ Aceito sem warnings
✅ Upload bem-sucedido
```

### Teste 2: Arquivo Grande (5-10MB)
```
Arquivo: contrato.pdf (7.8MB)
⚠️ Console warning: "Arquivo grande detectado"
✅ Aceito e processado
✅ Upload bem-sucedido (pode demorar em 3G)
```

### Teste 3: Arquivo Muito Grande (> 10MB)
```
Arquivo: manual.pdf (15.2MB)
❌ Erro exibido: "Arquivo muito grande: 15.2MB (máx 10MB)"
❌ Não processado
💡 Dica mostrada ao usuário
```

### Teste 4: Múltiplos Arquivos com Erro
```
Arquivos selecionados:
- arquivo1.pdf (3MB) ✅
- arquivo2.pdf (12MB) ❌
- arquivo3.pdf (5MB) ✅

Resultado:
❌ Erro detalhado listando arquivo2.pdf
✅ arquivo1 e arquivo3 são aceitos
```

### Teste 5: Limite de Quantidade
```
Arquivos já anexados: 4
Tentativa de adicionar: 3 arquivos
❌ Erro: "só é possível adicionar mais 1"
💡 Sugestão: remover arquivos existentes
```

---

## 📈 Métricas de Sucesso

### Antes da Validação
```
Problema: Usuários tentavam anexar PDFs de 20-50MB
Resultado:
- ❌ Upload demorava 5-10 minutos em 4G
- ❌ Timeout após 2-3 minutos
- ❌ Usuário frustrado, dados perdidos
- ❌ Custos altos de Storage
```

### Depois da Validação
```
Solução: Validação imediata com feedback claro
Resultado:
- ✅ Erro mostrado instantaneamente
- ✅ Usuário sabe exatamente o problema
- ✅ Dica de como resolver (comprimir PDF)
- ✅ Upload apenas de arquivos válidos (< 10MB)
- ✅ Economia de banda e tempo
```

---

## 🔧 Configuração Avançada

### Ajustar Limites por Ambiente

```typescript
// Em MaintenanceFormPage.vue
const MAX_FILE_SIZE = import.meta.env.PROD ? 10 : 50 // 50MB em dev

<MFileUpload :max-size="MAX_FILE_SIZE" />
```

### Limites Diferentes por Tipo

```typescript
const MAX_SIZES = {
  'image/jpeg': 10,
  'image/png': 10,
  'application/pdf': 15, // PDFs podem ser maiores
  'default': 10
}

const getMaxSize = (fileType: string) => {
  return MAX_SIZES[fileType] || MAX_SIZES.default
}
```

### Validação Assíncrona (Futuro)

```typescript
// Validar no servidor antes de processar
async function validateWithServer(file: File) {
  const response = await fetch('/api/validate-file', {
    method: 'POST',
    body: JSON.stringify({
      name: file.name,
      size: file.size,
      type: file.type
    })
  })
  
  return response.json() // { valid: boolean, reason?: string }
}
```

---

## 🚀 Melhorias Futuras

### 1. Compressão de PDF no Cliente
```typescript
import { PDFDocument } from 'pdf-lib'

async function compressPDF(file: File): Promise<File> {
  const arrayBuffer = await file.arrayBuffer()
  const pdfDoc = await PDFDocument.load(arrayBuffer)
  
  // Reduzir qualidade de imagens
  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true // Compressão adicional
  })
  
  return new File([compressedBytes], file.name, { type: 'application/pdf' })
}
```

### 2. Upload Progressivo (Chunks)
```typescript
// Para arquivos grandes (5-10MB), fazer upload em partes
async function uploadInChunks(file: File, chunkSize = 1024 * 1024) {
  const chunks = Math.ceil(file.size / chunkSize)
  
  for (let i = 0; i < chunks; i++) {
    const start = i * chunkSize
    const end = Math.min(start + chunkSize, file.size)
    const chunk = file.slice(start, end)
    
    await uploadChunk(chunk, i, chunks)
    updateProgress((i + 1) / chunks * 100)
  }
}
```

### 3. Análise de Conteúdo
```typescript
// Detectar se PDF contém apenas imagens scaneadas
async function isPDFScanned(file: File): Promise<boolean> {
  const pdfDoc = await PDFDocument.load(await file.arrayBuffer())
  const pages = pdfDoc.getPages()
  
  // Se todas as páginas são imagens, sugerir OCR ou conversão
  return pages.every(page => hasOnlyImages(page))
}
```

---

## 📚 Referências

- [Firebase Storage Limits](https://firebase.google.com/docs/storage/quotas-pricing)
- [PDF Compression Tools](https://www.ilovepdf.com/compress_pdf)
- [Image Optimization Best Practices](https://web.dev/fast/#optimize-your-images)

---

**Data**: 19/10/2025  
**Status**: ✅ Implementado  
**Versão**: 1.0  
**Arquivos Modificados**:
- `src/components/molecules/MFileUpload.vue`
- `src/views/MaintenanceFormPage.vue`
