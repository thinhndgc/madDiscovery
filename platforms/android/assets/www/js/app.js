(function(){
  'use strict';
  var module = angular.module('app', ['onsen']);

  module.controller('MasterController', function($scope, $data) {
    $scope.items = $data.items;

    $scope.showDetail = function(index) {
      var selectedItem = $data.items[index];
      $data.selectedItem = selectedItem;
      $scope.navi.pushPage('detail.html', {title : selectedItem.title});
    };
  });

  module.controller('DetailController', function($scope, $data) {
    $scope.item = $data.selectedItem;
  });

  module.factory('$data', function() {
    var data = {};
    data.items = [];
    var db = null;
    var listEvents = [];
    db = window.openDatabase("madDiscovery", "1.0", "madDiscovery", 2000000);
    db.transaction(function(tx){
      tx.executeSql("CREATE TABLE IF NOT EXISTS TBLEvents(ID Integer PRIMARY KEY, eventName TEXT, eventType TEXT, eventDate TEXT, startTime TEXT, OrgName TEXT, location TEXT, locationLat FLOAT, locationLng FLOAT);");
    },
    function (err) {
      console.log('Create table error, error code: ' + err.message);
    },
    function(){
      console.log('Table created!');
    });
    db.transaction(function (tx){
      tx.executeSql("SELECT * FROM TBLEvents;", [], function(tx,rs){
        var numberOfEvent = rs.rows.length;
        for (var i = 0; i < numberOfEvent; i++) {
          listEvents.push({"ID": rs.rows.item(i).ID, "eventName": rs.rows.item(i).eventName,
          "eventType": rs.rows.item(i).eventType, "eventDate": rs.rows.item(i).eventDate,
          "startTime": rs.rows.item(i).startTime, "OrgName": rs.rows.item(i).OrgName,
          "location": rs.rows.item(i).location, "locationLat": rs.rows.item(i).locationLat,
          "locationLng": rs.rows.item(i).locationLng});
          console.log(listEvents[i]["eventName"]);
          data.items.push({
            id: listEvents[i]["ID"],
            eventName: listEvents[i]["eventName"],
            location: listEvents[i]["location"],
            eventDate: listEvents[i]["eventDate"],
            startTime: listEvents[i]["startTime"],
            eventType: listEvents[i]["eventType"]
        });
        }
      });
    },
    function (err) {
      console.log('Get list events error, error code: ' + err.code);
    });
    return data;
  });
})();
