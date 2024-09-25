# Use an official Node.js image as a base
FROM node:20-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package*.json files to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install --production

# Copy the application code to the working directory
COPY . .

# Build the application for production
RUN npm run build

# Expose the port
EXPOSE 8000

# Run the command to start the production server
CMD ["npm", "start"]
