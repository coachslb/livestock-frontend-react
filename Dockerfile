# Stage 1 - the build process
FROM node:8 as build-deps
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . ./
RUN yarn build

RUN yarn global add serve

EXPOSE 5000

CMD serve -s build



