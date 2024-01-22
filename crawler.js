import express from 'express';
import cors from 'cors';
import axios from 'axios';
import cheerio from 'cheerio';

const app = express();
app.use(express.json());
app.use(cors());

app.get("/crawl", async (req, res) => {
    const url = "https://" + req.query.url;
    const coookies = [];
    const links = [url];
    crawl(url).then(e => {
        e.cookies.forEach(cookie => {
            console.log("Cookie: " + cookie);
            coookies.push(cookie);
        });
        e.links.forEach(link => {
            /* console.log("First round: " + link); */
            if(!links.includes({
                "link": link,
                "foundOn": url
            })){
                links.push({
                    "link": link,
                    "foundOn": url
                });
                crawl(link).then(e2 => {
                    e2.cookies.forEach(cookie => {
                        console.log("Cookie: " + cookie);
                        coookies.push(cookie);
                    });
                    e2.links.forEach(link2 => {
                        /* console.log("Second round: " + link2); */
                        if(!links.includes({
                            "link": link2,
                            "foundOn": link
                        })){
                            links.push({
                                "link": link2,
                                "foundOn": link
                            });
                            crawl(link2).then(e3 => {
                                e3.cookies.forEach(cookie => {
                                    console.log("Found Cookie: " + cookie);
                                    coookies.push(cookie);
                                });
                                e3.links.forEach(link3 => {
                                    if(!links.includes({
                                        "link": link3,
                                        "foundOn": link2
                                    })){
                                        links.push({
                                            "link": link3,
                                            "foundOn": link2
                                        });
                                        crawl(link3).then(e4 => {
                                            e4.cookies.forEach(cookie => {
                                                console.log("Found Cookie: " + cookie);
                                                coookies.push(cookie);
                                            });
                                            e4.links.forEach(link4 => {
                                                if(!links.includes({
                                                    "link": link4,
                                                    "foundOn": link3
                                                })){
                                                    links.push({
                                                        "link": link4,
                                                        "foundOn": link3
                                                    });
                                                }
                                            })
                                            res.status(200).json({
                                                "cookies": coookies,
                                                "links": links
                                            });
                                        })
                                    }
                                });
                                
                            })
                        }
                    });
                });
            }
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).send(err);
    });
});

app.listen(3002, () => {
    console.log('Server is listening on port 3002');
});

async function crawl(url){
    const html = await axios.get(url);
    const $ = cheerio.load(html.data);
    const links = $('a');
    const linkArray = [];
    const cookies = [];
    const cookieArray = html.headers['set-cookie'];
    if(cookieArray !== undefined){
        cookieArray.forEach(cookie => {
            cookies.push(cookie);
        });
    }

    links.each((i, link) => {
        
        const foundLink = $(link).attr('href');
        if(
            foundLink !== undefined &&
            foundLink.includes('https://') ||
            foundLink !== undefined &&
            foundLink.includes('http://')
        ){
            linkArray.push(foundLink);
        }
    });
    return {
        cookies: cookies,
        links: linkArray
    };
}