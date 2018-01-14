FROM node:8.9.4

# Create app directory
RUN mkdir -p /opt/checkforteamupdates
RUN mkdir -p /opt/checkforteamupdates/src
WORKDIR /opt/checkforteamupdates

# Copy in application specific files
COPY *.* /opt/checkforteamupdates/
COPY src/*.* /opt/checkforteamupdates/src/

# Install node modules
RUN npm install

CMD [ "npm", "start" ]
