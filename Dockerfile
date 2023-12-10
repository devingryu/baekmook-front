# Stage 1: Install dependencies
FROM 20.10-alpine3.17 as deps
WORKDIR /app

ADD package.json yarn.lock ./
RUN yarn install

# Stage 2: Build app
FROM 20.10-alpine3.17 as build
WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
ADD package.json yarn.lock ./

ADD . .
RUN yarn run build

# Stage 3: Run app
FROM 20.10-alpine3.17

# "609df9123d0d4c756031052925e70155a5102c26c5c59210aba9b48ddf2589c6"
ENV PORT="1559" \
    API_URL="http://localhost:1557" \
    SESSION_SECRET= 

WORKDIR /app

COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public

CMD ["yarn", "start"]