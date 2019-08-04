FROM node:10
RUN apt-get update && apt-get install -y netcat
RUN curl -o- -L https://yarnpkg.com/install.sh | bash
RUN npm install -g nodemon
WORKDIR /app/server
COPY . .

RUN npm install