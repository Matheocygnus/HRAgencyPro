# Skill Registry — HRAgencyPro

## Project Manifest Rules (auto-generated)

Source: project-manifest skill. Do NOT edit manually — regenerated each time the manifest is updated.

Triggers: when working on ANY change in this project (sdd-propose, sdd-design, sdd-apply, sdd-verify must respect these rules).

### Compact Rules

- Preservar fidelidad funcional: cada feature del monolito debe tener equivalente en la nueva arquitectura.
- Backend: NestJS + TypeORM exclusivamente. El schema Drizzle es solo referencia de migración.
- Frontend: HeroUI Pro + Tailwind v4 exclusivamente. Sin Shadcn/ui ni Tailwind v3.
- El frontend no conoce la DB: todo acceso de datos pasa por la API REST.
- Variables de entorno sobre hardcoded. Agregar .env.example en cada proyecto con comentarios.
- Credenciales de usuarios iniciales van a DB como seed — nunca en código fuente.
- No inventar mapeo de entidades TypeORM: derivarlas de shared/schema.ts original. Ambigüedad → pendiente visible.
- Tailwind v4 breaking changes son parte del trabajo: nueva config, nuevas directivas CSS.
- Done backend: npm run start:dev sin errores, todos los endpoints del monolito tienen equivalente.
- Done frontend: npm run dev sin errores, consume backend local, HeroUI Pro theme activo.
- Si algo está abierto, dejarlo visible: no ocultar ambigüedad para "cerrar" un cambio.

### Full rules in engram
- `project/hragencypro/manifest/rules` — reglas completas con justificación
- `project/hragencypro/manifest/context` — contexto estratégico
- `project/hragencypro/manifest/mission` — misión del agente y criterios de éxito
