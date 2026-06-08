-- Migration: Create cargas_logs table
-- Description: Table to track status changes (authorize/reject) for carga traceability

CREATE TABLE IF NOT EXISTS public.cargas_logs (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    id_carga uuid NOT NULL REFERENCES cargas(id) ON DELETE CASCADE,
    id_usuario uuid NOT NULL REFERENCES perfiles(id),
    accion text NOT NULL CHECK (accion IN ('autorizada', 'rechazada')),
    motivo text NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS cargas_logs_id_carga_idx ON public.cargas_logs USING btree (id_carga);
CREATE INDEX IF NOT EXISTS cargas_logs_id_usuario_idx ON public.cargas_logs USING btree (id_usuario);