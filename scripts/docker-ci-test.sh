#!/usr/bin/env bash
set -eux

dci() {
	docker-compose -f docker-compose.yml -f docker-compose.test.yml "$@"
}
export -f dci

dcie() {
	dci exec -T "$@"
}
export -f dcie

echo "Starting system..."
dci up -d

echo "Installing rahat server dependencies..."
dcie rahat_server yarn install --frozen-lockfile --no-progress

echo "Running rahat server tests..."
dcie rahat_server yarn coverage

echo "Installing rahat agency dependencies..."
dcie rahat_agency yarn install --frozen-lockfile --no-progress

echo "Running rahat agency tests..."
dcie rahat_agency yarn test

echo "Creating rahat agency production build..."
dcie rahat_agency yarn build

# echo "Running client production build..."
# dcie client npm run build
echo "Done"
