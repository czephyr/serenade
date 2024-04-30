FROM node:22.0.0

WORKDIR /src

COPY ./src/package*.json ./

RUN npm ci --include=dev

COPY ./src .

RUN npm run build

EXPOSE 80

ENTRYPOINT ["npm", "start"]
# ENTRYPOINT ["npm", "run", "dev"]
CMD ["--", "--port", "80"]