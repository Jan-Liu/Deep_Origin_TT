# Use an official Node.js image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker's cache
COPY package.json package-lock.json ./

# Install dependencies (including TypeScript for compilation)
RUN npm install --legacy-peer-deps

# Copy all source files into the container
COPY . .

# Ensure files have been copied (for debugging)
RUN ls -la /app && ls -la /app/src

# Force TypeScript to compile
RUN npm run build

# Expose the application port
EXPOSE 5000

# Start the backend
CMD ["npm", "start"]
