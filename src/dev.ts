import app from './app.js';
import connectDB from './db/index.js';

const PORT = 3000;

connectDB()
  .then((res) => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
