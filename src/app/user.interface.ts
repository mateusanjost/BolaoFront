export interface User {
    name: string;
    lastName: string;
    email: string;
    login: string;
    password: string;
    deleted: boolean;
    comission: number;
    parent: number;
    jurisdictionId: number;
    jurisdiction: string;
    userPermission: string;
    id: number;
    country: string;
    city: string;
    children: User[];
}