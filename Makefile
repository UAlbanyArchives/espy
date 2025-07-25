# Makefile for Dockerized Rails App

# Build production image with secret master.key
build:
	DOCKER_BUILDKIT=1 docker build \
	  --secret id=master_key,src=config/master.key \
	  -t espy .

build-nocache:
	DOCKER_BUILDKIT=1 docker build \
	  --no-cache \
	  --secret id=master_key,src=config/master.key \
	  -t espy .

# Restart dev containers (stop and start)
restart:
	docker compose down
	docker compose -f docker-compose-prod.yml up -d
