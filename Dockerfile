FROM node:latest
RUN apt-get update && \
    apt-get install -y g++ && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /src
COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build

CMD [ "yarn","start" ]