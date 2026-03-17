import { useState, useEffect } from 'react';
import packageJson from '../../package.json';

// REPOSITORY_URL: Update this to point to the raw version of version.json on your GitHub repository
const VERSION_URL = 'https://raw.githubusercontent.com/utsogharami5-source/Uday-QR/main/app/public/version.json';

interface VersionData {
  version: string;
  url: string;
  notes?: string;
}

export function useUpdateChecker() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [latestVersion, setLatestVersion] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [updateNotes, setUpdateNotes] = useState<string | null>(null);

  useEffect(() => {
    async function checkForUpdates() {
      try {
        const response = await fetch(VERSION_URL, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to fetch version info');
        
        const data: VersionData = await response.json();
        const currentVersion = packageJson.version;
        
        // Simple semver comparison (assumes format x.y.z)
        if (isNewerVersion(currentVersion, data.version)) {
          setIsUpdateAvailable(true);
          setLatestVersion(data.version);
          setDownloadUrl(data.url);
          if (data.notes) setUpdateNotes(data.notes);
        }
      } catch (error) {
        console.error('Update check failed:', error);
      }
    }

    checkForUpdates();
  }, []);

  return { isUpdateAvailable, latestVersion, downloadUrl, updateNotes };
}

function isNewerVersion(current: string, remote: string) {
  const currentParts = current.split('.').map(Number);
  const remoteParts = remote.split('.').map(Number);

  for (let i = 0; i < Math.max(currentParts.length, remoteParts.length); i++) {
    const curr = currentParts[i] || 0;
    const rem = remoteParts[i] || 0;
    if (rem > curr) return true;
    if (rem < curr) return false;
  }
  return false;
}
