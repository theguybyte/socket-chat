var socket = io();

var params = new URLSearchParams(window.location.search);
if (!params.has('name') || !params.has('name')) {
    window.location = 'index.html';
    throw new Error('The chatroom and name is necesary');

}

var user = {
    name: params.get('name'),
    chatroom: params.get('chatroom')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('enterInChat', user, function(resp) {
        console.log('Connected users', resp);
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});

// Enviar información
/* socket.emit('createMessage', {
    usuario: 'Fernando',
    mensaje: 'Hola Mundo'
}, function(resp) {
    console.log('respuesta server: ', resp);
}); */

// Escuchar información
socket.on('createMessage', function(mensaje) {

    console.log('Servidor:', mensaje);

});


//Listen changes in Users, when un User enter or gone from chat
socket.on('listPersons', function(persons) {
    console.log(persons);
});


//Direct Message
socket.on('directMessage', function(message) {
    console.log('DM', message);
});