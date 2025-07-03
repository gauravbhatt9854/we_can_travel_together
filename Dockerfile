# Step 1: Use official Node.js image as base
FROM node

# Step 2: Set working directory inside the container
WORKDIR /app

COPY . .
# Step 3: Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install 
# Step 7: Expose the default port
EXPOSE 3000
# Step 8: Run the Next.js app
CMD ["npm","run", "dev"]