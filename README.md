## Mandatory things before workshop

1. Having a linux (ubuntu is advised) with docker last version installed (for Windows or MacOS, you can use Virtual Box running Ubuntu)
2. Having done a first `docker pull ubuntu` to see if everything is working

## Step 1 - Run and create your first image using Alpine base image

Important links:
- https://docs.docker.com/engine/reference/run/
- https://docs.docker.com/engine/reference/commandline/commit/

1. Do `docker pull alpine && docker images` and compare size with Ubuntu image
2. Do `docker inspect alpine` and see the GraphDriver section. The name is the storage driver for Copy On Write capabilities your are using. Look at the file inside the UpperDir inside your system (surely needing root access)
3. Run Alpine container with sh in interactive mode with `run` command
4. inside the container add NodeJS (`apk add nodejs`), test it (`node -v`) and exit
5. Use `ps` command to see the stopped but not removed container (what happen if you remove it ?)
6. Commit this container as an image with a funny name with `commit` command. Look at the size of the images.
7. Run this new image in same interactive mode to see that node is always there
8. Inspect the new image and find what is the diff from the base image

You now understand the importance of small base image and have a glimpse on how image layering works (the next time you use Alpine in a Docker image it will not be downloaded again).

## Step 2 - Build a real Docker image and run do some interesting stuff

Important links:
- https://docs.docker.com/engine/reference/builder/
- https://docs.docker.com/engine/reference/commandline/build/
- https://docs.docker.com/engine/reference/run/


1. Now build the same previous image with DSL by completing the Dockerfile present in the `\node-base-image` dir 
2. Define a work directory like `/build` : is this dir already in your system ? how to create it ? more important why defining a work directory for your image ?
3. Setup PATH to prioritize local npm bin ahead of system PATH (in shell, you could do `export PATH=node_modules/.bin:$PATH` .. but how to make it present in running container ?)
4. Add a final command to make `npm install` run as soon as the container start and exit as soon as it's finished
5. Build this image and tag it with the `build` command
6. test this image with : `docker run -v "$(pwd):/build" xxxx` (xxxx is the name you gave to the image) in the `\hello-world` node app dir
7. What is this -v arg ? Why do we need it ?
8. Can you run the node app directly in your host ? try adding `node server.js` at the end of the `docker run` cmd
9. Your terminal is now blocked so how to stop the container ? Can you look inside the running container (by running a sh inside it with `exec` or `attach` to it). Run a `ps` command and look at the process running inside your container. (hey PID = 1 how is it possible ? https://en.wikipedia.org/wiki/Process_identifier)
10. Stopping the container, you should see `stopping application after SIGTERM` What is it ? Why is it very important to correctly handle sigterm ?
11. Look at the stopped container, how to automatically remove the container when it exits (btw there should be other stopped containers ... how to remove them in one command ?)
12. how to run the container in a non blocking mode (aka detached)
13. The node server is running on your system. What happens when you do `curl http://localhost:9090`
14. Go inside your container. Test the curl command. 
15. So how to make this server accessible ? Look at exposing port on your host system when running the container (look at the port of `docker ps`)
16. When you run in detached mode, you can't see what is happening inside the container luckily you have `docker logs`

Wow you now have a container that can build any node project, it can even run your application. And you know one of most important network feature of docker which is exposing port from the container into the system.

## Step 3 - Build node app generic image - the generic level

Important links:
- https://docs.docker.com/engine/reference/builder/

The goal is to make hello-world node application (directory of the same name) run as a container with only one line FROM in the Dockerfile. The idea is to have a generic image you could use to build many other node applications.

1. Manage that the running container has a new user group (name app & id 1000) with `addgroup` shell cmd & a new user (name app & id 1000)  with `adduser` shell cmd. If it's too complicated, try this in a simple Alpine running container.
2. Make the container use this user (you don't really want the container to run as ROOT) and the created home directory as WORKDIR
3. The most important step : you have to put your node app files inside your container & install node modules ... but not when building this generic image but when building the child image (look at `ONBUILD`)
4. Expose the correct port
5. Use a combination of ENTRYPOINT & CMD to make the container running only as node with server.js as the default parameter 
6. You can now use this image as a base image for any node app (like the hello world)
7. Stop a running node app container. Do you see `stopping application after SIGTERM` at the end ?

You now have a generic secure base image. You could experiment by taking into account that only the "installation" of node app files and directly running the node app are necessary.

## Step 4 - running a stack

Important links:
- https://docs.docker.com/compose/compose-file/
- https://docs.docker.com/compose/reference/overview/

The goal is to make a stack containing an ElasticSearch backend and a very basic CRUD ExpressJS application running in a container thanks the generic image you have build before.

You can run `docker run --rm -d -p 9200:9200 -p 9300:9300 blacktop/elasticsearch:6.1` to test this splendid ES image

1. define a compose file with two services : the app and the elasticsearch backend
2. the app image will be builded directly inside the app directory (thanks to the previous steps)
3. the ElasticSearch backend using blacktop/elasticsearch:6.1 image
4. you can try to build and run your whole stack with the `docker-compose` cmd but at this point it will surely not work as expected
5. Use the ES_HOST env variable to link your app to the running ES container and a custom network. You can look at the list of networks with `docker network` and inspect the one you have created. Look without and with the stack running.
6. A very sad thing is that docker compose doesn't handle the synchronization of your containers. So your node app can start running before the ES container and provoke an error. To handle this you can use [`dockerize`](https://github.com/jwilder/dockerize) and overload your entrypoint. You needs to add this to your Alpine base image. Of course you can change the app to wait for ES to be available.
7. Use a volume for not loosing the `/usr/share/elasticsearch/data` directory and link it to a directory inside your host

And finally, you have a docker stack ! You can run your whole many microservices with one file and some commands (or not).
The important parts of this steps are the compose file, the cmd line and the network part. You can look at the very good tutorials [here](https://docs.docker.com/network/#docker-ee-networking-features)


Interesting articles around Docker:
- https://docs.docker.com/storage/storagedriver/
- https://learnk8s.io/blog/smaller-docker-images
- https://donagh.io/docker-startup-order/
- https://medium.com/@gchudnov/trapping-signals-in-docker-containers-7a57fdda7d86

Harcore video:
- https://www.youtube.com/watch?v=sK5i-N34im8&t=5s
- https://www.youtube.com/watch?v=9oh_M11-foU



