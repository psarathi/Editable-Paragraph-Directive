var app = angular.module('plunker', []);

app.controller('MainCtrl', function($scope) {
    $scope.h2Content = 'This is h2';
    $scope.spanContent = 'This is span';
    $scope.pContent = 'This is paragraph';
    $scope.editMode = false;
    $scope.startEdit = function() {

        $scope.editMode = true;


    };

    $scope.$watch('h2Content', function(nv, ov) {
        if (angular.equals(nv, ov)) {
            return;
        }
        // Code to execute when the value changes
        console.info('Update service called');
    });

    $scope.$watch('spanContent', function(nv, ov) {
        if (angular.equals(nv, ov)) {
            return;
        }
        // Code to execute when the value changes
        console.info('Update service called');
    });

    $scope.$watch('pContent', function(nv, ov) {
        if (angular.equals(nv, ov)) {
            return;
        }
        // Code to execute when the value changes
        console.info('Update service called');
    });


    $scope.toggleEditMode = function() {
        $scope.editMode = !$scope.editMode;
    };

});

app.directive('editablePara', function($document, $compile, $parse) {
    var getTemplate = function(tag, id, tagClass) {
        tag = tag || 'p';

        return '<' + tag + ' class="editable ' + tagClass + '" id="' + id + '" ng-class="{isEditing:editMode}" contenteditable="{{editMode}}">{{content}}</' + tag + '>'
    };

    var compileFunction = function(element, attributes) {
        var html = getTemplate(attributes.tag, attributes.tagId, attributes.tagClass);
        var modelAccessor = $parse(attributes.content);

        var newElem = angular.element(html);
        element.replaceWith(newElem);

        return function(scope, element, attributes) {
            scope.editMode = false;
            $compile(element)(scope);

            // Prevent the user from entering enter
            element.bind('keydown', function(e) {
                if (e.keyCode == 13) {
                    e.preventDefault();
                }
            });

            $document.bind('click', function(e) {
                // If the element was clicked, make it editable
                if (e.target === element[0]) {
                    scope.$apply(function(scope) {
                        scope.editMode = true;
                    });
                } else {
                    // If the click was outside the element, make it read-only and assign the updated value back to the parent scope
                    scope.editMode = false;
                    scope.$apply(function(scope) {
                        modelAccessor.assign(scope.$parent, element.text());
                    });
                }
                e.stopPropagation();
            });
        };
    };

    return {
        scope: {
            content: '='
        },
        compile: compileFunction,
        restrict: 'E',
        replace: true
    }
});