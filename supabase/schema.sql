-- LedgerAI Initial Database Schema
-- Run this script in the Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tenants Table (Companies)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Users Table (Linked to Auth & Tenants)
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'user', -- 'admin', 'user', 'viewer'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Workflows Table (Stores the JSON logic from the Workflow Builder)
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    nodes JSONB NOT NULL DEFAULT '[]'::jsonb, -- The array of nodes & configs
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. RPA Queue Table (The Task List for the Chrome Extension)
CREATE TABLE rpa_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    workflow_id UUID REFERENCES workflows(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
    payload JSONB NOT NULL, -- Data to be processed (e.g., extracted invoice data)
    error_log TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 5. RPA Selectors Table (The Dynamic CSS Map for ERPs)
CREATE TABLE rpa_selectors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    erp_name TEXT NOT NULL, -- e.g., 'QuickBooks', 'NetSuite'
    action_type TEXT NOT NULL, -- e.g., 'Create Bill', 'Sync Vendor'
    selectors_map JSONB NOT NULL, -- e.g., {"vendor_input": "#qbo-vendor", "save": ".submit"}
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(erp_name, action_type)
);

-- Enable Row Level Security (RLS) on core tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE rpa_queue ENABLE ROW LEVEL SECURITY;

-- Note: In a true production environment, you would add RLS policies here
-- e.g., CREATE POLICY "Users can view their own tenant workflows" ON workflows ...
