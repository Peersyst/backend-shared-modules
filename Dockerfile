FROM node:20 as install
ARG NPM_TOKEN
ENV NPM_TOKEN ${NPM_TOKEN}

WORKDIR /app
COPY . .
RUN npm install

FROM install as build
RUN npm run prebuild
RUN npm run build

FROM build as test
RUN npm run lint

FROM test as publish
RUN npx lerna publish --yes from-package
