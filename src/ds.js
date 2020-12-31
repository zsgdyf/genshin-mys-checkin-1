const salt = 'h8w582wxwgqvahcdkpvdhbh2w9casgfl';

const wordsToBytes = function (t) {
  for (var e = [], n = 0; n < 32 * t.length; n += 8) e.push((t[n >>> 5] >>> (24 - (n % 32))) & 255);
  return e;
};

function mmNF() {
  var n = {
    utf8: {
      stringToBytes: function (t) {
        return n.bin.stringToBytes(unescape(encodeURIComponent(t)));
      },
      bytesToString: function (t) {
        return decodeURIComponent(escape(n.bin.bytesToString(t)));
      },
    },
    bin: {
      stringToBytes: function (t) {
        for (var e = [], n = 0; n < t.length; n++) e.push(255 & t.charCodeAt(n));
        return e;
      },
      bytesToString: function (t) {
        for (var e = [], n = 0; n < t.length; n++) e.push(String.fromCharCode(t[n]));
        return e.join('');
      },
    },
  };
  return n;
}

function g01() {
  function n(t) {
    return !!t.constructor && 'function' == typeof t.constructor.isBuffer && t.constructor.isBuffer(t);
  }
  return function (t) {
    return (
      null != t &&
      (n(t) ||
        (function (t) {
          return 'function' == typeof t.readFloatLE && 'function' == typeof t.slice && n(t.slice(0, 0));
        })(t) ||
        !!t._isBuffer)
    );
  };
}

