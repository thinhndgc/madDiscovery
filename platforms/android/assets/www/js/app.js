(function(){
  'use strict';
  var module = angular.module('app', ['onsen']);
  module.controller('AppController', function($scope) {});

  module.controller('ReportController', function($scope, $rootScope) {
    blindReportData();

    $scope.saveButtonHandler = function(index) {
      if(checkNullInput('txtReport')){
        changeBorderColor();
      }else{
        var report = $("#txtReport").val();
        var eventID = $rootScope.selectedItem["ID"];
        console.log(report+" - "+eventID);
        insertReport(eventID, report, function() {
          console.log("created report!");
          restoreBorderColor();
          clearTextField('txtReport');
          modalAddReport.hide();
          ons.notification.alert({
            message: 'Created report!',
            title: '',
            callback: function(idx) {
              switch (idx) {
                case 0:
                navi.popPage();
                break;
              }
            }
          });
        });
      }
    };


    function blindReportData() {
      if (angular.isDefined($rootScope.selectedItem)) {
        var eventID = $rootScope.selectedItem["ID"];
        getListReport(eventID,function(listReport){
          $scope.reports = listReport;
          $scope.$apply();
          console.log($scope.reports);
        });
      };
    };


    $scope.reportDelButtonHandler = function(index) {
      var selectedReport = $scope.reports[index];
      console.log(selectedReport);
      ons.notification.confirm({
        message: 'Are you sure to delete?',
        modifier: 'material',
        callback: function(idx) {
          switch (idx) {
            case 0:
            console.log('canceled');
            break;
            case 1:
            deteleReport(selectedReport["ID"]);
            // navi.popPage();
            blindReportData();
            break;
          }
        }
      });
    };
  });

  module.controller('GaleryController', function($scope, $rootScope) {
    $("#mygallery").justifiedGallery();
    // initPhotoSwipeFromDOM('#mygallery');

    blindImgData();
    function blindImgData() {
      if (angular.isDefined($rootScope.selectedItem)) {
        var eventID = $rootScope.selectedItem["ID"];
        getListImage(eventID,function(listImage){
          $scope.image = listImage;
          $scope.$apply();
          console.log($scope.image);
        });
      };

      console.log(listImage.length);

      for (var i = 0; i < listImage.length; i++) {
        <a src="" title="Image">
          <img src="{{i.path}}" />
        </a>
        var t = $('<a src="'+ listImage[i]["path"] +'" title="Image"> <img src="'+ listImage[i]["path"] +'" /> </a>');
        $("#mygallery").append(t);
      }

    }

    ons.createPopover('popoverImg.html').then(function(popover) {
      $rootScope.popoverImg = popover;
    });

    $scope.show = function(e) {
      $rootScope.popoverImg.show(e);
    };


  });

  module.controller('MapController', function($scope, $rootScope) {
    initDetailMap($rootScope.selectedItem["locationLat"],$rootScope.selectedItem["locationLng"]);
    var map = null;
    var currentMarker = null;
    function initDetailMap(Lat, Lng) {
      console.log(Lat+" - "+Lng);
      if (Lat=="" || Lng=="") {
        document.getElementById('map-details').innerHTML = '<br/><p class="map-noti">This event not have googlemap information!,</p>';
      }else {
        var myLatLng = {lat: Lat, lng: Lng};
        var map = new google.maps.Map(document.getElementById('map-details'), {
          center: myLatLng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var marker = new google.maps.Marker({
          position: myLatLng,
          map: map,
          draggable: false
        });
      }
    };
  });

  module.controller('MasterController', function($scope, $rootScope) {
    getConnection();
    createTable();
    createReportTable();
    createImageTable();

    ons.ready(function() {
      ons.createPopover('popover.html').then(function(popover) {
        $scope.popover = popover;
      });
    });

    $scope.reportsButtonHandler = function(index) {
      navi.pushPage('report.html',{ animation : 'slide' });
    };

    getListEvents(function(listEvents){
      $scope.events = listEvents;
      $scope.$apply();
      console.log($scope.events);
    });

    getListTodayEvents(function(listTodayEvents){
      $scope.todayEvents = listTodayEvents;
      $scope.$apply();
      console.log($scope.todayEvents);
    });

    $scope.showDetail = function(index) {
      var selectedItem = $scope.events[index];
      $rootScope.selectedItem = selectedItem;
      console.log($rootScope.selectedItem);
      $scope.navi.pushPage('detail.html',{ animation : 'lift' });
    };

    $scope.showTodayDetail = function(index) {
      var selectedItem = $scope.todayEvents[index];
      $rootScope.selectedItem = selectedItem;
      console.log($rootScope.selectedItem);
      $scope.navi.pushPage('detail.html',{ animation : 'lift' });
    };

    $scope.onKeyDown = function ($event) {
      var val = $("#search").val();
      console.log("--"+val);
      search(val, function(listEvents){
        $scope.events = listEvents;
        $scope.$apply();
        console.log($scope.events);
      });
    };

    ons.createPopover('popover.html').then(function(popover) {
      $rootScope.popover = popover;
    });

    $scope.show = function(e) {
      $rootScope.popover.show(e);
    };

  });


  module.controller('createPageController', function($scope, $rootScope) {
    loadPlugin();
    function loadPlugin() {
      $('#selectEventType').mobiscroll().select({
        theme: '',
        display: 'modal',
        minWidth: 200
      });
      $('#selectEventType').click(function () {
        $('#selectEventType').mobiscroll('show');
        return false;
      });
      $('#txtDate').mobiscroll().date({
        theme: '',
        display: 'modal'
      });

      $('#txtDate').click(function () {
        $('#txtDate').mobiscroll('show');
        return false;
      });
      $('#txtTime').mobiscroll().time({
        theme: '',
        display: 'modal'
      });

      $('#txtTime').click(function () {
        $('#txtTime').mobiscroll('show');
        return false;
      });
      console.log('loaded');
    }
  });

  module.controller('editPageController', function($scope, $rootScope) {
    loadPlugin();
    setValue();
    function loadPlugin() {
      $('#selectEventType').mobiscroll().select({
        theme: '',
        display: 'modal',
        minWidth: 200
      });
      $('#selectEventType').click(function () {
        $('#selectEventType').mobiscroll('show');
        return false;
      });
      $('#txtDate').mobiscroll().date({
        theme: '',
        display: 'modal'
      });

      $('#txtDate').click(function () {
        $('#txtDate').mobiscroll('show');
        return false;
      });
      $('#txtTime').mobiscroll().time({
        theme: '',
        display: 'modal'
      });

      $('#txtTime').click(function () {
        $('#txtTime').mobiscroll('show');
        return false;
      });
      console.log('loaded');
    }

    function setValue() {
      $("#eventID").val($rootScope.selectedItem["ID"]);
      $("#txtName").val($rootScope.selectedItem["eventName"]);
      $("#selectEventType").val($rootScope.selectedItem["eventType"]);
      $("#txtDate").val($rootScope.selectedItem["eventDate"]);
      $("#txtTime").val($rootScope.selectedItem["startTime"]);
      $("#txtOrganizer").val($rootScope.selectedItem["OrgName"]);
      $("#txtLocation").val($rootScope.selectedItem["location"]);
      $("#locLat").val($rootScope.selectedItem["locationLat"]);
      $("#locLng").val($rootScope.selectedItem["locationLng"]);
    }
  });

  module.controller('PopoverController', function($scope, $rootScope) {
    var pictureSource;
    var destinationType;
    blindImgData();
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
      pictureSource = navigator.camera.PictureSourceType;
      destinationType = navigator.camera.DestinationType;
    }

    function takePic() {

      var cameraOptions = {
        quality: 10,
        saveToPhotoAlbum: true
      };

      navigator.camera.getPicture(cameraSuccess, cameraError, cameraOptions);

      function cameraSuccess(imageData) {
        //
        // var img = document.getElementById("profile");
        // img.src = imageData;
        // imageData = "img/logo.png";
        alert(imageData);
        // window.plugins.socialsharing.shareViaFacebook(
        //   'Test fb by PhoneGap',
        //   imageData /* img */,
        //   null /* url */,
        //   function() {console.log('share ok')},
        //   function(errormsg){alert(errormsg)});

      }

      function cameraError(msg) {
        alert(msg);
      }
    }
    function savePhoto(path) {
      if (angular.isDefined($rootScope.selectedItem)) {
        var eventID = $rootScope.selectedItem["ID"];
        insertImage(eventID,path,function() {
          $rootScope.popoverImg.hide();
          ons.notification.alert({
            message: 'Added image!',
            title: '',
            callback: function(idx) {
              switch (idx) {
                case 0:
                // navi.popPage();
                blindImgData();
                break;
              }
            }
          });
        });
      }
    }

    function blindImgData() {
      if (angular.isDefined($rootScope.selectedItem)) {
        var eventID = $rootScope.selectedItem["ID"];
        getListImage(eventID,function(listImage){
          $scope.image = listImage;
          $scope.$apply();
          console.log($scope.image);
        });
      };
    }

    function onPhotoDataSuccess(imageURI) {
      console.log(imageURI);
      // alert(imageURI);
      var cameraImage = document.getElementById('image');
      // Unhide image elements
      //
      cameraImage.style.display = 'block';
      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      cameraImage.src = imageURI;
      savePhoto(imageURI);
    }

    function onPhotoURISuccess(imageURI) {
      console.log(imageURI);
      savePhoto(imageURI);
    }

    function capturePhoto() {
      // takePic();
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
        quality: 30,
        targetWidth: 600,
        targetHeight: 600,
        destinationType: destinationType.FILE_URI,
        saveToPhotoAlbum: true
      });
    }

    function getPhoto(source) {
      navigator.camera.getPicture(onPhotoURISuccess, onFail, {
        quality: 30,
        targetWidth: 600,
        targetHeight: 600,
        destinationType: destinationType.FILE_URI,
        sourceType: source
      });
    }

    function onFail(message) {
      //alert('Failed because: ' + message);
    }
    $scope.captureHandler = function() {
      capturePhoto();
    };

    $scope.chooseHandler = function() {
      getPhoto(pictureSource.PHOTOLIBRARY);
    };

    $scope.deleteHandler = function() {
      ons.notification.confirm({
        message: 'Are you sure to delete this event?',
        modifier: 'material',
        callback: function(idx) {
          switch (idx) {
            case 0:
            ons.notification.alert({
              message: 'Canceled',
              modifier: 'material'
            });
            break;
            case 1:
            var id = $rootScope.selectedItem["ID"];
            console.log(id);
            deteleData(id);
            $rootScope.popover.hide();
            // ons.notification.alert({
            //   message: 'Deleted',
            //   modifier: 'material'
            // });
            navi.resetToPage('home.html',{ animation : 'lift' });

            break;
          }
        }
      });
    };

    $scope.editHandler = function() {
      $rootScope.popover.hide();
      navi.pushPage('edit.html',{ animation : 'lift' });
    };
  });
})();
