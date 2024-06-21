import { setTimeout } from 'timers/promises';
import puppeteer from 'puppeteer';

// Sort by location, 
// DELETE ALL THE CONSOLE LOGS WHEN DONE TESTING THIS PROGRAM CUZ IT SLOWS IT DOWN

export const getMenu = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        console.log("Browser launched");

        const page = await browser.newPage();
        console.log("New page opened");

        // Disable images and CSS for faster page loading
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        // Go to the initial page
        await page.goto('https://www.absecom.psu.edu/menus/user-pages/daily-menu.cfm', { waitUntil: 'domcontentloaded' });

        // Get the list of locations from the dropdown
        // I want to add something which filters if the page doesn't have a menu, then it skips
        //Update this section so it adds a breakfast, lunch and dinner section to the data collected
        const locations = await page.evaluate(() => {
            const selectElement = document.querySelector('#selCampus');
            const options = Array.from(selectElement.options);
            return options.map(option => ({
                name: option.text.trim(),
                value: option.value
            })).filter(option => option.value !== '0');
        }); //I think this part is repetitive. instead of going and getting the value and attributes assigned to each option
        //We can just iterate through no

        let fullMenu = [];

        // Iterate over each location to scrape the fullMenu
        for (const location of locations) {
            console.log(`Scraping fullMenu for ${location.name}`);
            
            // Select the location from the dropdown
            await page.select('#selCampus', location.value);
            await setTimeout(1000); // Ensure the selection is processed
            // Submit the form to reload the page with the selected location (Basically click the button)
            await page.evaluate(() => {
                document.forms['frmMenuFilters'].submit();
            });

            // Wait for the page to reload by waiting for a specific element that appears after reload
            await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
            // Ensure the dropdown is present again to confirm the page has fully loaded
            await page.waitForSelector('#selCampus');
            
            // Additional wait to ensure the page has settled
            //await page.waitForTimeout(2000);

            // Retrieve links with nutrition in the name from each location
            // Add to the location list: Breakfast, Lunch, Dinner
            await page.waitForSelector('#selMeal');
            const times = await page.evaluate(() => {
                const selectTime = document.querySelector('#selMeal'); // goes to the element in the document
                const timeOptions = Array.from(selectTime.options); // turns the options into array

                return timeOptions.map(option => option.value).filter(value => value !== ''); // Stores the options into map and also filters out empty values for option
            });
            
            // for loop here
            for (const time of times) { // fixed to iterate over values
                console.log(`Scraping menu for ${location.name} during ${time}`);
                await page.select('#selMeal', time); // Select each of the times
                // you can add a timeout here
                await setTimeout(500);
                await page.evaluate(() => {
                    document.forms['frmMenuFilters'].submit();
                });

                await page.waitForNavigation({ waitUntil: 'domcontentloaded' }); // will wait for the document to be properly loaded first
                await page.waitForSelector('#selMeal');
                const nutritionalLinks = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll('a')) // again this changes all of the nutritional links into an array in the document
                        .filter(link => link.textContent.includes('Nutrition') || link.href.includes('nutrition'))
                        .map(link => ({
                            href: link.href,
                            text: link.innerText
                        }));
                });

                // Use Promise.all to scrape all the nutritional facts from the scraped links
                await Promise.all(nutritionalLinks.map(async (link) => {
                    try {
                        const newPage = await browser.newPage();
                        // Navigate to the nutritional link page and wait for it to load
                        await newPage.goto(link.href, { waitUntil: 'domcontentloaded' });
                        console.log(`Navigated to ${link.href}`);

                        let pagefullMenu = await newPage.evaluate(() => {
                            const labels = ["Serving Size", "Calories", "Total Fat", "Sat Fat", "Trans Fat", 
                                "Cholesterol", "Sodium", "Total Carb", "Dietary Fiber", "Sugars", "Protein"];
                            // The labels help guide the script to find the correct information, saved to an array
                            let nutritionFacts = {};

                            labels.forEach(label => {
                                let element = Array.from(document.querySelectorAll('b')).find(b => b.innerText.includes(label));
                                if (element) {
                                    nutritionFacts[label] = element.nextSibling.textContent.trim();
                                }
                            });

                            return nutritionFacts;
                        });

                        fullMenu.push({ location: location.name, link: link.text, time: time, ...pagefullMenu }); // pushes the fullMenu into the fullMenu array
                        console.log(`fullMenu collected from ${link.href}:`, pagefullMenu); // when we want to integrate this into MongoDB, we will

                        await newPage.close();
                    } catch (error) {
                        console.error(`Error collecting fullMenu from ${link.href}:`, error);
                    }
                }));
            }
        }

        //fs.writeFileSync('fullMenu.json', JSON.stringify(fullMenu, null, 2)); 
        //console.log("fullMenu written to fullMenu.json");
        // this will transfer the fullMenu from the array into mongodb. 
        //*I wonder if there is a way to directly go to MongoDB instead of using an array

        await browser.close();
        console.log("Browser closed");

        console.log("Returning fullMenu"); // returns this as an array
        return fullMenu;

    } catch (error) {
        console.error("An error occurred:", error);
    }
};

// Invoke the function
/*
getMenu().then(menu => {
    console.log("Full Menu:", menu);
}).catch(error => {
    console.error("Error:", error);
});
*/

