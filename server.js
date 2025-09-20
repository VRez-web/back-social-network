import express from "express";
import router from './auth/routes.js'

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to auth server!');
})

app.use('/api/v1/auth/', router);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})