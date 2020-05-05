var params = new URLSearchParams(window.location.search);

var nameUser_params = params.get('name');
var chatroom_params = params.get('chatroom');

//jQ references
let divUsers = $('#divUsuarios');
let formSend = $('#formSend');
let txtMessage = $('#txtMessage');
let divChatbox = $('#divChatbox');

//Functions for render users
function renderUsers(persons) { // [{}{}{}{}]
    console.log(persons);

    let html = `
        <li>
            <a href="javascript:void(0)" class="active"> Chat de <span> ${params.get('chatroom')}</span></a>
        </li>    
    `;

    for (let i = 0; i < persons.length; i++) {
        html += `
            <li>
                <a data-id=${persons[i].id} href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${persons[i].name} <small class="text-success">online</small></span></a>
            </li>        
        `;
    }

    divUsers.html(html);
}

function renderMessages(message, me) { //date, message, name

    let date = new Date(message.date);
    var hour = date.getHours() + ':' + date.getMinutes();
    let html = '';

    let adminClass = 'info';
    let adminClassImg = '';

    if (message.name === "Admin") {
        adminClass = 'danger';
        adminClassImg = 'd-none';
    }

    if (me) {
        html = `
            <li class="reverse">
                <div class="chat-content">
                    <h5>${message.name}</h5>
                        <div class="box bg-light-inverse">${message.message}</div>
                </div>
                <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>
                <div class="chat-time">${hour}</div>
            </li>
        `;
    } else {
        html = `
            <li class="animated fadeIn">
                <div class="chat-img ${adminClassImg}" ><img src="assets/images/users/1.jpg" alt="user" /></div>
                    <div class="chat-content">
                        <h5>${message.name}</h5>
                        <div class="box bg-light-${adminClass}">${message.message}</div>
                    </div>
                <div class="chat-time">${hour}</div>
            </li>
        `;
    }

    divChatbox.append(html);



}


//Listeners
divUsers.on('click', 'a', function() {
    let id = $(this).data('id');
    if (id) console.log(id);
});

formSend.on('submit', function(e) {

    e.preventDefault();
    if (txtMessage.val().trim().length === 0) return;

    socket.emit('createMessage', {
        usuario: nameUser_params,
        message: txtMessage.val()
    }, function(message) {
        txtMessage.val('').focus();
        renderMessages(message, true);
        scrollBottom();
    });

});


function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}