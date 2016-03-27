angular.module('ItHertz', ['ionic'])
/**
 * The Projects factory handles saving and loading projects
 * from local storage, and also lets us save and load the
 * last active project index.
 */
.factory('PersonalInfo', function () {
  return {
    all: function () {
      var personalInfo = window.localStorage['personalInfo'];
      if (personalInfo) {
        return angular.fromJson(personalInfo);
      }

      return null;
    },

    save: function (personalInfo) {
      window.localStorage['personalInfo'] = angular.toJson(personalInfo);
    }
  }
})
.factory('VehicleInfo', function () {
  return {
    all: function () {
      var vehicleInfo = window.localStorage['vehicleInfo'];
      if (vehicleInfo) {
        return angular.fromJson(vehicleInfo);
      }

      return null;
    },

    save: function (vehicleInfo) {
      window.localStorage['vehicleInfo'] = angular.toJson(vehicleInfo);
    }
  }
})
.factory('ContactInfo', function () {
  return {
    all: function () {
      var contactInfo = window.localStorage['contactInfo'];
      if (contactInfo) {
        return angular.fromJson(contactInfo);
      }

      return null;
    },

    save: function (contactInfo) {
      window.localStorage['contactInfo'] = angular.toJson(contactInfo);
    }
  }
})
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'home.html'
    })
    .state('about', {
      url: '/about',
      templateUrl: 'about.html'
    })
    .state('alert', {
      url: '/alert',
      templateUrl: 'alert.html'
    });

    $urlRouterProvider.otherwise('/');
}])
.controller('MainCtrl', function ($scope, $timeout, $interval, $ionicModal, $state, $ionicSideMenuDelegate, PersonalInfo) {
  // Get status of application
  $scope.protected = false;

  // Setup variables
  $scope.app = {
    title: "Ready Freddy?"
  };
  $scope.acceleration = {};

  // Create our modals
  $ionicModal.fromTemplateUrl('setup-user-1.html', function (modal) {
    $scope.setupUserModal = modal;
  }, {
    scope: $scope
  });

  $ionicModal.fromTemplateUrl('setup-user-2.html', function (modal) {
    $scope.setupVehicleModal = modal;
  }, {
    scope: $scope
  });

  $ionicModal.fromTemplateUrl('setup-user-3.html', function (modal) {
    $scope.setupContactModal = modal;
  }, {
    scope: $scope
  });

  $scope.setupUser = function (personalInfo, skipAll) {
    $scope.setupUserModal.hide();
    PersonalInfo.save(personalInfo);

    if (!skipAll) {
      $scope.setupVehicleModal.show();
    }
  };

  $scope.setupVehicle = function (vehicleInfo, skipAll) {
    $scope.setupVehicleModal.hide();
    VehicleInfo.save(vehicleInfo);

    if (!skipAll) {
      $scope.setupContactModal.show();
    }
  };

  $scope.setupContacts = function (contactInfo) {
    $scope.setupContactModal.hide();
    ContactInfo.save(contactInfo);
  };

  $scope.toggleSidebar = function () {
    $ionicSideMenuDelegate.toggleLeft();
  };

  $scope.initAlert = function (seconds) {
    $scope.alertTimer = seconds;
    $scope.dontAlert = false;

    console.log("THIS SCRIPT");

      cordova.plugins.notification.local.schedule({
        id: 2,
        text: 'Emergency services called.'
      });

    $scope.alertCountdown = $interval(function () {
        $scope.alertTimer -= 1;

        if ($scope.alertTimer == 0 && $scope.dontAlert == true) {
          console.log("Calling emergency services...");
          $state.go('about');
        }
    }, 1000, seconds);
  };

  $scope.cancelAlert = function () {
    $scope.dontAlert = true;
    $state.go('home');
  };

  document.addEventListener("deviceready", function () {
    if (!PersonalInfo.all()) {
      $scope.personalInfo = {};
      $scope.setupUserModal.show();
    }

    // - NOTIFICATIONS -

    cordova.plugins.notification.local.registerPermission(function (granted) {
      console.log('Permission has been granted: ' + granted);
    });

    cordova.plugins.notification.local.on('click', function (notification) {
      $state.go('alert');
    });

    // - BACKGROUNDING -

    cordova.plugins.backgroundMode.enable();

    // Get informed when the background mode has been activated
    cordova.plugins.backgroundMode.onactivate = function () {
      
    };

    // - LISTENER -
    $scope.toggleProtected = function () {
      $scope.protected = !$scope.protected;
      console.log("Something: " + $scope.protected);
      if ($scope.protected == true) {
        console.log("Should notify");
        var time = new Date();
        time.setSeconds(time.getSeconds() + 10);
        cordova.plugins.notification.local.schedule({
          id: 1,
          text: 'It feels like something happened, contacting emergency services. Open this notification to cancel.',
          at: time
        });
        $timeout(function () {
          $scope.initAlert(30);
        }, 10 * 1000);
      }
    };

    // Get informed when the background mode has been deactivated
    cordova.plugins.backgroundMode.ondeactivate = function () {

      // cordova.plugins.notification.badge.clear();
    };

    // navigator.accelerometer.watchAcceleration(
    //   function success(result) {
    //     $scope.acceleration = result;
    //   },
    //   function error(error) {
    //     $scope.acceleration.x = error;
    //   },{
    //     frequency: 1000,
    //     period: 1000
    //   });

    // accelerometer.then(
    //   function () {
    //     $scope.acceleration.y = "idon'tknowhwatimdoing";
    //   },
    //   function (error) {
    //     $scope.acceleration.x = "error";
    //   },
    //   function (result) {
    //     $scope.acceleration.z = "noterror";
    //     // $scope.acceleration = angular.copy(result);
    //   });

  }, false);
  
});