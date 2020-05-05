const { io } = require('../server');

const { Users } = require('../classes/users.js');

const { createMessage } = require('../utils/utils');

const users = new Users();

io.on('connection', (client) => {

    console.log('Usuario conectado');

    //Listen
    client.on('enterInChat', (user, callback) => {

        if (!user.name || !user.chatroom) {
            return callback({
                error: true,
                message: 'The name is mandatory'
            })
        }

        client.join(user.chatroom);

        users.addPerson(client.id, user.name, user.chatroom);

        client.broadcast.to(user.chatroom).emit('listPersons', users.getPersonsInChatroom(user.chatroom));
        client.broadcast.to(user.chatroom).emit('createMessage', createMessage('Admin', `${user.name} has joined`));


        callback(users.getPersonsInChatroom(user.chatroom));

    });

    client.on('disconnect', () => {

        let deletedPerson = users.removePerson(client.id);
        client.broadcast.to(deletedPerson.chatroom).emit('createMessage', createMessage('Admin', `${deletedPerson.name} has gone`));
        client.broadcast.to(deletedPerson.chatroom).emit('listPersons', users.getPersonsInChatroom(deletedPerson.chatroom));

    });

    client.on('createMessage', (data, callback) => {
        let person = users.getPerson(client.id);
        let message = createMessage(person.name, data.message);

        client.broadcast.to(person.chatroom).emit('createMessage', message);

        callback(message);
    });

    //Direct message
    client.on('directMessage', (data) => {

        let person = users.getPerson(client.id);

        client.broadcast.to(data.to).emit('directMessage', createMessage(person.name, data.message));

    });

});