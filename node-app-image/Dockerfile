FROM node-base-image

ENV DOCKERIZE_VERSION v0.6.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

ARG PGID=1000
ARG PUID=1000

RUN addgroup -g ${PGID} app && \
    adduser -D -u ${PUID} -G app app

# Create app directory
USER app
WORKDIR /home/app

ONBUILD COPY package*.json ./
ONBUILD RUN npm install
ONBUILD COPY . .

EXPOSE 9090

ENTRYPOINT [ "node",  ]
CMD [ "server.js" ]
