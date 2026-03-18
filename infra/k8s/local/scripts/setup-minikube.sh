#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# Mini AliExpress — Minikube bootstrap script
# ============================================================

RELEASE_NAME="mini-aliexpress"
NAMESPACE="mini-aliexpress"

echo "==> Starting Minikube..."
minikube start --cpus=4 --memory=8192 --driver=docker

echo "==> Enabling ingress addon..."
minikube addons enable ingress

echo "==> Creating namespace..."
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

echo "==> Building backend image inside Minikube..."
eval $(minikube docker-env)
docker build -t mini-aliexpress-backend:latest ../../../../backend/

echo "==> Building frontend image inside Minikube..."
docker build -t mini-aliexpress-frontend:latest ../../../../frontend/

echo "==> Adding Bitnami Helm repo..."
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

echo "==> Installing Helm dependencies..."
cd ../helm/mini-aliexpress
helm dependency build

echo "==> Deploying with Helm..."
helm upgrade --install "$RELEASE_NAME" . \
  --namespace "$NAMESPACE" \
  --values values.yaml \
  --wait --timeout 10m

echo ""
echo "==> Deployment complete!"
echo "    Add this to /etc/hosts: $(minikube ip) mini-aliexpress.local"
echo "    Then open http://mini-aliexpress.local"
