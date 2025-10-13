# 🧪 Teste Rápido - Sistema Base64

## ⚡ Teste em 2 Minutos

### 1️⃣ Iniciar Servidor
```bash
npm run dev
```

### 2️⃣ Fazer Login
```
URL: http://localhost:5173
Email: test@autocare.com
Senha: Test@123

(Se não existir, registre uma conta nova)
```

### 3️⃣ Adicionar Veículo (se necessário)
```
Veículos → Adicionar
- Marca: Toyota
- Modelo: Corolla  
- Ano: 2020
- Placa: ABC1234
- Quilometragem: 50000
- Combustível: Gasolina
```

### 4️⃣ Testar Upload de Anexo
```
Manutenções → Registrar Manutenção
1. Selecionar veículo
2. Tipo: Troca de Óleo
3. Descrição: Teste de upload
4. Custo: 150
5. Quilometragem: 50000
6. ARRASTAR UMA IMAGEM ou PDF (< 1MB)
7. Verificar preview
8. Salvar
```

### 5️⃣ Verificar Resultado
```
✅ Anexo deve aparecer na lista
✅ Clicar no anexo → Download funciona
✅ Arquivo baixado = original
```

---

## 🎯 Checklist de Validação

### Upload
- [ ] Aceita JPEG, PNG, PDF
- [ ] Rejeita arquivos > 1MB
- [ ] Preview aparece para imagens
- [ ] Ícone PDF aparece para PDFs
- [ ] Barra de progresso funciona
- [ ] Erro claro se arquivo muito grande

### Armazenamento
- [ ] Dados salvos no Firestore
- [ ] Base64 presente no documento
- [ ] Tamanho do documento < 1MB

### Download
- [ ] Click no anexo inicia download
- [ ] Nome do arquivo correto
- [ ] Conteúdo idêntico ao original
- [ ] Funciona para imagens e PDFs

### Performance
- [ ] Upload < 2 segundos (arquivo 500KB)
- [ ] Download instantâneo
- [ ] UI responsiva durante upload

---

## 🔍 Debug Console

### Ver documento no Firestore
```javascript
// No console do browser (F12)
const maintenanceId = 'COLE_ID_AQUI'
const doc = await firebase.firestore()
  .collection('maintenance')
  .doc(maintenanceId)
  .get()

console.log('Attachments:', doc.data().attachments)
console.log('Base64 length:', doc.data().attachments[0]?.data.length)
```

### Verificar tamanho do Base64
```javascript
const base64 = 'data:image/jpeg;base64,...'
const size = (base64.length * 3) / 4
console.log('Tamanho aprox:', Math.round(size / 1024), 'KB')
```

---

## ❌ Problemas Comuns

### "Arquivo muito grande"
**Causa**: Arquivo > 1MB  
**Solução**: Comprimir antes ou usar imagem menor

### Preview não aparece
**Causa**: Base64 não foi gerado  
**Solução**: Verificar console, reenviar arquivo

### Download não funciona
**Causa**: Base64 incompleto no Firestore  
**Solução**: Reenviar arquivo, verificar tamanho

### Upload muito lento
**Causa**: Arquivo grande sendo comprimido  
**Solução**: Normal para arquivos 700KB-1MB, aguardar

---

## ✅ Resultado Esperado

### No Firestore (Console Firebase)
```json
{
  "vehicleId": "abc123",
  "type": "oil_change",
  "attachments": [
    {
      "name": "nota.pdf",
      "data": "data:application/pdf;base64,JVBERi0xLjQK...",
      "type": "application/pdf",
      "size": 45678,
      "uploadedAt": "2025-10-13T10:00:00Z"
    }
  ]
}
```

### Na UI
```
✅ Card da manutenção
✅ Badge "1 anexo" ou "N anexos"
✅ Ícone clicável (📄 ou 🖼️)
✅ Nome do arquivo truncado se longo
✅ Data do upload
✅ Botão X para excluir (futuro)
```

---

## 🚀 Teste Avançado

### Upload Múltiplo
```
1. Arrastar 3 arquivos de uma vez
2. Todos devem aparecer
3. Preview para cada imagem
4. Salvar tudo junto
✅ 3 anexos na lista
```

### Compressão Automática
```
1. Pegar foto de celular (2-3MB)
2. Arrastar para upload
3. Sistema deve comprimir
4. Ver tamanho final < 1MB
✅ Upload bem-sucedido
```

### Limite de Tamanho
```
1. Tentar upload de PDF > 1MB
2. Deve mostrar erro vermelho
✅ "O arquivo deve ter no máximo 1MB"
```

---

## 📊 Métricas de Sucesso

- ✅ Upload: < 2s para 500KB
- ✅ Download: < 1s (instantâneo)
- ✅ Compressão: 60-80% para fotos
- ✅ Taxa de erro: 0% para arquivos válidos
- ✅ UX: Feedback claro em cada etapa

---

**Se todos os testes passarem: Sistema está funcionando perfeitamente! 🎉**
