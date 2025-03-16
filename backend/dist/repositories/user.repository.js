import pg from "pg";
import dotenv from "dotenv";
const { Pool } = pg;
dotenv.config();
class UserRepository {
    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });
    }
    async createUser(email, passwordHash) {
        const client = await this.pool.connect();
        try {
            const query = {
                text: "INSERT INTO Users (email, password_hash) VALUES ($1, $2) RETURNING email, password_hash",
                values: [email, passwordHash],
            };
            const result = await client.query(query);
            return result.rows[0];
        }
        catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
        finally {
            client.release();
        }
    }
    async getUserByEmail(email) {
        const client = await this.pool.connect();
        try {
            const query = {
                text: "SELECT * FROM Users WHERE email = $1",
                values: [email],
            };
            const result = await client.query(query);
            return result.rows[0] || null;
        }
        catch (error) {
            console.error("Error fetching user:", error);
            throw error;
        }
        finally {
            client.release();
        }
    }
    async deleteUser(email) {
        const client = await this.pool.connect();
        try {
            const query = {
                text: "DELETE FROM Users WHERE email = $1",
                values: [email],
            };
            await client.query(query);
            return true;
        }
        catch (error) {
            console.error("Error deleting user:", error);
            throw error;
        }
        finally {
            client.release();
        }
    }
}
export default new UserRepository();
//# sourceMappingURL=user.repository.js.map