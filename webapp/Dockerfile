FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN rm -rf node_modules
RUN rm -rf build
COPY . .

ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_KEY
ARG SERVICE_ROLE_KEY
ARG TMDB_SECRET_API_KEY

ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_KEY=${VITE_SUPABASE_KEY}
ENV SERVICE_ROLE_KEY=${SERVICE_ROLE_KEY}
ENV TMDB_SECRET_API_KEY=${TMDB_SECRET_API_KEY}

RUN npm install
RUN npm run build

FROM node:20-alpine as runtime

WORKDIR /app
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/build ./build
RUN npm install --production

EXPOSE 3000
ENTRYPOINT [ "npm", "run", "start" ]
