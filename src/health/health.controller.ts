import { Controller, Get } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Controller('health')
export class HealthController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @Get()
  async checkHealth() {
    try {
      const client = this.supabaseService.getClient();
      const { data, error } = await client.rpc('get_status');
      
      if (error) {
        return {
          status: 'error',
          database: 'down',
          error: error.message,
          timestamp: new Date().toISOString(),
        };
      }

      return {
        status: 'ok',
        database: 'up',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        database: 'down',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}
