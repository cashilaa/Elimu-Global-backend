import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class HealthService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getHealthStatus() {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .rpc('get_status');

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      return {
        status: 'error',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
