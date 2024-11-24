import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@supabase/supabase-js';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../types/user.interface';
import { UserRole } from '../enums/user-role.enum';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class UsersService {
  private supabase;

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseServiceRoleKey = this.configService.get<string>('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing Supabase configuration');
    }

    this.supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }

  private mapUserResponse(user: any): User {
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      role: user.role || UserRole.STUDENT,
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      isApproved: user.is_approved || false,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const { data: user, error } = await this.supabase
      .from('users')
      .insert([
        {
          email: createUserDto.email,
          password: hashedPassword,
          role: createUserDto.role || UserRole.STUDENT,
          first_name: createUserDto.firstName || '',
          last_name: createUserDto.lastName || '',
          is_approved: false
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return this.mapUserResponse(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return null;
    }

    return this.mapUserResponse(user);
  }

  async findById(userId: string, throwIfNotFound: boolean = false): Promise<User | null> {
    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && throwIfNotFound) {
      throw new UnauthorizedException('User not found');
    }

    return user ? this.mapUserResponse(user) : null;
  }

  async approveInstructor(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .update({ is_approved: true })
      .eq('id', id);

    if (error) {
      throw error;
    }
  }
}
