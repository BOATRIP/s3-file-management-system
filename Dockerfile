FROM node:12.13.0

RUN mkdir -p /cti-management-system
RUN chown -R node:node /cti-management-system
ENV HOME /cti-management-system
USER node
WORKDIR $HOME

# Setup project
ADD package.json /cti-management-system/package.json
#RUN npm install --production --no-progress && npm cache verify
RUN npm install --no-progress && npm cache verify

# Copy source files
ADD shared /cti-management-system/shared
ADD config /cti-management-system/config
ADD app.js /cti-management-system/app.js
ADD controllers /cti-management-system/controllers
ADD fittings /cti-management-system/fittings
ADD swagger /cti-management-system/swagger
ADD public /cti-management-system/public
ADD test /cti-management-system/test

EXPOSE 3000
USER root
CMD npm start