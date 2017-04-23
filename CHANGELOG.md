# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [4.1.0] - 2017-04-23

### Changed

- The new static `isExpired` method to check the `exp` claim
- The token expiration is now checked in `set` and the expired tokens are rejected

## [4.0.0] - 2017-03-29

### Changed

- **Breaking!** Upgraded resin-settings-storage. This changes the token's localStorage key in browsers to `resin-token`. This will lose all existing browser tokens.

## [3.0.0] - 2016-11-18

### Changed

- **Breaking!** Switch to factory pattern in order to make it work with the new resin-settings-storage

## [2.4.3] - 2016-09-12

### Changed

- Upgrade `resin-settings-storage` to v1.1.0.
- Run tests in the browser
- Update node versions in Travis and AppVeyor

## [2.4.2] - 2015-09-07

### Changed

- Upgrade `resin-settings-storage` to v1.0.1.

## [2.4.1] - 2015-08-06

### Added

- Run tests in Node v0.12 and iojs v2.5.0.

### Changed

- Make use of `resin-settings-storage` to persist/access the token.

## [2.4.0] - 2015-07-16

### Added

- Implement `token.getAge()`.

### Changed

- Fix uninformative error messages on `token.set()` if the token was not a string.

## [2.3.0] - 2015-07-09

### Added

- Implement `token.getData()`.
- Implement `token.getEmail()`.

## [2.2.0] - 2015-06-26

### Changed

- Validate a token by it's parseability instead of making an HTTP request to `/whoami`.

## [2.1.0] - 2015-06-19

### Added

- The token is validated agains `/whoami` on `.set()`.

## [2.0.0] - 2015-06-18

### Added

- JSDoc documentation.
- License to every source files.

### Changed

- Support promises.
- Improved README documentation.

## [1.3.0] - 2015-05-16

### Added

- Implement `token.getUserId()`.
- Configure Hound CI.

## [1.2.0] - 2015-03-19

### Changed

- Make use of [resin-errors](https://github.com/resin-io/resin-errors).

## [1.1.0] - 2015-03-19

### Added

- Implement `token.parse()`.
- Implement `token.getUsername()`.

[4.1.0]: https://github.com/resin-io/resin-token/compare/v4.0.0...v4.1.0
[4.0.0]: https://github.com/resin-io/resin-token/compare/v3.0.0...v4.0.0
[3.0.0]: https://github.com/resin-io/resin-token/compare/v2.4.3...v3.0.0
[2.4.3]: https://github.com/resin-io/resin-token/compare/v2.4.2...v2.4.3
[2.4.2]: https://github.com/resin-io/resin-token/compare/v2.4.1...v2.4.2
[2.4.1]: https://github.com/resin-io/resin-token/compare/v2.4.0...v2.4.1
[2.4.0]: https://github.com/resin-io/resin-token/compare/v2.3.0...v2.4.0
[2.3.0]: https://github.com/resin-io/resin-token/compare/v2.2.0...v2.3.0
[2.2.0]: https://github.com/resin-io/resin-token/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/resin-io/resin-token/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/resin-io/resin-token/compare/v1.3.0...v2.0.0
[1.3.0]: https://github.com/resin-io/resin-token/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/resin-io/resin-token/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/resin-io/resin-token/compare/v1.0.0...v1.1.0
