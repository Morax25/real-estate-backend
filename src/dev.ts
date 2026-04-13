import app from './app.js';
import dotenv from 'dotenv';

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
