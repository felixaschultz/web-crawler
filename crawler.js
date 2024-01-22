import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';

const port = process.env.PORT || 3003
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.status(200).send("Hello World");
})

app.get("/crawl", async (req, res) => {
    try{
        const url = "http://" + req.query.url;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'load', timeout: 0 });
        const cookies = await page.cookies();
        await browser.close();
        res.status(200).json(cookies);
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
});

app.get("/crawl/site", async (req, res) => {
    try{
        const url = "http://" + req.query.url;
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