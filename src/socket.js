const { format } = require("express/lib/response");

//aca va a estar toda la logica del servidor
module.exports = (io) => {
    let nickNames = [];
    io.on('connection', socket=>{
        //console.log('Nuevo usuario conectado');

        //al recibir el mensaje levantamos los datos del mismo:
        socket.on('enviar mensaje', (datos) => {
            //console.log(socket.nickName);
            io.sockets.emit('nuevo mensaje', {
                msg:datos,
                username:socket.nickName
            });
        });

        socket.on('nuevo usuario', (datos, callback) => {
            if(nickNames.indexOf(datos) != -1){
                callback(false);
            }else{
                callback(true);
                socket.nickName = datos;
                nickNames.push(socket.nickName);
                io.sockets.emit('nombre usuario', nickNames);
            }
        });
        //cuando recibo el evento salir, hago log out.
        socket.on('salir', (datos, callback) => {
            //console.log(socket.nickName);
            let encontrado = false;
            for(let i=0; i<nickNames.length;i++){
                
                if(datos == nickNames[i]){
                    //console.log('entre al if');
                    nickNames.splice(i,1);
                    encontrado=true;
                    break;
                }
            }
            callback(encontrado);
        });

        socket.on('usuarios conectados', () => {
            io.sockets.emit('nombre usuario', nickNames);
        });
    });
}