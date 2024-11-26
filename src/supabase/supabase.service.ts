import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';
import fetch from 'cross-fetch';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient;
  private readonly logger = new Logger(SupabaseService.name);
  private readonly maxRetries = 3;
  private readonly retryDelay = 2000; // 2 seconds

  constructor(private configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.error('Supabase credentials are missing!');
      throw new Error('Supabase credentials are required');
    }

    // Ensure URL format is correct
    const formattedUrl = supabaseUrl.endsWith('/')
      ? supabaseUrl.slice(0, -1)
      : supabaseUrl;

    try {
      this.supabase = createClient(formattedUrl, supabaseKey, {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
        },
        global: {
          fetch: fetch,
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseKey,
          },
        },
      });
      this.logger.log('Supabase client initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Supabase client:', error);
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async testConnection(attempt: number = 1): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('users')
        .select('count', { count: 'exact', head: true });

      if (error) {
        throw error;
      }

      this.logger.log('Successfully connected to Supabase');
      return true;
    } catch (error) {
      this.logger.warn(
        `Connection attempt ${attempt}/${this.maxRetries} failed:`,
        error.message
      );

      if (attempt < this.maxRetries) {
        this.logger.log(`Retrying in ${this.retryDelay / 1000} seconds...`);
        await this.delay(this.retryDelay);
        return this.testConnection(attempt + 1);
      }

      return false;
    }
  }

  async onModuleInit() {
    try {
      const isConnected = await this.testConnection();
      
      if (!isConnected) {
        this.logger.error('Failed to establish Supabase connection after maximum retries');
        // Don't throw error, allow the application to start
        this.logger.warn('Application will start but database functionality may be limited');
      }
    } catch (error) {
      this.logger.error('Error during Supabase initialization:', {
        message: error.message,
        details: error.stack,
        hint: error.hint || '',
        code: error.code || ''
      });
      // Continue application startup
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
