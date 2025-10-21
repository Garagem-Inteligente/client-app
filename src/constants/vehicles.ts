import type { VehicleType, FuelType, MaintenanceType } from '@/stores/vehicles';

// Labels em português para tipos de veículos
export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  car: 'Carro',
  motorcycle: 'Moto',
  van: 'Van',
  truck: 'Caminhão',
  bus: 'Ônibus',
  pickup: 'Caminhonete',
};

// Labels em português para tipos de combustível
export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  flex: 'Flex (Gasolina/Etanol)',
  gasoline: 'Gasolina',
  ethanol: 'Álcool (Etanol)',
  diesel: 'Diesel Comum',
  'diesel-s10': 'Diesel S10',
  electric: 'Elétrico',
  'hybrid-plugin': 'Híbrido Plugin',
  'hybrid-mild': 'Híbrido Leve',
  gnv: 'GNV (Gás Natural)',
};

// Opções para select de tipos de veículos
export const VEHICLE_TYPE_OPTIONS = [
  { value: 'car' as VehicleType, label: 'Carro' },
  { value: 'motorcycle' as VehicleType, label: 'Moto' },
  { value: 'van' as VehicleType, label: 'Van' },
  { value: 'truck' as VehicleType, label: 'Caminhão' },
  { value: 'bus' as VehicleType, label: 'Ônibus' },
  { value: 'pickup' as VehicleType, label: 'Caminhonete' },
];

// Opções para select de tipos de combustível
export const FUEL_TYPE_OPTIONS = [
  { value: 'flex' as FuelType, label: 'Flex (Gasolina/Etanol)' },
  { value: 'gasoline' as FuelType, label: 'Gasolina' },
  { value: 'ethanol' as FuelType, label: 'Álcool (Etanol)' },
  { value: 'diesel' as FuelType, label: 'Diesel Comum' },
  { value: 'diesel-s10' as FuelType, label: 'Diesel S10' },
  { value: 'electric' as FuelType, label: 'Elétrico' },
  { value: 'hybrid-plugin' as FuelType, label: 'Híbrido Plugin' },
  { value: 'hybrid-mild' as FuelType, label: 'Híbrido Leve' },
  { value: 'gnv' as FuelType, label: 'GNV (Gás Natural)' },
];

// Labels em português para tipos de manutenção
export const MAINTENANCE_TYPE_LABELS: Record<MaintenanceType, string> = {
  oil_change: 'Troca de Óleo do Motor',
  oil_filter: 'Troca de Filtro de Óleo',
  air_filter: 'Troca de Filtro de Ar',
  fuel_filter: 'Troca de Filtro de Combustível',
  cabin_filter: 'Troca de Filtro do Ar-Condicionado',
  tire_rotation: 'Rodízio de Pneus',
  tire_replacement: 'Troca de Pneus',
  wheel_alignment: 'Alinhamento',
  wheel_balancing: 'Balanceamento',
  brake_pads: 'Troca de Pastilhas de Freio',
  brake_discs: 'Troca de Discos de Freio',
  brake_fluid: 'Troca de Fluido de Freio',
  battery: 'Troca de Bateria',
  spark_plugs: 'Troca de Velas',
  timing_belt: 'Troca de Correia Dentada',
  serpentine_belt: 'Troca de Correia Poly-V',
  coolant: 'Troca de Fluido de Arrefecimento',
  transmission_fluid: 'Troca de Óleo do Câmbio',
  power_steering_fluid: 'Troca de Fluido da Direção',
  windshield_wipers: 'Troca de Palhetas do Limpador',
  air_conditioning: 'Manutenção do Ar-Condicionado',
  suspension: 'Manutenção da Suspensão',
  exhaust_system: 'Manutenção do Escapamento',
  general_inspection: 'Revisão Geral',
  other: 'Outro',
};

