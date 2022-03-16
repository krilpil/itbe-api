FROM node:lts-slim
WORKDIR /itbe-api
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT 443
EXPOSE $PORT
CMD ["node", "main.js"]