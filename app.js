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
        if (!angular.equals(nv, ov)) {
            console.info('Update service called');
        }
    });

    $scope.$watch('spanContent', function(nv, ov) {
        if (!angular.equals(nv, ov)) {
            console.info('Update service called');
        }
    });

    $scope.$watch('pContent', function(nv, ov) {
        if (!angular.equals(nv, ov)) {
            console.info('Update service called');
        }
    });


    $scope.toggleEditMode = function() {
        $scope.editMode = !$scope.editMode;
    };

});

app.directive('editablePara', function($document, $compile, $parse) {
    var getTemplate = function(tag, id) {
        tag = tag || 'p';

        return '<' + tag + ' class="editable" id="' + id + '" ng-class="{isEditing:editMode}" contenteditable="{{editMode}}">{{content}}</' + tag + '>'
    };

    var linkFunction = function(scope, element, attributes) {
        // console.log('document: ' + $document);
        // console.log(scope.tag);
        scope.editMode = false;
        element.html(getTemplate(attributes.tag, attributes.tagId));

        $compile(element.contents())(scope);


        $document.bind('click', function(e) {
            // console.log(scope.editMode);
            // console.log(e.target);
            // console.log(element.children()[0]);
            if (e.target === element.children()[0]) {
                // console.log('P click event: setting editMode to true');
                scope.editMode = true;
            } else {
                // console.log('Body click event: setting editMode to false');
                scope.editMode = false;
                scope.content = element.children().text();
            }
            // console.log(scope);
            scope.$apply();
            e.stopPropagation();
        });
    };

    var compileFunction = function(element, attributes) {
        var html = getTemplate(attributes.tag, attributes.tagId);
        var modelAccessor = $parse(attributes.content);

        var newElem = angular.element(html);
        element.replaceWith(newElem);

        return function(scope, element, attributes) {
            // console.log('document: ' + $document);
            // console.log(scope.tag);
            scope.editMode = false;
            // element.html(getTemplate(attributes.tag));

            $compile(element)(scope);

            element.bind('keydown', function(e) {
                // console.log(e.keyCode);
                if (e.keyCode == 13) {
                    e.preventDefault();
                }
            });

            $document.bind('click', function(e) {
                // console.log(scope.editMode);
                // console.log(e.target);
                // console.log(element.children()[0]);
                // console.log(element);
                if (e.target === element[0]) {
                    // console.log('P click event: setting editMode to true');
                    scope.editMode = true;
                } else {
                    // console.log('Body click event: setting editMode to false');
                    scope.editMode = false;
                    // scope.content = element.text();
                    // console.log(element.html());
                    scope.$apply(function(scope) {
                        modelAccessor.assign(scope.$parent, element.text());
                    });
                }
                // console.log(scope);
                // scope.$apply();
                e.stopPropagation();
            });
        };
    };

    return {
        scope: {
            content: '='
        },
        // link: linkFunction,
        compile: compileFunction,
        restrict: 'E',
        replace: true
    }
});