// Ícones (emojis) para tipos de manutenção
export const MAINTENANCE_TYPE_ICONS: Record<MaintenanceType, string> = {
  oil_change: '🛢️',
  oil_filter: '🔧',
  air_filter: '💨',
  fuel_filter: '⛽',
  cabin_filter: '❄️',
  tire_rotation: '🔄',
  tire_replacement: '⚫',
  wheel_alignment: '📏',
  wheel_balancing: '⚖️',
  brake_pads: '🛑',
  brake_discs: '💿',
  brake_fluid: '🧪',
  battery: '🔋',
  spark_plugs: '⚡',
  timing_belt: '⛓️',
  serpentine_belt: '🔗',
  coolant: '🌡️',
  transmission_fluid: '⚙️',
  power_steering_fluid: '🎯',
  windshield_wipers: '🌧️',
  air_conditioning: '❄️',
  suspension: '🔩',
  exhaust_system: '💨',
  general_inspection: '🔍',
  other: '📝',
};

// Opções para select de tipos de manutenção (agrupadas por categoria)
export const MAINTENANCE_TYPE_OPTIONS = [
  {
    category: 'Óleos e Filtros',
    options: [
      { value: 'oil_change' as MaintenanceType, label: 'Troca de Óleo do Motor', emoji: '🛢️' },
      { value: 'oil_filter' as MaintenanceType, label: 'Troca de Filtro de Óleo', emoji: '🔧' },
      { value: 'air_filter' as MaintenanceType, label: 'Troca de Filtro de Ar', emoji: '💨' },
      {
        value: 'fuel_filter' as MaintenanceType,
        label: 'Troca de Filtro de Combustível',
        emoji: '⛽',
      },
      {
        value: 'cabin_filter' as MaintenanceType,
        label: 'Troca de Filtro do Ar-Condicionado',
        emoji: '❄️',
      },
    ],
  },
  {
    category: 'Pneus e Rodas',
    options: [
      { value: 'tire_rotation' as MaintenanceType, label: 'Rodízio de Pneus', emoji: '🔄' },
      { value: 'tire_replacement' as MaintenanceType, label: 'Troca de Pneus', emoji: '⚫' },
      { value: 'wheel_alignment' as MaintenanceType, label: 'Alinhamento', emoji: '📏' },
      { value: 'wheel_balancing' as MaintenanceType, label: 'Balanceamento', emoji: '⚖️' },
    ],
  },
  {
    category: 'Freios',
    options: [
      { value: 'brake_pads' as MaintenanceType, label: 'Troca de Pastilhas de Freio', emoji: '🛑' },
      { value: 'brake_discs' as MaintenanceType, label: 'Troca de Discos de Freio', emoji: '💿' },
      { value: 'brake_fluid' as MaintenanceType, label: 'Troca de Fluido de Freio', emoji: '🧪' },
    ],
  },
  {
    category: 'Motor e Transmissão',
    options: [
      { value: 'spark_plugs' as MaintenanceType, label: 'Troca de Velas', emoji: '⚡' },
      { value: 'timing_belt' as MaintenanceType, label: 'Troca de Correia Dentada', emoji: '⛓️' },
      {
        value: 'serpentine_belt' as MaintenanceType,
        label: 'Troca de Correia Poly-V',
        emoji: '🔗',
      },
      {
        value: 'coolant' as MaintenanceType,
        label: 'Troca de Fluido de Arrefecimento',
        emoji: '🌡️',
      },
      {
        value: 'transmission_fluid' as MaintenanceType,
        label: 'Troca de Óleo do Câmbio',
        emoji: '⚙️',
      },
    ],
  },
  {
    category: 'Outros Sistemas',
    options: [
      { value: 'battery' as MaintenanceType, label: 'Troca de Bateria', emoji: '🔋' },
      {
        value: 'power_steering_fluid' as MaintenanceType,
        label: 'Troca de Fluido da Direção',
        emoji: '🎯',
      },
      {
        value: 'windshield_wipers' as MaintenanceType,
        label: 'Troca de Palhetas do Limpador',
        emoji: '🌧️',
      },
      {
        value: 'air_conditioning' as MaintenanceType,
        label: 'Manutenção do Ar-Condicionado',
        emoji: '❄️',
      },
      { value: 'suspension' as MaintenanceType, label: 'Manutenção da Suspensão', emoji: '🔩' },
      {
        value: 'exhaust_system' as MaintenanceType,
        label: 'Manutenção do Escapamento',
        emoji: '💨',
      },
    ],
  },
  {
    category: 'Geral',
    options: [
      { value: 'general_inspection' as MaintenanceType, label: 'Revisão Geral', emoji: '🔍' },
      { value: 'other' as MaintenanceType, label: 'Outro', emoji: '📝' },
    ],
  },
];
