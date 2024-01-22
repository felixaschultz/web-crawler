import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
app.use(express.json());
app.use(cors());

app.get("/crawl", async (req, res) => {
    const url = "https://" + req.query.url;
    
    try{
        const response = (await axios.get(url));
        res.status(200).send(response.headers);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

app.listen(3002, () => {
    console.log('Server is listening on port 3002');
});