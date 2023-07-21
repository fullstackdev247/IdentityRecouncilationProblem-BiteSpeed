import { Request, Response } from "express";
import { ContactModel } from '../models/contactModel';

export const identityController = async (req: Request, res: Response) => {
    const { email, phoneNumber } = req.body;
  
    try {
      const contactModel = new ContactModel();
      const consolidatedContact = await contactModel.identityAndConsolidate(email, phoneNumber);
      res.status(200).json({contact: consolidatedContact });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };