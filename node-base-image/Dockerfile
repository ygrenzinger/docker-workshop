FROM alpine

RUN apk update && apk add nodejs

RUN mkdir /build
WORKDIR /build

# Setup PATH to prioritize local npm bin ahead of system PATH.
# ENV PATH node_modules/.bin:$PATH

CMD ["npm", "install"]
