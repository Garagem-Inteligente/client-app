/**
 * Serviço de cache para dados da API FIPE
 * Utiliza Capacitor Preferences para armazenamento local otimizado para mobile
 */

import { Preferences } from '@capacitor/preferences';
import { fipeApi, type FipeBrand, type FipeModel, type FipeVehicleType } from './fipeApi';

// Prefixos para as chaves de cache
const CACHE_PREFIX = 'fipe_cache_';
const CACHE_VERSION = 'v1';

// Tempo de expiração do cache (7 dias em milissegundos)
const CACHE_EXPIRATION = 7 * 24 * 60 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  version: string;
}

/**
 * Classe de serviço para gerenciar cache de dados FIPE
 */
class FipeCacheService {
  /**
   * Gera uma chave única para o cache
   */
  private getCacheKey(vehicleType: FipeVehicleType, dataType: string, identifier?: string): string {
    const parts = [CACHE_PREFIX, CACHE_VERSION, vehicleType, dataType];
    if (identifier) {
      parts.push(identifier);
    }
    return parts.join('_');
  }

  /**
   * Verifica se um cache está expirado
   */
  private isCacheExpired(timestamp: number): boolean {
    return Date.now() - timestamp > CACHE_EXPIRATION;
  }

  /**
   * Salva dados no cache
   */
  private async setCache<T>(key: string, data: T): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      version: CACHE_VERSION,
    };

    await Preferences.set({
      key,
      value: JSON.stringify(entry),
    });
  }

  /**
   * Recupera dados do cache
   */
  private async getCache<T>(key: string): Promise<T | null> {
    try {
      const result = await Preferences.get({ key });

      if (!result.value) {
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(result.value);

      // Valida versão
      if (entry.version !== CACHE_VERSION) {
        await Preferences.remove({ key });
        return null;
      }

      // Valida expiração
      if (this.isCacheExpired(entry.timestamp)) {
        await Preferences.remove({ key });
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('❌ Erro ao recuperar cache:', error);
      return null;
    }
  }

  /**
   * Busca marcas com cache
   * Se não houver cache válido, busca da API e salva
   */
  async getBrands(vehicleType: FipeVehicleType): Promise<FipeBrand[]> {
    const cacheKey = this.getCacheKey(vehicleType, 'brands');

    // Tenta recuperar do cache
    const cached = await this.getCache<FipeBrand[]>(cacheKey);
    if (cached) {
      console.log('✅ Marcas carregadas do cache:', vehicleType);
      return cached;
    }

    // Busca da API
    console.log('📡 Buscando marcas da API:', vehicleType);
    const brands = await fipeApi.getBrandsByType(vehicleType);

    // Salva no cache
    await this.setCache(cacheKey, brands);

    return brands;
  }

  /**
   * Busca modelos com cache
   * Se não houver cache válido, busca da API e salva
   */
  async getModels(vehicleType: FipeVehicleType, brandCode: string): Promise<FipeModel[]> {
    const cacheKey = this.getCacheKey(vehicleType, 'models', brandCode);

    // Tenta recuperar do cache
    const cached = await this.getCache<FipeModel[]>(cacheKey);
    if (cached) {
      console.log('✅ Modelos carregados do cache:', vehicleType, brandCode);
      return cached;
    }

    // Busca da API
    console.log('📡 Buscando modelos da API:', vehicleType, brandCode);
    const models = await fipeApi.getModelsByBrand(vehicleType, brandCode);

    // Salva no cache
    await this.setCache(cacheKey, models);

    return models;
  }

  /**
   * Verifica se há cache disponível para marcas de um tipo de veículo
   */
  async hasBrandsCache(vehicleType: FipeVehicleType): Promise<boolean> {
    const cacheKey = this.getCacheKey(vehicleType, 'brands');
    const cached = await this.getCache<FipeBrand[]>(cacheKey);
    return cached !== null;
  }

  /**
   * Verifica se há cache disponível para modelos
   */
  async hasModelsCache(vehicleType: FipeVehicleType, brandCode: string): Promise<boolean> {
    const cacheKey = this.getCacheKey(vehicleType, 'models', brandCode);
    const cached = await this.getCache<FipeModel[]>(cacheKey);
    return cached !== null;
  }

  /**
   * Limpa todo o cache FIPE
   */
  async clearAllCache(): Promise<void> {
    try {
      const { keys } = await Preferences.keys();
      const fipeKeys = keys.filter((key) => key.startsWith(CACHE_PREFIX));

      for (const key of fipeKeys) {
        await Preferences.remove({ key });
      }

      console.log('✅ Cache FIPE limpo:', fipeKeys.length, 'entradas removidas');
    } catch (error) {
      console.error('❌ Erro ao limpar cache:', error);
    }
  }

  /**
   * Limpa cache de um tipo específico de veículo
   */
  async clearVehicleTypeCache(vehicleType: FipeVehicleType): Promise<void> {
    try {
      const { keys } = await Preferences.keys();
      const vehicleKeys = keys.filter(
        (key) => key.startsWith(CACHE_PREFIX) && key.includes(vehicleType),
      );

      for (const key of vehicleKeys) {
        await Preferences.remove({ key });
      }

      console.log(
        '✅ Cache limpo para tipo de veículo:',
        vehicleType,
        vehicleKeys.length,
        'entradas removidas',
      );
    } catch (error) {
      console.error('❌ Erro ao limpar cache do tipo de veículo:', error);
    }
  }

  /**
   * Obtém estatísticas do cache
   */
  async getCacheStats(): Promise<{
    totalEntries: number;
    cacheSize: number;
    oldestEntry: number | null;
  }> {
    try {
      const { keys } = await Preferences.keys();
      const fipeKeys = keys.filter((key) => key.startsWith(CACHE_PREFIX));

      let oldestTimestamp: number | null = null;
      let totalSize = 0;

      for (const key of fipeKeys) {
        const result = await Preferences.get({ key });
        if (result.value) {
          totalSize += result.value.length;
          const entry = JSON.parse(result.value);
          if (!oldestTimestamp || entry.timestamp < oldestTimestamp) {
            oldestTimestamp = entry.timestamp;
          }
        }
      }

      return {
        totalEntries: fipeKeys.length,
        cacheSize: totalSize,
        oldestEntry: oldestTimestamp,
      };
    } catch (error) {
      console.error('❌ Erro ao obter estatísticas do cache:', error);
      return {
        totalEntries: 0,
        cacheSize: 0,
        oldestEntry: null,
      };
    }
  }
}

// Exporta instância única do serviço
export const fipeCache = new FipeCacheService();

// Exporta também a classe para testes/mocks
export default FipeCacheService;
