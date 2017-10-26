var ws = require("nodejs-websocket");

//funkcja parametr - wykonuje się kiedy ktoś się podłączy do serwera
var server = ws.createServer( function(conn) {
    //console.log(conn);
    conn.on("text", function(data){
        var dataObject = JSON.parse(data);

        //console.log(data);
        if (dataObject.type == "join") {
            conn.nickName = dataObject.name;
            sendToAll({
                type: "status",
                message: conn.nickName + " dołaczył/a do czatu."
            });
        } else if (dataObject.type == "message") {
            sendToAll({
                type: "message",
                name: conn.nickName,
                message: dataObject.message
            });
        }
    } );

    conn.on("close", function() {
        if (conn.nickName) {
            sendToAll({
                type: "status",
                message: conn.nickName + " opuścił/a czat."
            });
        }
    });

    conn.on("error", function(){
        console.log("koniec połączenń");
    });
    console.log("nowy klient podłaczony");
}).listen(9090, "localhost", function() {
    console.log("start - serwer działa");
});

function sendToAll(data) {
    var msg = JSON.stringify(data);

    server.connections.forEach(function(conn) {
        conn.sendText(msg);
    });
}