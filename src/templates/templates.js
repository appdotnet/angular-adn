angular.module("adn").run(["$templateCache", function($templateCache) {

  $templateCache.put("templates/adn-text.html",
    "<div class=\"well-plain well-elevated\">\n" +
    "    <div>\n" +
    "        <textarea class=\"editable input-flex\" ng-model=\"textData.rawText\" ng-trim=\"false\" tabindex=1></textarea>\n" +
    "    </div>\n" +
    "    <div>\n" +
    "      <span class=\"text-left char-count\">{{ charCount }}</span>\n" +
    "      <span class=\"pull-right\">\n" +
    "        <button class=\"btn btn-primary btn-small\" tabindex=2 ng-disabled=\"charCount < 0\" ng-click=\"buttonClick()\">{{ buttonText }}</button>\n" +
    "      </span>\n" +
    "    </div>\n" +
    "</div>"
  );

  $templateCache.put("templates/user-search.html",
    "<div>\n" +
    "  <!-- originally from ohe -->\n" +
    "  <label class=\"control-label\" ng-bind='label'></label>\n" +
    "  <input class='input-block-level' type=\"hidden\" ui-select2=\"usernameSelect\" ng-model=\"selectedUsers\" ng-multiple>\n" +
    "</div>"
  );

}]);
