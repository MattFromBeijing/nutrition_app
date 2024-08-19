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
        const mealType = req.query.mealType

        // console.log(mealType)

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
            
            let menu = null
                if (checkActive) {
                    switch (mealType){
                        case "Breakfast":

                            menu = await new_menu.aggregate([
                                { $match : {"location" : currentLocations[i]}}, 
                                { $project : {"_id" : 0, "Breakfast" : 1}}
                            ]).toArray()
                            if (menu[0].Breakfast.length == 0) checkActive = false
                            else checkActive = true
                            break

                        case "Lunch":

                            menu = await new_menu.aggregate([
                                { $match : {"location" : currentLocations[i]}}, 
                                { $project : {"_id" : 0, "Lunch" : 1}}
                            ]).toArray()
                            if (menu[0].Lunch.length == 0) checkActive = false
                            else checkActive = true
                            break

                        case "Dinner":

                            menu = await new_menu.aggregate([
                                { $match : {"location" : currentLocations[i]}}, 
                                { $project : {"_id" : 0, "Dinner" : 1}}
                            ]).toArray()
                            if (menu[0].Dinner.length == 0) checkActive = false
                            else checkActive = true
                            break
                    }
                }
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
        const mealType = req.query.mealType;

        // console.log(mealType)

        let result = null;
        switch (mealType){
            case "Breakfast":

                result = await new_menu.aggregate([
                    { $match : {"location" : locationName}}, 
                    { $project : {"_id" : 0, "Breakfast" : 1}}
                ]).toArray()
                break

            case "Lunch":

                result = await new_menu.aggregate([
                    { $match : {"location" : locationName}}, 
                    { $project : {"_id" : 0, "Lunch" : 1}}
                ]).toArray()
                break

            case "Dinner":

                result = await new_menu.aggregate([
                    { $match : {"location" : locationName}}, 
                    { $project : {"_id" : 0, "Dinner" : 1}}
                ]).toArray()
                break
            
            // for development purposes only, comment out in deployment
            default:

                result = await new_menu.aggregate([
                    { $match : {"location" : locationName}}, 
                    { $project : {"_id" : 0, "Lunch" : 1}}
                ]).toArray()
                break
        }
        
        console.log(result)

        res.send(result[0])
    } catch (e) {
        console.error(e)
        res.status(500).send('Error occurred while fetching data.');
    }
});

export default dataRouter