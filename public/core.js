var reporteClima = angular.module('reporteClima', []);

reporteClima.controller('mainController',function($scope, $http){
  //$scope.datosCargados = false;
  if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position){
      $scope.$apply(function(){
        $scope.datosCargados = true;
        console.log(position);
        $scope.position = position;
        $http.get("/weather?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude)
          .success(function(data){
              $scope.resultados = data;
              var urlvoz = "/voz?texto=La temperatura actual es "+ $scope.resultados.data.observation.temp + "grados centígrados con un cielo " + $scope.resultados.data.observation.wx_phrase;
              initMediaObject(urlvoz);
              //console.log(data);
              console.log($scope)
            })
            .error(function(data){
              console.log('Error: ' + data);
            });
      });
    });
  }
  //console.log($scope.position);
});

function initMediaObject(theFile){
    // HTML5 Audio
    if (typeof Audio != "undefined") {
        console.log("HTML5 audio");
       new Audio(theFile).play() ;

       // Phonegap media
     } else if (typeof device != "undefined") {
       console.log("Phonegap audio");
       // Android needs the search path explicitly specified
       if (device.platform == 'Android') {
           //src = '/android_asset/www/' + src;
       }
       console.log('Using: ' + theFile);

       //Create the media object we need to do everything we need here
       console.log("Creating media object");
       theMedia = new Media(theFile, function onSuccess() {
                // release the media resource once finished playing
                mediaRes.release();
            },
            function onError(e){
                console.log("error playing sound: " + JSON.stringify(e));
            });
        theMedia.play();
       //console.log("Media: " + JSON.stringify(theMedia));
      };
    };
