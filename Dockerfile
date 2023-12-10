# Stage 1: Install dependencies
FROM node:20.10-alpine3.17 as deps
WORKDIR /app

ADD package.json yarn.lock ./
RUN yarn install

# Stage 2: Build app
FROM node:20.10-alpine3.17 as build
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
ADD package.json yarn.lock ./

ADD . .
RUN yarn run build

# Stage 3: Run app
FROM node:20.10-alpine3.17

ENV PORT="1559" \
    API_URL="http://host.docker.internal:1557" \
    SESSION_SECRET= 

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
ADD package.json yarn.lock ./

CMD ["yarn", "start"]