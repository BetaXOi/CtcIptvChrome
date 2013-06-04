function injectJs(text) {
	var scr = document.createElement('script');
	scr.type="text/javascript";
	scr.textContent=text;
	document.documentElement.appendChild(scr);
}

injectJs('/*\n *  md5.jvs 1.0b 27/06/96\n *\n * Javascript implementation of the RSA Data Security, Inc. MD5\n * Message-Digest Algorithm.\n *\n * Copyright (c) 1996 Henri Torgemane. All Rights Reserved.\n *\n * Permission to use, copy, modify, and distribute this software\n * and its documentation for any purposes and without\n * fee is hereby granted provided that this copyright notice\n * appears in all copies. \n *\n * Of course, this soft is provided \"as is\" without express or implied\n * warranty of any kind.\n\n    This version contains some trivial reformatting modifications\n    by John Walker.\n\n */\n\nfunction array(n) {\n    for (i = 0; i < n; i++) {\n        this[i] = 0;\n    }\n    this.length = n;\n}\n\n/* Some basic logical functions had to be rewritten because of a bug in\n * Javascript.. Just try to compute 0xffffffff >> 4 with it..\n * Of course, these functions are slower than the original would be, but\n * at least, they work!\n */\n\nfunction integer(n) {\n    return n % (0xffffffff + 1);\n}\n\nfunction shr(a, b) {\n    a = integer(a);\n    b = integer(b);\n    if (a - 0x80000000 >= 0) {\n        a = a % 0x80000000;\n        a >>= b;\n        a += 0x40000000 >> (b - 1);\n    } else {\n        a >>= b;\n    }\n    return a;\n}\n\nfunction shl1(a) {\n    a = a % 0x80000000;\n    if (a & 0x40000000 == 0x40000000) {\n        a -= 0x40000000;  \n        a *= 2;\n        a += 0x80000000;\n    } else {\n        a *= 2;\n    }\n    return a;\n}\n\nfunction shl(a, b) {\n    a = integer(a);\n    b = integer(b);\n    for (var i = 0; i < b; i++) {\n        a = shl1(a);\n    }\n    return a;\n}\n\nfunction and(a, b) {\n    a = integer(a);\n    b = integer(b);\n    var t1 = a - 0x80000000;\n    var t2 = b - 0x80000000;\n    if (t1 >= 0) {\n        if (t2 >= 0) {\n            return ((t1 & t2) + 0x80000000);\n        } else {\n            return (t1 & b);\n        }\n    } else {\n        if (t2 >= 0) {\n            return (a & t2);\n        } else {\n            return (a & b);  \n        }\n    }\n}\n\nfunction or(a, b) {\n    a = integer(a);\n    b = integer(b);\n    var t1 = a - 0x80000000;\n    var t2 = b - 0x80000000;\n    if (t1 >= 0) {\n        if (t2 >= 0) {\n            return ((t1 | t2) + 0x80000000);\n        } else {\n            return ((t1 | b) + 0x80000000);\n        }\n    } else {\n        if (t2 >= 0) {\n            return ((a | t2) + 0x80000000);\n        } else {\n            return (a | b);  \n        }\n    }\n}\n\nfunction xor(a, b) {\n    a = integer(a);\n    b = integer(b);\n    var t1 = a - 0x80000000;\n    var t2 = b - 0x80000000;\n    if (t1 >= 0) {\n        if (t2 >= 0) {\n            return (t1 ^ t2);\n        } else {\n            return ((t1 ^ b) + 0x80000000);\n        }\n    } else {\n        if (t2 >= 0) {\n            return ((a ^ t2) + 0x80000000);\n        } else {\n            return (a ^ b);  \n        }\n    }\n}\n\nfunction not(a) {\n    a = integer(a);\n    return 0xffffffff - a;\n}\n\n/* Here begin the real algorithm */\n\nvar state = new array(4); \nvar count = new array(2);\n    count[0] = 0;\n    count[1] = 0;                     \nvar buffer = new array(64); \nvar transformBuffer = new array(16); \nvar digestBits = new array(16);\n\nvar S11 = 7;\nvar S12 = 12;\nvar S13 = 17;\nvar S14 = 22;\nvar S21 = 5;\nvar S22 = 9;\nvar S23 = 14;\nvar S24 = 20;\nvar S31 = 4;\nvar S32 = 11;\nvar S33 = 16;\nvar S34 = 23;\nvar S41 = 6;\nvar S42 = 10;\nvar S43 = 15;\nvar S44 = 21;\n\nfunction F(x, y, z) {\n    return or(and(x, y), and(not(x), z));\n}\n\nfunction G(x, y, z) {\n    return or(and(x, z), and(y, not(z)));\n}\n\nfunction H(x, y, z) {\n    return xor(xor(x, y), z);\n}\n\nfunction I(x, y, z) {\n    return xor(y ,or(x , not(z)));\n}\n\nfunction rotateLeft(a, n) {\n    return or(shl(a, n), (shr(a, (32 - n))));\n}\n\nfunction FF(a, b, c, d, x, s, ac) {\n    a = a + F(b, c, d) + x + ac;\n    a = rotateLeft(a, s);\n    a = a + b;\n    return a;\n}\n\nfunction GG(a, b, c, d, x, s, ac) {\n    a = a + G(b, c, d) + x + ac;\n    a = rotateLeft(a, s);\n    a = a + b;\n    return a;\n}\n\nfunction HH(a, b, c, d, x, s, ac) {\n    a = a + H(b, c, d) + x + ac;\n    a = rotateLeft(a, s);\n    a = a + b;\n    return a;\n}\n\nfunction II(a, b, c, d, x, s, ac) {\n    a = a + I(b, c, d) + x + ac;\n    a = rotateLeft(a, s);\n    a = a + b;\n    return a;\n}\n\nfunction transform(buf, offset) { \n    var a = 0, b = 0, c = 0, d = 0; \n    var x = transformBuffer;\n    \n    a = state[0];\n    b = state[1];\n    c = state[2];\n    d = state[3];\n    \n    for (i = 0; i < 16; i++) {\n        x[i] = and(buf[i * 4 + offset], 0xFF);\n        for (j = 1; j < 4; j++) {\n            x[i] += shl(and(buf[i * 4 + j + offset] ,0xFF), j * 8);\n        }\n    }\n\n    /* Round 1 */\n    a = FF( a, b, c, d, x[ 0], S11, 0xd76aa478); /* 1 */\n    d = FF( d, a, b, c, x[ 1], S12, 0xe8c7b756); /* 2 */\n    c = FF( c, d, a, b, x[ 2], S13, 0x242070db); /* 3 */\n    b = FF( b, c, d, a, x[ 3], S14, 0xc1bdceee); /* 4 */\n    a = FF( a, b, c, d, x[ 4], S11, 0xf57c0faf); /* 5 */\n    d = FF( d, a, b, c, x[ 5], S12, 0x4787c62a); /* 6 */\n    c = FF( c, d, a, b, x[ 6], S13, 0xa8304613); /* 7 */\n    b = FF( b, c, d, a, x[ 7], S14, 0xfd469501); /* 8 */\n    a = FF( a, b, c, d, x[ 8], S11, 0x698098d8); /* 9 */\n    d = FF( d, a, b, c, x[ 9], S12, 0x8b44f7af); /* 10 */\n    c = FF( c, d, a, b, x[10], S13, 0xffff5bb1); /* 11 */\n    b = FF( b, c, d, a, x[11], S14, 0x895cd7be); /* 12 */\n    a = FF( a, b, c, d, x[12], S11, 0x6b901122); /* 13 */\n    d = FF( d, a, b, c, x[13], S12, 0xfd987193); /* 14 */\n    c = FF( c, d, a, b, x[14], S13, 0xa679438e); /* 15 */\n    b = FF( b, c, d, a, x[15], S14, 0x49b40821); /* 16 */\n\n    /* Round 2 */\n    a = GG( a, b, c, d, x[ 1], S21, 0xf61e2562); /* 17 */\n    d = GG( d, a, b, c, x[ 6], S22, 0xc040b340); /* 18 */\n    c = GG( c, d, a, b, x[11], S23, 0x265e5a51); /* 19 */\n    b = GG( b, c, d, a, x[ 0], S24, 0xe9b6c7aa); /* 20 */\n    a = GG( a, b, c, d, x[ 5], S21, 0xd62f105d); /* 21 */\n    d = GG( d, a, b, c, x[10], S22,  0x2441453); /* 22 */\n    c = GG( c, d, a, b, x[15], S23, 0xd8a1e681); /* 23 */\n    b = GG( b, c, d, a, x[ 4], S24, 0xe7d3fbc8); /* 24 */\n    a = GG( a, b, c, d, x[ 9], S21, 0x21e1cde6); /* 25 */\n    d = GG( d, a, b, c, x[14], S22, 0xc33707d6); /* 26 */\n    c = GG( c, d, a, b, x[ 3], S23, 0xf4d50d87); /* 27 */\n    b = GG( b, c, d, a, x[ 8], S24, 0x455a14ed); /* 28 */\n    a = GG( a, b, c, d, x[13], S21, 0xa9e3e905); /* 29 */\n    d = GG( d, a, b, c, x[ 2], S22, 0xfcefa3f8); /* 30 */\n    c = GG( c, d, a, b, x[ 7], S23, 0x676f02d9); /* 31 */\n    b = GG( b, c, d, a, x[12], S24, 0x8d2a4c8a); /* 32 */\n\n    /* Round 3 */\n    a = HH( a, b, c, d, x[ 5], S31, 0xfffa3942); /* 33 */\n    d = HH( d, a, b, c, x[ 8], S32, 0x8771f681); /* 34 */\n    c = HH( c, d, a, b, x[11], S33, 0x6d9d6122); /* 35 */\n    b = HH( b, c, d, a, x[14], S34, 0xfde5380c); /* 36 */\n    a = HH( a, b, c, d, x[ 1], S31, 0xa4beea44); /* 37 */\n    d = HH( d, a, b, c, x[ 4], S32, 0x4bdecfa9); /* 38 */\n    c = HH( c, d, a, b, x[ 7], S33, 0xf6bb4b60); /* 39 */\n    b = HH( b, c, d, a, x[10], S34, 0xbebfbc70); /* 40 */\n    a = HH( a, b, c, d, x[13], S31, 0x289b7ec6); /* 41 */\n    d = HH( d, a, b, c, x[ 0], S32, 0xeaa127fa); /* 42 */\n    c = HH( c, d, a, b, x[ 3], S33, 0xd4ef3085); /* 43 */\n    b = HH( b, c, d, a, x[ 6], S34,  0x4881d05); /* 44 */\n    a = HH( a, b, c, d, x[ 9], S31, 0xd9d4d039); /* 45 */\n    d = HH( d, a, b, c, x[12], S32, 0xe6db99e5); /* 46 */\n    c = HH( c, d, a, b, x[15], S33, 0x1fa27cf8); /* 47 */\n    b = HH( b, c, d, a, x[ 2], S34, 0xc4ac5665); /* 48 */\n\n    /* Round 4 */\n    a = II( a, b, c, d, x[ 0], S41, 0xf4292244); /* 49 */\n    d = II( d, a, b, c, x[ 7], S42, 0x432aff97); /* 50 */\n    c = II( c, d, a, b, x[14], S43, 0xab9423a7); /* 51 */\n    b = II( b, c, d, a, x[ 5], S44, 0xfc93a039); /* 52 */\n    a = II( a, b, c, d, x[12], S41, 0x655b59c3); /* 53 */\n    d = II( d, a, b, c, x[ 3], S42, 0x8f0ccc92); /* 54 */\n    c = II( c, d, a, b, x[10], S43, 0xffeff47d); /* 55 */\n    b = II( b, c, d, a, x[ 1], S44, 0x85845dd1); /* 56 */\n    a = II( a, b, c, d, x[ 8], S41, 0x6fa87e4f); /* 57 */\n    d = II( d, a, b, c, x[15], S42, 0xfe2ce6e0); /* 58 */\n    c = II( c, d, a, b, x[ 6], S43, 0xa3014314); /* 59 */\n    b = II( b, c, d, a, x[13], S44, 0x4e0811a1); /* 60 */\n    a = II( a, b, c, d, x[ 4], S41, 0xf7537e82); /* 61 */\n    d = II( d, a, b, c, x[11], S42, 0xbd3af235); /* 62 */\n    c = II( c, d, a, b, x[ 2], S43, 0x2ad7d2bb); /* 63 */\n    b = II( b, c, d, a, x[ 9], S44, 0xeb86d391); /* 64 */\n\n    state[0] += a;\n    state[1] += b;\n    state[2] += c;\n    state[3] += d;\n\n}\n\nfunction md5_init() {\n    count[0] = count[1] = 0;\n    state[0] = 0x67452301;\n    state[1] = 0xefcdab89;\n    state[2] = 0x98badcfe;\n    state[3] = 0x10325476;\n    for (i = 0; i < digestBits.length; i++) {\n        digestBits[i] = 0;\n    }\n}\n\nfunction md5_update(b) { \n    var index, i;\n    \n    index = and(shr(count[0],3) , 0x3F);\n    if (count[0] < 0xFFFFFFFF - 7) {\n      count[0] += 8;\n    } else {\n      count[1]++;\n      count[0] -= 0xFFFFFFFF + 1;\n      count[0] += 8;\n    }\n    buffer[index] = and(b, 0xff);\n    if (index  >= 63) {\n        transform(buffer, 0);\n    }\n}\n\nfunction md5_finish() {\n    var bits = new array(8);\n    var padding; \n    var i = 0, index = 0, padLen = 0;\n\n    for (i = 0; i < 4; i++) {\n        bits[i] = and(shr(count[0], (i * 8)), 0xFF);\n    }\n    for (i = 0; i < 4; i++) {\n        bits[i + 4] = and(shr(count[1], (i * 8)), 0xFF);\n    }\n    index = and(shr(count[0], 3), 0x3F);\n    padLen = (index < 56) ? (56 - index) : (120 - index);\n    padding = new array(64); \n    padding[0] = 0x80;\n    for (i = 0; i < padLen; i++) {\n      md5_update(padding[i]);\n    }\n    for (i = 0; i < 8; i++) {\n      md5_update(bits[i]);\n    }\n\n    for (i = 0; i < 4; i++) {\n        for (j = 0; j < 4; j++) {\n            digestBits[i * 4 + j] = and(shr(state[i], (j * 8)) , 0xFF);\n        }\n    } \n}\n\n/* End of the MD5 algorithm */\n');

