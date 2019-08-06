FROM node:10
RUN curl -o- -L https://yarnpkg.com/install.sh | bash
RUN npm install -g nodemon
WORKDIR /app/server
COPY . .

RUN npm install