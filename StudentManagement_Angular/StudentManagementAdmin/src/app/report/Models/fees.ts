export interface fees{
    feeId: string;
  feeStructureId: string;
  installmentNumber: number;
  dueDate: string;
  amount: number;
  status: InstallmentStatus;
  feeStructure: {
    studentProfile: {
      trialStudent: {
        firstName: string;
        lastName: string;
      };
    };
    courseDetail: {
      course: {
        courseName: string;
      };
    };
  };
}
export enum InstallmentStatus{
    paid=0,
    pending=2,
    partiallyPaid=1
}