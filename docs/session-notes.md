# Session Notes

## Where we left off

Completed Phases 1-6. Up next: Phase 7 (Observability) — stretch goal.

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
