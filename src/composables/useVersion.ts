import { computed } from 'vue'

// Version information - this would typically come from a version.json file or build process
const versionData = {
  version: '1.0.0',
  buildNumber: '1',
  sha: 'abc123def456'
}

export const useVersion = () => {
  const shortVersion = computed(() => versionData.version)
  const version = computed(() => versionData)
  const shortSha = computed(() => versionData.sha.substring(0, 7))

  // Additional computed properties for compatibility
  const fullVersionString = computed(() => `${versionData.version} (${versionData.buildNumber})`)
  const formattedBuildDate = computed(() => new Date().toLocaleDateString('pt-BR'))
  const isProduction = computed(() => import.meta.env.PROD)

  return {
    shortVersion,
    version,
    shortSha,
    fullVersionString,
    formattedBuildDate,
    isProduction
  }
}