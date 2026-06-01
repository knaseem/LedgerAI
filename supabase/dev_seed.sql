-- Development Seed Script
-- Run this in the Supabase SQL Editor

-- 1. Create a Dummy Tenant for Development
INSERT INTO tenants (id, name)
VALUES ('00000000-0000-0000-0000-000000000000', 'Acme Corp (Dev)')
ON CONFLICT DO NOTHING;

-- 2. Temporary Permissive RLS Policies for Development
-- WARNING: These should be removed and replaced with strict Auth policies before going live!

DROP POLICY IF EXISTS "Allow anon all on workflows" ON workflows;
CREATE POLICY "Allow anon all on workflows" ON workflows FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all on tenants" ON tenants;
CREATE POLICY "Allow anon all on tenants" ON tenants FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all on rpa_queue" ON rpa_queue;
CREATE POLICY "Allow anon all on rpa_queue" ON rpa_queue FOR ALL USING (true) WITH CHECK (true);
