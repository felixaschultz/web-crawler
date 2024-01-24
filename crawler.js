import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';

const port = process.env.PORT || 3003
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("public")) 

app.get("/", (req, res) => {
    res.status(200).send("Hello World");
})

app.get("/crawl", async (req, res) => {
    let url = req.query.url;
    let acceptAll = req.query.acceptAll;
    if(!req.query.url) res.status(400).json({message: "URL is required"});

    console.log(acceptAll);

    try{
        if(url.includes("https://") || url.includes("http://")){
            url = req.query.url
        }else{
            url = "http://" + req.query.url
        }
        const browser = await puppeteer.launch();
        const context = await browser.createIncognitoBrowserContext();

        const page = await context.newPage();
        await page.goto(url, { waitUntil: 'load', timeout: 0 });
        let cookies = [];
        let cookieCheck = false;
        if(acceptAll !== 'false'){
            let cookieBanner = await page.waitForSelector('.intastellarCookieSettings--acceptAll', { waitUntil: 'load', timeout: 120000 });
            if(!cookieBanner){
                cookieBanner = await page.waitForSelector('[data-cookiebanner=accept_button]', { waitUntil: 'load', timeout: 0 });
            }
            if(cookieBanner){
                await cookieBanner.click();
                await cookieBanner.dispose();
                await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
                cookieCheck = true;
            }
        }

        cookies.push(await page.cookies());
        cookies = cookies.flat();
        console.log('Cookies:', cookies);

        await browser.close();
        res.status(200).json(cookies);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
});

app.get("/crawl/site", async (req, res) => {
    let url = req.query.url;
    try{
        if(url.includes("https://") || url.includes("http://")){
            url = req.query.url
        }else{
            url = "http://" + req.query.url
        }
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'load', timeout: 0 });
        const content = await page.content();
        await browser.close();
        res.status(200).send(content);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
})

app.listen(port, () => {
    console.log('Server is listening on port https//localhost:' + port);
});

export default app;