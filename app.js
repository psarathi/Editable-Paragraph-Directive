var app = angular.module('plunker', []);

app.controller('MainCtrl', function($scope) {
  $scope.contentCaption = 'World';
  $scope.editMode = false;
  $scope.startEdit = function(){
    
   $scope.editMode = true;


  };
  
  $scope.$watch('contentCaption', function(nv, ov){
    if(!angular.equals(nv,ov)){
      console.info('Update service called');
    }
  });
  
    $scope.toggleEditMode = function(){
  $scope.editMode = !$scope.editMode;
  };

});

app.directive('editablePara', function($document){
  var linkFunction = function(scope, element, attributes){
    // console.log('document: ' + $document);
    // console.log(scope);
      $document.bind('click', function(e){
      // console.log(e.target);
      // console.log(element[0]);
      if(e.target === element[0]){
        // console.log('P click event: setting editMode to true');
      scope.editMode = true;
      }else{
        // console.log('Body click event: setting editMode to false');
        scope.editMode = false;
        scope.contentCaption = element.text();
      }
      // console.log(scope);
      scope.$apply();
      e.stopPropagation();
    });    
  };
  
  return {
    link: linkFunction,
    restrict: 'E',
    replace: true,
    transclude: true,
    template: '<p id="editable" ng-class="{isEditing:editMode}" contenteditable="{{editMode}}" ng-model="content">{{contentCaption}}</p>'
  }
});
