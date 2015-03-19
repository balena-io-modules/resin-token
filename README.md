resin-token
-------------

[![npm version](https://badge.fury.io/js/resin-token.svg)](http://badge.fury.io/js/resin-token)
[![dependencies](https://david-dm.org/resin-io/resin-token.png)](https://david-dm.org/resin-io/resin-token.png)
[![Build Status](https://travis-ci.org/resin-io/resin-token.svg?branch=master)](https://travis-ci.org/resin-io/resin-token)

Resin.io session token utilities.

Installation
------------

Install `resin-token` by running:

```sh
$ npm install --save resin-token
```

Documentation
-------------

### token.set(String token)

Set the current token.

### String token.get()

Get the current token, or `undefined`.

### Boolean token.has()

Return `true` if there is a saved token. `false` otherwise.

### token.remove()

Remove the current token.

### Object token.parse(String token)

Parse the token data and return an object with it.

### String token.getUsername()

Get the username of the current logged in token. `undefined` otherwise.

Tests
-----

Run the test suite by doing:

```sh
$ gulp test
```

Contribute
----------

- Issue Tracker: [github.com/resin-io/resin-token/issues](https://github.com/resin-io/resin-token/issues)
- Source Code: [github.com/resin-io/resin-token](https://github.com/resin-io/resin-token)

Before submitting a PR, please make sure that you include tests, and that [coffeelint](http://www.coffeelint.org/) runs without any warning:

```sh
$ gulp lint
```

Support
-------

If you're having any problem, please [raise an issue](https://github.com/resin-io/resin-token/issues/new) on GitHub.

ChangeLog
---------

### v1.1.0

- Implement `token.parse()`.
- Implement `token.getUsername()`.

License
-------

The project is licensed under the MIT license.
