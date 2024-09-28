import { getMenuItems } from "./functions/getMenuItems.js";
import { getWebPages } from "./functions/getWebPages.js";
import { getMenu } from './functions/getMenu.js'
import client from "./db.js"

const scrapeMenus = async () => {
  try {
    // Get the links and the full menu
    const links = await getWebPages();
    console.log('Links collected:', links);

    const fullMenu = await getMenuItems(links);
    console.log('Full menu collected:', fullMenu);

    // Connect to the MongoDB client
    await client.connect();
    console.log('Connected to MongoDB');

    const collection = client.db("test1").collection("new_menu");

    // Prepare the data for insertion
    // const documents = []
    // for (let location in fullMenu) {
    //   documents.push({
    //     location: fullMenu[location]
    //   });
    // }
    
    let documents = []
    let locations = Object.keys(fullMenu)
    for (let i = 0; i < locations.length; i++) {
      documents.push({
        location: locations[i],
        Breakfast: fullMenu[locations[i]].Breakfast,
        Lunch: fullMenu[locations[i]].Lunch,
        Dinner: fullMenu[locations[i]].Dinner,
        LateNight: fullMenu[locations[i]].LateNight
      })
    }

    console.log(documents)

    // Check if there are documents to insert
    if (documents.length > 0) {
      await collection.deleteMany({});
      await collection.insertMany(documents);
      console.log(`${documents.length} documents inserted`);
    } else {
      console.log("No documents to insert.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    // Ensure the client is closed
    await client.close();
    console.log("MongoDB client closed.");
  }
}

await scrapeMenus();