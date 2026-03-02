FROM node:18

WORKDIR /usr/src/app

# Copy package manifests first to leverage docker cache
COPY package*.json ./

# Install dependencies (including devDependencies for nodemon in dev)
RUN npm ci

# Copy the rest of the app
COPY . .

EXPOSE 4000

CMD ["npm", "run", "dev"]
