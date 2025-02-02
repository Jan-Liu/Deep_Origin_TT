# Use an official Node.js image
FROM node:18

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application
COPY . .

# Build TypeScript files
RUN npm run build

# Expose the port
EXPOSE 5000

# Start the backend
CMD ["node", "dist/server.js"]
