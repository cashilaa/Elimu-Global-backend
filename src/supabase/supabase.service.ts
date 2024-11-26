import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import fetch from 'cross-fetch';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.error('Supabase credentials are missing!');
      throw new Error('Supabase credentials are required');
    }

    try {
      this.supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
        },
        global: {
          fetch: fetch,
        },
      });
      this.logger.log('Supabase client initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Supabase client:', error);
      throw error;
    }
  }

  async onModuleInit() {
    try {
      // Test the connection with a simple health check
      const { error } = await this.supabase.from('users').select('count', { count: 'exact', head: true });
      
      if (error) {
        this.logger.error('Failed to connect to Supabase:', error);
        throw error;
      }
      
      this.logger.log('Successfully connected to Supabase');
    } catch (error) {
      this.logger.error('Failed to connect to Supabase:', { 
        message: error.message,
        details: error.stack,
        hint: error.hint || '',
        code: error.code || ''
      });
      // Don't throw the error here, just log it
      this.logger.warn('Continuing application startup despite Supabase connection issue');
    }
  }

  getClient(): SupabaseClient {
    if (!this.supabase) {
      this.logger.error('Supabase client is not initialized');
      throw new Error('Supabase client is not initialized');
    }
    return this.supabase;
  }
}
