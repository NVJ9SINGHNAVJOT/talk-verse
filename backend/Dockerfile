# Dockerfile
FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
RUN npm install

# Copy the rest of your application code
COPY . .

# Build your TypeScript code
RUN npm run build

# Start your application (adjust the command as needed)
CMD ["npm", "run", "start"]
