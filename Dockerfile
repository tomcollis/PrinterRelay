FROM node:17-alpine

# Create app directory
WORKDIR /usr/src/app

# Install prerequisites
RUN apk add git
RUN git clone https://github.com/tomcollis/PrinterRelay.git

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "index.js" ]
