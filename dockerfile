# Usa Node.js 20 como base para construir la aplicación
FROM node:20 AS build

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo de dependencias y el archivo de lock
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Construye la aplicación para producción usando Vite
RUN npm run build

# Usa una imagen de Nginx para servir la aplicación en producción
FROM nginx:alpine

# Copia el build de Vite (dist) al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia el archivo de configuración personalizado de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expón el puerto 3001
EXPOSE 3001

# Comando de inicio de Nginx
CMD ["nginx", "-g", "daemon off;"]