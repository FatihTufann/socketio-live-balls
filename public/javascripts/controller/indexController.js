app.controller('indexController', ['$scope', 'indexFactory', ($scope, indexFactory) => {
    const connectionsOptions = {
        reconnectionAttempts: 3,
        reconnectionDelay: 600
    };
    indexFactory.connectSocket('http://localhost:3000', connectionsOptions).then((socket) => {
        console.log('baglanti gerceklesti', socket);
    }).catch((err) => {
       console.log(err);
    });
}]);