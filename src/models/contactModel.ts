import {Pool, QueryResult} from 'pg';

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

    constructor(){
        this.pool = new Pool({
            user: 'db_user',
            host: 'db_host',
            database: 'db_name',
            password:'db_password',
            port:5432,
        });
    }
    
    async query(text:string, values:any[]): Promise<QueryResult<any>>{
        const client = await this.pool.connect();
        try {
            return await client.query(text, values);
        } finally {
            client.release();
        }
    }


    async identityAndConsolidate(email:string | null, phoneNumber:string | null): Promise<any>{
        //check if the contact is already exists in database with email or phoneNumber
        const existingContactQuery = await this.query(
            'SELECT * FROM "Contact" WHERE email = $1 OR phoneNumber = $2', 
            [email, phoneNumber] 
        );

    }

}
