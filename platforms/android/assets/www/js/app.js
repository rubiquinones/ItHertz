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
.controller('MainCtrl', function ($scope, $timeout, $ionicModal, PersonalInfo) {
  // Get status of application
  $scope.protected = window.localStorage['protected'];

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

  $timeout(function () {
    if (!PersonalInfo.all()) {
      $scope.personalInfo = {};
      $scope.setupUserModal.show();
    }
  });
});