//Import routes, npm packages and express
import bodyParser from "body-parser";
import express,  {Request, Response } from "express";
import identifyRoutes  from "./routes/identifyRoutes";
import cors from 'cors';
//Initialized server configuration
const app = express();
const port = 3000;

app.use(bodyParser.json());

//Enable CORS for all Routes
app.use(cors());

//Created POST request route identify to access the api services
app.use('/identify', identifyRoutes);

// Define a Test route for the root path ("/")
app.get('/', (res: Response) => {
  res.send('Welcome to FluxKart Bitespeed Backend Service!');
});
// Error handling middleware
app.use((err: any, res: Response) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });