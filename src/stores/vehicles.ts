import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useAuthStore } from './auth';
import { translateFirebaseError } from '@/utils/errorMessages';
import { logger } from '@/utils/logger';
import {
  uploadVehicleImage,
  isBase64DataURL,
  deleteImage,
  uploadMaintenancePhoto,
  uploadMaintenanceAttachment,
} from '@/utils/storage';

// Tipos de veículos disponíveis no Brasil
export type VehicleType = 'car' | 'motorcycle' | 'van' | 'truck' | 'bus' | 'pickup';

// Tipos de combustível disponíveis no Brasil
export type FuelType =
  | 'flex'
  | 'gasoline'
  | 'ethanol'
  | 'diesel'
  | 'electric'
  | 'hybrid-plugin'
  | 'hybrid-mild'
  | 'gnv';

export interface Vehicle {
  id: string;
  userId: string;
  vehicleType: VehicleType;
  make: string;
  model: string;
  year: number;
  plate: string;
  color?: string;
  mileage: number;
  fuelType: FuelType;
  imageUrl?: string; // Base64 da imagem do veículo
  fipeValue?: number; // Valor atual do veículo na tabela FIPE
  fipeCode?: string; // Código FIPE para consultas futuras
  purchaseValue?: number; // Valor de compra do veículo
  // Dados do Seguro
  insuranceCompany?: string;
  insurancePhone?: string;
  insurancePolicyNumber?: string;
  insuranceExpiryDate?: Date;
  insuranceValue?: number;
  brokerContact?: string; // Telefone do corretor de seguro
  // Documentos
  documentCRLV?: string; // Base64 do CRLV
  documentInsurancePolicy?: string; // Base64 da apólice
  createdAt: Date;
  updatedAt: Date;
}

export interface MaintenanceAttachment {
  name: string;
  data: string; // Base64 string (ex: "data:image/jpeg;base64,...")
  uploadedAt: Date;
  type: string;
  size: number;
}

export type MaintenanceType =
  | 'oil_change'
  | 'oil_filter'
  | 'air_filter'
  | 'fuel_filter'
  | 'cabin_filter'
  | 'tire_rotation'
  | 'tire_replacement'
  | 'wheel_alignment'
  | 'wheel_balancing'
  | 'brake_pads'
  | 'brake_discs'
  | 'brake_fluid'
  | 'battery'
  | 'spark_plugs'
  | 'timing_belt'
  | 'serpentine_belt'
  | 'coolant'
  | 'transmission_fluid'
  | 'power_steering_fluid'
  | 'windshield_wipers'
  | 'air_conditioning'
  | 'suspension'
  | 'exhaust_system'
  | 'general_inspection'
  | 'other';

export interface WarrantyInfo {
  months: number; // Prazo da garantia em meses
  expiryDate: Date; // Data de expiração calculada
}

export interface MaintenanceRecord {
  id: string;
  vehicleId: string;
  type: MaintenanceType;
  description: string;
  cost: number; // Total cost (kept for backward compatibility)
  partsCost?: number; // Cost of parts/materials
  laborCost?: number; // Cost of labor/service
  warrantyParts?: WarrantyInfo; // Garantia das peças
  warrantyLabor?: WarrantyInfo; // Garantia da mão de obra
  mileage: number;
  date: Date;
  nextDueDate?: Date;
  nextDueMileage?: number;
  serviceProvider?: string;
  notes?: string;
  attachments?: MaintenanceAttachment[];
  beforePhoto?: string; // Base64 encoded image of part before maintenance
  afterPhoto?: string; // Base64 encoded image of part after maintenance
  createdAt: Date;
}

export interface VehicleInput {
  vehicleType: VehicleType;
  make: string;
  model: string;
  year: number;
  plate: string;
  color?: string;
  mileage: number;
  fuelType: FuelType;
  imageUrl?: string;
  insuranceCompany?: string;
  insurancePhone?: string;
  insurancePolicyNumber?: string;
  insuranceExpiryDate?: Date | string;
  insuranceValue?: number;
}

