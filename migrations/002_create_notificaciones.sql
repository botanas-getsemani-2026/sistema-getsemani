-- Migration: Create notificaciones table
-- Description: Table to store in-app notifications for users

CREATE TABLE IF NOT EXISTS public.notificaciones (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    id_usuario uuid NOT NULL REFERENCES perfiles(id),
    titulo text NOT NULL,
    mensaje text NOT NULL,
    leido boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notificaciones_id_usuario_idx ON public.notificaciones USING btree (id_usuario);
CREATE INDEX IF NOT EXISTS notificaciones_leido_idx ON public.notificaciones USING btree (leido);