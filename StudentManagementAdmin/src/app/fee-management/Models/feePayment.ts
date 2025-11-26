



export enum paymentMode {
    Cash = 0,
    Card = 1,
    Online = 2
}

export enum ReturnMode {
    Debit = 0,
    Credit = 1
}

export interface Transaction {
    transactionId: string;
    studentId: string;
    transactionAmount: number;
    status: 'Credit' | 'Debit';
    remark?: string;
    transactionDate: string;
}

export enum transactionMode {
    Credit=0,
    Debit=1
}