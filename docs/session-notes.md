# Session Notes

## Where we left off

Working through Phase 7 (Observability). `http_requests_total` counter is complete. Next: latency histogram, then Redis connection gauge, then Grafana dashboard.

### Phase 7 notes
- `kube-prometheus-stack` installed in `monitoring` namespace via `helm install` (now codified in `helmfile.yaml`)
- ServiceMonitor was not working initially — fixed by adding `release: monitoring` label (so Prometheus Operator picks it up), adding `app: kubecounted` label to the Service, and naming the port `web` (required for ServiceMonitor endpoint selector)
- All 3 app pods confirmed UP in Prometheus targets UI
- Grafana accessible at `localhost:3001` via `kubectl port-forward svc/monitoring-grafana -n monitoring 3001:80`
- Grafana credentials in the `monitoring-grafana` Secret: `kubectl get secret monitoring-grafana -n monitoring -o jsonpath="{.data.admin-password}" | base64 --decode`
- Grafana data source (Prometheus) pre-configured by `kube-prometheus-stack` — no manual setup needed
- `deploy.yml` updated with path filters so CI only triggers on changes to `src/`, `package.json`, `pnpm-lock.yaml`, or `Dockerfile`

### Custom metrics status (app.js)
- `http_requests_total` Counter: COMPLETE — `labelNames: ['method', 'route']`, `registers: [register]`, middleware destructures `req` and calls `.inc({ method, route: path })`; `_res` unused so prefixed with underscore
- Custom registry (`new Registry()`) used instead of global default; `collectDefaultMetrics` scoped to it; `/metrics` route serves from it
- Latency histogram: not started — explain histogram concept (buckets, _sum, _count, _bucket) before user implements
- Redis connection gauge: not started — explain gauge concept (up/down value, not cumulative) before user implements
- Next: latency histogram first

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
