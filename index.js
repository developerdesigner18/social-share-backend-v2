import http from "http"
import { async } from "regenerator-runtime";
import colors from 'colors'

import app from "./server"
const Chat = require("./api/chat/chat.modal");
const Pusher = require('pusher')
const User = require('./api/users/user.controller')
let server = null;

if (process.env.NODE_ENV === "development") {
    server = http.createServer(app)
} else {
    console.log("This is the production environment")
    server = http.createServer(app)
}

const pusher = new Pusher({
    appId: "1230298",
    key: "91455e0618617fd0e25d",
    secret: "75a841f9bd99f1e1bd0d",
    cluster: "ap2",
    useTLS: true
});

pusher.trigger("my-channel", "my-event", {
    message: "hello world"
});

app.post('/pusher/auth', (req, res) => {
    const socketId = req.body.socket_id;
    const channel = req.body.channel_name;
    var presenceData = {
        user_id:
            Math.random()
                .toString(36)
                .slice(2) + Date.now()
    };
    const auth = pusher.authenticate(socketId, channel, presenceData);
    res.send(auth);
})

app.get('/', (req, res) => {
    res.send('welcome');
})

const PORT = process.env.PORT || 8000

const io = require('socket.io')(server, {
    cors: {
        origins: ['http://localhost:4200']
    }
});

const users = {}
const user = {}

io.on('connection', async (socket) => {

    socket.on('login', (data) => {
        // console.log("data", data)
        User.updateStatus(data)
        users[socket.id] = data.userId;
        socket.broadcast.emit("User_status", data.userId)
    })

    socket.broadcast.emit("Online", {
        users: user
    })

    //user when disconnected
    socket.on('disconnect', (data) => {
        console.log("socketid", users, socket.id)
        var query = { userId: '', status: 0 }
        Object.keys(users).forEach(element => {
            if (element == socket.id) {
                socket.broadcast.emit("User_status", users[element])
                query.userId = users[element]
                User.updateStatus(query)
                delete users[element]
            }
        });

        // if()
    });
    //Someone is typing
    // socket.on("typing", (data) => {
    //     console.log("data", data)
    //     socket.broadcast.emit('notifyTyping', data);
    //     // socket.in(data.recieverId).emit("notifyTyping", data);
    // });

    // const userId = await fetchUserId(socket);
    socket.on("typing", (data) => {
        socket.broadcast.emit('notifyStart', data)
    })

    socket.on('notifyStop', (data) => {
        socket.broadcast.emit('notifyStop', data)
    })

    //when soemone stops typing
    socket.on("stopTyping", () => {
        socket.broadcast.emit("notifyStopTyping");
    });

    //messages
    socket.on('my message', (msg) => {
        socket.broadcast.emit('my broadcast', msg);
    });
    //push notification
    socket.on('push_data', (data) => {
        socket.broadcast.emit('notify', {
            'msg': data.msg,
            'user': data.user,
            'name': data.name,
            'sender': data.sender
        });
    });
});

server.listen(PORT, async () => {
    try {
        console.log(`Server listening on port ${PORT}`.green)
    } catch (err) {
        console.log("Server init error".red, err)
    }
})