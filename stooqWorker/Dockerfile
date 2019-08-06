FROM node:10
RUN apt-get update && apt-get install -y netcat
RUN npm install -g nodemon
WORKDIR /app/stooqApi
COPY . .

RUN npm install