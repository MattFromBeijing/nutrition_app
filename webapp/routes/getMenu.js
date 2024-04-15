import client from "../db.js";

export const getMenu = async () => {
    try {
        await client.connect();

        const test1 = client.db("test1").collection("test1")
        const results = await test1.find().toArray();

        await client.close();

        return results;
        
    } catch (error) {
        console.error(error)
    }
}