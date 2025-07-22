FROM node:20.11-slim
WORKDIR /usr/app
COPY yarn.lock  package.json ./
RUN yarn install
COPY . .
RUN yarn build
CMD [ "node", ".output/server/index.mjs" ]