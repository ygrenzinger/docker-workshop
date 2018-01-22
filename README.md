## Mandotory things before workshop

1. Having a linux (ubuntu is advised) with docker last version installed (using Virtual Box running Ubuntu for example)
2. Having done a first `docker pull ubuntu` to see if everything is working

## Step 1 - Run and create your first image using Alpine base image

Important links:
https://docs.docker.com/engine/reference/run/
https://docs.docker.com/engine/reference/commandline/commit/

1. Do `docker pull alpine && docker images` and compare size with Ubuntu image
2. Do `docker inspect alpine` and see the GraphDriver section. The name is the storage driver for Copy On Write capabilities your are using. Look at the file inside the UpperDir inside your system (surely needing root access)
3. Run Alpine container with sh in interactive mode with `docker run`
4. inside the container install node (`apk add nodejs`) and exit
5. Do `docker ps -a` to see the stopped but not removed container (why happen if you remove it ?)
6. Commit this container as an image with nodejs (you should give it a name ...) with `docker commit`
7. Run this new image in same interactive mode to see that node is always there
8. Inspect the new image and find what is the diff from the base image

You now understand the importance of small base image and have a glimpse on how image layering works (the next time you use Alpine in a Docker image it will not be downloaded again).

## Step 2 - Build a real Docker image and run do some interesting stuff

Important links:
https://docs.docker.com/engine/reference/builder/
https://docs.docker.com/engine/reference/commandline/build/
https://docs.docker.com/engine/reference/run/


1. Now build the same previous image with DSL by completing the Dockerfile present in node-image dir 
2. Define a work directory like `/build` : is this dir already in your system ? how to create it ? more important why defining a work directory for your image ?
3. Setup PATH to prioritize local npm bin ahead of system PATH (in shell, you could do `export PATH=node_modules/.bin:$PATH` .. but how to make it present in running container ?)
4. Add a final command to make `npm install` run as soon as the container start and exit as soon as it's finished
5. Build this image and tag it with `docker build`
6. test this image with : `docker run -v "$(pwd):/build"` in the hello-world node app dir
7. What is this -v arg ? Why do we need it ?
8. Can you run the node app directly in your host ? try adding `node server.js` at the end of the docker run cmd (hey PID = 1 how is it possible ? https://en.wikipedia.org/wiki/Process_identifier)
9. Your terminal is now blocked so how to stop the container ?
10. Stopping the container, you should see `stopping application after SIGTERM` What is it ? Why is it very important to correctly handle sigterm ?
10. After stopping it, type : docker ps -a … hum there is a stopped container there, how to automatically remove the container when it exits (btw there should be other stopped container ... how to remove them in one command ?)
11. how to run the container in a non blocking mode (aka detached)
12. The node server is running on your system. What happens when you do `curl http://localhost:9090`
13. Go inside your container by executing shell on it with `docker exec`. Test the curl command. 
14. So how to make this server accessible ? Look at exposing port on your host system when running the container (look at the port of `docker ps`)
15. When you run in detached mode, you can't see what is happening inside the container luckily you have `docker logs`

Wow you now have a container that can build any node project, it can even run your application. And you know one of most important network feature of docker which is exposing port from the container into the system.

## Step 3 - Build node app generic image - the generic level

The goal is to make hello-world run as a container with only one FROM in the Dockerfile. The idea is to have a generic image you could use to build many other node applications.

1. Manage that the running container has a new user group (name app & id 1000) with addgroup shell cmd & a new user (name app & id 1000)  with adduser shell cmd. If it's complicated, try this in a simple Alpine container.
2. Make the container use this user and the created home directory (you don't really want the container to run as ROOT)
3. The most important step : you have to put your node app files inside your container & install node modules.
4. Expose the correct port
5. Use a combination of ENTRYPOINT & CMD to make the container running only as npm executable with start as the default parameter 
6. You can now use this image as a base image for any node app
7. Stop a running node app container. Do you see `stopping application after SIGTERM` at the end ? If you connect to a running container, you should look at the processes :)

You now have a generic secure base image. You could experiment by taking into account that only the "installation" of node app files and directly running the node app are necessary.

  