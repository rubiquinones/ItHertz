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
.controller('MainCtrl', function ($scope, $timeout, $ionicModal, $ionicSideMenuDelegate, PersonalInfo) {
  // Get status of application
  $scope.protected = window.localStorage['protected'];

  // Setup variables
  $scope.app = {
    title: "ItHertz"
  };
  $scope.acceleration = {};

  // Create our modal
  $ionicModal.fromTemplateUrl('setup-user.html', function (modal) {
    $scope.setupUserModal = modal;
  }, {
    scope: $scope
  });

  $scope.setupUser = function (personalInfo) {
    $scope.setupUserModal.hide();
    PersonalInfo.save(personalInfo);
  };

  $scope.toggleSidebar = function () {
    // $ionicSideMenuDelegate.toggleLeft();
  };

  // Run stuff
  $timeout(function () {
    if (!PersonalInfo.all()) {
      $scope.personalInfo = {};
      $scope.setupUserModal.show();
    }
  });

  document.addEventListener("deviceready", function () {
    $scope.acceleration.x = "UGH";
    $scope.acceleration.y = "WHY";
    navigator.accelerometer.watchAcceleration(
      function success(result) {
        $scope.acceleration = result;
      },
      function error(error) {
        $scope.acceleration.x = error;
      },{
        frequency: 10
      });

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

  }, true);
  
});