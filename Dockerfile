# Use a minimal Ubuntu base image
FROM ubuntu:20.04

# Update packages and install necessary tools
RUN apt-get update && \
    apt-get install -y \
    curl \
    gnupg \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
RUN apt-get install -y nodejs

# Install g++
RUN apt-get update && \
    apt-get install -y g++

# Install Python
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    ln -s /usr/bin/python3 /usr/bin/python

WORKDIR /src
COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

RUN npm run build

CMD [ "npm", "start" ]