injectJs('//Paul Tero, July 2001\n//http://www.tero.co.uk/des/\n//\n//Optimised for performance with large blocks by Michael Hayworth, November 2001\n//http://www.netdealing.com\n//\n//THIS SOFTWARE IS PROVIDED \"AS IS\" AND\n//ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE\n//IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE\n//ARE DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR OR CONTRIBUTORS BE LIABLE\n//FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL\n//DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS\n//OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)\n//HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT\n//LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY\n//OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF\n//SUCH DAMAGE.\n\n//des\n//this takes the key, the message, and whether to encrypt or decrypt\nfunction des (key, message, encrypt, mode, iv, padding) {\n  //declaring this locally speeds things up a bit\n  var spfunction1 = new Array (0x1010400,0,0x10000,0x1010404,0x1010004,0x10404,0x4,0x10000,0x400,0x1010400,0x1010404,0x400,0x1000404,0x1010004,0x1000000,0x4,0x404,0x1000400,0x1000400,0x10400,0x10400,0x1010000,0x1010000,0x1000404,0x10004,0x1000004,0x1000004,0x10004,0,0x404,0x10404,0x1000000,0x10000,0x1010404,0x4,0x1010000,0x1010400,0x1000000,0x1000000,0x400,0x1010004,0x10000,0x10400,0x1000004,0x400,0x4,0x1000404,0x10404,0x1010404,0x10004,0x1010000,0x1000404,0x1000004,0x404,0x10404,0x1010400,0x404,0x1000400,0x1000400,0,0x10004,0x10400,0,0x1010004);\n  var spfunction2 = new Array (-0x7fef7fe0,-0x7fff8000,0x8000,0x108020,0x100000,0x20,-0x7fefffe0,-0x7fff7fe0,-0x7fffffe0,-0x7fef7fe0,-0x7fef8000,-0x80000000,-0x7fff8000,0x100000,0x20,-0x7fefffe0,0x108000,0x100020,-0x7fff7fe0,0,-0x80000000,0x8000,0x108020,-0x7ff00000,0x100020,-0x7fffffe0,0,0x108000,0x8020,-0x7fef8000,-0x7ff00000,0x8020,0,0x108020,-0x7fefffe0,0x100000,-0x7fff7fe0,-0x7ff00000,-0x7fef8000,0x8000,-0x7ff00000,-0x7fff8000,0x20,-0x7fef7fe0,0x108020,0x20,0x8000,-0x80000000,0x8020,-0x7fef8000,0x100000,-0x7fffffe0,0x100020,-0x7fff7fe0,-0x7fffffe0,0x100020,0x108000,0,-0x7fff8000,0x8020,-0x80000000,-0x7fefffe0,-0x7fef7fe0,0x108000);\n  var spfunction3 = new Array (0x208,0x8020200,0,0x8020008,0x8000200,0,0x20208,0x8000200,0x20008,0x8000008,0x8000008,0x20000,0x8020208,0x20008,0x8020000,0x208,0x8000000,0x8,0x8020200,0x200,0x20200,0x8020000,0x8020008,0x20208,0x8000208,0x20200,0x20000,0x8000208,0x8,0x8020208,0x200,0x8000000,0x8020200,0x8000000,0x20008,0x208,0x20000,0x8020200,0x8000200,0,0x200,0x20008,0x8020208,0x8000200,0x8000008,0x200,0,0x8020008,0x8000208,0x20000,0x8000000,0x8020208,0x8,0x20208,0x20200,0x8000008,0x8020000,0x8000208,0x208,0x8020000,0x20208,0x8,0x8020008,0x20200);\n  var spfunction4 = new Array (0x802001,0x2081,0x2081,0x80,0x802080,0x800081,0x800001,0x2001,0,0x802000,0x802000,0x802081,0x81,0,0x800080,0x800001,0x1,0x2000,0x800000,0x802001,0x80,0x800000,0x2001,0x2080,0x800081,0x1,0x2080,0x800080,0x2000,0x802080,0x802081,0x81,0x800080,0x800001,0x802000,0x802081,0x81,0,0,0x802000,0x2080,0x800080,0x800081,0x1,0x802001,0x2081,0x2081,0x80,0x802081,0x81,0x1,0x2000,0x800001,0x2001,0x802080,0x800081,0x2001,0x2080,0x800000,0x802001,0x80,0x800000,0x2000,0x802080);\n  var spfunction5 = new Array (0x100,0x2080100,0x2080000,0x42000100,0x80000,0x100,0x40000000,0x2080000,0x40080100,0x80000,0x2000100,0x40080100,0x42000100,0x42080000,0x80100,0x40000000,0x2000000,0x40080000,0x40080000,0,0x40000100,0x42080100,0x42080100,0x2000100,0x42080000,0x40000100,0,0x42000000,0x2080100,0x2000000,0x42000000,0x80100,0x80000,0x42000100,0x100,0x2000000,0x40000000,0x2080000,0x42000100,0x40080100,0x2000100,0x40000000,0x42080000,0x2080100,0x40080100,0x100,0x2000000,0x42080000,0x42080100,0x80100,0x42000000,0x42080100,0x2080000,0,0x40080000,0x42000000,0x80100,0x2000100,0x40000100,0x80000,0,0x40080000,0x2080100,0x40000100);\n  var spfunction6 = new Array (0x20000010,0x20400000,0x4000,0x20404010,0x20400000,0x10,0x20404010,0x400000,0x20004000,0x404010,0x400000,0x20000010,0x400010,0x20004000,0x20000000,0x4010,0,0x400010,0x20004010,0x4000,0x404000,0x20004010,0x10,0x20400010,0x20400010,0,0x404010,0x20404000,0x4010,0x404000,0x20404000,0x20000000,0x20004000,0x10,0x20400010,0x404000,0x20404010,0x400000,0x4010,0x20000010,0x400000,0x20004000,0x20000000,0x4010,0x20000010,0x20404010,0x404000,0x20400000,0x404010,0x20404000,0,0x20400010,0x10,0x4000,0x20400000,0x404010,0x4000,0x400010,0x20004010,0,0x20404000,0x20000000,0x400010,0x20004010);\n  var spfunction7 = new Array (0x200000,0x4200002,0x4000802,0,0x800,0x4000802,0x200802,0x4200800,0x4200802,0x200000,0,0x4000002,0x2,0x4000000,0x4200002,0x802,0x4000800,0x200802,0x200002,0x4000800,0x4000002,0x4200000,0x4200800,0x200002,0x4200000,0x800,0x802,0x4200802,0x200800,0x2,0x4000000,0x200800,0x4000000,0x200800,0x200000,0x4000802,0x4000802,0x4200002,0x4200002,0x2,0x200002,0x4000000,0x4000800,0x200000,0x4200800,0x802,0x200802,0x4200800,0x802,0x4000002,0x4200802,0x4200000,0x200800,0,0x2,0x4200802,0,0x200802,0x4200000,0x800,0x4000002,0x4000800,0x800,0x200002);\n  var spfunction8 = new Array (0x10001040,0x1000,0x40000,0x10041040,0x10000000,0x10001040,0x40,0x10000000,0x40040,0x10040000,0x10041040,0x41000,0x10041000,0x41040,0x1000,0x40,0x10040000,0x10000040,0x10001000,0x1040,0x41000,0x40040,0x10040040,0x10041000,0x1040,0,0,0x10040040,0x10000040,0x10001000,0x41040,0x40000,0x41040,0x40000,0x10041000,0x1000,0x40,0x10040040,0x1000,0x41040,0x10001000,0x40,0x10000040,0x10040000,0x10040040,0x10000000,0x40000,0x10001040,0,0x10041040,0x40040,0x10000040,0x10040000,0x10001000,0x10001040,0,0x10041040,0x41000,0x41000,0x1040,0x1040,0x40040,0x10000000,0x10041000);\n\n  //create the 16 or 48 subkeys we will need\n  var keys = des_createKeys (key);\n  var m=0, i, j, temp, temp2, right1, right2, left, right, looping;\n  var cbcleft, cbcleft2, cbcright, cbcright2\n  var endloop, loopinc;\n  var len = message.length;\n  var chunk = 0;\n  //set up the loops for single and triple des\n  var iterations = keys.length == 32 ? 3 : 9; //single or triple des\n  if (iterations == 3) {looping = encrypt ? new Array (0, 32, 2) : new Array (30, -2, -2);}\n  else {looping = encrypt ? new Array (0, 32, 2, 62, 30, -2, 64, 96, 2) : new Array (94, 62, -2, 32, 64, 2, 30, -2, -2);}\n\n  //pad the message depending on the padding parameter\n  if (padding == 2) message += \"        \"; //pad the message with spaces\n  else if (padding == 1) {temp = 8-(len%8); message += String.fromCharCode (temp,temp,temp,temp,temp,temp,temp,temp); if (temp==8) len+=8;} //PKCS7 padding\n  else if (!padding) message += \"\\0\\0\\0\\0\\0\\0\\0\\0\"; //pad the message out with null bytes\n\n  //store the result here\n  result = \"\";\n  tempresult = \"\";\n\n  if (mode == 1) { //CBC mode\n    cbcleft = (iv.charCodeAt(m++) << 24) | (iv.charCodeAt(m++) << 16) | (iv.charCodeAt(m++) << 8) | iv.charCodeAt(m++);\n    cbcright = (iv.charCodeAt(m++) << 24) | (iv.charCodeAt(m++) << 16) | (iv.charCodeAt(m++) << 8) | iv.charCodeAt(m++);\n    m=0;\n  }\n\n  //loop through each 64 bit chunk of the message\n  while (m < len) {\n    left = (message.charCodeAt(m++) << 24) | (message.charCodeAt(m++) << 16) | (message.charCodeAt(m++) << 8) | message.charCodeAt(m++);\n    right = (message.charCodeAt(m++) << 24) | (message.charCodeAt(m++) << 16) | (message.charCodeAt(m++) << 8) | message.charCodeAt(m++);\n\n    //for Cipher Block Chaining mode, xor the message with the previous result\n    if (mode == 1) {if (encrypt) {left ^= cbcleft; right ^= cbcright;} else {cbcleft2 = cbcleft; cbcright2 = cbcright; cbcleft = left; cbcright = right;}}\n\n    //first each 64 but chunk of the message must be permuted according to IP\n    temp = ((left >>> 4) ^ right) & 0x0f0f0f0f; right ^= temp; left ^= (temp << 4);\n    temp = ((left >>> 16) ^ right) & 0x0000ffff; right ^= temp; left ^= (temp << 16);\n    temp = ((right >>> 2) ^ left) & 0x33333333; left ^= temp; right ^= (temp << 2);\n    temp = ((right >>> 8) ^ left) & 0x00ff00ff; left ^= temp; right ^= (temp << 8);\n    temp = ((left >>> 1) ^ right) & 0x55555555; right ^= temp; left ^= (temp << 1);\n\n    left = ((left << 1) | (left >>> 31)); \n    right = ((right << 1) | (right >>> 31)); \n\n    //do this either 1 or 3 times for each chunk of the message\n    for (j=0; j<iterations; j+=3) {\n      endloop = looping[j+1];\n      loopinc = looping[j+2];\n      //now go through and perform the encryption or decryption  \n      for (i=looping[j]; i!=endloop; i+=loopinc) { //for efficiency\n        right1 = right ^ keys[i]; \n        right2 = ((right >>> 4) | (right << 28)) ^ keys[i+1];\n        //the result is attained by passing these bytes through the S selection functions\n        temp = left;\n        left = right;\n        right = temp ^ (spfunction2[(right1 >>> 24) & 0x3f] | spfunction4[(right1 >>> 16) & 0x3f]\n              | spfunction6[(right1 >>>  8) & 0x3f] | spfunction8[right1 & 0x3f]\n              | spfunction1[(right2 >>> 24) & 0x3f] | spfunction3[(right2 >>> 16) & 0x3f]\n              | spfunction5[(right2 >>>  8) & 0x3f] | spfunction7[right2 & 0x3f]);\n      }\n      temp = left; left = right; right = temp; //unreverse left and right\n    } //for either 1 or 3 iterations\n\n    //move then each one bit to the right\n    left = ((left >>> 1) | (left << 31)); \n    right = ((right >>> 1) | (right << 31)); \n\n    //now perform IP-1, which is IP in the opposite direction\n    temp = ((left >>> 1) ^ right) & 0x55555555; right ^= temp; left ^= (temp << 1);\n    temp = ((right >>> 8) ^ left) & 0x00ff00ff; left ^= temp; right ^= (temp << 8);\n    temp = ((right >>> 2) ^ left) & 0x33333333; left ^= temp; right ^= (temp << 2);\n    temp = ((left >>> 16) ^ right) & 0x0000ffff; right ^= temp; left ^= (temp << 16);\n    temp = ((left >>> 4) ^ right) & 0x0f0f0f0f; right ^= temp; left ^= (temp << 4);\n\n    //for Cipher Block Chaining mode, xor the message with the previous result\n    if (mode == 1) {if (encrypt) {cbcleft = left; cbcright = right;} else {left ^= cbcleft2; right ^= cbcright2;}}\n    tempresult += String.fromCharCode ((left>>>24), ((left>>>16) & 0xff), ((left>>>8) & 0xff), (left & 0xff), (right>>>24), ((right>>>16) & 0xff), ((right>>>8) & 0xff), (right & 0xff));\n\n    chunk += 8;\n    if (chunk == 512) {result += tempresult; tempresult = \"\"; chunk = 0;}\n  } //for every 8 characters, or 64 bits in the message\n\n  //return the result as an array\n  result += tempresult;\n  result = result.replace(/\\0*$/g, \"\");\n  return result;\n} //end of des\n\n\n\n//des_createKeys\n//this takes as input a 64 bit key (even though only 56 bits are used)\n//as an array of 2 integers, and returns 16 48 bit keys\nfunction des_createKeys (key) {\n  //declaring this locally speeds things up a bit\n  pc2bytes0  = new Array (0,0x4,0x20000000,0x20000004,0x10000,0x10004,0x20010000,0x20010004,0x200,0x204,0x20000200,0x20000204,0x10200,0x10204,0x20010200,0x20010204);\n  pc2bytes1  = new Array (0,0x1,0x100000,0x100001,0x4000000,0x4000001,0x4100000,0x4100001,0x100,0x101,0x100100,0x100101,0x4000100,0x4000101,0x4100100,0x4100101);\n  pc2bytes2  = new Array (0,0x8,0x800,0x808,0x1000000,0x1000008,0x1000800,0x1000808,0,0x8,0x800,0x808,0x1000000,0x1000008,0x1000800,0x1000808);\n  pc2bytes3  = new Array (0,0x200000,0x8000000,0x8200000,0x2000,0x202000,0x8002000,0x8202000,0x20000,0x220000,0x8020000,0x8220000,0x22000,0x222000,0x8022000,0x8222000);\n  pc2bytes4  = new Array (0,0x40000,0x10,0x40010,0,0x40000,0x10,0x40010,0x1000,0x41000,0x1010,0x41010,0x1000,0x41000,0x1010,0x41010);\n  pc2bytes5  = new Array (0,0x400,0x20,0x420,0,0x400,0x20,0x420,0x2000000,0x2000400,0x2000020,0x2000420,0x2000000,0x2000400,0x2000020,0x2000420);\n  pc2bytes6  = new Array (0,0x10000000,0x80000,0x10080000,0x2,0x10000002,0x80002,0x10080002,0,0x10000000,0x80000,0x10080000,0x2,0x10000002,0x80002,0x10080002);\n  pc2bytes7  = new Array (0,0x10000,0x800,0x10800,0x20000000,0x20010000,0x20000800,0x20010800,0x20000,0x30000,0x20800,0x30800,0x20020000,0x20030000,0x20020800,0x20030800);\n  pc2bytes8  = new Array (0,0x40000,0,0x40000,0x2,0x40002,0x2,0x40002,0x2000000,0x2040000,0x2000000,0x2040000,0x2000002,0x2040002,0x2000002,0x2040002);\n  pc2bytes9  = new Array (0,0x10000000,0x8,0x10000008,0,0x10000000,0x8,0x10000008,0x400,0x10000400,0x408,0x10000408,0x400,0x10000400,0x408,0x10000408);\n  pc2bytes10 = new Array (0,0x20,0,0x20,0x100000,0x100020,0x100000,0x100020,0x2000,0x2020,0x2000,0x2020,0x102000,0x102020,0x102000,0x102020);\n  pc2bytes11 = new Array (0,0x1000000,0x200,0x1000200,0x200000,0x1200000,0x200200,0x1200200,0x4000000,0x5000000,0x4000200,0x5000200,0x4200000,0x5200000,0x4200200,0x5200200);\n  pc2bytes12 = new Array (0,0x1000,0x8000000,0x8001000,0x80000,0x81000,0x8080000,0x8081000,0x10,0x1010,0x8000010,0x8001010,0x80010,0x81010,0x8080010,0x8081010);\n  pc2bytes13 = new Array (0,0x4,0x100,0x104,0,0x4,0x100,0x104,0x1,0x5,0x101,0x105,0x1,0x5,0x101,0x105);\n\n  //how many iterations (1 for des, 3 for triple des)\n  var iterations = key.length > 8 ? 3 : 1; //changed by Paul 16/6/2007 to use Triple DES for 9+ byte keys\n  //stores the return keys\n  var keys = new Array (32 * iterations);\n  //now define the left shifts which need to be done\n  var shifts = new Array (0, 0, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 0);\n  //other variables\n  var lefttemp, righttemp, m=0, n=0, temp;\n\n  for (var j=0; j<iterations; j++) { //either 1 or 3 iterations\n    left = (key.charCodeAt(m++) << 24) | (key.charCodeAt(m++) << 16) | (key.charCodeAt(m++) << 8) | key.charCodeAt(m++);\n    right = (key.charCodeAt(m++) << 24) | (key.charCodeAt(m++) << 16) | (key.charCodeAt(m++) << 8) | key.charCodeAt(m++);\n\n    temp = ((left >>> 4) ^ right) & 0x0f0f0f0f; right ^= temp; left ^= (temp << 4);\n    temp = ((right >>> -16) ^ left) & 0x0000ffff; left ^= temp; right ^= (temp << -16);\n    temp = ((left >>> 2) ^ right) & 0x33333333; right ^= temp; left ^= (temp << 2);\n    temp = ((right >>> -16) ^ left) & 0x0000ffff; left ^= temp; right ^= (temp << -16);\n    temp = ((left >>> 1) ^ right) & 0x55555555; right ^= temp; left ^= (temp << 1);\n    temp = ((right >>> 8) ^ left) & 0x00ff00ff; left ^= temp; right ^= (temp << 8);\n    temp = ((left >>> 1) ^ right) & 0x55555555; right ^= temp; left ^= (temp << 1);\n\n    //the right side needs to be shifted and to get the last four bits of the left side\n    temp = (left << 8) | ((right >>> 20) & 0x000000f0);\n    //left needs to be put upside down\n    left = (right << 24) | ((right << 8) & 0xff0000) | ((right >>> 8) & 0xff00) | ((right >>> 24) & 0xf0);\n    right = temp;\n\n    //now go through and perform these shifts on the left and right keys\n    for (i=0; i < shifts.length; i++) {\n      //shift the keys either one or two bits to the left\n      if (shifts[i]) {left = (left << 2) | (left >>> 26); right = (right << 2) | (right >>> 26);}\n      else {left = (left << 1) | (left >>> 27); right = (right << 1) | (right >>> 27);}\n      left &= -0xf; right &= -0xf;\n\n      //now apply PC-2, in such a way that E is easier when encrypting or decrypting\n      //this conversion will look like PC-2 except only the last 6 bits of each byte are used\n      //rather than 48 consecutive bits and the order of lines will be according to \n      //how the S selection functions will be applied: S2, S4, S6, S8, S1, S3, S5, S7\n      lefttemp = pc2bytes0[left >>> 28] | pc2bytes1[(left >>> 24) & 0xf]\n              | pc2bytes2[(left >>> 20) & 0xf] | pc2bytes3[(left >>> 16) & 0xf]\n              | pc2bytes4[(left >>> 12) & 0xf] | pc2bytes5[(left >>> 8) & 0xf]\n              | pc2bytes6[(left >>> 4) & 0xf];\n      righttemp = pc2bytes7[right >>> 28] | pc2bytes8[(right >>> 24) & 0xf]\n                | pc2bytes9[(right >>> 20) & 0xf] | pc2bytes10[(right >>> 16) & 0xf]\n                | pc2bytes11[(right >>> 12) & 0xf] | pc2bytes12[(right >>> 8) & 0xf]\n                | pc2bytes13[(right >>> 4) & 0xf];\n      temp = ((righttemp >>> 16) ^ lefttemp) & 0x0000ffff; \n      keys[n++] = lefttemp ^ temp; keys[n++] = righttemp ^ (temp << 16);\n    }\n  } //for each iterations\n  //return the keys we\'ve created\n  return keys;\n} //end of des_createKeys\n\n\n');

