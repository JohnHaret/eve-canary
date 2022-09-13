dep-up:
	docker network create dev \
	&& docker-compose -f .docker/docker-compose.yaml up -d

dep-down:
	docker-compose -f .docker/docker-compose.yaml down -v \
	&& docker network rm dev