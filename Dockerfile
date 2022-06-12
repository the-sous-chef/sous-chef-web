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

FROM node:18-alpine as base

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

FROM node:18-alpine as build

RUN apk add --update \
  python \
  python-dev \
  py-pip \
  && rm -rf /var/cache/apk/*

COPY ./package-lock.json    ${APP_DIR}/package-lock.json
COPY ./package.json         ${APP_DIR}/package.json

RUN npm ci

RUN echo "Building ${NODE_ENV}..."

FROM base as development

ONBUILD COPY . ${APP_DIR}/

FROM base as production

ONBUILD COPY ./dist         ${APP_DIR}/dist

FROM ${NODE_ENV}

COPY --from=build ${APP_DIR} .

CMD ["node", "--max-old-space=4096", "./dist/server.js"]
