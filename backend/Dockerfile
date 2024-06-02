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

# Expose the port your app will listen on
EXPOSE 5000

# Start your application
CMD ["npm", "run", "start"]
