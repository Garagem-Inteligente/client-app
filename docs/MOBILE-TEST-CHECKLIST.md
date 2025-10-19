# Teste Mobile - Checklist de Problemas Potenciais

## ✅ Logs Desktop (Funcionando)

```
✅ Foto before: 100KB
✅ Foto after: 1.9MB
✅ Documento criado: KfJTURJeeyX0bPh0D818
✅ Upload before photo → Storage
✅ Upload after photo → Storage
✅ Upload attachment (PDF) → Storage
✅ Documento atualizado com URLs
✅ Lista recarregada: 1 registro
```

---

## ⚠️ Problemas Potenciais no Mobile

### 1. **Tamanho de Imagem (1.9MB)**
**Sintoma**: Upload lento ou travamento em conexões ruins (3G)
**Causa**: Foto after muito grande
**Solução Futura**: Compressão automática de imagens antes do upload

**Mitigação Atual**: 
- Firebase tem timeout de 5 minutos
- Storage aceita até 10MB
- Deve funcionar, mas pode demorar

---

### 2. **Permissões de Storage**
**Sintoma**: Erro "Missing or insufficient permissions" no upload
**Causa**: Storage Rules podem estar bloqueando

**Teste Rápido**: Verifique storage.rules no Firebase Console
```plaintext
// Deve ter:
match /maintenance/{userId}/{maintenanceId}/{allPaths=**} {
  allow read, write: if request.auth.uid == userId;
}
```

---

### 3. **Conexão Lenta**
**Sintoma**: Timeout ou "Network Error"
**Causa**: Upload de 1.9MB pode levar 30s+ em 3G
**Solução**: Usuário precisa de WiFi ou boa conexão

**Verificação**:
- Desktop: ✅ Funcionou (boa conexão)
- Mobile WiFi: Deve funcionar
- Mobile 3G/4G: Pode ser lento

---

### 4. **Memória do Dispositivo**
**Sintoma**: App trava ou fecha durante upload
**Causa**: 1.9MB em base64 = ~2.5MB em RAM
**Solução**: Performance mode já ativa em dispositivos fracos

**Logs a observar no mobile**:
```
🚀 Performance mode enabled (low-end device detected)
```

---

### 5. **Formato de Arquivo**
**Sintoma**: Erro "Invalid image format" ou upload falha
**Causa**: Câmera do celular pode gerar formatos não suportados

**Formatos Esperados**:
- ✅ JPEG (.jpg, .jpeg)
- ✅ PNG (.png)
- ⚠️ HEIC (.heic) - iPhone, precisa conversão
- ❌ WebP (.webp) - Alguns Androids

**Verificação**: Logs devem mostrar:
```
📤 Uploading image to Storage: maintenance/.../after_xxx.jpg
```

---

### 6. **Firestore Rules**
**Sintoma**: "Invalid data" após upload bem-sucedido
**Causa**: Update do documento com URLs pode falhar

**Verificação**: Logs devem mostrar:
```
✅ Maintenance record updated with Storage URLs
```

Se falhar aqui, as fotos foram upadas mas o documento não foi atualizado.

---

## 🧪 Testes no Mobile

### Cenário 1: WiFi (Ideal)
**Expectativa**: Funcionar igual ao desktop
**Logs esperados**: Idênticos aos do desktop

### Cenário 2: 4G (Bom)
**Expectativa**: Funcionar, mas mais lento
**Logs esperados**: 
- ✅ Mesmos logs
- ⏱️ Delays maiores entre uploads

### Cenário 3: 3G (Ruim)
**Expectativa**: Muito lento, pode falhar
**Logs esperados**:
- ⏱️ Upload demora 30s+
- ❌ Possível timeout

### Cenário 4: Offline
**Expectativa**: Erro imediato
**Logs esperados**:
```
❌ Error: Network request failed
```

---

## 🚨 Erros Esperados e Soluções

### 1. "Missing or insufficient permissions"
**Causa**: Storage Rules ou Firestore Rules
**Solução**: Regras já foram corrigidas, deve funcionar

### 2. "Network Error" / "Request Timeout"
**Causa**: Conexão lenta
**Solução**: Aguardar ou usar WiFi

### 3. "Invalid data"
**Causa**: Campo obrigatório faltando
**Solução**: Já validamos, não deve ocorrer

### 4. "Quota Exceeded"
**Causa**: Limite diário do Firebase atingido
**Solução**: Upgrade do plano (improvável em teste)

---

## 📱 Logs Críticos para Observar no Mobile

### Sucesso:
```
✅ Maintenance document created: [ID]
✅ Before photo uploaded
✅ After photo uploaded
✅ Attachments processed
✅ Maintenance record updated with Storage URLs
✅ Maintenance registered successfully!
```

### Falha no Upload:
```
❌ Error uploading before photo: [erro]
ou
❌ Error uploading after photo: [erro]
ou
❌ Error uploading attachments: [erro]
```

### Falha no Update:
```
✅ Before photo uploaded
✅ After photo uploaded
❌ Error updating maintenance record: [erro]
```

---

## 🔧 Correções Já Aplicadas

1. ✅ Firestore Rules simplificadas (`allow read`)
2. ✅ Validação de campos obrigatórios no código
3. ✅ Documento explícito (não spread)
4. ✅ Sanitização melhorada de nomes de arquivo
5. ✅ Logging completo para debug

---

## 📊 Próximos Passos Após Teste Mobile

### Se Funcionar ✅
- Marcar como concluído
- Documentar fluxo completo
- Considerar otimizações futuras (compressão)

### Se Falhar ❌
- Copiar logs completos do console mobile
- Identificar linha específica do erro
- Aplicar correção direcionada

---

**Aguardando resultado do teste mobile...** 📱
