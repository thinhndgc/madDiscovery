(function(){
  'use strict';
  var module = angular.module('app', ['onsen']);
  //   module.directive('myPostRepeatDirective', function() {
  //   return function(rootScope, element, attrs) {
  //     if (rootScope.$last){
  //       // iteration is complete, do whatever post-processing
  //       // is necessary
  //       alert("done");
  //     }
  //   };
  // });
  module.controller('AppController', function($scope) {});

  module.controller('ReportController', function($scope, $rootScope) {
    blindReportData();

    $scope.saveButtonHandler = function(index) {
      if(checkNullInput('txtReport')){
        changeBorderColor();
      }else{
        if (checkDate()) {
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
        }else {
          modalAddReport.hide();
          ons.notification.alert({message: 'This event has ended!',title: 'Error'});
        }
      }
    };

    function checkDate(){
      var evDate = $rootScope.selectedItem["eventDate"];
      console.log(evDate);
      var dateArray = evDate.split("/");
      var currentDate = new Date();
      console.log(currentDate);
      var currentDay = currentDate.getDate();
      var currentMonth = currentDate.getMonth() + 1;
      var currentYear = currentDate.getFullYear();
      var eventDay = parseInt(dateArray[1]);
      var eventMonth = parseInt(dateArray[0]);
      var eventYear = parseInt(dateArray[2]);
      if (eventYear < currentYear) {
        return false;
      }else if (eventMonth < currentMonth && eventYear == currentYear) {
        return false;
      }else if (eventDay < currentDay && eventMonth == currentMonth && eventYear == currentYear) {
        return false;
      }else {
        return true;
      }
    }


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

    // initPhotoSwipeFromDOM('#mygallery');
    blindImgData();

    function blindImgData() {
      if (angular.isDefined($rootScope.selectedItem)) {
        var eventID = $rootScope.selectedItem["ID"];
        getListImage(eventID,function(listImage){
          $rootScope.image = listImage;
          $scope.$apply();
          console.log($rootScope.image);
          console.log(listImage.length);
          $("#mygallery").justifiedGallery();
          // for (var i = 0; i < listImage.length; i++) {
          //   console.log('<a src="'+ listImage[i]["path"] +'" title="Image"> <img src="'+ listImage[i]["path"] +'" /> </a>');
          //   $('<a src="'+ listImage[i]["path"] +'" title="Image"> <img src="'+ listImage[i]["path"] +'" /> </a>').appendTo('#mygallery');
          //   console.log("--------------"+$('#mygallery').html());
          // };
        });
      };
      console.log("in here galery");
    }

    $scope.imgHandler = function(index) {
      var selectedImg = $rootScope.image[index];
      $rootScope.selectedImg = selectedImg;
      var imgID = selectedImg["ID"];
      console.log("id = " + imgID);
      console.log($("#mygallery").html());
      var evimg = "#evimg"+imgID;
      console.log("==== " + evimg);
      $rootScope.popoverPic.show(evimg);
    };

    ons.createPopover('popoverImg.html').then(function(popover) {
      $rootScope.popoverImg = popover;
    });

    $scope.show = function(e) {
      $rootScope.popoverImg.show(e);
    };

    ons.createPopover('popoverPic.html').then(function(popover) {
      $rootScope.popoverPic = popover;
    });

    $scope.shows = function(e) {
      $rootScope.popoverPic.show(e);
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

  module.controller('viewImagePageController', function($scope, $rootScope) {
    console.log('=============================================');
    var src = $rootScope.selectedImg["path"];
    console.log(src);
    $('<a src="'+ src +'" title="Image"> <img alt="Image" src="'+src+'"/> </a>').appendTo('#imgView');
    // $('#imgView').justifiedGallery();
    console.log("html: " + $('#imgView').html());
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

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
      pictureSource = navigator.camera.PictureSourceType;
      destinationType = navigator.camera.DestinationType;
    }

    $scope.viewHandler = function() {
      var src = $rootScope.selectedImg["path"];
      console.log(src);
      $rootScope.popoverPic.hide();
      // FullScreenImage.showImageURL($rootScope.selectedImg["path"]);
      window.plugins.fileOpener.open(src);
      // navi.pushPage('viewImage.html',{ animation : 'lift' });
    };

    $scope.deleteImgHandler = function() {
      // var selectedImg = $rootScope.image[index];
      console.log($rootScope.selectedImg["ID"]+"===");
      $rootScope.popoverPic.hide();
      ons.notification.confirm({
        message: 'Are you sure to delete?',
        modifier: 'material',
        callback: function(idx) {
          switch (idx) {
            case 0:
            console.log('canceled');
            break;
            case 1:
            deteleImage($rootScope.selectedImg["ID"]);
            // navi.popPage();
            blindImgData();
            break;
          }
        }
      });
    };

    $scope.shareHandler = function() {
      console.log($rootScope.selectedImg["ID"]+"===");
      var text = 'This is a picture from ' + $rootScope.selectedItem["eventName"] + 'event!';
      var path = $rootScope.selectedImg["path"];
      window.plugins.socialsharing.shareViaFacebook(
        text,
        path /* img */,
        null /* url */,
        function() {
          $rootScope.popoverPic.hide();
          // ons.notification.alert({
          //   message: 'This photo is shared!',
          //   title: '',
          //   callback: function(idx) {
          //     switch (idx) {
          //       case 0:
          //       console.log('share success!');
          //       break;
          //     }
          //   }
          // });
        },
        function(errormsg){alert(errormsg)});
      };

      function blindImgData() {
        if (angular.isDefined($rootScope.selectedItem)) {
          var eventID = $rootScope.selectedItem["ID"];
          getListImage(eventID,function(listImage){
            $rootScope.image = listImage;
            $scope.$apply();
            console.log($rootScope.image);
            console.log(listImage.length);
            // $("#mygallery").html('');
            // for (var i = 0; i < listImage.length; i++) {
            //   console.log('<a src="'+ listImage[i]["path"] +'" id="'+listImage[i]["ID"]+'" class ="eventimg" title="Image"> <img src="'+ listImage[i]["path"] +'" /> </a>');
            //   $('<a src="'+ listImage[i]["path"] +'" title="Image"> <img src="'+ listImage[i]["path"] +'" /> </a>').appendTo('#mygallery');
            //   console.log("--------------"+$('#mygallery').html());
            //   $("#mygallery").justifiedGallery();
            // };
            $("#mygallery").justifiedGallery();
          });
        };

        console.log("in here");
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

      function onPhotoDataSuccess(imageURI) {
        console.log(imageURI);
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
              deteleAllReport(id);
              deteleAllImage(id);
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
