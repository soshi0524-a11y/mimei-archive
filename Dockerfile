FROM node:22-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY preview-server.mjs ./

ENV HOST=0.0.0.0
EXPOSE 3000

CMD ["npm", "start"]
