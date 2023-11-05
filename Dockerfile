FROM node:20.4

WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY nodemon.json ./

# If building code for production
# RUN npm ci --only=production
# RUN npm install --only=production

# If building code for development
RUN npm install