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

import { extern, slice } from './ethkey.js';

const input = slice(extern._input_ptr(), 1024);
const secret = slice(extern._secret_ptr(), 32);
const publicKey = slice(extern._public_ptr(), 64);
const address = slice(extern._address_ptr(), 20);

function bytesToHex (bytes) {
  return `0x${Buffer.from(bytes).toString('hex')}`;
}

export function phraseToWallet (phrase) {
  const phraseUtf8 = Buffer.from(phrase, 'utf8');

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
}

export function verifySecret (key) {
  const keyBuf = Buffer.from(key.slice(2), 'hex');

  secret.set(keyBuf);

  return extern._verify_secret();
}