/*
import { setTimeout } from 'timers/promises';
import puppeteer from 'puppeteer';

// Sort by location, 
// DELETE ALL THE CONSOLE LOGS WHEN DONE TESTING THIS PROGRAM CUZ IT SLOWS IT DOWN

export const getMenu = async () => {
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        console.log("Browser launched");

        const page = await browser.newPage();
        console.log("New page opened");

        // Disable images and CSS for faster page loading
        await page.setRequestInterception(true);
        page.on('request', (req) => {
            if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
                req.abort();
            } else {
                req.continue();
            }
        });

        // Go to the initial page
        await page.goto('https://www.absecom.psu.edu/menus/user-pages/daily-menu.cfm', { waitUntil: 'domcontentloaded' });

        // Get the list of locations from the dropdown
        // I want to add something which filters if the page doesn't have a menu, then it skips
        //Update this section so it adds a breakfast, lunch and dinner section to the data collected
        const locations = await page.evaluate(() => {
            const selectElement = document.querySelector('#selCampus');
            const options = Array.from(selectElement.options);
            return options.map(option => ({
                name: option.text.trim(),
                value: option.value
            })).filter(option => option.value !== '0');
        }); //I think this part is repetitive. instead of going and getting the value and attributes assigned to each option
        //We can just iterate through no

        let fullMenu = [];

        // Iterate over each location to scrape the fullMenu
        for (const location of locations) {
            console.log(`Scraping fullMenu for ${location.name}`);
            
            // Select the location from the dropdown
            await page.select('#selCampus', location.value);
            await setTimeout(500); //this was the part where it was causing the problem
            // Submit the form to reload the page with the selected location (Basically click the button)
            await page.evaluate(() => {
                document.forms['frmMenuFilters'].submit();
            });

            // Wait for the page to reload by waiting for a specific element that appears after reload
            await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
            // Ensure the dropdown is present again to confirm the page has fully loaded
            await page.waitForSelector('#selCampus');
            // 
            // Additional wait to ensure the page has settled
            //await page.waitForTimeout(2000);

            // Retrieve links with nutrition in the name from each location
            // Add to the location list: Breakfast, Lunch, Dinner
            page.waitForSelector('#selMeal');
            const times = await page.evaluate(() => {
                const selectTime = document.querySelector('#selMeal') //goes to the element in the document
                const timeOption = Array.from(selectTime.options) //turns the options into array

                return timeOption.map(option => option.value).filter(value => value !== '') //Stores the options into 
                //map and also filters out empty values for option
                }
            )
            //for loop here
            for (const time in times) {
                await page.select('#selMeal, time') //Select each of the times
                // you can add a timeout here
                await setTimeout(500)
                await page.evaluate(() => {
                    document.forms['frmMenuFilters'].submit();
                });

                await page.waitForNavigation({waitUntil:'domcontentloaded'}) //will wiat for the document to be properly loaded first
                await page.waitForSelector('#selMeal');
                const nutritionalLinks = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll('a')) //again this changes all of the nutritional links
                    // into an array in the document
                        .filter(link => link.textContent.includes('Nutrition') || link.href.includes('nutrition'))
                        .map(link => ({
                            href: link.href,
                            text: link.innerText
                        }));
                });
            


            // Use Promise.all to scrape all the nutritional facts from the scraped links
            await Promise.all(nutritionalLinks.map(async (link) => {
                try {
                    const newPage = await browser.newPage();
                    // Navigate to the nutritional link page and wait for it to load
                    await newPage.goto(link.href, { waitUntil: 'domcontentloaded' });
                    console.log(`Navigated to ${link.href}`);

                    let pagefullMenu = await newPage.evaluate(() => {
                        const labels = ["Serving Size", "Calories", "Total Fat", "Sat Fat", "Trans Fat", 
                            "Cholesterol", "Sodium", "Total Carb", "Dietary Fiber", "Sugars", "Protein"];
                        // The labels help guide the script to find the correct information, saved to an array
                        let nutritionFacts = {};

                        labels.forEach(label => {
                            let element = Array.from(document.querySelectorAll('b')).find(b => b.innerText.includes(label));
                            if (element) {
                                nutritionFacts[label] = element.nextSibling.textContent.trim();
                            }
                        });

                        return nutritionFacts;
                    });

                    fullMenu.push({ location: location.name, link: link.text, time: time, ...pagefullMenu }); // pushes the fullMenu into the fullMenu array
                    console.log(`fullMenu collected from ${link.href}:`, pagefullMenu); // when we want to integrate this into MongoDB, we will

                    await newPage.close();
                } catch (error) {
                    console.error(`Error collecting fullMenu from ${link.href}:`, error);
                }
            }));

        }
    }

        //fs.writeFileSync('fullMenu.json', JSON.stringify(fullMenu, null, 2)); 
        //console.log("fullMenu written to fullMenu.json");
        // this will transfer the fullMenu from the array into mongodb. 
        //*I wonder if there is a way to directly go to MongoDB instead of using an array

        await browser.close();
        console.log("Browser closed");

        console.log("Returning fullMenu"); //returns this as an array
        return fullMenu;

    } catch (error) {
        console.error("An error occurred:", error);
    }
};
*/