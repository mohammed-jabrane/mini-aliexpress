# ── PostgreSQL ────────────────────────────────
POSTGRES_DB=mini_aliexpress
POSTGRES_USER=aliexpress
POSTGRES_PASSWORD={{ postgres_password }}

# ── Minio S3 ─────────────────────────────────
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD={{ minio_root_password }}

# ── Keycloak ─────────────────────────────────
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD={{ keycloak_admin_password }}

# ── Docker Hub (images) ─────────────────────
DOCKERHUB_USERNAME={{ dockerhub_username }}
IMAGE_TAG={{ image_tag | default('latest') }}
FRONTEND_IMAGE_TAG={{ image_tag | default('latest') }}-int

# ── VM FQDN (Azure DNS label) ─────────────
VM_FQDN={{ vm_fqdn }}
