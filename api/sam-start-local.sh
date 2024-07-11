# export DOCKER_HOST="unix:///${HOME}/.docker/desktop/docker.sock"
export DOCKER_HOST="unix:///${HOME}/.docker/run/docker.sock"
sam local start-api \
-p 8080 \
--env-vars env.json \
# --docker-network localhost-network \
--container-host host.docker.internal \
--warm-containers EAGER
