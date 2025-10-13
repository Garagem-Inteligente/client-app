/**
 * Serviço de integração com a API FIPE v2
 * Documentação: https://deividfortuna.github.io/fipe/v2/
 * 
 * A API fornece informações sobre veículos (carros, motos, caminhões)
 * incluindo marcas, modelos, anos e valores da tabela FIPE.
 * 
 * Limite: 500 requisições/dia sem autenticação
 * Com token gratuito: 1000 requisições/dia
 */

const FIPE_API_BASE_URL = 'https://fipe.parallelum.com.br/api/v2'

// Tipos de veículos suportados
export type VehicleType = 'cars' | 'motorcycles' | 'trucks'

// Interfaces da API
export interface FipeBrand {
  code: string
  name: string
}

export interface FipeModel {
  code: string
  name: string
}

export interface FipeYear {
  code: string
  name: string
}

export interface FipeVehicleInfo {
  brand: string
  codeFipe: string
  fuel: string
  fuelAcronym: string
  model: string
  modelYear: number
  price: string
  referenceMonth: string
  vehicleType: number
}

export interface FipeReference {
  code: string
  month: string
}

/**
 * Classe de serviço para interagir com a API FIPE
 */
class FipeApiService {
  private baseUrl: string

  constructor(baseUrl: string = FIPE_API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  /**
   * Faz uma requisição GET para a API
   */
  private async fetch<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Erro na API FIPE: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Erro ao buscar dados da FIPE:', error)
      throw error
    }
  }

  /**
   * Busca as referências (meses) disponíveis na tabela FIPE
   */
  async getReferences(): Promise<FipeReference[]> {
    return this.fetch<FipeReference[]>('/references')
  }

  /**
   * Busca todas as marcas por tipo de veículo
   * @param vehicleType - Tipo do veículo (cars, motorcycles, trucks)
   * @param reference - Código de referência do mês (opcional)
   */
  async getBrandsByType(
    vehicleType: VehicleType = 'cars',
    reference?: number
  ): Promise<FipeBrand[]> {
    const queryParam = reference ? `?reference=${reference}` : ''
    return this.fetch<FipeBrand[]>(`/${vehicleType}/brands${queryParam}`)
  }

  /**
   * Busca todos os modelos de uma marca específica
   * @param vehicleType - Tipo do veículo
   * @param brandId - ID da marca
   * @param reference - Código de referência do mês (opcional)
   */
  async getModelsByBrand(
    vehicleType: VehicleType,
    brandId: string,
    reference?: number
  ): Promise<FipeModel[]> {
    const queryParam = reference ? `?reference=${reference}` : ''
    return this.fetch<FipeModel[]>(
      `/${vehicleType}/brands/${brandId}/models${queryParam}`
    )
  }

  /**
   * Busca todos os anos disponíveis para um modelo específico
   * @param vehicleType - Tipo do veículo
   * @param brandId - ID da marca
   * @param modelId - ID do modelo
   * @param reference - Código de referência do mês (opcional)
   */
  async getYearsByModel(
    vehicleType: VehicleType,
    brandId: string,
    modelId: string,
    reference?: number
  ): Promise<FipeYear[]> {
    const queryParam = reference ? `?reference=${reference}` : ''
    return this.fetch<FipeYear[]>(
      `/${vehicleType}/brands/${brandId}/models/${modelId}/years${queryParam}`
    )
  }

  /**
   * Busca informações completas de um veículo específico
   * @param vehicleType - Tipo do veículo
   * @param brandId - ID da marca
   * @param modelId - ID do modelo
   * @param yearId - ID do ano
   * @param reference - Código de referência do mês (opcional)
   */
  async getVehicleInfo(
    vehicleType: VehicleType,
    brandId: string,
    modelId: string,
    yearId: string,
    reference?: number
  ): Promise<FipeVehicleInfo> {
    const queryParam = reference ? `?reference=${reference}` : ''
    return this.fetch<FipeVehicleInfo>(
      `/${vehicleType}/brands/${brandId}/models/${modelId}/years/${yearId}${queryParam}`
    )
  }

  /**
   * Busca marcas com filtro de texto
   * Útil para implementar busca/autocompletar
   */
  async searchBrands(
    vehicleType: VehicleType,
    searchTerm: string
  ): Promise<FipeBrand[]> {
    const brands = await this.getBrandsByType(vehicleType)
    
    if (!searchTerm) return brands

    const normalizedSearch = searchTerm.toLowerCase().trim()
    return brands.filter(brand =>
      brand.name.toLowerCase().includes(normalizedSearch)
    )
  }

  /**
   * Busca modelos com filtro de texto
   */
  async searchModels(
    vehicleType: VehicleType,
    brandId: string,
    searchTerm: string
  ): Promise<FipeModel[]> {
    const models = await this.getModelsByBrand(vehicleType, brandId)
    
    if (!searchTerm) return models

    const normalizedSearch = searchTerm.toLowerCase().trim()
    return models.filter(model =>
      model.name.toLowerCase().includes(normalizedSearch)
    )
  }
}

// Exporta instância única do serviço
export const fipeApi = new FipeApiService()

// Exporta também a classe para testes/mocks
export default FipeApiService
