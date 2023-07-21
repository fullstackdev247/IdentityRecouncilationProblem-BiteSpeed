import {Pool, QueryResult} from 'pg';

interface Contact {
    id:number;
    email: string;
    phoneNumber:string;
    createdAt:Date;
    updatedAt: Date;
    deletedAt: Date;
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
}