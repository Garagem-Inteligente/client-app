/**
 * Utilitários para cálculos relacionados a combustível
 */

import type { MaintenanceRecord, Vehicle } from '@/stores/vehicles';

/**
 * Calcula o gasto estimado de combustível entre duas manutenções
 * @param startMileage Quilometragem inicial
 * @param endMileage Quilometragem final
 * @param averageFuelConsumption Consumo médio em km/l
 * @param fuelPricePerLiter Preço do combustível por litro (opcional)
 * @returns Objeto com litros consumidos e custo (se preço fornecido)
 */
export function calculateFuelConsumption(
  startMileage: number,
  endMileage: number,
  averageFuelConsumption: number,
  fuelPricePerLiter?: number,
) {
  if (averageFuelConsumption <= 0) {
    return { liters: 0, cost: 0, distance: 0 };
  }

  const distance = endMileage - startMileage;

  if (distance <= 0) {
    return { liters: 0, cost: 0, distance: 0 };
  }

  const liters = distance / averageFuelConsumption;
  const cost = fuelPricePerLiter ? liters * fuelPricePerLiter : 0;

  return {
    distance,
    liters: Math.round(liters * 10) / 10, // Arredondar para 1 casa decimal
    cost: Math.round(cost * 100) / 100, // Arredondar para 2 casas decimais
  };
}

/**
 * Calcula o gasto de combustível entre duas manutenções consecutivas
 * @param prevMaintenance Manutenção anterior
 * @param currentMaintenance Manutenção atual
 * @param vehicle Veículo
 * @param fuelPricePerLiter Preço do combustível por litro (opcional)
 */
export function calculateFuelBetweenMaintenances(
  prevMaintenance: MaintenanceRecord,
  currentMaintenance: MaintenanceRecord,
  vehicle: Vehicle,
  fuelPricePerLiter?: number,
) {
  if (!vehicle.averageFuelConsumption || vehicle.averageFuelConsumption <= 0) {
    return null;
  }

  const startMileage = prevMaintenance.mileage;
  const endMileage = currentMaintenance.mileage;

  return calculateFuelConsumption(
    startMileage,
    endMileage,
    vehicle.averageFuelConsumption,
    fuelPricePerLiter,
  );
}

/**
 * Calcula o gasto total de combustível para um veículo baseado em suas manutenções
 * @param maintenanceRecords Array de registros de manutenção (ordenados por data)
 * @param vehicle Veículo
 * @param fuelPricePerLiter Preço do combustível por litro (opcional)
 */
export function calculateTotalFuelCost(
  maintenanceRecords: MaintenanceRecord[],
  vehicle: Vehicle,
  fuelPricePerLiter?: number,
) {
  if (!vehicle.averageFuelConsumption || vehicle.averageFuelConsumption <= 0) {
    return null;
  }

  if (maintenanceRecords.length < 2) {
    return null;
  }

  // Ordenar por quilometragem
  const sorted = [...maintenanceRecords].sort((a, b) => a.mileage - b.mileage);

  let totalLiters = 0;
  let totalCost = 0;
  let totalDistance = 0;

  for (let i = 1; i < sorted.length; i++) {
    const result = calculateFuelConsumption(
      sorted[i - 1].mileage,
      sorted[i].mileage,
      vehicle.averageFuelConsumption,
      fuelPricePerLiter,
    );

    totalLiters += result.liters;
    totalCost += result.cost;
    totalDistance += result.distance;
  }

  return {
    totalDistance,
    totalLiters: Math.round(totalLiters * 10) / 10,
    totalCost: Math.round(totalCost * 100) / 100,
    averageLitersPerKm: totalDistance > 0 ? totalLiters / totalDistance : 0,
  };
}

/**
 * Preços médios de combustível no Brasil (estimativa, deve ser atualizado)
 */
export const ESTIMATED_FUEL_PRICES: Record<string, number> = {
  flex: 5.5, // Média gasolina
  gasoline: 6.0,
  ethanol: 4.5,
  diesel: 5.8,
  'diesel-s10': 6.0,
  electric: 0.8, // Por kWh equivalente
  'hybrid-plugin': 5.0,
  'hybrid-mild': 5.5,
  gnv: 4.2,
};

/**
 * Obtém o preço estimado do combustível baseado no tipo
 */
export function getEstimatedFuelPrice(fuelType: string): number {
  return ESTIMATED_FUEL_PRICES[fuelType] || 6.0;
}
