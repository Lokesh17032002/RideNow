import http from "http";
import app from "./app.js";
import connectToDb from "./db/db.js";
const port = process.env.PORT || 3000;

const server = http.createServer(app);
// connectToDb();


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

