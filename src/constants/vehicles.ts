import type { VehicleType, FuelType } from '@/stores/vehicles'

// Labels em português para tipos de veículos
export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  car: 'Carro',
  motorcycle: 'Moto',
  van: 'Van',
  truck: 'Caminhão',
  bus: 'Ônibus',
  pickup: 'Caminhonete'
}

// Labels em português para tipos de combustível
export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  flex: 'Flex (Gasolina/Etanol)',
  gasoline: 'Gasolina',
  ethanol: 'Álcool (Etanol)',
  diesel: 'Diesel',
  electric: 'Elétrico',
  'hybrid-plugin': 'Híbrido Plugin',
  'hybrid-mild': 'Híbrido Leve',
  gnv: 'GNV (Gás Natural)'
}

// Opções para select de tipos de veículos
export const VEHICLE_TYPE_OPTIONS = [
  { value: 'car' as VehicleType, label: 'Carro' },
  { value: 'motorcycle' as VehicleType, label: 'Moto' },
  { value: 'van' as VehicleType, label: 'Van' },
  { value: 'truck' as VehicleType, label: 'Caminhão' },
  { value: 'bus' as VehicleType, label: 'Ônibus' },
  { value: 'pickup' as VehicleType, label: 'Caminhonete' }
]

// Opções para select de tipos de combustível
export const FUEL_TYPE_OPTIONS = [
  { value: 'flex' as FuelType, label: 'Flex (Gasolina/Etanol)' },
  { value: 'gasoline' as FuelType, label: 'Gasolina' },
  { value: 'ethanol' as FuelType, label: 'Álcool (Etanol)' },
  { value: 'diesel' as FuelType, label: 'Diesel' },
  { value: 'electric' as FuelType, label: 'Elétrico' },
  { value: 'hybrid-plugin' as FuelType, label: 'Híbrido Plugin' },
  { value: 'hybrid-mild' as FuelType, label: 'Híbrido Leve' },
  { value: 'gnv' as FuelType, label: 'GNV (Gás Natural)' }
]

// Ícones do Lucide para cada tipo de veículo
export const VEHICLE_TYPE_ICONS: Record<VehicleType, string> = {
  car: 'Car',
  motorcycle: 'Bike',
  van: 'TruckIcon',
  truck: 'TruckIcon',
  bus: 'Bus',
  pickup: 'TruckIcon'
}
