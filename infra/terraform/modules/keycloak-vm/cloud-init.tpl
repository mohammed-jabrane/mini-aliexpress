#cloud-config
package_update: true
packages:
  - docker.io
  - docker-compose

runcmd:
  - systemctl enable docker
  - systemctl start docker
  - |
    cat > /opt/docker-compose.yml <<'COMPOSE'
    version: "3.9"
    services:
      keycloak:
        image: quay.io/keycloak/keycloak:${keycloak_version}
        restart: always
        command: start --optimized --hostname-strict=false --http-enabled=true
        environment:
          KC_DB: postgres
          KC_DB_URL: jdbc:postgresql://${db_host}:5432/${db_name}
          KC_DB_USERNAME: ${db_user}
          KC_DB_PASSWORD: ${db_password}
          KEYCLOAK_ADMIN: ${admin_user}
          KEYCLOAK_ADMIN_PASSWORD: ${admin_password}
        ports:
          - "8080:8080"
          - "8443:8443"
    COMPOSE
  - cd /opt && docker-compose up -d
