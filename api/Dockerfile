FROM node:12
RUN mkdir -p /app
WORKDIR /app
VOLUME /schema
COPY package.json .
RUN npm install
COPY . .

EXPOSE 4000

CMD ["npm", "start"]