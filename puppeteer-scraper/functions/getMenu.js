import { setTimeout } from 'timers/promises';
import puppeteer from 'puppeteer';


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
        const locations = await page.evaluate(() => {
            const selectElement = document.querySelector('#selCampus');
            const options = Array.from(selectElement.options);
            return options.map(option => ({
                name: option.text.trim(),
                value: option.value
            })).filter(option => option.value !== '0');
        });

        let fullMenu = [];

        // Iterate over each location to scrape the fullMenu
        for (const location of locations) {
            console.log(`Scraping fullMenu for ${location.name}`);
            
            
            // Select the location from the dropdown
            await page.select('#selCampus', location.value);
            await setTimeout(500); //this was the part where it was causing the problem
            // Submit the form to reload the page with the selected location
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
            const nutritionalLinks = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('a'))
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

                    fullMenu.push({ location: location.name, link: link.text, ...pagefullMenu }); // pushes the fullMenu into the fullMenu array
                    console.log(`fullMenu collected from ${link.href}:`, pagefullMenu); // when we want to integrate this into MongoDB, we will

                    await newPage.close();
                } catch (error) {
                    console.error(`Error collecting fullMenu from ${link.href}:`, error);
                }
            }));
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