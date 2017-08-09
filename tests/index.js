const test = require('tape-async');
const { phraseToWallet, verifySecret } = require('../target/lib');

test('verify secret', async function(t) {
    const secret = '0x0000000000000000000000000000000000000000000000000000000000000001';

    t.equal(
        await verifySecret('0x0000000000000000000000000000000000000000000000000000000000000001'),
        true,
        'accepts 1'
    );

    t.equal(
        await verifySecret('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141'),
        false,
        'rejects the `N` constant'
    );

    t.equal(
        await verifySecret('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140'),
        true,
        'accepts `N - 1`'
    );

    t.equal(
        await verifySecret('0x0000000000000000000000000000000000000000000000000000000000000000'),
        false,
        'rejects 0'
    );

    t.equal(
        await verifySecret('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'),
        false,
        'rejects all `f`'
    );

    t.end();
});

test('generates valid wallet object', async function(t) {
    const wallet = await phraseToWallet('doge to the moon');

    t.equal(
        wallet.secret,
        '0x58125e14841228b2db1ae8fe24524b54568b33dcf01472acd5249c0452c09ef6',
        'has valid secret key'
    );

    t.equal(
        wallet.public,
        '0xb76ca2fdb0ed0e3ece0cdb0178d3431df0793764600f0b3130a599a7e7ae0a4447427fd255050108b522eae4d89aa77f9d77edb8ab72244c98f8d584bac2dc2e',
        'has valid public key'
    );

    t.equal(
        wallet.address,
        '0x00850755def64d1c4bf5771d9d94896c1b5ae703',
        'has valid address'
    );

    t.end();
});
