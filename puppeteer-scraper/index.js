import puppeteer from "puppeteer";

const getLinks = async () => {

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto("https://menu.hfs.psu.edu/", {
    waitUntil: "domcontentloaded",
  });

  const links = await page.evaluate(() => {
    const mappedLinks = Array.from(document.querySelectorAll("#menu-container a")).map((elementHandle) => ({
      name : elementHandle.innerText,
      link : elementHandle.href,
    }));
    return mappedLinks.filter(link => link.name !== "")
  });
  
  await browser.close();
  return links;
};

(async () => {
  const links = await getLinks();
  console.log(links);
})();