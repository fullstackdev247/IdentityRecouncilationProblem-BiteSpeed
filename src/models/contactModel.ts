import {Pool, QueryResult} from 'pg';

//Database Schema for Contact Model
interface Contact {
    id:number;
    email: string;
    phoneNumber:string;
    linkedId:number | null;
    linkPrecedence: 'primary' | 'secondary';
    createdAt:Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export class ContactModel{
    private pool: Pool;
 
    //Added DB Credentials logic   
    constructor(){
        this.pool = new Pool({
            user: 'db_user',
            host: 'db_host',
            database: 'db_name',
            password:'db_password',
            port:5432,
        });
    }
    //Query to PostgreSQL Database 
    async query(text:string, values:any[]): Promise<QueryResult<any>>{
        const client = await this.pool.connect();
        try {
            return await client.query(text, values);
        } finally {
            client.release();
        }
    }

    //Identity Recouncillation logic for contactModel
    async identityAndConsolidate(email:string | null, phoneNumber:string | null): Promise<any>{
        //check if the contact is already exists in database with email or phoneNumber
        const existingContactQuery = await this.query(
            'SELECT * FROM "Contact" WHERE email = $1 OR phoneNumber = $2', 
            [email, phoneNumber] 
        );

        //If there a match found, consolidate the contacts
        if(existingContactQuery.rows.length>0){
            const contacts: Contact[] = existingContactQuery.rows;
            const primaryContact = contacts.find((contact) => contact.linkPrecedence);

            if(!primaryContact){
                //If there is no primary contact (should not happen), return an error
                throw new Error('No any primary contact found');
            }
            //Check if any existing contact found, then add to secondary
            const secondaryContacts = contacts.filter(
                (contact) => contact.linkPrecedence === 'secondary'
            );

            const consolidatedContact = {
                primaryContactId: primaryContact.id,
                emails: contacts.map((contact) => contact.phoneNumber).filter((phone)=> phone),
                secondaryContactIds: secondaryContacts.map((contact) => contact.id),
            };
            return consolidatedContact;
        } else{
            //If there is no match found, create a new primary contact
            const newContactQuery = await this.query(
                'INSERT INTO "Contact" (email, phoneNumber, linkPrecedence) VALUES ($1, $2, $3) RETURNING *',
                [email, phoneNumber, 'primary']
            );

            const newPrimaryContact = newContactQuery.rows[0];
            const consolidatedContact = {
                newPrimaryContactId: newPrimaryContact.id,
                emails: [newPrimaryContact.email],
                phoneNumbers: [newPrimaryContact.phoneNumber],
                secondaryContactIds: [],
            };
            return consolidatedContact;
        }
    }

}
