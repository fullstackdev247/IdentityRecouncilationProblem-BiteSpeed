import { Request, Response } from "express";
import { ContactModel } from '../models/contactModel';

export const identifyController = async (req: Request, res: Response) => {
    const { email, phoneNumber } = req.body;
  
    try {
      const contactModel = new ContactModel();
      const consolidatedContact = await contactModel.identifyAndConsolidate(email, phoneNumber);
      res.status(200).json({contact: consolidatedContact });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };