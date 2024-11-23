import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createSupabaseClient } from '../config/supabase.config';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '../types/user.interface';
import { UserRole } from '../enums/user-role.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private supabase;

  constructor(private configService: ConfigService) {
    this.supabase = createSupabaseClient(configService);
  }

  private mapUserResponse(user: any): User {
    return {
      id: user.id,
      email: user.email,
      password: user.password,
      role: user.role || UserRole.STUDENT,
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
          role: createUserDto.role || UserRole.STUDENT
        }
      ])
      .select()
      .single();

    if (error) {
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

  async findById(id: string): Promise<User | null> {
    const { data: user, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !user) {
      return null;
    }

    return this.mapUserResponse(user);
  }

  async approveInstructor(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('users')
      .update({ isApproved: true })
      .eq('id', id);

    if (error) {
      throw error;
    }
  }
}
