FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
COPY . .

ARG SUPABASE_URL
ARG SUPABASE_KEY
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_KEY=${SUPABASE_KEY}

RUN npm install
RUN npm run build

FROM node:20-alpine as runtime

WORKDIR /app
USER node:node
COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/build ./build
RUN npm install --production

EXPOSE 3000
ENTRYPOINT [ "node", "build" ]
