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
    });

    $urlRouterProvider.otherwise('/');
}])
.controller('MainCtrl', function ($scope, $timeout, $ionicModal, $ionicSideMenuDelegate, PersonalInfo) {
  // Get status of application
  $scope.protected = window.localStorage['protected'];

  // Setup variables
  $scope.app = {
    title: "ItHertz"
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

  $scope.setupVehicle = function (vehicleInfo) {
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

  document.addEventListener("deviceready", function () {
    if (!PersonalInfo.all()) {
      $scope.personalInfo = {};
      $scope.setupUserModal.show();
    }

    // - NOTIFICATIONS -

    cordova.plugins.notification.local.registerPermission(function (granted) {
        console.log('Permission has been granted: ' + granted);
    });

    // - BACKGROUNDING -

    cordova.plugins.backgroundMode.enable();

    // Get informed when the background mode has been activated
    cordova.plugins.backgroundMode.onactivate = function () {
        cordova.plugins.notification.local.schedule({
          id: 1,
          text: 'Test Message 1'
      });
    };

    // Get informed when the background mode has been deactivated
    cordova.plugins.backgroundMode.ondeactivate = function () {
        clearInterval(timer);
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