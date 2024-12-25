import puppeteer from 'puppeteer';
import { setTimeout } from 'timers/promises';

// DELETE ALL THE CONSOLE LOGS WHEN DONE TESTING THIS PROGRAM CUZ IT SLOWS IT DOWN

export const getMenuItems = async (links) => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        console.log("Beginning nutritional info collection");

        let fullMenu = {};

        // Use Promise.all to handle each link in parallel
        const linkPromises = links.map(async (link) => {
          try {
            const page = await browser.newPage();
            await page.goto(link.href, { waitUntil: 'domcontentloaded', timeout: 60000 });
            // console.log(`Navigated to ${link.href}`);

            const nutritionFacts = await page.evaluate(() => {
              console.log("reached page")
              const labels = ["Serving Size", "Calories", "Total Fat", "Sat Fat", "Trans Fat", 
                              "Cholesterol", "Sodium", "Total Carb", "Dietary Fiber", "Sugars", "Protein"];
              let facts = {};

              labels.forEach(label => {
                  let element = Array.from(document.querySelectorAll('b')).find(b => b.innerText.includes(label));
                  if (element) {
                      let info = element.nextSibling.textContent.trim();
                      if (info == ""){
                        facts[label] = "n/a"
                      } else {
                        facts[label] = parseInt(info)
                      }
                  } else {
                      facts[label] = "n/a"
                  }
              });
              // console.log("finished page, no error")
              return facts;
            });

            // console.log(nutritionFacts != null)

            // Initialize the location and time objects in fullMenu if they don't exist
            if (!fullMenu[link.location]) {
              fullMenu[link.location] = {
                Breakfast: {},
                Lunch: {},
                Dinner: {},
                LateNight: {}
              };
            }

            // Add the scraped nutritional facts to the corresponding location and time
            if (fullMenu[link.location][link.time][link.category]){
              fullMenu[link.location][link.time][link.category].push({
                name: link.text,
                href: link.href,
                category: link.category,
                servingSize: nutritionFacts["Serving Size"],
                calories: nutritionFacts["Calories"],
                totalFat: nutritionFacts["Total Fat"],
                satFat: nutritionFacts["Sat Fat"],
                transFat: nutritionFacts["Trans Fat"],
                cholesterol: nutritionFacts["Cholesterol"],
                sodium: nutritionFacts["Sodium"],
                totalCarb: nutritionFacts["Total Carb"],
                dietaryFiber: nutritionFacts["Dietary Fiber"],
                sugars: nutritionFacts["Sugars"],
                protein: nutritionFacts["Protein"]
              });
            } else {
              fullMenu[link.location][link.time][link.category] = [{
                name: link.text,
                href: link.href,
                category: link.category,
                servingSize: nutritionFacts["Serving Size"],
                calories: nutritionFacts["Calories"],
                totalFat: nutritionFacts["Total Fat"],
                satFat: nutritionFacts["Sat Fat"],
                transFat: nutritionFacts["Trans Fat"],
                cholesterol: nutritionFacts["Cholesterol"],
                sodium: nutritionFacts["Sodium"],
                totalCarb: nutritionFacts["Total Carb"],
                dietaryFiber: nutritionFacts["Dietary Fiber"],
                sugars: nutritionFacts["Sugars"],
                protein: nutritionFacts["Protein"]
              }]
            }

            // console.log(`Nutritional facts collected for ${link.location} during ${link.time}:`, nutritionFacts);
            await page.close();
          } catch (error) {
              console.error(`Error collecting nutritional facts from ${link.href}:`, error);
          }
        });

        // Await all link promises
        await Promise.all(linkPromises);

        await browser.close();

        return fullMenu;

    } catch (error) {
        console.error("An error occurred:", error);
    }
};