FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

ARG SUPABASE_URL
ARG SUPABASE_KEY
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_KEY=${SUPABASE_KEY}

RUN npm run build && npm prune --production

FROM node:20-alpine as runtime

WORKDIR /app
USER node:node
COPY --from=build --chown=node:node /app/build ./build
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/package.json ./package.json

EXPOSE 3000
ENTRYPOINT [ "node", "build" ]
