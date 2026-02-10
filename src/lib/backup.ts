
import { toast } from "sonner";

export interface BackupData {
    version: number;
    timestamp: string;
    data: Record<string, any>;
}

const BACKUP_VERSION = 1;
const STORAGE_KEYS = [
    'active-farmers',
    'active-batches',
    'warehouse-inventory',
    'retailer-orders',
    'retailer-inventory'
];

export const createBackup = () => {
    try {
        const data: Record<string, any> = {};

        // Collect data from known storage keys
        STORAGE_KEYS.forEach(key => {
            const value = localStorage.getItem(key);
            if (value) {
                try {
                    data[key] = JSON.parse(value);
                } catch (e) {
                    console.warn(`Failed to parse key ${key}`, e);
                    data[key] = value;
                }
            }
        });

        const backup: BackupData = {
            version: BACKUP_VERSION,
            timestamp: new Date().toISOString(),
            data
        };

        const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `agrovia-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast.success("Backup downloaded successfully");
        return true;
    } catch (error) {
        console.error('Backup failed:', error);
        toast.error("Failed to create backup");
        return false;
    }
};

export const restoreBackup = async (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const backup: BackupData = JSON.parse(content);

                if (!backup.data || typeof backup.data !== 'object') {
                    throw new Error("Invalid backup format");
                }

                // Restore data
                Object.entries(backup.data).forEach(([key, value]) => {
                    if (typeof value === 'object') {
                        localStorage.setItem(key, JSON.stringify(value));
                    } else {
                        localStorage.setItem(key, String(value));
                    }
                });

                toast.success("Data restored successfully! reloading...");

                // Reload to apply changes
                setTimeout(() => {
                    window.location.reload();
                }, 1500);

                resolve(true);
            } catch (error) {
                console.error('Restore failed:', error);
                toast.error("Failed to restore backup: Invalid file");
                resolve(false);
            }
        };

        reader.onerror = () => {
            toast.error("Error reading file");
            resolve(false);
        };

        reader.readAsText(file);
    });
};
