const express = require("express")
const dotenv = require ("dotenv")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const database = require("./config/database.js")
const router = require("./src/routes/userRoutes.js")
dotenv.config();

const init = async() => {
  try {
    await database.authenticate();
    console.log('Database Successfully Connected');
  } catch (error) {
    console.error('Unable to connect', error);
    
  }

  const server = express();
  const port =  3000;

  server.use(cors({credential: true, origin:'http://localhost:3000'}));
  server.use(cookieParser())
  server.use(express.json());
  server.use(express.urlencoded({extended: true}))
  server.use(router);

  server.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${port}`);
});

}

init()