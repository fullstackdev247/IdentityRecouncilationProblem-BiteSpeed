//Import routes, npm packages and express
import bodyParser from "body-parser";
import express,  {Request, Response, NextFunction } from "express";
import identifyRoutes  from "./routes/identifyRoutes";

//Initialized server configuration
const app = express();
const port = 3000;

app.use(bodyParser.json());
//Created POST request route identify to access the api services
app.use('/identify', identifyRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next:NextFunction) => {
    console.error('Error:', err.stack);
    res.status(500).send({ error: 'Internal Server Error' });
    next(err)
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });