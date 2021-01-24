const express = require('express');
const faunadb = require('faunadb');
const { Octokit } = require("@octokit/core");
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const octokit = new Octokit({});

let q = faunadb.query
var client = new faunadb.Client({ secret: process.env.FUNNA_API_KEY })

app.post('/create', async function (request, response) {
    console.log(request.body)
    console.log(request.body["h-captcha-response"])
    const params = new URLSearchParams()
    params.append('response', request.body["h-captcha-response"])
    params.append('secret', process.env.HCAPTCHA_SECRET_KEY)
    const resp = await axios.post("https://hcaptcha.com/siteverify", params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "X-Client": "axios",
            "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 20_0_0 like Mac OS X) AppleWebKit/604.1.28 (KHTML, like Gecko) Version/20.0.0 Mobile/14A403 Mobile/604.1.28"
        }
    })
    console.log(resp.data)
    response.send(request.body)
})


app.listen(3000, function () { })
