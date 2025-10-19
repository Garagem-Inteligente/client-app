# Firestore Indexes - Deploy Guide

## Índices Criados

Este arquivo define índices compostos para otimizar as queries do Firestore.

### Maintenance Collection

1. **userId + vehicleId + date (DESC)**
   - Otimiza queries que buscam manutenções de um veículo específico ordenadas por data
   - Usado em: `stores/vehicles.ts` - `fetchMaintenanceRecords()`

2. **userId + vehicleId + nextDueDate (ASC)**
   - Otimiza queries que buscam próximas manutenções de um veículo
   - Usado em: Avisos de manutenção preventiva

3. **userId + date (DESC)**
   - Otimiza queries que buscam todas as manutenções de um usuário ordenadas por data
   - Usado em: Lista geral de manutenções

### Vehicles Collection

4. **userId + createdAt (DESC)**
   - Otimiza queries que buscam veículos de um usuário ordenados por data de criação
   - Usado em: `stores/vehicles.ts` - `fetchVehicles()`

5. **userId + make + model (ASC)**
   - Otimiza queries que filtram veículos por fabricante e modelo
   - Usado em: Filtros avançados de veículos

## Como Fazer o Deploy

### Via Firebase CLI

```bash
# 1. Instalar Firebase CLI (se ainda não tiver)
npm install -g firebase-tools

# 2. Login no Firebase
firebase login

# 3. Selecionar o projeto
firebase use <project-id>

# 4. Deploy apenas dos índices
firebase deploy --only firestore:indexes
```

### Via Firebase Console (Manual)

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Selecione seu projeto
3. Vá em **Firestore Database** → **Indexes**
4. Clique em **Add Index** e crie manualmente cada índice
5. Configure os campos conforme especificado no arquivo

## Verificação

Após o deploy, você pode verificar os índices criados:

```bash
firebase firestore:indexes
```

Ou acesse o Firebase Console e veja a lista de índices ativos.

## Monitoramento

- Os índices podem levar alguns minutos para serem criados
- Verifique o status em **Firestore Database** → **Indexes**
- Status possíveis: `Building` → `Enabled`

## Performance

Estes índices melhoram significativamente a performance das queries:
- Reduzem tempo de resposta de queries complexas
- Evitam warnings de índices faltantes no console
- Permitem escalabilidade para milhares de documentos

## Custos

- Índices consomem espaço de armazenamento
- Cada documento indexado conta para o limite de índices
- Para mais detalhes: [Firestore Pricing](https://firebase.google.com/pricing)
