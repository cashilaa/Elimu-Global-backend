import { UserRole } from '../enums/user-role.enum';

export interface User {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}
