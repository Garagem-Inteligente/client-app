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

  return {
    shortVersion,
    version,
    shortSha
  }
}