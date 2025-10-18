# 📋 Plano de Atualização - Página de Manutenção

## 🎯 Objetivo
Copiar **100% das funcionalidades e visuais** da página de manutenção web para o app Ionic.

---

## ✅ Já Implementado (724 linhas)

### Estrutura Básica:
- ✅ Header com botão adicionar
- ✅ Stats cards (Total, Custo, Próximas, Atrasadas)
- ✅ Chips de filtro (Todas, Recentes, Próximas, Atrasadas)
- ✅ Lista de manutenções
- ✅ Cards de detalhes

### Formulário Básico:
- ✅ Seleção de veículo
- ✅ Tipo de manutenção (select simples)
- ✅ Descrição
- ✅ Custo total
- ✅ Quilometragem
- ✅ Data
- ✅ Próxima data
- ✅ Próxima quilometragem

### Listagem:
- ✅ Cards com informações
- ✅ Status e badges
- ✅ Formatação de data e moeda
- ✅ Nome do veículo
- ✅ Botões de ação

---

## ⚠️ Faltando Implementar (da versão web)

### 1. **Formulário Completo** ❌
```typescript
// Campos que faltam:
- partsCost: number (💰 Custo das Peças)
- laborCost: number (🔧 Custo da Mão de Obra)
- totalCost: computed (💵 Custo Total Calculado)
- serviceProvider: string (Oficina/Prestador)
- notes: string (Observações/Notas)
- beforePhoto: string (Foto Antes)
- afterPhoto: string (Foto Depois)
- attachments: FileUploadItem[] (Anexos/Documentos)
```

### 2. **Upload de Fotos Antes/Depois** ❌
- Input de foto "Antes da Manutenção"
- Input de foto "Depois da Manutenção"
- Preview das fotos
- Validação (max 2MB, apenas imagens)
- Remoção de fotos
- Integração com Capacitor Camera

### 3. **Upload de Anexos (FileUpload)** ❌
- Componente FileUpload
- Upload múltiplo de arquivos
- Preview de arquivos
- Progress bar
- Validação (max 5MB por arquivo)
- Base64 encoding
- Lista de anexos
- Download de anexos
- Remoção de anexos

### 4. **Cálculo Automático de Custos** ❌
```typescript
// Lógica:
const totalCost = computed(() => {
  const parts = formData.partsCost || 0
  const labor = formData.laborCost || 0
  return parts + labor
})

// Display:
💵 Custo Total: R$ 1.234,56
```

### 5. **Image Compare** ❌
- Componente para comparar fotos antes/depois
- Slider interativo
- Zoom
- Fullscreen

### 6. **Modal de Confirmação** ❌
- Ionic Alert Controller para exclusão
- Confirmação antes de deletar
- Loading state durante exclusão

### 7. **Query Parameters** ❌
```typescript
// Auto-abrir formulário:
?action=new&vehicleId=123

// Filtros por URL:
?view=upcoming
?view=overdue
?view=costs
```

### 8. **Select com Grupos (optgroup)** ❌
```html
<ion-select>
  <ion-select-option header>🔧 Motor e Óleo</ion-select-option>
  <ion-select-option>🛢️ Troca de Óleo</ion-select-option>
  <ion-select-option header>🚗 Pneus</ion-select-option>
  <ion-select-option>🔄 Rodízio de Pneus</ion-select-option>
</ion-select>
```

### 9. **Máscaras de Input** ❌
- Currency mask para custos
- Mileage mask para quilometragem
- Date picker nativo

### 10. **Download de Anexos** ❌
- Botão para baixar cada anexo
- Função `downloadBase64File()`
- Conversão Base64 → Blob → Download

---

## 🎨 Visuais a Copiar

### 1. **Card de Custo Total** (quando preenchido)
```vue
<div class="cost-total-card">
  <span>💵 Custo Total:</span>
  <span class="cost-value">R$ 1.234,56</span>
</div>
```

**Estilo:**
- Background: `bg-blue-500/10`
- Border: `border-blue-500/30`
- Valor em destaque: `text-2xl font-bold text-blue-400`

### 2. **Section de Fotos Antes/Depois**
```vue
<div class="photos-grid">
  <div class="photo-upload">
    <label>📸 Foto Antes</label>
    <input type="file" accept="image/*">
    <img v-if="beforePhoto" :src="beforePhoto">
    <button @click="removePhoto('before')">Remover</button>
  </div>
  <div class="photo-upload">
    <label>📸 Foto Depois</label>
    <!-- Same structure -->
  </div>
</div>
```

**Estilo:**
- Grid 2 colunas
- Preview com border e shadow
- Botão de remoção hover vermelho

### 3. **Section de Anexos**
```vue
<div class="attachments-section">
  <label>📎 Anexos (Notas Fiscais, Recibos)</label>
  <FileUpload 
    @files-selected="handleFilesSelected"
    :max-files="5"
    :max-size="5"
  />
  <div class="attachments-list">
    <div v-for="file in uploadedFiles" :key="file.name">
      <!-- File preview -->
    </div>
  </div>
</div>
```

**Estilo:**
- Border dashed
- Hover: border-blue-500
- Preview cards com ícone de arquivo
- Progress bar animada

