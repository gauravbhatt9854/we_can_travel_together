FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ✅ Now you can use `next start`
EXPOSE 3000
CMD ["npm", "run" , "dev"]