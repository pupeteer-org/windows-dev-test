const { app } = require('@azure/functions');
//const puppeteer = require('puppeteer-core');
const puppeteer = require('puppeteer');

app.http('scraper', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        let urlString = "https://pptr.dev";
        const url = new URL(urlString);
        try {
            const browser = await puppeteer.launch();
            // const browser = await puppeteer.launch({
            //     headless: true,     
            //     args: ['--no-sandbox', '--disable-setuid-sandbox']
            // });
            // const browser = await puppeteer.launch({
            //     headless: true,
            //     executablePath:  `${process.cwd()}/chrome/win64-135.0.7049.41/chrome-win64/chrome.exe`,
            //     args: ['--no-sandbox', '--disable-setuid-sandbox']
            // });
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
