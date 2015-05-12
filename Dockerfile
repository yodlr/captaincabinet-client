FROM hub.getyodlr.com/nodejs-yodlr
MAINTAINER Ross Kukulinski "ross@getyodlr.com"

WORKDIR /src

# Install app dependencies
ADD package.json /src/package.json
RUN npm install

ADD . /src/

RUN rm /root/.ssh/id_rsa

# environment
CMD ["/usr/bin/npm", "test"]
