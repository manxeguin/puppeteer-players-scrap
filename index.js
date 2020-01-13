const puppeteer = require('puppeteer');

const clickElement = async (page, selector) => {
  const allResultsSelector = selector;
  await page.waitForSelector(allResultsSelector);
  return page.click(allResultsSelector);
}

const scrapPlayers = async () => {
    const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.comuniazo.com/comunio/jugadores');
  await clickElement(page, '#qcCmpButtons > button:nth-child(2)')

  // Players and price

  const players = await page.evaluate(() => {

    const parsePlayerRow = (row) => {
      const playerNameSelector = 'tr > td:nth-child(1) > a > div > strong';
      const playerPriceSelector = 'tr > td:nth-child(8)';
      const playerName = row.querySelectorAll(playerNameSelector);
      const playerPrice = row.querySelectorAll(playerPriceSelector);
    
      return {
          name: playerName[0] ? playerName[0].textContent : null,
          price: playerPrice[0] ? playerPrice[0].textContent : null
      };
    }

    const playerRows = 'body > div.content.content-players > div > div.box.table-players > div > div.scroll-content > table > tbody tr';
    const rows = Array.from(document.querySelectorAll(playerRows));
    return rows.map(parsePlayerRow);
  });

  await browser.close();
  return players;
}

const players = scrapPlayers().then((results) => {
    console.log(results);
});
