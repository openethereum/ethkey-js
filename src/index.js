// Copyright 2015-2017 Parity Technologies (UK) Ltd.
// This file is part of Parity.

// Parity is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// Parity is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Parity.  If not, see <http://www.gnu.org/licenses/>.

import secp256k1 from 'secp256k1/elliptic';
import { keccak_256 as keccak256 } from 'js-sha3';
import { extern, slice } from './ethkey.js';

const ctx = extern
  .then((extern) => {
    extern._ecpointg();

    return {
      extern,
      input: slice(extern._input_ptr(), 1024),
      secret: slice(extern._secret_ptr(), 32),
      publicKey: slice(extern._public_ptr(), 64),
      address: slice(extern._address_ptr(), 20),
    }
  })
  .catch(() => null);

function bytesToHex (bytes) {
  return `0x${Buffer.from(bytes).toString('hex')}`;
}

function seedToWalletFallback (seed) {
  let secret = keccak256.array(seed);

  for (let i = 0; i < 16384; i++) {
    secret = keccak256.array(secret);
  }

  while (true) {
    secret = keccak256.array(secret);

    const secretBuf = Buffer.from(secret);

    if (secp256k1.privateKeyVerify(secretBuf)) {
      // No compression, slice out last 64 bytes
      const publicBuf = secp256k1.publicKeyCreate(secretBuf, false).slice(-64);
      const address = keccak256.array(publicBuf).slice(12);

      if (address[0] !== 0) {
        continue;
      }

      const wallet = {
        secret: bytesToHex(secretBuf),
        public: bytesToHex(publicBuf),
        address: bytesToHex(address)
      };

      return wallet;
    }
  }
}

export function phraseToWallet (phrase) {
  const phraseUtf8 = Buffer.from(phrase, 'utf8');

  return ctx
    .then((ctx) => {
      if (!ctx) {
        return seedToWalletFallback(phraseUtf8);
      }

      const { extern, input, secret, publicKey, address } = ctx;

      if (phraseUtf8.length > input.length) {
        throw new Error('Phrase is too long!');
      }

      input.set(phraseUtf8);

      extern._brain(phraseUtf8.length);

      const wallet = {
        secret: bytesToHex(secret),
        public: bytesToHex(publicKey),
        address: bytesToHex(address)
      };

      return wallet;
    });
}

export function verifySecret (key) {
  const keyBuf = Buffer.from(key.slice(2), 'hex');

  return ctx
    .then((ctx) => {
      if (!ctx) {
        return secp256k1.privateKeyVerify(keyBuf);
      }

      const { extern, secret } = ctx;

      secret.set(keyBuf);

      return Boolean(extern._verify_secret());
    });
}
