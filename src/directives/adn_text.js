(function () {
  'use strict';

  angular.module('adn').directive('adnText', function () {
    return {
      restrict: 'A',
      link: function (scope, elem, attrs) {
        scope.offset = 0;
        if (scope.textData.rawText === undefined) {
          scope.textData.rawText = '';
        }

        // until angular > 1.1.1, ng-trim isn't an option so this won't be fired on whitespace from scope.text
        scope.updateCounter = function () {
          scope.charCount = scope.maxChars - scope.offset - scope.textData.rawText.length;
        };

        scope.$watch('[maxChars, offset, textData]', scope.updateCounter, true);
        scope.updateCounter();
        scope.buttonClick = function () {
          if (scope.textData.rawText.length <= scope.maxChars) {
            // processedMessage is what we should send to the server
            // rawText is what should be in the text box that gets processed into text
            scope.textData.processedMessage = {
                text: scope.textData.rawText
            };
            scope.onButtonClick();
          }
        };
      },
      templateUrl: 'templates/adn-text.html',
      scope: {
        buttonText: "@",
        onButtonClick: '&',
        maxChars: "@",
        textData: '='
      }
    };
  });
}());