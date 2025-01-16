FROM node:23-alpine

WORKDIR /app

COPY . .

RUN npm i -g serve

RUN ./build.sh

EXPOSE 3030

CMD [ "serve", "-s", "dist" ]
