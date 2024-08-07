FROM node:20-alpine as build

WORKDIR /app

COPY package*.json ./
RUN rm -rf node_modules
RUN rm -rf build
COPY . .

ARG SUPABASE_URL
ARG SUPABASE_KEY
ENV SUPABASE_URL=${SUPABASE_URL}
ENV SUPABASE_KEY=${SUPABASE_KEY}

RUN npm install
RUN npm run build

FROM node:20-alpine as runtime

WORKDIR /app
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/build ./build
RUN npm install --production

EXPOSE 3000
ENTRYPOINT [ "npm", "run", "start" ]
