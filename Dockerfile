FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Install prerequisites
RUN apk add git
# The following line ensures that the latest GitHub repo is copied and not cached
RUN wget -P /usr/src "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h"
# Pull app from GitHub
RUN git clone https://github.com/tomcollis/PrinterRelay.git .

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
## COPY . .

EXPOSE 80
CMD [ "node", "index.js" ]
