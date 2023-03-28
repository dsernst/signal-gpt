# DEV: Doesn't copy code, so we can bind mount it for hot-reloads
#    - Built & run w/ `yarn dev`
FROM node:18-alpine as dev

# Install dependencies: signal-cli (needs testing repository), dbus
RUN echo "https://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories
RUN apk update
RUN apk add --no-cache signal-cli
RUN apk add --no-cache dbus-x11

# Switch to less privileged user
USER node

WORKDIR /_BOT/signal-gpt

# Start the DBus daemon in the background, storing its new env vars, then start the app
CMD sh -c 'eval $(dbus-launch --sh-syntax) && yarn start'





## Prod envirorment

FROM node:18-alpine

# Install dependencies: signal-cli (needs testing repository), dbus
RUN echo "https://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories
RUN apk update
RUN apk add --no-cache signal-cli
RUN apk add --no-cache dbus-x11

# Copy rest of application code
COPY . ./_BOT/signal-gpt
WORKDIR /_BOT/signal-gpt

# Switch to less privileged user
USER node

# Install node dependencies
RUN yarn install --production

# Start the app
CMD sh -c 'eval $(dbus-launch --sh-syntax) && yarn start'