const encodeString = (function () {
  var r, o, i, u, a;
  (r = (function (t, e) {
    var n = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      r;
    var r = {
      rotl: function (t, e) {
        return (t << e) | (t >>> (32 - e));
      },
      rotr: function (t, e) {
        return (t << (32 - e)) | (t >>> e);
      },
      endian: function (t) {
        if (t.constructor == Number) return (16711935 & r.rotl(t, 8)) | (4278255360 & r.rotl(t, 24));
        for (var e = 0; e < t.length; e++) t[e] = r.endian(t[e]);
        return t;
      },
      randomBytes: function (t) {
        for (var e = []; t > 0; t--) e.push(Math.floor(256 * Math.random()));
        return e;
      },
      bytesToWords: function (t) {
        for (var e = [], n = 0, r = 0; n < t.length; n++, r += 8) e[r >>> 5] |= t[n] << (24 - (r % 32));
        return e;
      },
      wordsToBytes: function (t) {
        for (var e = [], n = 0; n < 32 * t.length; n += 8) e.push((t[n >>> 5] >>> (24 - (n % 32))) & 255);
        return e;
      },
      bytesToHex: function (t) {
        for (var e = [], n = 0; n < t.length; n++) e.push((t[n] >>> 4).toString(16)), e.push((15 & t[n]).toString(16));
        return e.join('');
      },
      hexToBytes: function (t) {
        for (var e = [], n = 0; n < t.length; n += 2) e.push(parseInt(t.substr(n, 2), 16));
        return e;
      },
      bytesToBase64: function (t) {
        for (var e = [], r = 0; r < t.length; r += 3)
          for (var o = (t[r] << 16) | (t[r + 1] << 8) | t[r + 2], i = 0; i < 4; i++)
            8 * r + 6 * i <= 8 * t.length ? e.push(n.charAt((o >>> (6 * (3 - i))) & 63)) : e.push('=');
        return e.join('');
      },
      base64ToBytes: function (t) {
        t = t.replace(/[^A-Z0-9+\/]/gi, '');
        for (var e = [], r = 0, o = 0; r < t.length; o = ++r % 4)
          0 != o &&
            e.push(
              ((n.indexOf(t.charAt(r - 1)) & (Math.pow(2, -2 * o + 8) - 1)) << (2 * o)) |
                (n.indexOf(t.charAt(r)) >>> (6 - 2 * o)),
            );
        return e;
      },
    };

    return r;
  })()),
    (o = mmNF().utf8),
    (i = g01()),
    (u = mmNF().bin),
    ((a = function (t, e) {
      t.constructor == String
        ? (t = e && 'binary' === e.encoding ? u.stringToBytes(t) : o.stringToBytes(t))
        : i(t)
        ? (t = Array.prototype.slice.call(t, 0))
        : Array.isArray(t) || t.constructor === Uint8Array || (t = t.toString());
      for (
        var n = r.bytesToWords(t),
          c = 8 * t.length,
          f = 1732584193,
          s = -271733879,
          l = -1732584194,
          h = 271733878,
          p = 0;
        p < n.length;
        p++
      )
        n[p] = (16711935 & ((n[p] << 8) | (n[p] >>> 24))) | (4278255360 & ((n[p] << 24) | (n[p] >>> 8)));
      (n[c >>> 5] |= 128 << c % 32), (n[14 + (((c + 64) >>> 9) << 4)] = c);
      var d = a._ff,
        g = a._gg,
        v = a._hh,
        A = a._ii;
      for (p = 0; p < n.length; p += 16) {
        var y = f,
          m = s,
          w = l,
          b = h;
        (f = d(f, s, l, h, n[p + 0], 7, -680876936)),
          (h = d(h, f, s, l, n[p + 1], 12, -389564586)),
          (l = d(l, h, f, s, n[p + 2], 17, 606105819)),
          (s = d(s, l, h, f, n[p + 3], 22, -1044525330)),
          (f = d(f, s, l, h, n[p + 4], 7, -176418897)),
          (h = d(h, f, s, l, n[p + 5], 12, 1200080426)),
          (l = d(l, h, f, s, n[p + 6], 17, -1473231341)),
          (s = d(s, l, h, f, n[p + 7], 22, -45705983)),
          (f = d(f, s, l, h, n[p + 8], 7, 1770035416)),
          (h = d(h, f, s, l, n[p + 9], 12, -1958414417)),
          (l = d(l, h, f, s, n[p + 10], 17, -42063)),
          (s = d(s, l, h, f, n[p + 11], 22, -1990404162)),
          (f = d(f, s, l, h, n[p + 12], 7, 1804603682)),
          (h = d(h, f, s, l, n[p + 13], 12, -40341101)),
          (l = d(l, h, f, s, n[p + 14], 17, -1502002290)),
          (f = g(f, (s = d(s, l, h, f, n[p + 15], 22, 1236535329)), l, h, n[p + 1], 5, -165796510)),
          (h = g(h, f, s, l, n[p + 6], 9, -1069501632)),
          (l = g(l, h, f, s, n[p + 11], 14, 643717713)),
          (s = g(s, l, h, f, n[p + 0], 20, -373897302)),
          (f = g(f, s, l, h, n[p + 5], 5, -701558691)),
          (h = g(h, f, s, l, n[p + 10], 9, 38016083)),
          (l = g(l, h, f, s, n[p + 15], 14, -660478335)),
          (s = g(s, l, h, f, n[p + 4], 20, -405537848)),
          (f = g(f, s, l, h, n[p + 9], 5, 568446438)),
          (h = g(h, f, s, l, n[p + 14], 9, -1019803690)),
          (l = g(l, h, f, s, n[p + 3], 14, -187363961)),
          (s = g(s, l, h, f, n[p + 8], 20, 1163531501)),
          (f = g(f, s, l, h, n[p + 13], 5, -1444681467)),
          (h = g(h, f, s, l, n[p + 2], 9, -51403784)),
          (l = g(l, h, f, s, n[p + 7], 14, 1735328473)),
          (f = v(f, (s = g(s, l, h, f, n[p + 12], 20, -1926607734)), l, h, n[p + 5], 4, -378558)),
          (h = v(h, f, s, l, n[p + 8], 11, -2022574463)),
          (l = v(l, h, f, s, n[p + 11], 16, 1839030562)),
          (s = v(s, l, h, f, n[p + 14], 23, -35309556)),
          (f = v(f, s, l, h, n[p + 1], 4, -1530992060)),
          (h = v(h, f, s, l, n[p + 4], 11, 1272893353)),
          (l = v(l, h, f, s, n[p + 7], 16, -155497632)),
          (s = v(s, l, h, f, n[p + 10], 23, -1094730640)),
          (f = v(f, s, l, h, n[p + 13], 4, 681279174)),
          (h = v(h, f, s, l, n[p + 0], 11, -358537222)),
          (l = v(l, h, f, s, n[p + 3], 16, -722521979)),
          (s = v(s, l, h, f, n[p + 6], 23, 76029189)),
          (f = v(f, s, l, h, n[p + 9], 4, -640364487)),
          (h = v(h, f, s, l, n[p + 12], 11, -421815835)),
          (l = v(l, h, f, s, n[p + 15], 16, 530742520)),
          (f = A(f, (s = v(s, l, h, f, n[p + 2], 23, -995338651)), l, h, n[p + 0], 6, -198630844)),
          (h = A(h, f, s, l, n[p + 7], 10, 1126891415)),
          (l = A(l, h, f, s, n[p + 14], 15, -1416354905)),
          (s = A(s, l, h, f, n[p + 5], 21, -57434055)),
          (f = A(f, s, l, h, n[p + 12], 6, 1700485571)),
          (h = A(h, f, s, l, n[p + 3], 10, -1894986606)),
          (l = A(l, h, f, s, n[p + 10], 15, -1051523)),
          (s = A(s, l, h, f, n[p + 1], 21, -2054922799)),
          (f = A(f, s, l, h, n[p + 8], 6, 1873313359)),
          (h = A(h, f, s, l, n[p + 15], 10, -30611744)),
          (l = A(l, h, f, s, n[p + 6], 15, -1560198380)),
          (s = A(s, l, h, f, n[p + 13], 21, 1309151649)),
          (f = A(f, s, l, h, n[p + 4], 6, -145523070)),
          (h = A(h, f, s, l, n[p + 11], 10, -1120210379)),
          (l = A(l, h, f, s, n[p + 2], 15, 718787259)),
          (s = A(s, l, h, f, n[p + 9], 21, -343485551)),
          (f = (f + y) >>> 0),
          (s = (s + m) >>> 0),
          (l = (l + w) >>> 0),
          (h = (h + b) >>> 0);
      }
      return r.endian([f, s, l, h]);
    })._ff = function (t, e, n, r, o, i, u) {
      var a = t + ((e & n) | (~e & r)) + (o >>> 0) + u;
      return ((a << i) | (a >>> (32 - i))) + e;
    }),
    (a._gg = function (t, e, n, r, o, i, u) {
      var a = t + ((e & r) | (n & ~r)) + (o >>> 0) + u;
      return ((a << i) | (a >>> (32 - i))) + e;
    }),
    (a._hh = function (t, e, n, r, o, i, u) {
      var a = t + (e ^ n ^ r) + (o >>> 0) + u;
      return ((a << i) | (a >>> (32 - i))) + e;
    }),
    (a._ii = function (t, e, n, r, o, i, u) {
      var a = t + (n ^ (e | ~r)) + (o >>> 0) + u;
      return ((a << i) | (a >>> (32 - i))) + e;
    }),
    (a._blocksize = 16),
    (a._digestsize = 16);
  return function (t, e) {
    if (null == t) throw new Error('Illegal argument ' + t);
    var n = wordsToBytes(a(t, e));
    return e && e.asBytes ? n : e && e.asString ? u.bytesToString(n) : r.bytesToHex(n);
  };
})();

const processAction = function (t) {
  var e = Math.floor(Date.now() / 1e3),
    n = (function (t) {
      for (var e = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678', n = e.length, r = '', o = 0; o < 6; o++)
        r += e.charAt(Math.floor(Math.random() * n));
      return r;
    })();
  return [e, n, (0, encodeString)('salt=' + t + '&t=' + e + '&r=' + n)].join(',');
};

module.exports = () => processAction(salt);
