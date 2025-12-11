import app from "./app.ts"
const PORT = 3000

app.listen(PORT, ()=>{
  console.log(`Server is running on PORT: ${PORT}`)
})