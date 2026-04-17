# Imagen base
FROM node:18

# Carpeta de trabajo
WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el proyecto
COPY . .

# Puerto
EXPOSE 3001

# Comando de arranque
CMD ["node", "index.js"]