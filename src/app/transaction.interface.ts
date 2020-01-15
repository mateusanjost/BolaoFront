export interface Transaction {
    id: number;
    date: Date;
    fromUser: number;
    fromUserName: string;
    toUser: number;
    toUserName: string;
    description: string;    
  }