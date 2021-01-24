const express = require('express');
let faunadb = require('faunadb')
const { Octokit } = require("@octokit/core")
const { axios } = require("axios"); var bodyParser = require('body-parser');
const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const octokit = new Octokit({});

let q = faunadb.query
var client = new faunadb.Client({ secret: process.env.FUNNA_API_KEY })
axios

app.post('/post', function (request, response) {
    console.log(request.body) //you will get your data in this as object.
    response.send(request.body)
})


app.listen(3000, function () { })
