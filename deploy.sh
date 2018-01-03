#!/bin/bash
set -eo pipefail

# Mix outputs warnings to STDOUT, so we need to only keep the last line (see lpil/exfmt#53 for related discussion)
PROJECT_VERSION=`docker-compose run --rm app mix run --no-compile --no-start -e 'IO.write Mix.Project.config[:version]' | tail -n 1`

if [ "$TRAVIS_TAG" = "" ]; then
  REV=`git rev-parse --short HEAD`
  VERSION="$PROJECT_VERSION-dev-$REV (build $TRAVIS_BUILD_NUMBER)"
  case $TRAVIS_BRANCH in
    master)
      DOCKER_TAG="dev"
      ;;

    debug-production)
      DOCKER_TAG="debug"
      ;;

    release/*)
      DOCKER_TAG="$PROJECT_VERSION-dev"
      ;;

    stable)
      echo "Pulling $PROJECT_VERSION and tagging as latest"
      docker login -u ${DOCKER_USER} -p ${DOCKER_PASS} ${DOCKER_REGISTRY}
      docker pull ${DOCKER_REPOSITORY}:${PROJECT_VERSION}
      docker tag ${DOCKER_REPOSITORY}:${PROJECT_VERSION} ${DOCKER_REPOSITORY}:latest
      docker push ${DOCKER_REPOSITORY}:latest
      exit 0
      ;;

    *)
      exit 0
      ;;
  esac
else
  TAG_VERSION="${TRAVIS_TAG/-*/}"
  if [ "$PROJECT_VERSION" != "$TAG_VERSION" ]; then
    echo "Project version and tag differs: $PROJECT_VERSION != $TRAVIS_TAG"
    exit 1
  fi

  VERSION="$TRAVIS_TAG (build $TRAVIS_BUILD_NUMBER)"
  DOCKER_TAG="$TRAVIS_TAG"

  if [ "$TAG_VERSION" = "$TRAVIS_TAG" ]; then
    EXTRA_DOCKER_TAG="${TRAVIS_TAG%.*}"
  fi
fi

echo "Version: $VERSION"
echo $VERSION > VERSION

# Build assets
docker-compose run --rm webpack yarn deploy

# Build and push Docker image
echo "Docker tag: $DOCKER_TAG"
docker build -t ${DOCKER_REPOSITORY}:${DOCKER_TAG} .
docker login -u ${DOCKER_USER} -p ${DOCKER_PASS} ${DOCKER_REGISTRY}
docker push ${DOCKER_REPOSITORY}:${DOCKER_TAG}

# Push extra image on exact tags
if [ "$EXTRA_DOCKER_TAG" != "" ]; then
  echo "Pushing also as $EXTRA_DOCKER_TAG"
  docker tag ${DOCKER_REPOSITORY}:${DOCKER_TAG} ${DOCKER_REPOSITORY}:${EXTRA_DOCKER_TAG}
  docker push ${DOCKER_REPOSITORY}:${EXTRA_DOCKER_TAG}
fi
