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
        page.setUserAgent('Intastellar Cookiebot', {
            architecture: 'INTASTELLAR_COOKIEBOT_V1',
            mobile: false,
        });
        const client = await page.target().createCDPSession();
        await page.goto(url, { waitUntil: 'load', timeout: 0 });
        let cookies = [];
        
        const selectors = ['.intastellarCookieSettings--acceptAll', '#coiOverlay button.coi-banner__accept'];
        if(acceptAll === 'true'){
            const promises = selectors.map(async (selector) => {
                try {
                    /* await page.waitForNavigation({ waitUntil: 'load', timeout: 0 }); */
                    await page.waitForSelector(selector, {waitUntil: 'load', timeout: 0 });

                    /* try{ */
                        await page.$(selector);
                        await page.click(selector);
                    /* }catch(err){
                        console.log(err);
                    } */
                   // console.error(`Selector '${selector}' not found within the specified timeout.`);
                    /* return { selector, status: 'rejected', error: error.message }; */
                    
                } catch (error) {
                    console.error(`Selector '${selector}': ${error.message}`);
                    // Handle the case where the selector is not found for this selector
                    return { selector, status: 'rejected', error: error.message };
                }
            });
            
            const results = await Promise.allSettled(promises);
            console.log(results);
            cookies = await client.send('Network.getAllCookies');
        }else{
            cookies = await client.send('Network.getAllCookies');
        }
        
        /* cookies = cookies.flat(); */
        console.log('Cookies:', cookies.cookies);

        await browser.close();
        res.status(200).json(cookies.cookies);
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