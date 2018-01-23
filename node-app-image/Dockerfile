FROM node-base-image

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

ENTRYPOINT [ "npm" ]

CMD [ "start" ]
