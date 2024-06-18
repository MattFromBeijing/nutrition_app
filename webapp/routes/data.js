import express from 'express';
import client from "../db.js";

const dataRouter = express.Router()

dataRouter.get("/getMenu", async (req, res) => {
    try {
        await client.connect();

        const test1 = client.db("test1").collection("test1") //Connects to the database test1, collection test1
        const results = await test1.find().toArray(); //use the find() function to locate the stored document, reutnring a cursor
        //YOu can convert this cursor ito an array of documents using the toArray()
        
        res.send(results)
    } catch (e) {
        console.error(e)
        res.status(500).send('Error occurred while fetching data.');
    } finally {
        await client.close();
    }
});

export default dataRouter;