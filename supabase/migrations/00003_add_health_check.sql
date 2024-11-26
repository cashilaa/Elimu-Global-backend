-- Create health check function
CREATE OR REPLACE FUNCTION public.get_status()
RETURNS jsonb
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT jsonb_build_object(
    'status', 'healthy',
    'timestamp', CURRENT_TIMESTAMP,
    'database', current_database(),
    'version', version()
  );
$$;
