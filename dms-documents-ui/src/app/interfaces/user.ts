export interface User {
    username: string;
    rootDir: string;
    canRead: boolean;
    canUpdate: boolean;
    canDelete: boolean;
    canCreate: boolean;
}