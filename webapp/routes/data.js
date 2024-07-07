import express from 'express';
import client from "../db.js";

const dataRouter = express.Router()

// client.connect(err => {
//     if (err) {
//         console.log('Failed to connect to MongoDB', err)
//         process.exit(1);
//     }
//     console.log('Connected to MongoDB')
// })

const db = client.db('test1') //Connects to the database test1
const new_menu = db.collection("new_menu") //connects to collection new_menu

dataRouter.get("/getFullMenu", async (req, res) => {
    try {
        //use the find() function to locate the stored document, retunring a cursor
        //YOu can convert this cursor ito an array of documents using the toArray()
        const results = await new_menu.find().toArray();

        res.send(results)
    } catch (e) {
        console.error(e)
        res.status(500).send('Error occurred while fetching data.');
    }
});

dataRouter.get("/getActiveLocations", async (req, res) => {
    try {
        const currentLocations = req.query.locationNames

        const pipeline = [
            {
                $group: {
                    _id: null,
                    allLocations: {$push: "$location"}
                }
            },
            {
                $project: {
                    _id: 0,
                    allLocations: 1
                }
            }
        ]
        const resultArray = await new_menu.aggregate(pipeline).toArray()
        const checkLocations = resultArray[0].allLocations

        // console.log(checkLocations)
        // console.log(currentLocations)

        let activeLocations = {};
        for (let i = 0; i < currentLocations.length; i++) {
            let checkActive = checkLocations.includes(currentLocations[i])
            activeLocations[currentLocations[i]] = checkActive
        }

        // console.log(activeLocations)
        
        res.send(activeLocations)
    } catch (e) {
        console.error(e)
        res.status(500).send('Error occurred while fetching data.');
    }
});

dataRouter.get("/getLocationMenu", async (req, res) => {
    try {
        const locationName = req.query.locationName;
        const result = await new_menu.find({ "location" : {$eq : locationName}}).toArray()
        
        console.log(result)

        res.send(result[0])
    } catch (e) {
        console.error(e)
        res.status(500).send('Error occurred while fetching data.');
    }
});

export default dataRouter;