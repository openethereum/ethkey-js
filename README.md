# Parity ethkey.js

Ethereum keys generator, compatible with [rust codebase](https://github.com/openethereum/openethereum/tree/master/accounts/ethkey).

# Installation

`$ npm i @parity/ethkey.js --save`

## API

#### `phraseToWallet (String key)`

Returns a `Promise` of an object containing `secret`, `public` and `address` as hex-encoded, `0x` prefixed `String`s.

#### `verifySecret (String secret)`

Returns a `Promise` of a boolean. Verifies that a given secret is valid. Secret should be 32 bytes encoded as hex with `0x` prefix.
