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
    credit: number;
    children: User[];
}

export interface UserLoginForm{
    name: string;
    login: string;
    password: string;
    parentId: number;
    jurisdictionId: number;
    email: string;
}