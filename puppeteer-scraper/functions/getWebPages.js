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
        console.log("Beginning link collection");

        const page = await browser.newPage();

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

        let links = [];

        // Iterate over each location to scrape the links
        for (let location of locations) {
            // Select the location from the dropdown and wait for navigation
            await Promise.all([
                page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                page.select('#selCampus', location.value)
            ]);

            // console.log(`${location.name} loaded`);

            // Retrieve meal times
            await page.waitForSelector('#selMeal');
            const times = await page.evaluate(() => {
                const selectTime = document.querySelector('#selMeal');
                const timeOptions = Array.from(selectTime.options);
                return timeOptions.map(option => option.value).filter(value => value !== '');
            });

            // Iterate over each meal time
            for (let time of times) {
                // Select the meal time and wait for navigation
                await Promise.all([
                    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
                    page.select('#selMeal', time)
                ]);

                await page.waitForSelector('#selMeal');
                // console.log(`${time} at ${location.name} loaded`);

                const nutritionalLinks = await page.evaluate(() => {
                    return Array.from(document.querySelectorAll('a'))
                        .filter(link => link.textContent.includes('Nutrition') || link.href.includes('nutrition'))
                        .map(link => ({
                            href: link.href,
                            text: link.innerText
                        }));
                });

                // console.log(`Successfully scraped for ${time} at ${location.name}`);

                nutritionalLinks.forEach(link => {
                    let mealTime = ""
                    time == "Late Night" ? mealTime = "LateNight" : mealTime = time
                    links.push({
                        href: link.href,
                        text: link.text,
                        location: location.name,
                        time: mealTime
                    });
                });
            }
        }

        await browser.close();

        return links;

    } catch (error) {
        console.error("An error occurred:", error);
    }
};
