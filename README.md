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
