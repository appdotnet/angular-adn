# angular-adn

## Getting Started

You can install angular-adn using bower

```
bower install angular-adn --save
```

## Introduction

App.net has now built a few apps using AngularJS. [Omega](https://omega.app.net), [PourOver](https://adn-pourover.appspot.com), and a couple yet to be released. In the process we have started to reuse a few components that would be helpful to anyone creating an App.net client.

Right now, there are only 3 angular services included, but this is just the beginning we haven't even reached a v0.1 release yet. Our goal here is to release code like this early, and get feedback from devs.

## Services

**ADNConfig**

We considered just using Angular constants or values, but we decided that having a consistent API across modules was important enough to create our own service. ADNConfig serves two functions, one is to be initialized with app level configuration data, and to provide a configuration getter that allows a fallback value.

```js
angular.app('testApp', ['adn']).config(function (ADNConfigProvider) {
    ADNConfigProvider.setConfig({
        'set_var': 'non_fallback'
    });
}).run(function (ADNConfig) {
    var test = ADNConfig.get('set_var', 'fallback');
    // test === 'non_fallback';
    var test2 = ADNConfig.get('not_set_var', 'fallback');
    // not_set_var === 'fallback';
});
```

**Auth**

The Auth service is currently a barebones method for handling the App.net Client Side authentication flow. It handles parsing the access_token out of a URL, and also handles setting the access token on both the $rootScope, and in localStorage. That way a user will not have to re-authorize your app everytime they come back to your website.

```
// The user has just gone through the authflow and is back on your site.
// https://example.com/#access_token=123
angular.controller('TestCtrl', function ($rootScope, Auth) {
    Auth.login();
    Auth.isLoggedIn(); // === true
    $rootScope.local.accessToken; // === 123
})
```

**ApiClient**

Finally, the ApiClient, a light wrapper around the built in $http service. It handles adding the access_token to a requests headers, and prepending the root Alpha API URL so you don't have to.

```
// After the user has authenticated
angular.controller('TestCtrl', function (ApiClient) {
    ApiClient.post({
        url: '/posts',
        data: {
            text: 'This is a post'
        }
    }).success(function (resp) {
        // An App.net post was created
    });
})
```

Feedback is welcome, the best way right now is to [create an issue](https://github.com/appdotnet/angular-adn) or, you can always ask ([@voidfiles](https://app.net/voidfiles)) a question.
