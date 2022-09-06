FROM node:16.17-alpine3.15 as build

WORKDIR /app
COPY package.json ./
RUN yarn install

COPY src ./src

FROM node:16.17-alpine3.15
USER node
WORKDIR /app
COPY --chown=node:node --from=build /app/node_modules/ ./node_modules/
COPY --chown=node:node --from=build /app/package.json ./
COPY --chown=node:node --from=build /app/src ./src
COPY --chown=node:node .env.docker ./.env


CMD ["yarn","start:dev"]