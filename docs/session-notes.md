# Session Notes

## Where we left off

Completed Phases 1-5 fully. Up next: Phase 6 (CI/CD Pipeline).

### Phase 6 starting point
- User has prior GitHub Actions experience
- **Next step:** push project to GitHub, then set up a GitHub Actions workflow to build and push the Docker image, then automate deployment to the cluster

### Key context
- minikube is the local K8s cluster
- Images must be built inside minikube's Docker env: `eval $(minikube docker-env)` then `docker build -t kubecounted .`
- `imagePullPolicy: Never` is set in `app-deployment.yaml` so K8s uses the local image — **this will need to change in Phase 6** when images are pushed to a real registry (e.g. Docker Hub or GHCR)
- Redis URL is passed via ConfigMap (`k8s/configmap.yaml`) as `REDIS_URL=redis://redis:6379`
- App has readiness and liveness probes on `GET /health`
- App Service is type `NodePort`
