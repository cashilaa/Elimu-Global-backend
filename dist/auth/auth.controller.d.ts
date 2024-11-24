import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../enums/user-role.enum';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    register(createUserDto: CreateUserDto): Promise<{
        message: string;
        user: {
            id: string;
            email: string;
            role: UserRole;
            firstName: string;
            lastName: string;
            isApproved: boolean;
        };
    }>;
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            role: any;
            firstName: any;
            lastName: any;
            isApproved: any;
        };
    }>;
    getInstructorApplications(): Promise<void>;
    approveInstructor(id: string): Promise<{
        message: string;
    }>;
}
