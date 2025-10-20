import { ref, computed } from "vue";
import { CHANGELOG, type ChangelogEntry } from "@/constants/changelog";

export function useChangelog() {
  const changelog = ref<ChangelogEntry[]>(CHANGELOG);

  const latestVersion = computed(() => {
    if (changelog.value.length === 0) return null;
    return changelog.value[0];
  });

  const latestChanges = computed(() => {
    return latestVersion.value?.changes || [];
  });

  const getVersionChanges = (version: string) => {
    return changelog.value.find((entry) => entry.version === version);
  };

  const getAllVersions = computed(() => {
    return changelog.value.map((entry) => entry.version);
  });

  return {
    changelog,
    latestVersion,
    latestChanges,
    getVersionChanges,
    getAllVersions,
  };
}
