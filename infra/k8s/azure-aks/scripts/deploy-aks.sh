#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# Mini AliExpress — Azure AKS deployment script
# ============================================================

RESOURCE_GROUP="${RESOURCE_GROUP:?Set RESOURCE_GROUP}"
AKS_CLUSTER="${AKS_CLUSTER:?Set AKS_CLUSTER}"
ACR_NAME="${ACR_NAME:?Set ACR_NAME}"
RELEASE_NAME="mini-aliexpress"
NAMESPACE="mini-aliexpress"

echo "==> Logging in to Azure..."
az login

echo "==> Getting AKS credentials..."
az aks get-credentials --resource-group "$RESOURCE_GROUP" --name "$AKS_CLUSTER"

echo "==> Logging in to ACR..."
az acr login --name "$ACR_NAME"

echo "==> Building & pushing backend image..."
docker build -t "$ACR_NAME.azurecr.io/mini-aliexpress-backend:latest" ../../../../backend/
docker push "$ACR_NAME.azurecr.io/mini-aliexpress-backend:latest"

echo "==> Building & pushing frontend image..."
docker build -t "$ACR_NAME.azurecr.io/mini-aliexpress-frontend:latest" ../../../../frontend/
docker push "$ACR_NAME.azurecr.io/mini-aliexpress-frontend:latest"

echo "==> Creating namespace..."
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

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
  --set "backend.image.repository=$ACR_NAME.azurecr.io/mini-aliexpress-backend" \
  --set "frontend.image.repository=$ACR_NAME.azurecr.io/mini-aliexpress-frontend" \
  --wait --timeout 10m

echo ""
echo "==> Deployment complete!"
echo "    Run: kubectl get ingress -n $NAMESPACE"
