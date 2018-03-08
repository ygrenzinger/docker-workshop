FROM node-base-image

ENV DOCKERIZE_VERSION v0.6.0
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

ARG USER=app

RUN addgroup -g 1000 ${USER} && \
    adduser -D -u 1000 -G ${USER} ${USER}

# Create app directory
USER ${USER}
WORKDIR /home/${USER}

ONBUILD COPY . .
ONBUILD RUN npm install

EXPOSE 9090

ENTRYPOINT [ "node" ]
CMD [ "server.js" ]
