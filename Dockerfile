FROM node:20 AS build
WORKDIR /app
RUN npm install -g npm@11
COPY package*.json ./
RUN npm install --no-audit --no-fund --loglevel=verbose
COPY . .
RUN npx ng build

FROM node:20-slim
WORKDIR /app
COPY --from=build /app/dist ./dist
EXPOSE 4000
CMD ["node", "dist/calisthenics-coach-ui/server/server.mjs"]
