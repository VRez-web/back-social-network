import express from "express";
import cors from "cors";
import router from './auth/routes.js'

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Welcome to auth server!');
})

app.use('/api/v1/auth/', router);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
})