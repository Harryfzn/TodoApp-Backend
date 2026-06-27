#use an official node.js runtime as a parent image
FROM node:22-alpine

# set working directory (menentukan directory doc)
WORKDIR /app

# copy package.json and the package-lock.json (copy semua package json)
COPY package*.json .

# install the dependecies (menginstall dependencies (yang ada pada package.json))
RUN npm install

# copy the rest of the application  (copy semua code)
COPY . .

# expose the part that app runs on ()
EXPOSE 5003

# define command

CMD [ "node", "./src/server.js" ]