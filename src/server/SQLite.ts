import sqlite3 from 'sqlite3'
import { open } from 'sqlite';
import { fileURLToPath, URL } from 'node:url'

export class SQLite {

    private static async getDbConnection() {
        let dbfile = fileURLToPath(new URL('./data.db', import.meta.url));
        // console.log(dbfile);
        return open({
            filename: dbfile,
            driver: sqlite3.Database
        });
    }

    public static async run(query: string, params: any[] = []) {
        const db = await this.getDbConnection();
        return db.run(query, params);
    }

    public static async get(query: string, params: any[] = []) {
        const db = await this.getDbConnection();
        return db.get(query, params);
    }

    public static async all(query: string, params: any[] = []) {
        const db = await this.getDbConnection();
        return db.all(query, params);
    }

    public static async insert(query: string, params: any[] = []) {
        const db = await this.getDbConnection();
        return db.run(query, params);
    }

    public static async update(query: string, params: any[] = []) {
        const db = await this.getDbConnection();
        return db.run(query, params);
    }

    public static async delete(query: string, params: any[] = []) {
        const db = await this.getDbConnection();
        return db.run(query, params);
    }
}