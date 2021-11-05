app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {

    $scope.messages = [ ];
    $scope.players = { };

    $scope.init = () => {
      const username = prompt('please enter username');

      if (username)
          initSocket(username);
      else
          return false;
    };

    function initSocket(username){
        const connectionsOptions = {
            reconnectionAttempts: 3,
            reconnectionDelay: 600
        };
        indexFactory.connectSocket('http://localhost:3000', connectionsOptions)
            .then((socket) => {
                socket.emit('newUser', {username});

                socket.on('initPlayers', (players) => {
                    $scope.players = players;
                    $scope.$apply();
                });

                socket.on('newUser', (data) => {
                    const messageData = {
                        type: {
                            code: 0,
                            message: 1
                        },
                        username: data.username
                    };

                    $scope.messages.push(messageData);
                    $scope.players[data.id] = data;
                    $scope.$apply();
                });

                socket.on('disUser', (user) => {
                    const messageData = {
                        type: {
                            code: 0,
                            message: 0
                        },
                        username: user.username
                    };
                   console.log(user);
                   $scope.messages.push(messageData);
                   delete $scope.players[user.id];
                   $scope.$apply();
                });

                socket.on('animate', (data) => {
                    $('#'+ data.socketId).animate({ 'left': data.x, 'top': data.y}, () => {
                        animate = false;
                    });
                });

                let animate = false;
                $scope.onClickPlayer = ($event) => {
                    if (!animate){
                        let x = $event.offsetX;
                        let y = $event.offsetY;
                        socket.emit('animate',{ x, y});

                        animate = true;
                        $('#'+ socket.id).animate({ 'left': x, 'top': y}, () => {
                            animate = false;
                        });
                    }


                };

            }).catch((err) => {
                console.log(err);
            });
    };

}]);