### 4. **Detalhes da Manutenção (cards expandidos)**
```vue
<ACard>
  <template #header>
    <div class="maintenance-header">
      <h3>🛢️ Troca de Óleo</h3>
      <ABadge variant="success">Concluída</ABadge>
    </div>
  </template>

  <div class="maintenance-details-grid">
    <div class="detail-item">
      <span class="label">📅 Data:</span>
      <span class="value">15/10/2024</span>
    </div>
    <!-- More details -->
  </div>

  <div v-if="record.attachments" class="attachments">
    <!-- Attachment list -->
  </div>

  <div v-if="record.beforePhoto || record.afterPhoto">
    <ImageCompare 
      :before="record.beforePhoto"
      :after="record.afterPhoto"
    />
  </div>

  <template #footer>
    <div class="actions">
      <AButton size="small" @click="handleEdit">Editar</AButton>
      <AButton size="small" variant="danger" @click="handleDelete">Excluir</AButton>
    </div>
  </template>
</ACard>
```

---

## 📝 Checklist de Implementação

### Componentes Necessários:
- [ ] Criar `MFileUpload.vue` (versão Ionic do FileUpload)
- [ ] Criar `MImageCompare.vue` (versão Ionic do ImageCompare)
- [ ] Adaptar `AInput` para suportar máscaras
- [ ] Usar `ion-datetime` para datas
- [ ] Usar `ion-select` com optgroups

### Funcionalidades Core:
- [ ] Campo `partsCost` com mask currency
- [ ] Campo `laborCost` com mask currency
- [ ] Computed `totalCost`
- [ ] Display do custo total (card azul)
- [ ] Campo `serviceProvider` (input text)
- [ ] Campo `notes` (textarea)
- [ ] Upload `beforePhoto` (Camera API)
- [ ] Upload `afterPhoto` (Camera API)
- [ ] Preview de fotos
- [ ] Remoção de fotos
- [ ] Upload de anexos (MFileUpload)
- [ ] Lista de anexos
- [ ] Download de anexos
- [ ] Exclusão de anexos
- [ ] Modal de confirmação (Alert Controller)
- [ ] Query params (auto-open form, filters)

### Visuais:
- [ ] Card de custo total (blue gradient)
- [ ] Grid de fotos antes/depois (2 cols)
- [ ] Preview de fotos com border
- [ ] Section de anexos com border dashed
- [ ] Lista de anexos com cards
- [ ] Progress bars animadas
- [ ] Image compare interativo
- [ ] Select com grupos (categorias)
- [ ] Empty states melhorados

### UX:
- [ ] Loading states em todos uploads
- [ ] Validações de arquivo
- [ ] Mensagens de erro
- [ ] Confirmação de exclusão
- [ ] Auto-scroll para formulário
- [ ] Reset form após submit
- [ ] Toasts de sucesso/erro

---

## 🎯 Prioridades

### **P0 - Crítico** (Implementar Agora):
1. ✅ Custos separados (peças + mão de obra)
2. ✅ Cálculo automático de total
3. ✅ Upload de fotos antes/depois
4. ✅ Campo de notas e prestador
5. ✅ Modal de confirmação de exclusão

### **P1 - Importante** (Próximo):
6. ✅ Upload de anexos
7. ✅ Download de anexos
8. ✅ Query parameters
9. ✅ Select com grupos

### **P2 - Nice to Have** (Depois):
10. ⚠️ Image Compare
11. ⚠️ Máscaras de input avançadas
12. ⚠️ Animações extras

---

## 📊 Comparação de Linhas

| Versão | Linhas | Status |
|--------|--------|--------|
| Web    | 948    | ✅ Completa |
| Ionic Atual | 724 | ⚠️ ~76% |
| Ionic Objetivo | ~950 | 🎯 100% |

**Faltam ~226 linhas** com as funcionalidades críticas.

---

## 🚀 Resultado Esperado

Após implementação completa:

### Formulário Completo:
```
📝 Registrar Manutenção

Veículo *: [Select]
Tipo de Manutenção *: [Select com Grupos]
Descrição *: [Input]

💰 Custo das Peças (R$): [Input com Mask]
🔧 Custo da Mão de Obra (R$): [Input com Mask]

[Card Azul] 💵 Custo Total: R$ 1.234,56

Quilometragem *: [Input com Mask]
Data *: [Date Picker]
Próxima Data: [Date Picker]
Próxima Quilometragem: [Input]

Oficina/Prestador: [Input]
Observações: [Textarea]

📸 Fotos da Peça
[Antes] [Depois]

📎 Anexos
[Upload Area]
- nota-fiscal.pdf [Download] [Delete]
- recibo.jpg [Download] [Delete]

[Cancelar] [Salvar]
```

### Detalhes da Manutenção:
```
🛢️ Troca de Óleo [Badge: Concluída]

📅 Data: 15/10/2024
⏱️ Quilometragem: 45.000 km
💰 Custo Peças: R$ 800,00
🔧 Custo Mão de Obra: R$ 400,00
💵 Total: R$ 1.200,00
🏪 Oficina: Auto Center XYZ
📝 Notas: Usado óleo sintético premium

📸 Fotos
[Image Compare: Antes ⟷ Depois]

📎 Anexos (2)
- nota-fiscal.pdf [📥]
- foto-filtro.jpg [📥]

[Editar] [Excluir]
```

---

## ✅ Sucesso

Quando completo:
- 🎨 Visual 100% igual à versão web
- ⚙️ Todas funcionalidades presentes
- 📱 Adaptado para mobile
- 🚀 Performance otimizada
- ✨ UX excelente

