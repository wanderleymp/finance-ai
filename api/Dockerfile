# Usar uma imagem base do Node.js
FROM node:20

# Definir o diretório de trabalho
WORKDIR /usr/src/app

# Copiar os arquivos do projeto
COPY package*.json ./
COPY prisma ./prisma
RUN npm install
COPY . .

# Expor a porta que o app vai usar
EXPOSE 3000

# Comando para iniciar o app
CMD ["npm", "run", "start:prod"]
