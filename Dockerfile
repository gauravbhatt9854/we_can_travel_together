# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the project
COPY . .

# Expose port used by Next.js
EXPOSE 3000

# Start the dev server (change to "npm start" for production)
CMD ["npm", "start"]
