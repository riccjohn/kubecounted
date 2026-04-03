# Session Notes

## Where we left off

**Phase 7 complete.** All observability work is done.

### Phase 7 notes
- `kube-prometheus-stack` installed in `monitoring` namespace via `helm install` (codified in `helmfile.yaml`)
- ServiceMonitor fixed by adding `release: monitoring` label, `app: kubecounted` label to Service, and naming port `web`
- All 3 app pods confirmed UP in Prometheus targets UI
- Grafana accessible at `localhost:3001` via `kubectl port-forward svc/monitoring-grafana -n monitoring 3001:80`
- Grafana credentials in the `monitoring-grafana` Secret: `kubectl get secret monitoring-grafana -n monitoring -o jsonpath="{.data.admin-password}" | base64 --decode`
- Grafana data source (Prometheus) pre-configured by `kube-prometheus-stack` — no manual setup needed
- `deploy.yml` updated with path filters so CI only triggers on changes to `src/`, `package.json`, `pnpm-lock.yaml`, or `Dockerfile`

### Custom metrics (app.js) — all complete
- `http_requests_total` Counter: `labelNames: ['method', 'route']`; middleware calls `.inc({ method, route: path })`
- `http_request_duration_seconds` Histogram: `startTimer({ method, route: path })` called in middleware; end function called via `res.on('finish', endTimer)`
- `redis_connected` Gauge: set to `1` on `connect` event, `0` on `error` and `end` events
- Custom registry (`new Registry()`) used; `collectDefaultMetrics` scoped to it

### Grafana dashboard — complete
- "Requests/sec by route": `sum(rate(http_requests_total[5m])) by (route)`
- "p99 Latency by route": `histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, route))`
- "Redis Connection": `sum(redis_connected) / count(redis_connected)` — Stat panel with green/yellow/red thresholds

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
