import puppeteer from 'puppeteer';
import { setTimeout } from 'timers/promises';

// Sort by location, 
// DELETE ALL THE CONSOLE LOGS WHEN DONE TESTING THIS PROGRAM CUZ IT SLOWS IT DOWN

export const getWebPages = async () => {
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
        // Update this section so it adds a breakfast, lunch and dinner section to the data collected
        const locations = await page.evaluate(() => {
            const selectElement = document.querySelector('#selCampus');
            const options = Array.from(selectElement.options);
            return options.map(option => ({
                name: option.text.trim(),
                value: option.value
            })).filter(option => option.value !== '0');
        }); // I think this part is repetitive. Instead of going and getting the value and attributes assigned to each option
        // We can just iterate through no

        let links = [];

        // Iterate over each location to scrape the links
        for (const location of locations) {
            console.log(`Scraping links for ${location.name}`);
            
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
            // await page.waitForTimeout(2000);

            // Retrieve links with nutrition in the name from each location
            // Add to the location list: Breakfast, Lunch, Dinner
            await page.waitForSelector('#selMeal');
            const times = await page.evaluate(() => {
                const selectTime = document.querySelector('#selMeal'); // Goes to the element in the document
                const timeOptions = Array.from(selectTime.options); // Turns the options into array

                return timeOptions.map(option => option.value).filter(value => value !== ''); // Stores the options into map and also filters out empty values for option
            });

            // For loop here
            for (const time of times) { // Fixed to iterate over values
                console.log(`Scraping links for ${location.name} during ${time}`);
                await page.select('#selMeal', time); // Select each of the times
                await setTimeout(750); // Add a timeout here
                await page.evaluate(() => {
                    document.forms['frmMenuFilters'].submit();
                });

                await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
                await page.waitForSelector('#selMeal');

                const nutritionalLinks = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll('a'))
                        .filter(link => link.textContent.includes('Nutrition') || link.href.includes('nutrition'))
                        .map(link => ({
                            href: link.href,
                            text: link.innerText
                        }));
                });

                nutritionalLinks.forEach(link => {
                    links.push({
                        href: link.href,
                        text: link.text,
                        location: location.name,
                        time: time
                    });
                });
            }
        }

        await browser.close();
        console.log("Browser closed");

        return links;

    } catch (error) {
        console.error("An error occurred:", error);
    }
};



/*import puppeteer from "puppeteer";

export const getWebPages = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });
  
  const page = await browser.newPage();

  await page.goto("https://menu.hfs.psu.edu/", {
    waitUntil: "domcontentloaded",
  });
  
  let webpages = await page.$$eval("#menu-container a", elementHandle => elementHandle.map((el) => (
    {
      location : el.innerText,
      link : el.href,
    })
  ).filter(el => el.location !== ""));

  await browser.close();
  return webpages;
};
*/
/*const test = await getWebPages();
console.log(test);*/