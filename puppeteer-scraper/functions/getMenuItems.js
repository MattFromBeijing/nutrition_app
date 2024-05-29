import puppeteer from "puppeteer";

export const getMenuItems = async (location, link) => {
  const browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto(link, { waitUntil: 'domcontentloaded'});

  //go to location webpage
  const menuPages = await page.$$eval('a[href*="longmenu.aspx"]', anchors => anchors.map(el => el.href));

  let fullMenu = {
    Location : location,
    Breakfast : [],
    Lunch : [],
    Dinner : [],
    LateNight : [],
  };

  //loop through every location
  if (menuPages !== 0){
    for (const menuPage of menuPages) {
      try {
  
        //go to breakfast/lunch/dinner item list page
        await page.goto(menuPage, {waitUntil: 'domcontentloaded',});
        
        //find links to individual item page
        const itemPages = await page.$$eval('a[onmouseover*="Click for label of this item."]', anchors => anchors.map(el => el.href));

        // start set of names to remove duplicate items
        let existingItems = new Set();
  
        //loop through every item
        if (itemPages.length !== 0) {
          for (const itemPage of itemPages){
            try {
              
              //go to individual item page
              await page.goto(itemPage, {waitUntil: "domcontentloaded",});
    
              //scrape everything
              const itemName = await page.$eval('.labelrecipe', el => el.textContent);
              // const itemSugar
              // const itemFat
              // ...
    
              //create map containing item info
              let menuItem = {
                name : itemName,
                // sugar: itemSugar
                // fat: itemFat
                // ...
              };

              //push map into menu if it doesn't exist in existingItems
              if (!existingItems.has(menuItem.name)){
                if (String(menuPage).includes("Breakfast")){
                  fullMenu.Breakfast.push(menuItem);
                } else if (String(menuPage).includes("Lunch")){
                  fullMenu.Lunch.push(menuItem);
                } else if (String(menuPage).includes("Dinner")){
                  fullMenu.Dinner.push(menuItem);
                } else if (String(menuPage).includes("Late+Night")){
                  fullMenu.LateNight.push(menuItem);
                }

                // add name to existingItems to filter out future repeated items
                existingItems.add(menuItem.name)
              }
    
              
            
            } catch (error) {
              console.error(error);
            }
          }
        }

      } catch (error) {
        console.error(error);
      }
    }
  }
  
  await browser.close();
  return fullMenu;
}

/*const location = "Altoona, Port Sky Cafe";
const link = "https://menu.hfs.psu.edu/shortmenu.aspx?sName=Penn+State+Housing+and+Food+Services&locationNum=40&locationName=Altoona%2c+Port+Sky+Cafe&naFlag=1"

const menu = await getMenuItems(location, link);
console.log(menu);*/