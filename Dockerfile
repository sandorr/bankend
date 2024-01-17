FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn build
CMD ["node", "dist/src/main.js"]
