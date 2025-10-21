<template>
  <div class="service-items-manager">
    <div class="header">
      <h3 class="title">
        <ion-icon :icon="constructOutline" class="title-icon"></ion-icon>
        Serviços Realizados
      </h3>
      <p class="subtitle">Adicione todos os serviços realizados nesta manutenção</p>
    </div>

    <!-- Service Items List -->
    <div class="service-items-list">
      <div v-for="(item, index) in modelValue" :key="item.id" class="service-item-card">
        <div class="service-item-header">
          <div class="item-number">{{ index + 1 }}</div>
          <button
            v-if="modelValue.length > 1"
            type="button"
            class="remove-btn"
            @click="removeItem(index)"
            :disabled="disabled"
          >
            <ion-icon :icon="trashOutline"></ion-icon>
          </button>
        </div>

        <div class="service-item-content">
          <!-- Type Selection -->
          <div class="form-field">
            <label :for="`type-${item.id}`" class="field-label">
              Tipo de Serviço <span class="required">*</span>
            </label>
            <select
              :id="`type-${item.id}`"
              v-model="item.type"
              class="field-input"
              :disabled="disabled"
              required
            >
              <option value="">Selecione o tipo</option>
              <option v-for="type in maintenanceTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>

          <!-- Description -->
          <div class="form-field">
            <label :for="`description-${item.id}`" class="field-label">
              Descrição <span class="required">*</span>
            </label>
            <input
              :id="`description-${item.id}`"
              v-model="item.description"
              type="text"
              class="field-input"
              placeholder="Ex: Troca de óleo sintético 5W30"
              :disabled="disabled"
              required
            />
          </div>

          <!-- Cost Fields -->
          <div class="cost-grid">
            <div class="form-field">
              <label :for="`parts-cost-${item.id}`" class="field-label"> Custo das Peças </label>
              <input
                :id="`parts-cost-${item.id}`"
                v-model.number="item.partsCost"
                type="number"
                inputmode="decimal"
                step="0.01"
                min="0"
                class="field-input"
                placeholder="R$ 0,00"
                :disabled="disabled"
              />
            </div>

            <div class="form-field">
              <label :for="`labor-cost-${item.id}`" class="field-label">
                Custo da Mão de Obra
              </label>
              <input
                :id="`labor-cost-${item.id}`"
                v-model.number="item.laborCost"
                type="number"
                inputmode="decimal"
                step="0.01"
                min="0"
                class="field-input"
                placeholder="R$ 0,00"
                :disabled="disabled"
              />
            </div>
          </div>

          <!-- Total Cost Display -->
          <div v-if="getItemTotalCost(item) > 0" class="total-cost-display">
            <span class="label">Total deste item:</span>
            <span class="value">{{ formatCurrency(getItemTotalCost(item)) }}</span>
          </div>

          <!-- Notes -->
          <div class="form-field">
            <label :for="`notes-${item.id}`" class="field-label"> Observações (Opcional) </label>
            <textarea
              :id="`notes-${item.id}`"
              v-model="item.notes"
              class="field-textarea"
              rows="2"
              placeholder="Observações específicas deste serviço..."
              :disabled="disabled"
            ></textarea>
          </div>

          <!-- Photos -->
          <div class="photos-section">
            <h4 class="photos-title">Fotos Antes/Depois</h4>
            <div class="photos-grid">
              <!-- Before Photo -->
              <div class="photo-upload-field">
                <label class="photo-label">Foto Antes</label>
                <div v-if="item.beforePhoto" class="photo-preview">
                  <img :src="item.beforePhoto" alt="Antes" />
                  <button
                    type="button"
                    class="remove-photo-btn"
                    @click="removePhoto(index, 'before')"
                    :disabled="disabled"
                  >
                    <ion-icon :icon="closeCircleOutline"></ion-icon>
                  </button>
                </div>
                <button
                  v-else
                  type="button"
                  class="upload-photo-btn"
                  @click="uploadPhoto(index, 'before')"
                  :disabled="disabled"
                >
                  <ion-icon :icon="cameraOutline"></ion-icon>
                  <span>Adicionar Foto</span>
                </button>
              </div>

              <!-- After Photo -->
              <div class="photo-upload-field">
                <label class="photo-label">Foto Depois</label>
                <div v-if="item.afterPhoto" class="photo-preview">
                  <img :src="item.afterPhoto" alt="Depois" />
                  <button
                    type="button"
                    class="remove-photo-btn"
                    @click="removePhoto(index, 'after')"
                    :disabled="disabled"
                  >
                    <ion-icon :icon="closeCircleOutline"></ion-icon>
                  </button>
                </div>
                <button
                  v-else
                  type="button"
                  class="upload-photo-btn"
                  @click="uploadPhoto(index, 'after')"
                  :disabled="disabled"
                >
                  <ion-icon :icon="cameraOutline"></ion-icon>
                  <span>Adicionar Foto</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Item Button -->
    <button type="button" class="add-item-btn" @click="addItem" :disabled="disabled">
      <ion-icon :icon="addCircleOutline"></ion-icon>
      <span>Adicionar Outro Serviço</span>
    </button>

    <!-- Total Summary -->
    <div v-if="modelValue.length > 1" class="total-summary">
      <div class="summary-row">
        <span class="summary-label">Total de Serviços:</span>
        <span class="summary-value">{{ modelValue.length }}</span>
      </div>
      <div class="summary-row total">
        <span class="summary-label">Valor Total:</span>
        <span class="summary-value">{{ formatCurrency(getTotalCost()) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { IonIcon } from '@ionic/vue';
  import {
    constructOutline,
    trashOutline,
    addCircleOutline,
    cameraOutline,
    closeCircleOutline,
  } from 'ionicons/icons';
  import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
  import type { MaintenanceServiceItem, MaintenanceType } from '@/stores/vehicles';
  import { MAINTENANCE_TYPE_LABELS } from '@/constants/vehicles';

  interface Props {
    modelValue: MaintenanceServiceItem[];
    disabled?: boolean;
  }

  const props = defineProps<Props>();
  const emit = defineEmits<{
    'update:modelValue': [value: MaintenanceServiceItem[]];
  }>();

  // Maintenance types for dropdown
  const maintenanceTypes = Object.entries(MAINTENANCE_TYPE_LABELS).map(([value, label]) => ({
    value: value as MaintenanceType,
    label,
  }));

  const generateId = () => {
    return `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  const addItem = () => {
    const newItem: MaintenanceServiceItem = {
      id: generateId(),
      type: '' as MaintenanceType,
      description: '',
      partsCost: 0,
      laborCost: 0,
      notes: '',
    };
    emit('update:modelValue', [...props.modelValue, newItem]);
  };

  const removeItem = (index: number) => {
    const updated = props.modelValue.filter((_, i) => i !== index);
    emit('update:modelValue', updated);
  };

  const getItemTotalCost = (item: MaintenanceServiceItem) => {
    return (item.partsCost || 0) + (item.laborCost || 0);
  };

  const getTotalCost = () => {
    return props.modelValue.reduce((sum, item) => sum + getItemTotalCost(item), 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const uploadPhoto = async (index: number, type: 'before' | 'after') => {
    try {
      const image = await Camera.getPhoto({
        quality: 80,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
        promptLabelHeader: 'Selecionar Foto',
        promptLabelPhoto: 'Da Galeria',
        promptLabelPicture: 'Tirar Foto',
      });

      if (image.dataUrl) {
        const updated = [...props.modelValue];
        if (type === 'before') {
          updated[index].beforePhoto = image.dataUrl;
        } else {
          updated[index].afterPhoto = image.dataUrl;
        }
        emit('update:modelValue', updated);
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  const removePhoto = (index: number, type: 'before' | 'after') => {
    const updated = [...props.modelValue];
    if (type === 'before') {
      delete updated[index].beforePhoto;
    } else {
      delete updated[index].afterPhoto;
    }
    emit('update:modelValue', updated);
  };
</script>

<style scoped>
  .service-items-manager {
    width: 100%;
  }

  .header {
    margin-bottom: 24px;
  }

  .title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 1.25rem;
    font-weight: 700;
    color: #fff;
    margin: 0 0 8px 0;
  }

  .title-icon {
    font-size: 1.5rem;
    color: #3b82f6;
  }

  .subtitle {
    color: #9ca3af;
    font-size: 0.875rem;
    margin: 0;
  }

  .service-items-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 20px;
  }

  .service-item-card {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 20px;
    transition: all 0.3s ease;
  }

  .service-item-card:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(59, 130, 246, 0.3);
  }

  .service-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .item-number {
    background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.875rem;
  }

  .remove-btn {
    background: transparent;
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;
    padding: 8px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .remove-btn:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.1);
    border-color: #ef4444;
  }

  .remove-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .service-item-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .field-label {
    color: #e5e7eb;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .required {
    color: #ef4444;
  }

  .field-input,
  .field-textarea {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    padding: 12px 16px;
    color: #fff;
    font-size: 1rem;
    transition: all 0.2s ease;
    width: 100%;
  }

  .field-input:focus,
  .field-textarea:focus {
    outline: none;
    border-color: #3b82f6;
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .field-input:disabled,
  .field-textarea:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .field-textarea {
    resize: vertical;
    min-height: 60px;
    font-family: inherit;
  }

  .cost-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .total-cost-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%);
    border: 1px solid rgba(16, 185, 129, 0.2);
    border-radius: 12px;
  }

  .total-cost-display .label {
    color: #9ca3af;
    font-size: 0.875rem;
  }

  .total-cost-display .value {
    color: #10b981;
    font-size: 1.125rem;
    font-weight: 700;
  }

  .photos-section {
    margin-top: 8px;
  }

  .photos-title {
    color: #e5e7eb;
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0 0 12px 0;
  }

  .photos-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .photo-upload-field {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .photo-label {
    color: #9ca3af;
    font-size: 0.75rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .photo-preview {
    position: relative;
    aspect-ratio: 4/3;
    border-radius: 12px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.3);
  }

  .photo-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .remove-photo-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0, 0, 0, 0.7);
    border: none;
    color: #ef4444;
    padding: 6px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    transition: all 0.2s ease;
  }

  .remove-photo-btn:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.9);
    color: white;
  }

  .upload-photo-btn {
    aspect-ratio: 4/3;
    background: rgba(255, 255, 255, 0.03);
    border: 2px dashed rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    color: #9ca3af;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
    font-size: 0.875rem;
  }

  .upload-photo-btn:hover:not(:disabled) {
    background: rgba(59, 130, 246, 0.1);
    border-color: #3b82f6;
    color: #3b82f6;
  }

  .upload-photo-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .upload-photo-btn ion-icon {
    font-size: 2rem;
  }

  .add-item-btn {
    width: 100%;
    padding: 16px 24px;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%);
    border: 2px dashed rgba(59, 130, 246, 0.3);
    border-radius: 12px;
    color: #3b82f6;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
  }

  .add-item-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.1) 100%);
    border-color: #3b82f6;
  }

  .add-item-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .add-item-btn ion-icon {
    font-size: 1.5rem;
  }

  .total-summary {
    margin-top: 24px;
    padding: 20px;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(124, 58, 237, 0.05) 100%);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .summary-row.total {
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .summary-label {
    color: #9ca3af;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .summary-row.total .summary-label {
    color: #e5e7eb;
    font-size: 1rem;
    font-weight: 600;
  }

  .summary-value {
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
  }

  .summary-row.total .summary-value {
    color: #a78bfa;
    font-size: 1.5rem;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    .cost-grid,
    .photos-grid {
      grid-template-columns: 1fr;
    }

    .service-item-card {
      padding: 16px;
    }

    .title {
      font-size: 1.125rem;
    }
  }
</style>
