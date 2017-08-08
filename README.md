# Parity ethkey.js

Ethereum keys generator, compatible with [rust codebase](https://github.com/paritytech/parity/tree/master/ethkey).

## API

#### `phraseToWallet (String key)`

Returns an object containing `secret`, `public` and `address` as hex-encoded, `0x` prefixed `String`s.

#### `verifySecret (String secret)`

Verifies that a given secret is valid. Secret should be 32 bytes encoded as hex with `0x` prefix.
