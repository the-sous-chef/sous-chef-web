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

FROM base as build

RUN apk update && apk upgrade

COPY ./package-lock.json        ${APP_DIR}/package-lock.json
COPY ./package.json             ${APP_DIR}/package.json
COPY ./etc/dev.sh               ${APP_DIR}/dev.sh
COPY ./etc/install-esbuild.sh   ${APP_DIR}/install-esbuild.sh 

RUN npm ci --force --ignore-scripts

RUN echo "Building ${NODE_ENV}..."

FROM base as development

ONBUILD COPY .                  ${APP_DIR}/

FROM base as production

ONBUILD COPY ./dist             ${APP_DIR}/dist

FROM ${NODE_ENV}

WORKDIR ${APP_DIR}

COPY --from=build ${APP_DIR}/ ${APP_DIR}/

CMD ["node", "--max-old-space=4096", "./dist/server.js"]
