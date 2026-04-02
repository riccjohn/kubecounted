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
- [ ] Verify minikube pulls image from GHCR instead of local build (check package visibility, run `kubectl rollout restart deployment/kubecounted`, confirm app responds)

## Phase 7: Observability (Stretch)

- [~] Install Prometheus and Grafana via Helm (done manually via `helm install` — needs Helmfile)
- [x] Add `/metrics` endpoint (prom-client, collectDefaultMetrics, GET /metrics)
- [x] Write a `helmfile.yaml` to codify the Helm release (install Helmfile first: `brew install helmfile`)
- [x] Configure Prometheus scraping (ServiceMonitor with `release: monitoring` label; added `app: kubecounted` label and named port `web` to Service so ServiceMonitor could match it)
- [ ] Build Grafana dashboard

### Notes
- `kube-prometheus-stack` is already running in the cluster in the `monitoring` namespace — deployed manually this session
- Helmfile is the `package.json` equivalent for Helm — makes the setup reproducible and visible in the repo
- Next session: install Helmfile, write `helmfile.yaml`, then move on to ServiceMonitor
