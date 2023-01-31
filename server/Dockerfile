FROM node:16-alpine
WORKDIR /app
COPY . .
RUN yarn install --production
CMD ["node", "build/index.js"]
EXPOSE 4000