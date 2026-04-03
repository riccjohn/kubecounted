# Session Notes

## Where we left off

Working through Phase 7 (Observability). Custom metrics still need to be added to the app before the Grafana dashboard can be built.

### Phase 7 notes
- `kube-prometheus-stack` installed in `monitoring` namespace via `helm install` (now codified in `helmfile.yaml`)
- `/metrics` endpoint added using `prom-client` — currently only exposes default Node.js/process metrics via `collectDefaultMetrics`
- ServiceMonitor was not working initially — fixed by adding `release: monitoring` label (so Prometheus Operator picks it up), adding `app: kubecounted` label to the Service, and naming the port `web` (required for ServiceMonitor endpoint selector)
- All 3 app pods confirmed UP in Prometheus targets UI
- Grafana data source (Prometheus) is pre-configured by `kube-prometheus-stack` — no manual setup needed
- Grafana default credentials are stored in the `monitoring-grafana` Secret: `kubectl get secret monitoring-grafana -n monitoring -o jsonpath="{.data.admin-password}" | base64 --decode`
- Next: add custom metrics to `app.js` (request counter by route/method, latency histogram, Redis connection gauge), then build Grafana dashboard

## Phase 6 notes

### Phase 6 notes
- CI workflow builds and pushes image to GHCR on push to `main` — confirmed working
- Required enabling "Read and write permissions" under repo Settings → Actions → General → Workflow permissions
- Tagged with both `latest` and the commit SHA for traceability
- CD skipped — minikube runs locally and is unreachable from GitHub Actions runners
- `imagePullPolicy` changed from `Never` to `IfNotPresent` — cluster now pulls from GHCR
- Discussed GitOps/ArgoCD as an alternative pull-based CD model (not implemented)

### Key context
- minikube is the local K8s cluster
- Images must be built inside minikube's Docker env: `eval $(minikube docker-env)` then `docker build -t kubecounted .`
- `imagePullPolicy: Never` is set in `app-deployment.yaml` so K8s uses the local image — **this will need to change in Phase 6** when images are pushed to a real registry (e.g. Docker Hub or GHCR)
- Redis URL is passed via ConfigMap (`k8s/configmap.yaml`) as `REDIS_URL=redis://redis:6379`
- App has readiness and liveness probes on `GET /health`
- App Service is type `NodePort`
