const app = require('./app');
const PORT = process.env.PORT || 9091;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});