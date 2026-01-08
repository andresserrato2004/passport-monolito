From node:18

WORKDIR /app

# Dockerfile
FROM node:18

# Crear directorio de trabajo
WORKDIR /app

# Copiar dependencias
COPY package*.json ./
RUN npm install

# Copiar código fuente
COPY . .

# Compilar Prisma Client
RUN npx prisma generate

# Exponer puerto
EXPOSE 4000

# Comando para correr la app
CMD ["npm", "run", "dev"]
