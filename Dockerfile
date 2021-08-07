###############################################################################
# Location where our code is contained in the container
###############################################################################
ARG APP_DIR=/opt/app
###############################################################################

###############################################################################
# DEBUG configuration
###############################################################################
ARG DEBUG=
###############################################################################

###############################################################################
# NODE_ENV configuration
###############################################################################
ARG NODE_ENV=production
###############################################################################

FROM node:15-alpine as base

ARG APP_DIR
ARG DEBUG
ARG NODE_ENV

ENV APP_DIR=${APP_DIR}
ENV DEBUG=${DEBUG}
ENV NODE_ENV=${NODE_ENV}
# ENV NEW_RELIC_DISTRIBUTED_TRACING_ENABLED=true

# App port
EXPOSE 80

WORKDIR ${APP_DIR}

FROM base as build

COPY ./ecosystem.config.js  ${APP_DIR}/ecosystem.config.js
COPY ./package-lock.json    ${APP_DIR}/package-lock.json
COPY ./package.json         ${APP_DIR}/package.json

RUN echo "Building ${NODE_ENV}..."

FROM build as development

ONBUILD RUN npm install --no-optional --force
ONBUILD COPY . ${APP_DIR}/

FROM build as production

ONBUILD RUN apk add --update \
  python \
  python-dev \
  py-pip \
  && rm -rf /var/cache/apk/*
ONBUILD RUN VP_ARTIFACTORY_TOKEN=${VP_ARTIFACTORY_TOKEN} npm ci

ONBUILD COPY ./config       ${APP_DIR}/config
ONBUILD COPY ./dist         ${APP_DIR}/dist

FROM ${NODE_ENV}

CMD ["npx", "pm2-runtime", "ecosystem.config.js"]
