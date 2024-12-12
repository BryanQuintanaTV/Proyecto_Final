export interface User {
    refresh: string;
    access: string;
    user: {
        id: number;
        is_staff: boolean;
    };
}