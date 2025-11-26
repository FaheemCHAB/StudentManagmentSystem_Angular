export interface studentProfile {

    studentId?: string;
    studentReferenceId?:string;
    trialStudentId?: string;
    referredBy: reference;
    dob: Date;
    document?: File;
     firstName: string;
  lastName: string;
  address: string;
  email: string;
  phone: string;
  photoUrl?: string; 

}

export interface qualifications {
    qualificationId: string;
    studentId: string;
    collegeName?: string;
    collegeId: string;
    qualificationName: string;
    passOutYear: string;

}

export interface experience {
    experienceId: string;
    studentId: string;
    position: string;
    companyName: string;
    totalExperience: string;

}

export interface courseDetails {

    courseDetailId: string;
    studentProfileId: string;
    courseId: string;
    batchId: string;
    timeSlot: string;
    status: status;
    mode: mode;

}

export interface feeStructure {

    installmentId?: string;
    studentId: string;
    courseDetailId?: string;
    totalInstallment: number;




}

export interface fee {
    feeId: string;
    feeStructureId: string;
    installmentNumber: number;
    dueDate: string; // Still string (e.g., '2025-07-01') for API compatibility
    amount: number | null;
    amountReceived: number;
    dueAmount: number;
    currentReceivedAmount:number;
    amountReceivedDate?: string; // Optional, nullable DateTime in backend
    status: InstallmentStatus;
    paymentMode: PaymentMode; // must define enum PaymentMode too
    remarks?:string
    paidAmount?: number;
  balanceAmount?: number;
}

export enum InstallmentStatus {
    Paid = 0,
    Pending = 2,
    PartiallyPaid = 1
}

export enum mode {
    online = 0,
    hybrid = 1,
    offline = 2
}


export enum reference {
    student = 0,
    staff = 1,
    webinar = 2,
    advertisement = 3
}

export enum status {
    ongoing = 0,
    dropped = 1,
    completed = 2,
    placed = 3

}
export interface FeeSummary {
    amountPaid: number;
    amountPending: number;
    nextDueDate: string;
}

export enum PaymentMode {
    Cash = 0,
    Card = 1,
    Online = 2
}

//added
export interface SecondaryContact {
  secondaryContactId?: string;
  studentId: string;
  guardianName: string;
  relation: string;
  phone: string;
  adress: string;
}
