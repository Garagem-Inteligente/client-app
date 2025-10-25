/**
 * Utilitários para comparação semântica de versões (Semantic Versioning)
 * Baseado em: https://semver.org/
 */

import type { VersionComparisonResult } from '@/types/version'

/**
 * Parseia uma string de versão para componentes [major, minor, patch]
 * Exemplo: "1.2.3" → [1, 2, 3]
 *
 * @param version String de versão no formato "X.Y.Z"
 * @returns Array [major, minor, patch] ou null se inválido
 */
export const parseVersion = (version: string): [number, number, number] | null => {
  // Validar se é string e se não é null/undefined
  if (!version || typeof version !== 'string') {
    return null
  }

  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/)
  if (!match) return null

  return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)]
}

/**
 * Compara duas versões semânticas
 *
 * @param v1 Primeira versão (ex: "1.0.0")
 * @param v2 Segunda versão (ex: "1.0.1")
 * @returns Resultado detalhado da comparação
 *
 * @example
 * compareVersions("1.0.0", "1.0.1") // isOlder: true, isNewer: false, isEqual: false
 * compareVersions("2.0.0", "1.0.0") // isOlder: false, isNewer: true, isEqual: false
 * compareVersions("1.0.0", "1.0.0") // isOlder: false, isNewer: false, isEqual: true
 */
export const compareVersions = (v1: string, v2: string): VersionComparisonResult => {
  const parsed1 = parseVersion(v1)
  const parsed2 = parseVersion(v2)

  if (!parsed1 || !parsed2) {
    return {
      isOlder: false,
      isNewer: false,
      isEqual: false,
      major: 0,
      minor: 0,
      patch: 0,
    }
  }

  const [major1, minor1, patch1] = parsed1
  const [major2, minor2, patch2] = parsed2

  // Comparar major
  if (major1 !== major2) {
    return {
      isOlder: major1 < major2,
      isNewer: major1 > major2,
      isEqual: false,
      major: major2 - major1,
      minor: 0,
      patch: 0,
    }
  }

  // Comparar minor
  if (minor1 !== minor2) {
    return {
      isOlder: minor1 < minor2,
      isNewer: minor1 > minor2,
      isEqual: false,
      major: 0,
      minor: minor2 - minor1,
      patch: 0,
    }
  }

  // Comparar patch
  if (patch1 !== patch2) {
    return {
      isOlder: patch1 < patch2,
      isNewer: patch1 > patch2,
      isEqual: false,
      major: 0,
      minor: 0,
      patch: patch2 - patch1,
    }
  }

  // Iguais
  return {
    isOlder: false,
    isNewer: false,
    isEqual: true,
    major: 0,
    minor: 0,
    patch: 0,
  }
}

/**
 * Verifica se v1 é mais antiga que v2
 *
 * @param v1 Primeira versão
 * @param v2 Segunda versão
 * @returns true se v1 < v2
 */
export const isVersionOlder = (v1: string, v2: string): boolean => {
  return compareVersions(v1, v2).isOlder
}

/**
 * Verifica se v1 é mais nova que v2
 *
 * @param v1 Primeira versão
 * @param v2 Segunda versão
 * @returns true se v1 > v2
 */
export const isVersionNewer = (v1: string, v2: string): boolean => {
  return compareVersions(v1, v2).isNewer
}

/**
 * Verifica se v1 é igual a v2
 *
 * @param v1 Primeira versão
 * @param v2 Segunda versão
 * @returns true se v1 === v2
 */
export const isVersionEqual = (v1: string, v2: string): boolean => {
  return compareVersions(v1, v2).isEqual
}

/**
 * Verifica se v1 é igual ou mais antiga que v2
 *
 * @param v1 Primeira versão
 * @param v2 Segunda versão
 * @returns true se v1 <= v2
 */
export const isVersionOlderOrEqual = (v1: string, v2: string): boolean => {
  const result = compareVersions(v1, v2)
  return result.isOlder || result.isEqual
}

/**
 * Valida se uma string é uma versão válida (X.Y.Z)
 *
 * @param version String a validar
 * @returns true se é válida
 */
export const isValidVersion = (version: string): boolean => {
  return parseVersion(version) !== null
}

/**
 * Formata diferenças entre versões em texto legível
 *
 * @param v1 Versão anterior
 * @param v2 Versão nova
 * @returns String descritiva (ex: "minor update", "major update")
 */
export const formatVersionDifference = (v1: string, v2: string): string => {
  const result = compareVersions(v1, v2)

  if (result.isEqual) return 'mesma versão'
  if (result.isNewer) return 'versão anterior (downgrade)'

  if (result.major > 0) return `atualização major (${v1} → ${v2})`
  if (result.minor > 0) return `atualização minor (${v1} → ${v2})`
  if (result.patch > 0) return `correção de bug (${v1} → ${v2})`

  return 'versão desconhecida'
}
