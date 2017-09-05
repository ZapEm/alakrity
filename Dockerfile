FROM node:7-alpine

ENV APPDIR /usr/src/app

# Create app directory
RUN mkdir -p $APPDIR

WORKDIR $APPDIR

# Install app dependencies
COPY package.json $APPDIR
RUN npm -q install

# Bundle app source
COPY . $APPDIR
# ???
# RUN chown -R alakrity:alakrity $APPDIR && chmod -R a-w $APPDIR && ls -ld

# USER alakrity

# Certs
RUN mkdir -p /etc/certs/prod /etc/certs/staging
VOLUME /etc/certs

# USER alakrity

# Build app from source
RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]