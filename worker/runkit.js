const express = require('express');
const faunadb = require('faunadb');
const { Octokit } = require("@octokit/core");
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const session = require('express-session');
const cryptoRandomString = require("crypto-random-string")

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
    secret: cryptoRandomString({ length: 24, type: 'url-safe' }),
    resave: false,
    saveUninitialized: true
}));

const octokit = new Octokit({});

let q = faunadb.query
var client = new faunadb.Client({ secret: process.env.FUNNA_API_KEY })

const oauth_redirect = "https://github.com/login/oauth/authorize?client_id=41a3215c5b2c3b92a8f3";

app.post('/create', async function (req, res) {
    let sess = req.session;
    if (sess.username) {
        const params = new URLSearchParams()
        params.append('response', req.body["h-captcha-response"])
        params.append('secret', process.env.HCAPTCHA_SECRET_KEY)
        const captcha_resp = await axios.post("https://hcaptcha.com/siteverify", params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                "X-Client": "axios",
                "User-Agent": "Axios/1.0"
            }
        })
        if (captcha_resp.data.success) {
            console.log("captcha Success")
            await client.query(
                q.Create(q.Collection('comment'), {
                    data: {
                        url: req.body["url"],
                        comment: req.body["comment"]
                    }
                })
            )
        }
    } else {
        sess.url = req.body["url"];
        sess.comment = req.body["comment"]
        res.redirect(oauth_redirect);
        return
    }
    res.send("error");
})

app.get("/signintest", async function (req, res) {
    let sess = req.session;
    res.send(sess)
})

app.get("/callback", async function (req, res) {
    let sess = req.session;
    res.send(sess)
})


app.listen(3000, function () { })
