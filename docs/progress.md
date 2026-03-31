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

- [ ] Scale the app to 3 replicas
- [ ] Verify hostnames rotate across requests
- [ ] Verify hit count is consistent across pods
- [ ] Verify deleted pods are automatically recreated

## Phase 4: Health Checks & Resilience

- [ ] Add `GET /health` endpoint
- [ ] Add readiness probe
- [ ] Add liveness probe
- [ ] Test by killing the Redis pod

## Phase 5: Ingress & Routing

- [ ] Install an Ingress Controller
- [ ] Write an Ingress manifest
- [ ] Add a second service and route via the same Ingress
- [ ] Update `/etc/hosts` to point hostnames at minikube IP

## Phase 6: CI/CD Pipeline

- [ ] Push project to GitHub
- [ ] Set up GitHub Actions workflow for image build & push
- [ ] Automate deployment to cluster

## Phase 7: Observability (Stretch)

- [ ] Install Prometheus and Grafana via Helm
- [ ] Add `/metrics` endpoint
- [ ] Configure Prometheus scraping
- [ ] Build Grafana dashboard
