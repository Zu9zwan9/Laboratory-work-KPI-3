const http = require('http');
const pid = process.pid;
const express = require('express')
const app = express()
const port = process.env.PORT || 8800
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({
    extended: true
})

const {
    initializeApp,
    applicationDefault,
    cert
} = require('firebase-admin/app');
const {
    getFirestore,
    Timestamp,
    FieldValue,
    DocumentSnapshot
} = require('firebase-admin/firestore');
const {
    credential
} = require("firebase-admin");

const serviceAccount = require('./serviceAccountKey.json');
app.use(express.urlencoded({
    extended: true
}))
app.use(express.json());

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();



app.post('/createChat', async (req, res) => {
    const chatId = req.body.chatId;
    const name = req.body.name;
    const privacy = req.body.privacy;
    const emoji = req.body.emoji;
    const snapshot = await db.collection("chats").add({
        chatId,
        name,
        privacy,
        emoji,
        timestamp: Timestamp.now()
    });
    res.send({
        "result": "Success"
    });
});
app.post('/addUser', async (req, res) => {
    const userId = req.body.userId;
    const name = req.body.name;
    const PhoneNum = req.body.PhoneNum;
    const snapshot = await db.collection("users").add({
        userId,
        name,
        PhoneNum,
        timestamp: Timestamp.now()
    });
    res.send({
        "result": "Success"
    });
});
app.get('/getUser/:userId', async (req, res) => {
    const userId = req.params.userId;
    const name = req.body.name;
    const snapshot = await db.collection('users').doc(userId).get();
    res.send(snapshot.data());
});

app.post('/sendMessage', async (req, res) => {
    const userId = req.body.userId;
    const name = req.body.name;
    const chatId = req.body.chatId;
    const message = req.body.message;
    const snapshot = await db.collection('chats').doc(chatId).collection("messages").add({
        userId,
        name,
        chatId,
        message,
        timestamp: Timestamp.now()
    });
    res.send({
        "result": "Success"
    });
});

app.get('/getMessages/:chatId', async (req, res) => {
    const chatId = req.params.chatId;
    const userId = req.headers["userId"];
    const snapshot = await db.collection('chats').doc(userId).get();
    res.send(snapshot.data());
});

const server = http
    .createServer((req, res) => {
        for (let i = 0; i < 1e7; i++) {}
        res.end(`Hello from Node.js! \n`);
    })
    .listen(8800, () => {
        console.log(`Worker started. Pid: ${pid}`);
    });

process.on('SIGINT', () => {
    console.log('Signal is SIGINT');
    server.close(() => {
        process.exit(0);
    })
});

process.on('SIGTERM', () => {
    console.log('Signal is SIGTERM');
    server.close(() => {
        process.exit(0);
    })
});

process.on('SIGUSR2', () => {
    console.log('Signal is SIGUSR2');
    server.close(() => {
        process.exit(1);
    })
});

app.use(express.static(__dirname));