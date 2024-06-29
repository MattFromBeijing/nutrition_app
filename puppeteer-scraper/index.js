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
    const documents = [];
    for (const location in fullMenu) {
      for (const time in fullMenu[location]) {
        fullMenu[location][time].forEach(item => {
          documents.push({
            location,
            time,
            ...item
          });
        });
      }
    }

    // Check if there are documents to insert
    if (documents.length > 0) {
      await collection.insertMany(documents);
      console.log("Documents inserted.");
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

  console.log('Hi');
}

await scrapeMenus();



/*
const scrapeMenus = async () => {
  const links = await getWebPages();
  console.log('Linked collected:', links);

  const fullMenu = await getMenuItems(links);
  console.log('Full menu collected:', fullMenu)

  try {
    await client.connect();
    console.log('Connected to MongobD')
    const collection = client.db("test1").collection("new_menu");
    await collection.insertMany(fullMenu);
    await client.close()
    console.log("Documents Inserted.")
  } catch (error) {
    console.log(error)
  }

  console.log('Hi');
}
  */

await scrapeMenus();

/* 
  if (webPages.length === 0) return todayMenus;

  for (let i = 0; i < webPages.length; i++){
    try {
      const locationMenu = await getMenuItems(webPages[i].location, webPages[i].link);

      //append onto existing list
      todayMenus.push(locationMenu);

    } catch (error) {
      console.error(error)
    }
  }
*/