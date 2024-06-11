const puppeteer = require('puppeteer');
const fs = require('fs');

// DELETE ALL THE CONSOLE LOGS WHEN DONE TESTING THIS PROGRAM CUZ IT SLOWS IT DOWN

(async () => {
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
        const locations = await page.evaluate(() => {
            const selectElement = document.querySelector('#selCampus');
            const options = Array.from(selectElement.options);
            return options.map(option => ({
                name: option.text.trim(),
                value: option.value
            })).filter(option => option.value !== '0');
        });

        let data = [];

        // Iterate over each location to scrape the data
        for (const location of locations) {
            console.log(`Scraping data for ${location.name}`);

            // Select the location from the dropdown
            await page.select('#selCampus', location.value);

            // Submit the form to reload the page with the selected location
            await page.evaluate(() => {
                document.forms['frmMenuFilters'].submit();
            });

            // Wait for the page to reload
            await page.waitForNavigation({ waitUntil: 'domcontentloaded' });

            // Ensure the dropdown is present again to confirm the page has fully loaded
            // ADDED: Wait for the selector to ensure the page has fully loaded
            await page.waitForSelector('#selCampus');

            // Retrieve links with nutrition in the name
            const nutritionalLinks = await page.evaluate(() => {
                return Array.from(document.querySelectorAll('a'))
                    .filter(link => link.textContent.includes('Nutrition') || link.href.includes('nutrition'))
                    .map(link => ({
                        href: link.href,
                        text: link.innerText
                    }));
            });

            // Use Promise.all to scrape links in parallel
            await Promise.all(nutritionalLinks.map(async (link) => {
                try {
                    const newPage = await browser.newPage();
                    // ADDED: Navigate to the nutritional link page and wait for it to load
                    await newPage.goto(link.href, { waitUntil: 'domcontentloaded' });
                    console.log(`Navigated to ${link.href}`);
                    
                    //Self created labels to ensure the scrapper collects the correct information
                    let pageData = await newPage.evaluate(() => {
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

                    data.push({ location: location.name, link: link.text, ...pageData }); // pushes the data into the data array
                    console.log(`Data collected from ${link.href}:`, pageData); // when we want to integrate this into MongoDB, we will

                    await newPage.close();
                } catch (error) {
                    console.error(`Error collecting data from ${link.href}:`, error);
                }
            }));
        }

        // Save the scraped data to a JSON file
        fs.writeFileSync('data.json', JSON.stringify(data, null, 2)); // this will transfer the data from the array into mongodb. *I wonder if there is a way to directly go to MongoDB instead of using an array
        console.log("Data written to data.json");
        
        await browser.close();
        console.log("Browser closed");

       // return data;

    } catch (error) {
        console.error("An error occurred:", error);
    }
})();
