import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';

const app = express();
app.use(express.json());
app.use(cors());

app.get("/crawl", async (req, res) => {
    const url = "https://" + req.query.url;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url);
    const cookies = await page.cookies();
    await browser.close();
    res.json(cookies);
    
});

app.listen(3003, () => {
    console.log('Server is listening on port https//localhost:3003');
});