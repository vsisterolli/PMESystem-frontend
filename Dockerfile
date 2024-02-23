FROM node
WORKDIR /usr/src
COPY . .
EXPOSE 3000
RUN npm i
RUN npm run build
CMD [ "npm", "start" ]