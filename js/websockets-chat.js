(function() {

    function debugLine() {
        console.log("-".repeat(30));
    }

    var chat = {


        sendData: function(msg) {
            var data = JSON.stringify(msg);
            this.socket.send(data);
        },

        sendMessage: function() {
            var message = this.messageInput.value;

            if (message !== "") {
                this.sendData({
                    type: "message",
                    message: message
                });
                this.messageInput.value="";
            }
        },

        renderRow: function(data) {
            var chatRow = document.createElement("div"),
                date = new Date(),
                time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
                message;

                chatRow.classList.add("chatRow");

                if (data.type == "status") {
                    message = "<span class='status'>" + data.message + "</span>";
                }
                else 
                    message = "<span class='name'>" + data.name + ": </span><span class='message'>" + data.message + "</span>";
                
                chatRow.innerHTML = "<span class='time'>" + time + "</span>\n" + message;

                this.chatWindow.appendChild(chatRow);
                this.chatWindow.scrollTop = this.chatWindow.scrollHeight;
        },

        displayMessage: function(e) {
            var data = JSON.parse(e.data);
            this.renderRow(data);

        },


        joinToChat: function(e) {
            var name = this.nameInput.value;
    
            if(name) {
                this.sendData({
                    type: "join",
                    name: name
                });

                e.target.onclick = null;
                e.target.setAttribute("disabled", "disabled");
                this.nameInput.setAttribute("readonly","readonly");

                this.submitButton.removeAttribute("disabled");
                this.submitButton.onclick = this.sendMessage.bind(this);
                

            }
        },

        stopApp: function() {
            this.joinButton.onclick = null;
            this.joinButton.setAttribute("disabled", "disabled");

            this.submitButton.onclick = null;
            this.submitButton.setAttribute("disabled", "disabled");

            console.log("rozłączenie");
            this.renderRow({
                type: "status",
                message: "Przerwano połaczenie z serwerem."
            });
        },

        connectToServer: function() {
            this.socket = new WebSocket("ws://localhost:9090");
            this.socket.onmessage = this.displayMessage.bind(this);
            this.socket.onclose = this.stopApp.bind(this);

        },

        init: function() {
            if (!window.WebSocket) return;

            this.nameInput = document.querySelector("#yourName");
            this.joinButton = document.querySelector("#join");
            this.chatWindow = document.querySelector("#chatWindow");
            this.messageInput = document.querySelector("#message");
            this.submitButton = document.querySelector("#submit");

            this.joinButton.onclick = this.joinToChat.bind(this);

            this.connectToServer();
        }
    }


    chat.init();
})();
