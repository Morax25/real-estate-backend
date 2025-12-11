import app from "./app.ts"
import {PORT} from './configs/env.ts'
console.log("Path" )
app.listen(PORT, ()=>{
  console.log(`Server is running on PORT: ${PORT}`)
})