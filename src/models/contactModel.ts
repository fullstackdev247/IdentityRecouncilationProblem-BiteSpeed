import { createPool, Pool, PoolConnection } from 'mysql';

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
        this.pool =  createPool({
            connectionLimit: 10,
            user: 'root',
            host: 'localhost',
            database: 'api',
            password:'',
        });
    }
    //Query to Mysql Database 
    async query<T>(sql: string, values?: any[]): Promise<T> {
        return new Promise((resolve, reject) => {
          this.pool.getConnection((err: any, connection: PoolConnection) => {
            if (err) {
              reject(err);
              return;
            }
    //Connection Result Query to MySQL
            connection.query(sql, values, (err: any, results: T) => {
              connection.release();
              if (err) {
                reject(err);
                return;
              }
              resolve(results);
            });
          });
        });
      }

    //Identity Recouncillation logic for contactModel
    async identifyAndConsolidate(email:string | null, phoneNumber:string | null): Promise<any>{
        //check if the contact is already exists in database with email or phoneNumber
        const existingContactQuery = await this.query<any[]>(
            'SELECT * FROM Contact WHERE email = ? OR phoneNumber = ?', 
            [email, phoneNumber] 
        );

        //If there a match found, consolidate the contacts
        if(existingContactQuery.length> 0){
            const contacts: Contact[] = existingContactQuery;
            const primaryContact = contacts.find((contact) => contact.linkPrecedence === 'primary');

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
            const newContactQuery = await this.query<Contact[]>(
                'INSERT INTO Contact (email, phoneNumber, linkPrecedence) VALUES (?, ?, ?)',
                [email, phoneNumber, 'primary']
            );

            const newPrimaryContact = newContactQuery[0];
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
