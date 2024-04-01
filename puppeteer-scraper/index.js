import puppeteer from "puppeteer";

const getMenuItems = async () => {

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto("https://menu.hfs.psu.edu/shortmenu.aspx?sName=Penn+State+Housing+and+Food+Services&locationNum=50&locationName=Harrisburg%2c+Stacks&naFlag=1&WeeksMenus=This+Week%27s+Menus&myaction=read&dtdate=3%2f31%2f2024", {
    waitUntil: "domcontentloaded",
  });

  const menu = await page.evaluate(() => {

    const menuItems = document.querySelectorAll(".shortmenurecipes");

    return Array.from(menuItems).map((item) => {

      const itemName = item.innerText.slice(0, -1);

      return { itemName };
    });
  });

  console.log(menu);

  await browser.close();
};

getMenuItems();