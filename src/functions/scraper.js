const { app } = require('@azure/functions');
const puppeteer = require('puppeteer-core');
//const puppeteer = require('puppeteer');

app.http('scraper', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        let urlString = "https://pptr.dev";
        const url = new URL(urlString);
        try {
            // const browser = await puppeteer.launch({
            //     headless: true,
            //     executablePath:  `${process.cwd()}/chrome/linux-134.0.6998.165/chrome-linux64/chrome`,
            //     args: ['--no-sandbox', '--disable-setuid-sandbox']
            // });
            const browser = await puppeteer.launch({
                headless: true,
                executablePath:  `${process.cwd()}/chrome/chrome.exe`,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            const page = await browser.newPage()
            await page.goto(url.href, { waitUntil: 'domcontentloaded' })
            const data = await page.evaluate(() => {
                const titles = Array.from(document.querySelectorAll('h2'))
                textValue = "";
                titles.forEach(title => {
                    textValue = textValue + title.innerHTML;
                });
                return textValue;
            })
            console.log(data)
            await browser.close()

            return { body: data };
        } catch (err) {
            return {
                body: JSON.stringify({ "error": err.stack })
            }
        }

    }
});
