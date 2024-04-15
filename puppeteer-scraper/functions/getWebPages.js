import puppeteer from "puppeteer";

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

/*const test = await getWebPages();
console.log(test);*/