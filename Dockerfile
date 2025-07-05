FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# 🔧 Build the app
RUN npm run build

# ✅ Now you can use `next start`
EXPOSE 3000
CMD ["npm", "start"]