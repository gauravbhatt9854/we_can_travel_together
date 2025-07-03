# Step 1: Use official Node.js image as base
FROM node

# Step 2: Set working directory inside the container
WORKDIR /app

# Step 3: Copy only package.json and package-lock.json for layer caching
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Expose the default Next.js port
EXPOSE 3000

# Step 7: Start Next.js in dev mode
CMD ["npm", "run", "dev"]
