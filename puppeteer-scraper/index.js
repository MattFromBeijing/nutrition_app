import { getMenuItems } from "./functions/getMenuItems.js";
import { getWebPages } from "./functions/getWebPages.js";
import client from "./db.js"

const scrapeMenus = async () => {
    const webPages = await getWebPages();
    let todayMenus = [];

    for (let i = 0; i < webPages.length; i++){
        try {
            const locationMenu = await getMenuItems(webPages[i].location, webPages[i].link);

            //append onto existing list
            todayMenus.push(locationMenu);

        } catch (error) {
            console.error(error)
        }
    }

    try {
        client.connect();
        const collection = client.db("test1").collection("test1");
        await collection.insertMany(todayMenus);
        await client.close()
        console.log("Documents Inserted.")
    } catch (error) {
        console.log(error)
    }

    console.log(JSON.stringify(todayMenus, null, 2));
}

await scrapeMenus();