import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';
import { SignUpDto, SignInDto } from '../../dtos/auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async signUp(dto: SignUpDto) {
    const supabase = this.supabaseService.getClient();

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select()
      .eq('email', dto.email)
      .single();

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create user
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        email: dto.email,
        first_name: dto.firstName,
        last_name: dto.lastName,
        role: dto.role,
      })
      .select()
      .single();

    if (userError) throw userError;

    // Create auth user
    const { error: authError } = await supabase.auth.signUp({
      email: dto.email,
      password: dto.password,
    });

    if (authError) throw authError;

    // If instructor, create profile
    if (dto.role === 'instructor') {
      const { error: profileError } = await supabase.from('profiles').insert({
        user_id: user.id,
        qualification: dto.qualification,
        expertise: dto.expertise,
        experience: dto.experience,
        bio: dto.bio,
        phone_number: dto.phoneNumber,
      });

      if (profileError) throw profileError;
    }

    return { message: 'User created successfully' };
  }

  async signIn(dto: SignInDto) {
    const supabase = this.supabaseService.getClient();

    const { data: { session }, error } = await supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const { data: user } = await supabase
      .from('users')
      .select('*, profiles(*)')
      .eq('email', dto.email)
      .single();

    return {
      user,
      session,
    };
  }

  async signOut() {
    const supabase = this.supabaseService.getClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { message: 'Signed out successfully' };
  }
}
