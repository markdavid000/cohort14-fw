export type Student = {
  id: number;
  name: string;
  email: string;
  level: number;
  wallet: string;
  isPaid: boolean;
  isActive: boolean;
};

export type StaffMember = {
  id: number;
  name: string;
  email: string;
  role: string;
  wallet: string;
  salary: number;
  isActive: boolean;
  lastPaidAt?: string;
};

type Listener = () => void;

const listeners = new Set<Listener>();

let tuitionFees: Record<number, number> = {
  1: 100,
  2: 150,
  3: 200,
  4: 250,
};

let students: Student[] = [
  {
    id: 1,
    name: 'Ada Lovelace',
    email: 'ada@example.edu',
    level: 1,
    wallet: 'N/A',
    isPaid: true,
    isActive: true,
  },
  {
    id: 2,
    name: 'Alan Turing',
    email: 'alan@example.edu',
    level: 2,
    wallet: 'N/A',
    isPaid: false,
    isActive: true,
  },
];

let staffMembers: StaffMember[] = [
  {
    id: 1,
    name: 'Grace Hopper',
    email: 'grace@example.edu',
    role: 'Teacher',
    wallet: 'N/A',
    salary: 1000,
    isActive: true,
  },
];

let tokenAllowance = 0;

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getStudents() {
  return students;
}

export function getStudentById(id: number) {
  return students.find((student) => student.id === id);
}

export function registerStudent(payload: Omit<Student, 'id' | 'isPaid' | 'isActive'>) {
  const nextId = students.length ? Math.max(...students.map((student) => student.id)) + 1 : 1;
  students = [
    ...students,
    {
      id: nextId,
      isPaid: false,
      isActive: true,
      ...payload,
    },
  ];
  notify();
}

export function payStudentTuition(studentId: number) {
  students = students.map((student) => {
    if (student.id !== studentId) {
      return student;
    }
    return {
      ...student,
      isPaid: true,
    };
  });
  notify();
}

export function getTuitionFee(level: number) {
  return tuitionFees[level] ?? tuitionFees[1] ?? 0;
}

export function setTuitionFee(level: number, fee: number) {
  tuitionFees = {
    ...tuitionFees,
    [level]: fee,
  };
  notify();
}

export function getTreasuryBalance() {
  return students.reduce((sum, student) => {
    if (!student.isPaid) {
      return sum;
    }
    return sum + getTuitionFee(student.level);
  }, 0);
}

export function getAllowance() {
  return tokenAllowance;
}

export function approveAllowance(amount: number) {
  tokenAllowance = amount;
  notify();
}

export function consumeAllowance(amount: number) {
  tokenAllowance = Math.max(0, tokenAllowance - amount);
  notify();
}

export function registerStaff(payload: Omit<StaffMember, 'id' | 'isActive' | 'lastPaidAt'>) {
  const nextId = staffMembers.length ? Math.max(...staffMembers.map((staff) => staff.id)) + 1 : 1;
  staffMembers = [
    ...staffMembers,
    {
      id: nextId,
      isActive: true,
      ...payload,
    },
  ];
  notify();
}

export function payStaff(staffId: number) {
  staffMembers = staffMembers.map((staff) => {
    if (staff.id !== staffId) {
      return staff;
    }
    return {
      ...staff,
      lastPaidAt: new Date().toISOString(),
    };
  });
  notify();
}

export function suspendStaff(staffId: number) {
  staffMembers = staffMembers.map((staff) => {
    if (staff.id !== staffId) {
      return staff;
    }
    return {
      ...staff,
      isActive: false,
    };
  });
  notify();
}

export function activateStaff(staffId: number) {
  staffMembers = staffMembers.map((staff) => {
    if (staff.id !== staffId) {
      return staff;
    }
    return {
      ...staff,
      isActive: true,
    };
  });
  notify();
}