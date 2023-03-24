FROM node:18

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]
COPY ./ ./

RUN npm install

EXPOSE 3000

CMD ["node", "server.js"]