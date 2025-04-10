import mysql from 'mysql2'; // Important to put the /promise to use promises instead of callbacks when connecting to the DB
import dotenv from 'dotenv';
dotenv.config();

/* Information that is required by Mysql2 to establish connection
const config = { 
    host: 'localhost', // 127.0.0.1 if this doesn't work
    user: 'root',
    port: 3306,
    password: '',
    database: 'RealEstate_DB'
}
*/

// .env version
const config = { 
    host: process.env.MYSQL_HOST, // 127.0.0.1 if this doesn't work
    user: process.env.MYSQL_USER,
    port: 3306,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}

// We provide mysql2 the config information for the connection
const pool = mysql.createPool(config).promise(); 

// Main functions

export class RealEstateModel {
    static async getAllProperties () {
        const result = await pool.query(
            'SELECT BIN_TO_UUID(id) AS id, title, price, city, state, year, description, thumbnail FROM property ORDER BY price DESC'
        );

        return result[0]; // [0] because I just want the rows
    }

    static async getFeaturedProperties() {
        const result = await pool.query(
            `SELECT BIN_TO_UUID(id) AS id, title, price, city, state, year, description, thumbnail 
             FROM property 
             ORDER BY price DESC
             LIMIT 4 `
        );
        
        return result[0];
    }

    static async getAllFirms () {
        const result = await pool.query(
            'SELECT * FROM firm'
        );

        return result[0];
    }

    static async getPropertyById(id) {
        const result = await pool.query(
            `SELECT *
            FROM property
            WHERE id = UUID_TO_BIN(?)`, [id]
        )

        return result[0];
    }

    // ADD
    static async createProperty(title, year, description, price, city, state, thumbnail) {
        await pool.query(`
            INSERT INTO property (id, title, year, description, price, city, state, thumbnail)
            VALUES (UUID_TO_BIN(UUID()), ?, ?, ?, ?, ?, ?, ?)
            `, [title, year, description, price, city, state, thumbnail]);
    }
}
