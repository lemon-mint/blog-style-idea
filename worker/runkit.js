const express = require('express');
let faunadb = require('faunadb')
const { Octokit } = require("@octokit/core")
const { axios } = require("axios");

const octokit = new Octokit({});

const app = express()
let q = faunadb.query
var client = new faunadb.Client({ secret: process.env.FUNNA_API_KEY })
axios

app.get('/repos/:user', async function (req, res) {
    res.send(data.data);
})


app.listen(3000, function () { })
