FROM node

WORKDIR /app
COPY . . 
RUN npm install 
CMD ["npm", "run", "start"]
ENV PORT=8080