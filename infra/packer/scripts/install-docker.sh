#!/bin/bash
set -euo pipefail

# ── Update system packages ──────────────────────────────────
sudo apt-get update
sudo apt-get upgrade -y

# ── Install prerequisites ───────────────────────────────────
sudo apt-get install -y \
  ca-certificates \
  curl \
  gnupg \
  lsb-release

# ── Add Docker's official GPG key ──────────────────────────
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# ── Set up Docker repository ───────────────────────────────
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# ── Install Docker CE + Compose v2 plugin ───────────────────
sudo apt-get update
sudo apt-get install -y \
  docker-ce \
  docker-ce-cli \
  containerd.io \
  docker-buildx-plugin \
  docker-compose-plugin

# ── Enable Docker service ──────────────────────────────────
sudo systemctl enable docker
sudo systemctl start docker

# ── Add default Azure VM user to docker group ──────────────
sudo usermod -aG docker azureuser

# ── Verify installation ────────────────────────────────────
docker --version
docker compose version
