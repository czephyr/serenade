FROM node:latest

WORKDIR /src

COPY ./src/package*.json ./

RUN npm install
# RUN npm ci --include=dev

COPY ./src .

# RUN npm run build

EXPOSE 80

# ENTRYPOINT ["npm", "start"]
ENTRYPOINT ["npm", "run", "dev"]
CMD ["--", "--port", "80"]