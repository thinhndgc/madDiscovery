var db = null;

// function onSuccessful(){
//   console.log('created');
// }

function getConnection() {
  db = window.openDatabase("madDiscovery", "1.0", "madDiscovery", 2000000);
  if (db != null) {
    console.log("Connected to DB!");
  }
  else {
    console.log('Connect to DB error!');
  }
}

function createTable(tx) {
  db.transaction(function(tx){
    //tx.executeSql('DROP TABLE IF EXISTS Events');
    tx.executeSql("CREATE TABLE IF NOT EXISTS TBLEvents(ID Integer PIMARY KEY, eventName TEXT, eventType TEXT, eventDate TEXT, startTime TEXT, OrgName TEXT, location TEXT, locationLat FLOAT, locationLng FLOAT);");
  },
  function (err) {
    console.log('Create table error, error code: ' + err.code);
  },
  function(){
    console.log('Table created!');
  });
}

function deteleData(value) {
  db.transaction(function(tx){
    //tx.executeSql('DROP TABLE IF EXISTS Events');
    tx.executeSql("DELETE FROM TBLEvents WHERE eventType = ?", [value]);
  },
  function (err) {
    console.log('Delete data error, error code: ' + err.code);
  },
  function(){
    console.log('Deleted Data!');
  });
}


function insertEvent(eventName,eventType,eventDate,startTime,OrgName,location,locationLat,locationLng,onSuccessful){
  db.transaction(function(tx){
    tx.executeSql("INSERT INTO TBLEvents(eventName,eventType,eventDate,startTime,OrgName,location,locationLat,locationLng) VALUES (?,?,?,?,?,?,?,?);",
    [eventName,eventType,eventDate,startTime,OrgName,location,locationLat,locationLng]);
  },
  function (err) {
    console.log('Insert error, error code: ' + err.code);
  },
  function (){
    onSuccessful();
  });
}

function getListEvents(onSuccessful) {
  db.transaction(function (tx){
    tx.executeSql("SELECT * FROM TBLEvents;", [], function(tx,rs){
      var numberOfEvent = rs.length;
      var listEvents = [];
      for (var i = 0; i < numberOfEvent; i++) {
        listEvents.push({"ID": rs.rows.item(i).ID, "eventName": rs.rows.item(i).eventName,
        "eventType": rs.rows.item(i).eventType, "eventDate": rs.rows.item(i).eventDate,
        "startTime": rs.rows.item(i).startTime, "OrgName": rs.rows.item(i).OrgName,
        "location": rs.rows.item(i).location, "locationLat": rs.rows.item(i).locationLat,
        "locationLng": rs.rows.item(i).locationLng});
      }
      onSuccessful(listEvents);
    });
  },
  function (err) {
    console.log('Get list events error, error code: ' + err.code);
  });
}