export const useVehiclesStore = defineStore('vehicles', () => {
  // State
  const vehicles = ref<Vehicle[]>([]);
  const maintenanceRecords = ref<MaintenanceRecord[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const vehicleCount = computed(() => vehicles.value.length);
  const totalMaintenanceRecords = computed(() => maintenanceRecords.value.length);

  const vehiclesByType = computed(() => {
    const grouped: Record<VehicleType, Vehicle[]> = {
      car: [],
      motorcycle: [],
      van: [],
      truck: [],
      bus: [],
      pickup: [],
    };

    vehicles.value.forEach((vehicle) => {
      grouped[vehicle.vehicleType].push(vehicle);
    });

    return grouped;
  });

  const getMaintenanceByVehicle = computed(() => {
    return (vehicleId: string) =>
      maintenanceRecords.value
        .filter((record) => record.vehicleId === vehicleId)
        .sort((a, b) => b.date.getTime() - a.date.getTime());
  });

  const upcomingMaintenance = computed(() => {
    const now = new Date();
    return maintenanceRecords.value
      .filter((record) => record.nextDueDate && record.nextDueDate > now)
      .sort((a, b) => a.nextDueDate!.getTime() - b.nextDueDate!.getTime());
  });

  const overdueMaintenance = computed(() => {
    const now = new Date();
    return maintenanceRecords.value
      .filter((record) => record.nextDueDate && record.nextDueDate < now)
      .sort((a, b) => a.nextDueDate!.getTime() - b.nextDueDate!.getTime());
  });

  const recentMaintenance = computed(() => {
    return maintenanceRecords.value
      .filter((record) => record.date)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  });

  const totalMaintenanceCost = computed(() => {
    return maintenanceRecords.value.reduce((total, record) => total + record.cost, 0);
  });

  const maintenanceStats = computed(() => {
    const stats = {
      total: maintenanceRecords.value.length,
      totalCost: totalMaintenanceCost.value,
      upcoming: upcomingMaintenance.value.length,
      overdue: overdueMaintenance.value.length,
      byType: {} as Record<string, number>,
    };

    maintenanceRecords.value.forEach((record) => {
      stats.byType[record.type] = (stats.byType[record.type] || 0) + 1;
    });

    return stats;
  });

  // Actions
  const fetchVehicles = async () => {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) {
      logger.warn('User not authenticated, skipping vehicles fetch');
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      logger.info('🔍 Fetching vehicles for user:', authStore.user!.id);

      const vehiclesRef = collection(db, 'vehicles');
      const q = query(
        vehiclesRef,
        where('userId', '==', authStore.user!.id),
        orderBy('createdAt', 'desc'),
      );

      const querySnapshot = await getDocs(q);

      logger.info(`✅ Found ${querySnapshot.size} vehicles`);

      vehicles.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
        insuranceExpiryDate: doc.data().insuranceExpiryDate?.toDate(),
      })) as Vehicle[];

      logger.info('✅ Vehicles loaded successfully');
    } catch (err) {
      const errorMessage = translateFirebaseError(
        err,
        'Não foi possível carregar os veículos. Verifique sua conexão com a internet.',
      );
      error.value = errorMessage;
      logger.error('❌ Error fetching vehicles:', err);
    } finally {
      loading.value = false;
    }
  };

  const addVehicle = async (vehicleData: VehicleInput) => {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) return false;

    loading.value = true;
    error.value = null;

    try {
      logger.info('🚗 Adding new vehicle...');

      // Converter insuranceExpiryDate para Date se for string
      const insuranceDate = vehicleData.insuranceExpiryDate
        ? typeof vehicleData.insuranceExpiryDate === 'string'
          ? new Date(vehicleData.insuranceExpiryDate)
          : vehicleData.insuranceExpiryDate
        : undefined;

      // Primeiro, criar o documento sem a imagem para obter o ID
      const vehicleRef = collection(db, 'vehicles');
      const docRef = await addDoc(vehicleRef, {
        ...vehicleData,
        imageUrl: null, // Temporariamente null
        userId: authStore.user!.id,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        insuranceExpiryDate: insuranceDate ? Timestamp.fromDate(insuranceDate) : null,
      });

      logger.info('✅ Vehicle document created:', docRef.id);

      // Se houver imagem em base64, fazer upload para Storage
      let finalImageUrl = vehicleData.imageUrl;
      if (vehicleData.imageUrl && isBase64DataURL(vehicleData.imageUrl)) {
        logger.info('📤 Uploading vehicle image to Storage...');
        try {
          finalImageUrl = await uploadVehicleImage(
            authStore.user!.id,
            docRef.id,
            vehicleData.imageUrl,
          );

          // Atualizar documento com a URL do Storage
          await updateDoc(doc(db, 'vehicles', docRef.id), {
            imageUrl: finalImageUrl,
            updatedAt: Timestamp.now(),
          });

          logger.info('✅ Vehicle image uploaded and document updated');
        } catch (uploadError) {
          logger.error('❌ Error uploading vehicle image:', uploadError);
          // Continuar mesmo se o upload falhar - documento já foi criado
        }
      }

      // Adicionar o novo veículo à lista local
      const newVehicle: Vehicle = {
        id: docRef.id,
        ...vehicleData,
        imageUrl: finalImageUrl,
        userId: authStore.user!.id,
        insuranceExpiryDate: insuranceDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vehicles.value.unshift(newVehicle);

      logger.info('✅ Vehicle added successfully');
      return true;
    } catch (err) {
      logger.error('❌ Error adding vehicle:', err);
      error.value = translateFirebaseError(err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const updateVehicle = async (vehicleId: string, vehicleData: Partial<VehicleInput>) => {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) return false;

    loading.value = true;
    error.value = null;

    try {
      logger.info('🔄 Updating vehicle:', vehicleId);

      // Converter insuranceExpiryDate para Date se for string
      const insuranceDate = vehicleData.insuranceExpiryDate
        ? typeof vehicleData.insuranceExpiryDate === 'string'
          ? new Date(vehicleData.insuranceExpiryDate)
          : vehicleData.insuranceExpiryDate
        : undefined;

      let finalImageUrl = vehicleData.imageUrl;

      // Se houver nova imagem em base64, fazer upload para Storage
      if (vehicleData.imageUrl && isBase64DataURL(vehicleData.imageUrl)) {
        logger.info('📤 Uploading new vehicle image to Storage...');
        try {
          // Buscar veículo atual para deletar imagem antiga
          const currentVehicle = vehicles.value.find((v) => v.id === vehicleId);
          if (currentVehicle?.imageUrl && currentVehicle.imageUrl.includes('firebasestorage')) {
            logger.info('🗑️ Deleting old vehicle image...');
            await deleteImage(currentVehicle.imageUrl);
          }

          // Upload nova imagem
          finalImageUrl = await uploadVehicleImage(
            authStore.user!.id,
            vehicleId,
            vehicleData.imageUrl,
          );
          logger.info('✅ New vehicle image uploaded');
        } catch (uploadError) {
          logger.error('❌ Error uploading vehicle image:', uploadError);
          // Continuar com a atualização mesmo se o upload falhar
        }
      }

      const vehicleRef = doc(db, 'vehicles', vehicleId);
      await updateDoc(vehicleRef, {
        ...vehicleData,
        imageUrl: finalImageUrl,
        updatedAt: Timestamp.now(),
        insuranceExpiryDate: insuranceDate ? Timestamp.fromDate(insuranceDate) : null,
      });

      // Atualizar o veículo na lista local
      const index = vehicles.value.findIndex((v) => v.id === vehicleId);
      if (index !== -1) {
        vehicles.value[index] = {
          ...vehicles.value[index],
          ...vehicleData,
          imageUrl: finalImageUrl,
          insuranceExpiryDate: insuranceDate,
          updatedAt: new Date(),
        };
      }

      logger.info('✅ Vehicle updated successfully');
      return true;
    } catch (err) {
      logger.error('❌ Error updating vehicle:', err);
      error.value = translateFirebaseError(err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteVehicle = async (vehicleId: string) => {
    const authStore = useAuthStore();
    if (!authStore.isAuthenticated) return false;

    loading.value = true;
    error.value = null;

    try {
      await deleteDoc(doc(db, 'vehicles', vehicleId));

      // Remover o veículo da lista local
      vehicles.value = vehicles.value.filter((v) => v.id !== vehicleId);

      return true;
    } catch (err) {
      const errorMessage = translateFirebaseError(
        err,
        'Não foi possível excluir o veículo. Verifique sua conexão com a internet.',
      );
      error.value = errorMessage;
      return false;
    } finally {
      loading.value = false;
    }
  };

  const getVehicleById = (vehicleId: string) => {
    return vehicles.value.find((v) => v.id === vehicleId);
  };

  // Maintenance Actions
  const fetchMaintenanceRecords = async () => {
    loading.value = true;
    error.value = null;

    try {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) {
        logger.warn('User not authenticated, skipping maintenance fetch');
        loading.value = false;
        return;
      }

      logger.info('🔍 Fetching maintenance records for user:', authStore.user!.id);

      // Buscar todas as manutenções do usuário (as rules exigem filtro por userId)
      const maintenanceRef = collection(db, 'maintenance');
      const q = query(
        maintenanceRef,
        where('userId', '==', authStore.user!.id),
        orderBy('date', 'desc'),
      );

      const querySnapshot = await getDocs(q);
      const fetchedRecords: MaintenanceRecord[] = [];

      logger.info(`✅ Found ${querySnapshot.size} maintenance records`);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        fetchedRecords.push({
          id: doc.id,
          vehicleId: data.vehicleId,
          type: data.type,
          description: data.description,
          cost: data.cost,
          partsCost: data.partsCost,
          laborCost: data.laborCost,
          warrantyParts: data.warrantyParts
            ? {
                months: data.warrantyParts.months,
                expiryDate: data.warrantyParts.expiryDate?.toDate(),
              }
            : undefined,
          warrantyLabor: data.warrantyLabor
            ? {
                months: data.warrantyLabor.months,
                expiryDate: data.warrantyLabor.expiryDate?.toDate(),
              }
            : undefined,
          mileage: data.mileage,
          date: data.date?.toDate() || new Date(),
          nextDueDate: data.nextDueDate?.toDate(),
          nextDueMileage: data.nextDueMileage,
          serviceProvider: data.serviceProvider,
          notes: data.notes,
          attachments: data.attachments?.map((att: { uploadedAt?: { toDate: () => Date } }) => ({
            ...att,
            uploadedAt: att.uploadedAt?.toDate() || new Date(),
          })),
          beforePhoto: data.beforePhoto,
          afterPhoto: data.afterPhoto,
          createdAt: data.createdAt?.toDate() || new Date(),
        });
      });

      maintenanceRecords.value = fetchedRecords;
      logger.info('✅ Maintenance records loaded successfully');
    } catch (err) {
      const errorMessage = translateFirebaseError(
        err,
        'Não foi possível carregar os registros de manutenção. Verifique sua conexão com a internet.',
      );
      error.value = errorMessage;
      logger.error('❌ Error fetching maintenance records:', err);
    } finally {
      loading.value = false;
    }
  };

  const addMaintenanceRecord = async (
    maintenanceData: Partial<MaintenanceRecord>,
  ): Promise<boolean> => {
    logger.info('🚀 addMaintenanceRecord called with:', maintenanceData);

    const authStore = useAuthStore();
    if (!authStore.user?.id) {
      logger.error('❌ No authenticated user');
      error.value = 'Usuário não autenticado';
      return false;
    }

    loading.value = true;
    error.value = null;

    try {
      logger.info('📝 Creating maintenance record...');

      // Validar campos obrigatórios
      if (!maintenanceData.vehicleId) {
        logger.error('❌ Missing vehicleId');
        error.value = 'ID do veículo é obrigatório';
        loading.value = false;
        return false;
      }

      if (!maintenanceData.type) {
        logger.error('❌ Missing type');
        error.value = 'Tipo de manutenção é obrigatório';
        loading.value = false;
        return false;
      }

      if (!maintenanceData.description) {
        logger.error('❌ Missing description');
        error.value = 'Descrição é obrigatória';
        loading.value = false;
        return false;
      }

      // Primeiro, criar o documento sem as imagens para obter o ID
      const tempRecord = {
        vehicleId: maintenanceData.vehicleId,
        type: maintenanceData.type,
        description: maintenanceData.description,
        cost: maintenanceData.cost || 0,
        partsCost: maintenanceData.partsCost || 0,
        laborCost: maintenanceData.laborCost || 0,
        mileage: maintenanceData.mileage || 0,
        date: maintenanceData.date ? Timestamp.fromDate(maintenanceData.date) : Timestamp.now(),
        nextDueDate: maintenanceData.nextDueDate
          ? Timestamp.fromDate(maintenanceData.nextDueDate)
          : null,
        nextDueMileage: maintenanceData.nextDueMileage || null,
        serviceProvider: maintenanceData.serviceProvider || null,
        notes: maintenanceData.notes || null,
        warrantyParts: maintenanceData.warrantyParts || null,
        warrantyLabor: maintenanceData.warrantyLabor || null,
        beforePhoto: null,
        afterPhoto: null,
        attachments: [],
        userId: authStore.user.id,
        createdAt: Timestamp.now(),
      };

      logger.info('📦 Document to create:', tempRecord);

      const docRef = await addDoc(collection(db, 'maintenance'), tempRecord);
      logger.info('✅ Maintenance document created:', docRef.id);

      // Upload de fotos before/after se existirem e forem base64
      let finalBeforePhoto = maintenanceData.beforePhoto;
      let finalAfterPhoto = maintenanceData.afterPhoto;

      if (maintenanceData.beforePhoto && isBase64DataURL(maintenanceData.beforePhoto)) {
        logger.info('� Uploading before photo to Storage...');
        try {
          finalBeforePhoto = await uploadMaintenancePhoto(
            authStore.user.id,
            docRef.id,
            maintenanceData.beforePhoto,
            'before',
          );
          logger.info('✅ Before photo uploaded');
        } catch (uploadError) {
          logger.error('❌ Error uploading before photo:', uploadError);
        }
      }

      if (maintenanceData.afterPhoto && isBase64DataURL(maintenanceData.afterPhoto)) {
        logger.info('📤 Uploading after photo to Storage...');
        try {
          finalAfterPhoto = await uploadMaintenancePhoto(
            authStore.user.id,
            docRef.id,
            maintenanceData.afterPhoto,
            'after',
          );
          logger.info('✅ After photo uploaded');
        } catch (uploadError) {
          logger.error('❌ Error uploading after photo:', uploadError);
        }
      }

      // Upload de attachments se existirem e forem base64
      let finalAttachments = maintenanceData.attachments || [];
      if (maintenanceData.attachments && maintenanceData.attachments.length > 0) {
        logger.info(
          '📎 Uploading',
          maintenanceData.attachments.length,
          'attachments to Storage...',
        );

        finalAttachments = await Promise.all(
          maintenanceData.attachments.map(async (att) => {
            if (att.data && isBase64DataURL(att.data)) {
              try {
                const url = await uploadMaintenanceAttachment(
                  authStore.user!.id,
                  docRef.id,
                  att.data,
                  att.name,
                );
                return { ...att, data: url };
              } catch (uploadError) {
                logger.error('❌ Error uploading attachment:', att.name, uploadError);
                return att; // Manter original se falhar
              }
            }
            return att;
          }),
        );

        logger.info('✅ Attachments processed');
      }

      // Atualizar documento com as URLs do Storage
      await updateDoc(doc(db, 'maintenance', docRef.id), {
        beforePhoto: finalBeforePhoto || null,
        afterPhoto: finalAfterPhoto || null,
        attachments: finalAttachments,
      });

      logger.info('✅ Maintenance record updated with Storage URLs');

      // Recarrega a lista de manutenções
      await fetchMaintenanceRecords();
      logger.info('🔄 Maintenance list reloaded');

      return true;
    } catch (err) {
      logger.error('❌ Error adding maintenance record:', err);
      const errorCode = (err as { code?: string })?.code;
      const errorMessage = (err as { message?: string })?.message;
      logger.error('Error code:', errorCode);
      logger.error('Error message:', errorMessage);
      error.value = translateFirebaseError(err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const deleteMaintenanceRecord = async (id: string) => {
    loading.value = true;
    error.value = null;

    try {
      const authStore = useAuthStore();
      if (!authStore.isAuthenticated) return false;

      const recordRef = doc(db, 'maintenance', id);
      await deleteDoc(recordRef);

      maintenanceRecords.value = maintenanceRecords.value.filter((r) => r.id !== id);
      return true;
    } catch (err) {
      const errorMessage = translateFirebaseError(
        err,
        'Não foi possível excluir o registro de manutenção. Verifique sua conexão com a internet.',
      );
      error.value = errorMessage;
      logger.error('Error deleting maintenance record:', err);
      return false;
    } finally {
      loading.value = false;
    }
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    // State
    vehicles,
    maintenanceRecords,
    loading,
    error,
    // Getters
    vehicleCount,
    totalMaintenanceRecords,
    vehiclesByType,
    getMaintenanceByVehicle,
    upcomingMaintenance,
    overdueMaintenance,
    recentMaintenance,
    totalMaintenanceCost,
    maintenanceStats,
    // Vehicle Actions
    fetchVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicleById,
    // Maintenance Actions
    fetchMaintenanceRecords,
    addMaintenanceRecord,
    deleteMaintenanceRecord,
    // Common
    clearError,
  };
});