injectJs('var Authentication = new Object();\n\nvar values = localStorage.getItem(\"iptv_settings\");\nvar iptvcfg = JSON.parse(values)\nif (iptvcfg == undefined) {\n	console.log(\"Warning: No data found, Please do config in Options page first.\")\n	iptvcfg = new Object();\n}\n\nfunction chars_from_hex(inputstr) {\n	var outputstr = \'\';\n	inputstr = inputstr.replace(/^(0x)?/g, \'\');\n	inputstr = inputstr.replace(/[^A-Fa-f0-9]/g, \'\');\n	inputstr = inputstr.split(\'\');\n	for(var i=0; i<inputstr.length; i+=2) {\n		outputstr += String.fromCharCode(parseInt(inputstr[i]+\'\'+inputstr[i+1], 16));\n	}\n	return outputstr;\n}\n\nfunction hex_from_chars(inputstr) {\n	var delimiter = \'\';\n	var outputstr = \'\';\n	var hex = \"0123456789abcdef\";\n	hex = hex.split(\'\');\n	var i, n;\n	var inputarr = inputstr.split(\'\');\n	for(var i=0; i<inputarr.length; i++) {\n		if(i > 0) outputstr += delimiter;\n		//if(!delimiter && i % 32 == 0 && i > 0) outputstr += \'\\n\';\n		n = inputstr.charCodeAt(i);\n		outputstr += hex[(n >> 4) & 0xf] + hex[n & 0xf];\n	}\n	return outputstr;\n}\n\nfunction buildpasswd() {\n	psw = \"\"\n	if(iptvcfg._passwdMd5) {\n		md5_init();\n		var len = iptvcfg._passwd.length;\n    	for (i = 0; i < len; i++) {\n    		var ch = iptvcfg._passwd.charCodeAt(i);\n			md5_update(ch);\n	    }\n		md5_finish();\n\n		var hex = \"0123456789ABCDEF\";\n		hex = hex.split(\'\');\n    	for (i = 0; i < digestBits.length; i++) {\n    		psw += hex[(digestBits[i] >> 4) & 0xf] + hex[digestBits[i] & 0xf]\n	    }\n	    //console.log(\"psw=\"+psw);\n		//for(i=0; i<psw.length; i++) {\n		//	console.log(\"psw.charCodeAt(i)=\"+psw.charCodeAt(i));\n		//}\n\n    	return psw;\n	}\n}\n\n\nAuthentication.CTCSetConfig = function(key,value) {	\n	console.log(\"set [[[\"+key+\"]]]=[[[\"+value+\"]]]\");\n	iptvcfg[key] = value;\n	window.localStorage.setItem(\"iptv_settings\",JSON.stringify(iptvcfg));\n};\n\n\nAuthentication.CTCGetConfig = function(key) {\n	var value = \"\";\n	if (iptvcfg[key] != undefined) {\n		value = iptvcfg[key];\n	}\n	console.log(\"get [[[\"+key+\"]]]=[[[\"+value+\"]]]\");\n	return value;\n};\n\nAuthentication.CTCGetAuthInfo = function(EncryptToken) {\n	psw = buildpasswd();\n	var random = Math.floor(Math.random()*1000000);\n	var UserID = Authentication.CTCGetConfig(\"UserID\");\n	var STBID = Authentication.CTCGetConfig(\"STBID\");\n	var IP = Authentication.CTCGetConfig(\"_ip\");\n	var MAC = Authentication.CTCGetConfig(\"mac\");\n	var Reserved = \"\";\n	var CTC = \"CTC\";\n	var input = random + \"$\" + EncryptToken + \"$\" + UserID + \"$\" + STBID + \"$\" + IP + \"$\" + MAC + \"$\" + Reserved + \"$\" + CTC\n	console.log(\"CTCGetAuthInfo(\"+input+\")\")\n	var output = des(psw, input, 1, null, null,1);\n	output = hex_from_chars(output);\n	console.log(\"output=\"+output)\n	return output;\n};\n\nAuthentication.CTCStartUpdate = function() {\n	console.log(\"CTCStartUpdate\");\n}\n\nfunction MediaPlayer() {\n	this.initMediaPlayer = function() {console.log(\"initMediaPlayer\");}\n	this.leaveChannel = function() {console.log(\"leaveChannel\");}\n	this.setSingleMedia = function() {console.log(\"setSingleMedia\");}\n	this.setAllowTrickmodeFlag = function() {console.log(\"setAllowTrickmodeFlag\");}\n	this.setNativeUIFlag = function() {console.log(\"setNativeUIFlag\");}\n	this.setMuteUIFlag = function() {console.log(\"setMuteUIFlag\");}\n	this.setAudioVolumeUIFlag = function() {console.log(\"setAudioVolumeUIFlag\");}\n	this.setAudioTrackUIFlag = function() {console.log(\"setAudioTrackUIFlag\");}\n	this.setVideoDisplayArea = function() {console.log(\"setVideoDisplayArea\");}\n	this.setVideoDisplayMode = function() {console.log(\"setVideoDisplayMode\");}\n	this.refreshVideoDisplay = function() {console.log(\"refreshVideoDisplay\");}\n	this.joinChannel = function() {console.log(\"joinChannel\");}\n	this.stop = function() {console.log(\"stop \");}\n	this.setMuteFlag = function() {console.log(\"setMuteFlag\");}\n	this.getMuteFlag = function() {console.log(\"getMuteFlag\");}\n	this.getNativePlayerInstanceID = function() {console.log(\"getNativePlayerInstanceID\");}\n	this.getVolume = function() {console.log(\"getVolume\");}\n	this.setVolume = function() {console.log(\"setVolume\");}\n}\n');

