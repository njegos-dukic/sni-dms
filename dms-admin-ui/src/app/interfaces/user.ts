export interface User {
    id: string;
    rootDir: string;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canCreate: boolean;
    isManager: boolean;
    allowedDomain: string;
}