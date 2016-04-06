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
    tx.executeSql("CREATE TABLE IF NOT EXISTS TBLEvents(ID Integer PRIMARY KEY, eventName TEXT, eventType TEXT, eventDate TEXT, startTime TEXT, OrgName TEXT, location TEXT, locationLat FLOAT, locationLng FLOAT);");
  },
  function (err) {
    console.log('Create table error, error code: ' + err.message);
  },
  function(){
    console.log('Table events created!');
  });
}


function deteleData(value) {
  db.transaction(function(tx){
    //tx.executeSql('DROP TABLE IF EXISTS Events');
    tx.executeSql("DELETE FROM TBLEvents WHERE ID = ?", [value]);
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
  getConnection();
  db.transaction(function (tx){
    tx.executeSql("SELECT * FROM TBLEvents;", [], function(tx,rs){
      var numberOfEvent = rs.rows.length;
      var listEvents = [];
      for (var i = 0; i < numberOfEvent; i++) {
        listEvents.push({"ID": rs.rows.item(i).ID, "eventName": rs.rows.item(i).eventName,
        "eventType": rs.rows.item(i).eventType, "eventDate": rs.rows.item(i).eventDate,
        "startTime": rs.rows.item(i).startTime, "OrgName": rs.rows.item(i).OrgName,
        "location": rs.rows.item(i).location, "locationLat": rs.rows.item(i).locationLat,
        "locationLng": rs.rows.item(i).locationLng});
      }
      onSuccessful(listEvents);
      // return listEvents;
    });
  },
  function (err) {
    console.log('Get list events error, error code: ' + err.code);
  });
}

function getListTodayEvents(onSuccessful) {
  var currentDate = new Date();
  var currentDay = currentDate.getDate();
  var currentMonth = currentDate.getMonth() + 1;
  var currentYear = currentDate.getFullYear();
  if (currentDay < 10 && currentMonth < 10) {
    var formatedDate = "0"+currentMonth+"/0"+currentDay+"/"+currentYear;
  }else if (currentDay < 10) {
    var formatedDate = currentMonth+"/0"+currentDay+"/"+currentYear;
  }else {
    var formatedDate = currentMonth+"/"+currentDay+"/"+currentYear;
  }
  getConnection();
  db.transaction(function (tx){
    tx.executeSql("SELECT * FROM TBLEvents WHERE eventDate = ?;", [formatedDate], function(tx,rs){
      var numberOfEvent = rs.rows.length;
      var listTodayEvents = [];
      for (var i = 0; i < numberOfEvent; i++) {
        listTodayEvents.push({"ID": rs.rows.item(i).ID, "eventName": rs.rows.item(i).eventName,
        "eventType": rs.rows.item(i).eventType, "eventDate": rs.rows.item(i).eventDate,
        "startTime": rs.rows.item(i).startTime, "OrgName": rs.rows.item(i).OrgName,
        "location": rs.rows.item(i).location, "locationLat": rs.rows.item(i).locationLat,
        "locationLng": rs.rows.item(i).locationLng});
      }
      onSuccessful(listTodayEvents);
      // return listEvents;
    });
  },
  function (err) {
    console.log('Get list to day events error, error code: ' + err.code);
  });
}

function checkExistEvent(eventName, eventDate, startTime, OrgName, location, onSuccessful, onFail) {
  db.transaction(function (tx) {
    tx.executeSql("SELECT * FROM TBLEvents WHERE eventName = ? AND eventDate = ? AND startTime = ? AND OrgName = ? AND location = ?", [eventName, eventDate, startTime, OrgName, location], function(tx, rs){
      if (rs.rows.length == 0) {
        onSuccessful();
      }else {
        onFail();
      }
    });
  },
  function(err){
    console.log('Check events error, error code: ' + err.code);
  });
}

function editEvent(eventName,eventType, eventDate, startTime,OrgName, location, locationLat, locationLng, eventID, onSuccessful) {
  db.transaction(function(tx) {
    tx.executeSql("UPDATE TBLEvents SET eventName = ?, eventType = ?, eventDate = ?, startTime = ?,OrgName=? , location = ?, locationLat=?, locationLng=? WHERE ID = ?",
    [eventName,eventType, eventDate, startTime,OrgName, location, locationLat, locationLng, eventID]);
  }, function(err) {
    console.log("EDIT EVENT ERROR " + err.code);
  }, function() {
    onSuccessful();
  });
}

function search(value, onSuccessful) {
  getConnection();
  db.transaction(function (tx){
    tx.executeSql("SELECT * FROM TBLEvents WHERE eventName like " + "'%"+value+"%' or eventDate like " + "'%"+value+"%' or location like " + "'%"+value+"%';", [], function(tx,rs){
      var numberOfEvent = rs.rows.length;
      var listEvents = [];
      if (numberOfEvent==0) {
        onSuccessful(null);
      }else {
        for (var i = 0; i < numberOfEvent; i++) {
          listEvents.push({"ID": rs.rows.item(i).ID, "eventName": rs.rows.item(i).eventName,
          "eventType": rs.rows.item(i).eventType, "eventDate": rs.rows.item(i).eventDate,
          "startTime": rs.rows.item(i).startTime, "OrgName": rs.rows.item(i).OrgName,
          "location": rs.rows.item(i).location, "locationLat": rs.rows.item(i).locationLat,
          "locationLng": rs.rows.item(i).locationLng});
        }
        console.log(listEvents);
        onSuccessful(listEvents);
      }

      // return listEvents;
    });
  },
  function (err) {
    console.log('Get search events error, error code: ' + err.code);
  });
}

function createReportTable(tx) {
  db.transaction(function(tx){
    tx.executeSql("CREATE TABLE IF NOT EXISTS TBLReport(ID Integer PRIMARY KEY, eventID Integer, report TEXT, FOREIGN KEY(eventID) REFERENCES TBLEvents(ID));");
  },
  function (err) {
    console.log('Create table error, error code: ' + err.message);
  },
  function(){
    console.log('Table report created!');
  });
}

function insertReport(eventID,report,onSuccessful){
  db.transaction(function(tx){
    tx.executeSql("INSERT INTO TBLReport(eventID,report) VALUES (?,?);",
    [eventID,report]);
  },
  function (err) {
    console.log('Insert report error, error code: ' + err.code);
  },
  function (){
    onSuccessful();
  });
}

function getListReport(eventID, onSuccessful) {
  getConnection();
  db.transaction(function (tx){
    tx.executeSql("SELECT * FROM TBLReport WHERE eventID = "+eventID+";", [], function(tx,rs){
      var numberOfReport = rs.rows.length;
      var listReport = [];
      for (var i = 0; i < numberOfReport; i++) {
        listReport.push({"ID": rs.rows.item(i).ID, "eventID": rs.rows.item(i).eventID,"report": rs.rows.item(i).report});
      }
      onSuccessful(listReport);
    });
  },
  function (err) {
    showError("Write report error!");
    console.log('Get list report error, error code: ' + err.code);
  });
}

function deteleReport(value) {
  db.transaction(function(tx){
    tx.executeSql("DELETE FROM TBLReport WHERE ID = ?", [value]);
  },
  function (err) {
    console.log('Delete report error, error code: ' + err.code);
  },
  function(){
    console.log('Deleted report!');
  });
}

function deteleAllReport(value) {
  db.transaction(function(tx){
    tx.executeSql("DELETE FROM TBLReport WHERE eventID = ?", [value]);
  },
  function (err) {
    console.log('Delete report error, error code: ' + err.code);
  },
  function(){
    console.log('Deleted report!');
  });
}

function createImageTable(tx) {
  db.transaction(function(tx){
    tx.executeSql("CREATE TABLE IF NOT EXISTS TBLImage(ID Integer PRIMARY KEY, eventID Integer, path TEXT, FOREIGN KEY(eventID) REFERENCES TBLEvents(ID));");
  },
  function (err) {
    console.log('Create table error, error code: ' + err.message);
  },
  function(){
    console.log('Table image created!');
  });
}

function insertImage(eventID,path,onSuccessful){
  db.transaction(function(tx){
    tx.executeSql("INSERT INTO TBLImage(eventID,path) VALUES (?,?);",
    [eventID,path]);
  },
  function (err) {
    console.log('Insert image error, error code: ' + err.code);
  },
  function (){
    onSuccessful();
  });
}

function getListImage(eventID, onSuccessful) {
  getConnection();
  db.transaction(function (tx){
    tx.executeSql("SELECT * FROM TBLImage WHERE eventID = "+eventID+";", [], function(tx,rs){
      var numberOfImage = rs.rows.length;
      var listImage = [];
      for (var i = 0; i < numberOfImage; i++) {
        listImage.push({"ID": rs.rows.item(i).ID, "eventID": rs.rows.item(i).eventID,"path": rs.rows.item(i).path});
      }
      onSuccessful(listImage);
    });
  },
  function (err) {
    console.log('Get list image error, error code: ' + err.code);
  });
}

function deteleImage(value) {
  db.transaction(function(tx){
    tx.executeSql("DELETE FROM TBLImage WHERE ID = ?", [value]);
  },
  function (err) {
    console.log('Delete image error, error code: ' + err.code);
  },
  function(){
    console.log('Deleted image!');
  });
}

function deteleAllImage(value) {
  db.transaction(function(tx){
    tx.executeSql("DELETE FROM TBLImage WHERE eventID = ?", [value]);
  },
  function (err) {
    console.log('Delete image error, error code: ' + err.code);
  },
  function(){
    console.log('Deleted image!');
  });
}
