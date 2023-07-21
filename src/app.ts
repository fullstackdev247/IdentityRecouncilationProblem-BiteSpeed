//Import npm packages and express
import bodyParser from "body-parser";
import express, { Request, Response } from "express";

//Initialized server configuration
const app = express();
const port = 3000;

app.use(bodyParser.json());

// Error handling middleware
app.use((err: any, req: Request, res: Response) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });