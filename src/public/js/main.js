$(function(){
    const socket = io();
    //accedemos a los elementos del dom
    var nick = '';
    const messageForm = $('#message-form');
    const messageBox = $('#message');
    const chat = $('#chat');
    const exitForm = $('#exit-form');

    const nickForm = $('#nick-form');
    const nickError = $('#nick-error');
    const nickName = $('#nick-name');
    const userNames = $('#usernames');

    $(document).ready(function() {        
        var refreshId =  setInterval( function(){
            if(nick!=""){
            socket.emit('usuarios conectados');
            }
        }, 1000 );        
    });

    //eventos

    //enviamos un mensaje al servidor
    messageForm.submit(e => {
        e.preventDefault();
        console.log('Envio un mensaje desde el cliente clikeando');
        socket.emit('enviar mensaje', messageBox.val());
        messageBox.val('')
    })

    //obtenemos respuesta del server

    socket.on('nuevo mensaje', function(datos){
        console.log('El valor de datos.username es: ', datos.username);
        let color = "#f4f4f4";
        if(nick == datos.username){
            color = "#9ff4c5";
        }
        chat.append(`<div class="msg-area mb-2" style="background-color:${color}"><b>${datos.username}</b><p class="msg">${datos.msg}</p></div>`);
    });

    //nuevo usuario
    nickForm.submit( e =>{
        e.preventDefault();
        socket.emit('nuevo usuario', nickName.val(), datos => {
            if(datos){
                nick = nickName.val();
                $('#nick-wrap').hide();
                $('#content-wrap').show();
            }else{
                nickError.html('<div class="alert alert-danger">Ya hay un usuario registrado con ese nombre :/</div>');
            }
            nickName.val('');
        });
    });

    //obtenemos el array de usuarios conectados

    socket.on('nombre usuario', datos =>{
        let html='';
        let color = '';
        let salir = '';

        for(let i=0; i < datos.length; i++){
            if(nick == datos[i]){
                color = "#027f43";
                salir = '';
            }else{
                color="#000";
                salir='';
            }
            html += `<p style="color: ${color}">${datos[i]} ${salir}</p>`;
        }
        userNames.html(html);
    });

    exitForm.submit(e => {
        e.preventDefault();
        console.log('Cerrando sesion');
        socket.emit('salir', nick, callback => {
            if(callback){
                location.reload();
            }else{
                console.log('error al salir sesion');
            }
        });
        
    });

})
