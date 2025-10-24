/**
 * Composable para gerenciar cache e dados da API FIPE
 * Facilita o uso do sistema de cache em componentes Vue
 */

import { ref, computed } from 'vue';
import { fipeCache } from '@/services/fipeCache';
import { fipeApi, type FipeBrand, type FipeModel, type FipeYear, type FipeVehicleType } from '@/services/fipeApi';

export function useFipeData() {
  // Estados
  const brands = ref<FipeBrand[]>([]);
  const models = ref<FipeModel[]>([]);
  const years = ref<FipeYear[]>([]);

  const loadingBrands = ref(false);
  const loadingModels = ref(false);
  const loadingYears = ref(false);

  const error = ref<string | null>(null);

  // Estado de inicialização do cache
  const isInitializingCache = ref(false);
  const cacheInitMessage = ref('Atualizando base de dados...');

  // Computed
  const isLoading = computed(
    () => loadingBrands.value || loadingModels.value || loadingYears.value || isInitializingCache.value,
  );

  const hasBrands = computed(() => brands.value.length > 0);
  const hasModels = computed(() => models.value.length > 0);
  const hasYears = computed(() => years.value.length > 0);

  /**
   * Carrega marcas com cache
   */
  const loadBrands = async (vehicleType: FipeVehicleType) => {
    try {
      error.value = null;

      // Verifica se precisa fazer download inicial
      const hasCache = await fipeCache.hasBrandsCache(vehicleType);

      if (!hasCache) {
        isInitializingCache.value = true;
        cacheInitMessage.value = 'Atualizando base de dados de veículos...';
      } else {
        loadingBrands.value = true;
      }

      brands.value = await fipeCache.getBrands(vehicleType);
    } catch (err) {
      console.error('❌ Erro ao carregar marcas:', err);
      error.value = 'Não foi possível carregar as marcas. Verifique sua conexão.';
      brands.value = [];
    } finally {
      isInitializingCache.value = false;
      loadingBrands.value = false;
    }
  };

  /**
   * Carrega modelos com cache
   */
  const loadModels = async (vehicleType: FipeVehicleType, brandCode: string) => {
    try {
      error.value = null;

      // Verifica se precisa fazer download inicial
      const hasCache = await fipeCache.hasModelsCache(vehicleType, brandCode);

      if (!hasCache) {
        isInitializingCache.value = true;
        cacheInitMessage.value = 'Consultando modelos disponíveis...';
      } else {
        loadingModels.value = true;
      }

      models.value = await fipeCache.getModels(vehicleType, brandCode);
    } catch (err) {
      console.error('❌ Erro ao carregar modelos:', err);
      error.value = 'Não foi possível carregar os modelos. Verifique sua conexão.';
      models.value = [];
    } finally {
      isInitializingCache.value = false;
      loadingModels.value = false;
    }
  };

  /**
   * Carrega anos (não usa cache pois é dinâmico)
   */
  const loadYears = async (vehicleType: FipeVehicleType, brandCode: string, modelCode: string) => {
    try {
      error.value = null;
      loadingYears.value = true;

      years.value = await fipeApi.getYearsByModel(vehicleType, brandCode, modelCode);
    } catch (err) {
      console.error('❌ Erro ao carregar anos:', err);
      error.value = 'Não foi possível carregar os anos. Verifique sua conexão.';
      years.value = [];
    } finally {
      loadingYears.value = false;
    }
  };

  /**
   * Busca marcas com filtro de texto (usa cache)
   */
  const searchBrands = async (vehicleType: FipeVehicleType, searchTerm: string) => {
    try {
      error.value = null;

      // Carrega do cache
      const allBrands = await fipeCache.getBrands(vehicleType);

      if (!searchTerm) {
        brands.value = allBrands;
        return;
      }

      // Filtra localmente
      const normalizedSearch = searchTerm.toLowerCase().trim();
      brands.value = allBrands.filter((brand) => brand.name.toLowerCase().includes(normalizedSearch));
    } catch (err) {
      console.error('❌ Erro ao buscar marcas:', err);
      error.value = 'Erro ao buscar marcas.';
      brands.value = [];
    }
  };

  /**
   * Busca modelos com filtro de texto (usa cache)
   */
  const searchModels = async (vehicleType: FipeVehicleType, brandCode: string, searchTerm: string) => {
    try {
      error.value = null;

      // Carrega do cache
      const allModels = await fipeCache.getModels(vehicleType, brandCode);

      if (!searchTerm) {
        models.value = allModels;
        return;
      }

      // Filtra localmente
      const normalizedSearch = searchTerm.toLowerCase().trim();
      models.value = allModels.filter((model) => model.name.toLowerCase().includes(normalizedSearch));
    } catch (err) {
      console.error('❌ Erro ao buscar modelos:', err);
      error.value = 'Erro ao buscar modelos.';
      models.value = [];
    }
  };

  /**
   * Limpa todos os dados
   */
  const clearAll = () => {
    brands.value = [];
    models.value = [];
    years.value = [];
    error.value = null;
  };

  /**
   * Limpa apenas modelos e anos
   */
  const clearModelsAndYears = () => {
    models.value = [];
    years.value = [];
  };

  /**
   * Limpa apenas anos
   */
  const clearYears = () => {
    years.value = [];
  };

  /**
   * Obtém estatísticas do cache
   */
  const getCacheStats = async () => {
    return await fipeCache.getCacheStats();
  };

  /**
   * Limpa todo o cache FIPE
   */
  const clearCache = async () => {
    await fipeCache.clearAllCache();
    clearAll();
  };

  /**
   * Limpa cache de um tipo específico de veículo
   */
  const clearVehicleTypeCache = async (vehicleType: FipeVehicleType) => {
    await fipeCache.clearVehicleTypeCache(vehicleType);
    clearAll();
  };

  return {
    // Estados
    brands,
    models,
    years,
    loadingBrands,
    loadingModels,
    loadingYears,
    error,
    isInitializingCache,
    cacheInitMessage,

    // Computed
    isLoading,
    hasBrands,
    hasModels,
    hasYears,

    // Métodos
    loadBrands,
    loadModels,
    loadYears,
    searchBrands,
    searchModels,
    clearAll,
    clearModelsAndYears,
    clearYears,
    getCacheStats,
    clearCache,
    clearVehicleTypeCache,
  };
}
