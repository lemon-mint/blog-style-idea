const express = require('express');
const faunadb = require('faunadb');
const cors = require('cors');
const axios = require('axios');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false
}));

let q = faunadb.query
var client = new faunadb.Client({ secret: process.env.FUNNA_API_KEY })

const oauth_redirect = "https://github.com/login/oauth/authorize?client_id=41a3215c5b2c3b92a8f3";

app.post('/create', async function (req, res) {
    let sess = req.session;
    if (sess.username && sess.avatar_url) {
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
                        user: sess.username,
                        avatar_url: sess.avatar_url,
                        url: req.body["url"],
                        comment: req.body["comment"]
                    }
                })
            )
            res.send("OK");
            return
        }
        res.redirect(req.body["callback"]);
        return
    } else {
        sess.requirecallback = true;
        sess.callback = req.body["callback"];
        res.redirect(oauth_redirect);
        return
    }
})

app.get("/signintest", async function (req, res) {
    let sess = req.session;
    res.send(sess)
})

app.get("/gh/callback", async function (req, res) {
    let sess = req.session;
    const params = new URLSearchParams()
    params.append('client_id', "41a3215c5b2c3b92a8f3")
    params.append('client_secret', process.env.OAUTH2_SECRET)
    params.append('code', req.query.code)
    console.log(req.query.code)
    const oauth2_resp = await axios.post("https://github.com/login/oauth/access_token", params, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            "X-Client": "axios",
            "User-Agent": "Axios/1.0",
            "Accept": "application/json"
        }
    })
    console.log(oauth2_resp)
    if (oauth2_resp.data.access_token) {
        const user_resp = await axios.get("https://api.github.com/user", {
            headers: {
                "X-Client": "axios",
                "User-Agent": "Axios/1.0",
                "Accept": "application/json",
                "Authorization": `token ${oauth2_resp.data.access_token}`
            }
        });
        sess.username = user_resp.data.login;
        sess.avatar_url = user_resp.data.avatar_url;
        if (sess.requirecallback && sess.callback) {
            sess.requirecallback = false;
            const redirect = sess.callback;
            sess.callback = "";
            res.redirect(redirect);
            return
        }
        res.send(user_resp.data);
        return
    }
    res.send(oauth2_resp.data)
})

app.get('/session/test', async function (req, res) {
    let sess = req.session;
    res.send(sess.username && sess.avatar_url);
});

app.listen(3000, function () { })
