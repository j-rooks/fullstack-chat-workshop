const express = require('express');
const multer = require('multer');
const upload = multer({
  dest: __dirname + '/build/images',
});
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const reloadMagic = require('./reload-magic.js');
const passwords = {};
const sessions = {};
const directMessages = {};
const chatRooms = {};
reloadMagic(app);

class Message {
  constructor(username, message, img) {
    this.username = username;
    this.message = message;
    this.img = img;
    this.timestamp = Date.now();
  }
}

app.use('/', express.static('build'));

app.get('/session', (req, res) => {
  const sessionId = req.cookies.sid;
  if (sessions[sessionId]) {
    const username = sessions[sessionId];
    return res.send(JSON.stringify({ success: true, username }));
  }
  res.send(JSON.stringify({ success: false }));
});

app.get('/chatrooms', function(req, res) {
  const sessionId = req.cookies.sid;
  if (!sessions[sessionId]) {
    return res.send(
      JSON.stringify({ success: false, message: 'Invalid session' })
    );
  }
  res.send(
    JSON.stringify({
      success: true,
      chatRooms,
    })
  );
});

app.get('/direct-messages', (req, res) => {
  const sessionId = req.cookies.sid;
  const username = sessions[sessionId];
  res.send(
    JSON.stringify({
      success: true,
      messages: directMessages[username],
    })
  );
});

app.post('/kick', upload.none(), (req, res) => {
  const sessionId = req.cookies.sid;
  const username = sessions[sessionId];
  const chatRoom = chatRooms[req.body.roomName];
  const usernameToKick = req.body.username;
  if (!passwords[usernameToKick]) {
    return res.send(
      JSON.stringify({ success: false, message: 'User does not exist' })
    );
  }
  if (chatRoom.admin !== username) {
    return res.send(
      JSON.stringify({
        success: false,
        message: 'Only the admin of the chat room can kick users',
      })
    );
  }
  chatRoom.users.splice(chatRoom.users.indexOf(usernameToKick), 1);
  chatRoom.messages.push(
    new Message('Notification', `${usernameToKick} was kicked`)
  );
  res.send(JSON.stringify({ success: true }));
});

app.post('/logout', (req, res) => {
  const sessionId = req.cookies.sid;
  delete sessions[sessionId];
  res.send(JSON.stringify({ success: true }));
});

app.post('/delete', upload.none(), (req, res) => {
  const sessionId = req.cookies.sid;
  const username = sessions[sessionId];
  const roomName = req.query.roomName;
  const chatRoom = chatRooms[roomName];
  chatRoom.messages = chatRoom.messages.filter(
    (message) => message.username !== username
  );
  res.send(JSON.stringify({ success: true }));
});

app.post('/newmessage', upload.single('img'), (req, res) => {
  console.log('*** inside new message');
  console.log('body', req.body);
  const sessionId = req.cookies.sid;
  const username = sessions[sessionId];
  console.log('username', username);
  const roomName = req.body.roomName;
  const msg = req.body.message;
  const imgPath = req.file ? `/images/${req.file.filename}` : '';
  const newMsg = new Message(username, msg, imgPath);
  console.log('new message', newMsg);
  chatRooms[roomName].messages.push(newMsg);
  console.log('updated chat room', chatRooms[roomName]);
  res.send(JSON.stringify({ success: true }));
});

app.post('/direct-message', upload.none(), (req, res) => {
  const sessionId = req.cookies.sid;
  const username = sessions[sessionId];
  const recipient = req.body.username;
  const message = req.body.message;
  if (!passwords[recipient]) {
    return res.send(
      JSON.stringify({ success: false, message: 'User does not exist' })
    );
  }
  directMessages[recipient].push(new Message(username, message));
  res.send(JSON.stringify({ success: true }));
});

app.post('/create-room', upload.none(), (req, res) => {
  const sessionId = req.cookies.sid;
  const username = sessions[sessionId];
  const roomName = req.body.roomName;
  chatRooms[roomName] = { admin: username, messages: [], users: [] };
  res.send(JSON.stringify({ success: true }));
});

app.post('/join', upload.none(), (req, res) => {
  const sessionId = req.cookies.sid;
  const username = sessions[sessionId];
  const roomName = req.query.roomName;
  const chatRoom = chatRooms[roomName];
  chatRoom.users.push(username);
  chatRoom.messages.push(new Message('Notification', `${username} has joined`));
  res.send(JSON.stringify({ success: true }));
});

app.post('/leave', upload.none(), (req, res) => {
  const sessionId = req.cookies.sid;
  const username = sessions[sessionId];
  const roomName = req.query.roomName;
  const chatRoom = chatRooms[roomName];
  chatRoom.users.splice(chatRoom.users.indexOf(username), 1);
  chatRoom.messages.push(new Message('Notification', `${username} has left`));
  res.send(JSON.stringify({ success: true }));
});

app.post('/login', upload.none(), (req, res) => {
  console.log("**** I'm in the login endpoint");
  console.log('this is the parsed body', req.body);
  const username = req.body.username;
  const enteredPassword = req.body.password;
  const expectedPassword = passwords[username];
  console.log('expected password', expectedPassword);
  if (enteredPassword === expectedPassword) {
    console.log('password matches');
    const sessionId = generateId();
    console.log('generated id', sessionId);
    sessions[sessionId] = username;
    res.cookie('sid', sessionId);
    res.send(JSON.stringify({ success: true }));
    return;
  }
  res.send(JSON.stringify({ success: false }));
});

const generateId = () => {
  return '' + Math.floor(Math.random() * 100000000);
};

app.post('/signup', upload.none(), (req, res) => {
  console.log("**** I'm in the signup endpoint");
  console.log('this is the body', req.body);
  const username = req.body.username;
  const enteredPassword = req.body.password;
  if (passwords[username]) {
    return res.send({ success: false, message: 'Username taken' });
  }
  passwords[username] = enteredPassword;
  directMessages[username] = [];
  console.log('passwords object', passwords);
  const sessionId = generateId();
  console.log('generated id', sessionId);
  sessions[sessionId] = username;
  res.cookie('sid', sessionId);
  res.send(JSON.stringify({ success: true }));
});

app.all('/*', (req, res, next) => {
  res.sendFile(__dirname + '/build/index.html');
});

app.listen(4000);
