export interface Transaction {
    id: number;
    date: Date;
    activeUser: number;
    activeUserName: string;
    passiveUser: number;
    passiveUserName: string;
    description: string; 
    type: number;
    typeDesc: string;
    creditIn: number;
    creditOut: number;
    balance: number;
    dateFormatted: string;
  }