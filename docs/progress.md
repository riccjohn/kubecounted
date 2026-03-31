# Progress

## Phase 1: Docker Fundamentals

- [x] Write the app with Redis connection
- [x] Write a `Dockerfile` with multi-stage build
- [x] Write a `docker-compose.yml` that runs both the app and Redis
- [x] Verify the app connects to Redis using Docker's internal DNS

## Phase 2: Kubernetes Basics

- [x] Write a Deployment manifest for the app
- [x] Write a Service manifest for the app
- [x] Write a Deployment and Service for Redis
- [x] Move the Redis connection URL into a ConfigMap
- [x] Verify app reads Redis URL from ConfigMap

## Phase 3: Scaling & Load Balancing

- [x] Scale the app to 3 replicas
- [x] Verify hostnames rotate across requests
- [x] Verify hit count is consistent across pods
- [x] Verify deleted pods are automatically recreated

## Phase 4: Health Checks & Resilience

- [x] Add `GET /health` endpoint
- [x] Add readiness probe
- [x] Add liveness probe
- [x] Test by killing the Redis pod

## Phase 5: Ingress & Routing

- [x] Install an Ingress Controller
- [x] Write an Ingress manifest
- [x] Add a second service and route via the same Ingress
- [x] Update `/etc/hosts` to point hostnames at minikube IP (using minikube tunnel + Host header instead)

## Phase 6: CI/CD Pipeline

- [x] Push project to GitHub
- [x] Set up GitHub Actions workflow for image build & push
- [~] Automate deployment to cluster (skipped — minikube is local, unreachable from CI; CD is manual via `kubectl apply`)

## Phase 7: Observability (Stretch)

- [ ] Install Prometheus and Grafana via Helm
- [ ] Add `/metrics` endpoint
- [ ] Configure Prometheus scraping
- [ ] Build Grafana dashboard
