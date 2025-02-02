# Use an official Node.js image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json before installing dependencies
COPY package.json package-lock.json ./

# Install dependencies (including devDependencies for TypeScript)
RUN npm install --legacy-peer-deps

# Copy all project files
COPY . .

# Build TypeScript files
RUN npm run build

# Expose the port
EXPOSE 5000

# Start the backend
CMD ["node", "dist/server.js"]
