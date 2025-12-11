import app from "./app.ts"
import {PORT} from './configs/env.ts'
import connectDB from "./db/index.ts";

connectDB()
  .then((res) => {
    app.listen(PORT, () => {
      console.log(`Server is running on Port : ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Error connecting DB : ${err}`);
  });