FROM node:20-alpine

# Instalamos dependencias de sistema necesarias (incluyendo GIT y librerías de compatibilidad)
RUN apk add --no-cache libc6-compat git

WORKDIR /app

# Copiamos archivos de configuración
COPY package*.json ./

# Instalamos las librerías base de v0 de una vez
RUN npm install lucide-react clsx tailwind-merge @radix-ui/react-scroll-area

# Instalamos el resto de dependencias del package.json
RUN npm install

# Copiamos el código
COPY . .

EXPOSE 3000

# Comando para arrancar Next.js
CMD ["npx", "next", "dev", "-H", "0.0.0.0"]