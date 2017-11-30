require("./jsbn.js"),require("./prng4.js");var RNG=require("./rng.js"),RSA=require("./rsa.js");require("./base64.js");var Zlib=require("zlibjs"),CryptoJS=require("./hmac-md5.js"),UINT64=require("cuint").UINT64,ADLER32=require("adler-32"),asmCrypto=require("./asmcrypto.js");!function(t){function e(){return this instanceof e?this:new e}function r(t){var e=new RNG.SecureRandom,r=[];r[0]=0;for(var n=t,o=new Uint8Array(n);n>0;)e.nextBytes(r),o[--n]=r[0];return o}function n(t,e){if(128!=e&&256!=e)return null;for(var r,n,o=e>>3,i=o,s=new Uint8Array(o),a=new Uint8Array([82,8,21,4,255,0,1,43]),f=16,y=new Uint8Array(f),p=0,c=(asmCrypto.SHA1.HASH_SIZE,new Uint8Array(0));i>0||f>0;){p++&&(c=new Uint8Array(n.length)).set(n),null!=a?((r=new Uint8Array(c.length+t.length+a.length)).set(c),r.set(t,c.length),r.set(a,c.length+t.length),c=r):((r=new Uint8Array(c.length+t.length)).set(c),r.set(t,c.length),c=r),n=asmCrypto.SHA1.bytes(c);for(b=1;b<5;b++)c=n,n=asmCrypto.SHA1.bytes(c);var h=0;if(i>0){var u=s.length-i;h=Math.min(i,n.length);for(b=0;b<h;b++)s[u+b]=n[b];i-=h}if(h<n.length&&f>0){for(var d=y.length-f,l=Math.min(f,n.length-h),b=h;b<h+l;b++)y[d+b-h]=n[b];f-=l}}return{key:s,iv:y}}var o=new function(){this.isValid=!1,this.timeStamp=UINT64(0),this.offset=UINT64(0),this.setTimeStamp=function(t){this.timeStamp=t;var e=(new Date).getTime();this.offset=this.timeStamp.clone().subtract(UINT64(e)),this.isValid=!0},this.getTimeStampWithOffset=function(){var t=(new Date).getTime();return UINT64(String(t)).add(this.offset)}},i=new function(){this.isVaild=!1,this.ID=UINT64(0),this.aesKey=new Uint8Array(32),this.version=0,this.type=0,this.UID_u=UINT64(0),this.UID_l=UINT64(0),this.toBytes=function(){var t,e=new Uint8Array(f);for(e[0]=this.isVaild?1:0,t=0;t<8;t++)e[1+t]=this.ID.clone().shiftRight(8*t).and(UINT64(255)).toNumber();for(t=0;t<this.aesKey.length;t++)e[9+t]=this.aesKey[t];for(e[41]=255&this.version,e[42]=this.version>>>8&255,e[43]=this.type||255,t=0;t<8;t++)e[44+t]=this.UID_u.clone().shiftRight(8*t).and(UINT64(255)).toNumber();for(t=0;t<8;t++)e[52+t]=this.UID_l.clone().shiftRight(8*t).and(UINT64(255)).toNumber();return e},this.fromBtyes=function(t){if(t.length!=f)throw"error";var e;for(this.isVaild=1==t[0],this.ID=UINT64("0"),e=0;e<8;e++)this.ID=this.ID.or(UINT64().fromBits(t[1+e],0,0,0).shiftLeft(8*e));for(e=0;e<this.aesKey.length;e++)this.aesKey[e]=t[9+e];for(this.version=t[42]<<8|t[41],this.type=t[43],this.UID_u=UINT64("0"),e=0;e<8;e++)this.UID_u=this.UID_u.or(UINT64().fromBits(t[44+e],0,0,0).shiftLeft(8*e));for(this.UID_l=UINT64("0"),e=0;e<8;e++)this.UID_l=this.UID_l.or(UINT64().fromBits(t[52+e],0,0,0).shiftLeft(8*e))},this.fromServerBtyes=function(t){if(t.length!=y)return!1;var e;for(this.ID=UINT64(t[0]|t[1]<<8,t[2]|t[3]<<8,t[4]|t[5]<<8,t[6]|t[7]<<8),e=0;e<this.aesKey.length;e++)this.aesKey[e]=t[8+e];return this.version=t[41]<<8|t[40],this.type=t[42],this.UID_u=UINT64(t[43]|t[44]<<8,t[45]|t[46]<<8,t[47]|t[48]<<8,t[49]|t[50]<<8),this.UID_l=UINT64(t[51]|t[52]<<8,t[53]|t[54]<<8,t[55]|t[56]<<8,t[57]|t[58]<<8),this.isVaild=!0,!0}},s="00d69d454c9c64fdd87be760c0cf7bc4750ccdd91f5525f50789f91d35bd114d0a480bf9e3c85f15fe0273ff50609254fb58bd680a9ad77b205eb257a558a222774a1934ace69f2fcaa5cff4d2f49c6bf5f4b0cfcd40eb63d8f0ca6a0decffdbc4b2347152903ad084a98a748d8dee8fe9a2a9353cf6135d6df2771942742e472ff358822481f64e4594020f6d9c557565615fdf8e66b280ac6053810718e0d6afca62455981b215c62a23defd471f8800a9f1229822873e2928e2bc7bb7ea794b868a6e7221bdd60b275da0a6c09cc765f0d4e26e16322413d50e7cf3ebf3404995d5f7b2c80cb2fdc2358a05bb0bbc3f12d42e545b227a63385a347c069a1037",a="10001",f=60,y=59;e.prototype.getVersion=function(){return 2},e.prototype.setEncType=function(t){if("number"!=typeof t||1!=t)throw"error";i.type=t},e.prototype.setFakeKlKeyUID_u_UID_l=function(t,e){if("string"!=typeof t||"string"!=typeof e)throw"error";i.aesKey=r(i.aesKey.length),i.UID_u=UINT64(t),i.UID_l=UINT64(e),i.isVaild=!0,i.type=1},e.prototype.setKlKeyInvalid=function(){i.isVaild=!1},e.prototype.getKlKeyIsValid=function(){return i.isVaild},e.prototype.getKlKeyID=function(){return UINT64(i.ID)},e.prototype.getKlKeyVersion=function(){return i.version},e.prototype.getKlKeyType=function(){return i.type},e.prototype.getKlKeyUID_u=function(){return i.UID_u.clone()},e.prototype.getKlKeyUID_l=function(){return i.UID_l.clone()},e.prototype.setKlKeyUID_u=function(t){i.UID_u=UINT64(t)},e.prototype.setKlKeyUID_l=function(t){i.UID_l=UINT64(t)},e.prototype.klKeyAlloc=function(t){if(t<=0)throw"error";var e,r,n,o=asmCrypto.hex_to_bytes(s),a=new Uint8Array(o.length),y=(new Uint8Array(76),new Array(4)),p=new Array(4),c=0;for(n=t.length,e=0;e<4&&c<n;e++)y[e]=t[c+3]<<24|t[c+2]<<16|t[c+1]<<8|t[c],c+=4+y[e];if(c!=n)throw"error";if(y[0]!=o.length)throw"error";if(4!=y[2])throw"error";for(c=0,e=0;e<4;e++){for(n=y[e],p[e]=new Uint8Array(n),c+=4,r=0;r<n;r++)p[e][r]=t[c+r];c+=n}for(e=0;e<a.length;e++)a[e]=p[0][e]^o[e];var h=this.adler32Byte(p[1]),u=p[2];if(h!=(u[3]<<24|u[2]<<16|u[1]<<8|u[0]))throw"error";var d=this.aesDecrypt(p[1],a);if(d.length!=f+16)throw"error";var l=this.hmacMd5Hex(asmCrypto.bytes_to_hex(asmCrypto.string_to_bytes("")),asmCrypto.bytes_to_hex(p[0]));for(e=0;e<16;e++){var b=l.words[e>>>2]>>>e%4*8&255;if(d[f+e]!=b)throw"error"}i.fromBtyes(d.subarray(0,f))},e.prototype.klKeyGet=function(){var t,e=asmCrypto.hex_to_bytes(s),n=r(e.length),o=new Uint8Array(e.length),a=new Uint8Array(f+16);for(t=0;t<o.length;t++)o[t]=n[t]^e[t];var y=i.toBytes();for(t=0;t<f;t++)a[t]=y[t];var p=this.hmacMd5Hex(asmCrypto.bytes_to_hex(asmCrypto.string_to_bytes("")),asmCrypto.bytes_to_hex(n));for(t=0;t<16;t++){var c=p.words[t>>>2]>>>t%4*8&255;a[f+t]=c}var h,u,d=this.aesEncrypt(a,o),l=this.adler32Byte(d),b=new Uint8Array([255&l,l>>>8&255,l>>>16&255,l>>>24&255]),m=new Uint8Array([0]),_=new Uint8Array(16+n.length+d.length+b.length+m.length),g=0,U=new Array(n,d,b,m);for(t=0;t<4&&g<_.length;t++){for(u=U[t].length,_[g]=255&u,_[g+1]=u>>>8&255,_[g+2]=u>>>16&255,_[g+3]=u>>>24&255,h=0;h<u;h++)_[g+4+h]=U[t][h];g+=4+u}if(g!=_.length)throw"error";return _},e.prototype.klKeyFree=function(){i.fromBtyes(new Uint8Array(f))},e.prototype.aesEncryptMemSize=function(t){if("number"!=typeof t||t<0)throw"error";return t-t%16+16},e.prototype.aesEncrypt=function(t,e){var r=n(e=e||i.aesKey,128);return asmCrypto.AES_CBC.encrypt(t,r.key,!0,r.iv)},e.prototype.aesDecrypt=function(t,e){var r=n(e=e||i.aesKey,128);return asmCrypto.AES_CBC.decrypt(t,r.key,!0,r.iv)},e.prototype.adler32=function(t){return ADLER32.str(t)},e.prototype.adler32Byte=function(t){return ADLER32.buf(t)},e.prototype.hmacMd5=function(t,e){return CryptoJS.HmacMD5(e,t)},e.prototype.hmacMd5Hex=function(t,e){return CryptoJS.HmacMD5(CryptoJS.enc_Hex_parse(e),CryptoJS.enc_Hex_parse(t))},e.prototype.rsaKeyVersion=2,e.prototype.rsaPlaintextMaxSize=245,e.prototype.rsaCiphertextSize=256,e.prototype.rsaEncrypt=function(t){var e=new RSA.RSAKey;return e.setPublic(s,a),e.encrypt(t,!1)},e.prototype.rsaEncryptTEST=function(t){var e=new RSA.RSAKey;return e.setPublic(s,a),e.encrypt(t,!0)},e.prototype.rsaEncryptByte=function(t){var e=new RSA.RSAKey;return e.setPublic(s,a),asmCrypto.hex_to_bytes(e.encryptByte(t,!1))},e.prototype.rsaEncryptByteTEST=function(t){var e=new RSA.RSAKey;return e.setPublic(s,a),asmCrypto.hex_to_bytes(e.encryptByte(t,!0))},e.prototype.genKeyValidationNonce=function(t){if(!i.isVaild)throw"error";var e,r=new Uint8Array(16);for(e=7;e>-1;e--)r[e]=i.ID.clone().shiftRight(8*e).and(UINT64(255)).toNumber();for(e=0;e<4;e++)r[8+e]=t>>>8*e&255;r.fill(0,12);var n=this.aesEncrypt(r,i.aesKey),o=this.rsaEncryptByte(r),s=new Uint8Array(n.length+o.length);return s.set(n),s.set(o,n.length),s},e.prototype.chkKeyValidationCorrectNonce=function(t,e){var r=this.aesDecrypt(e,i.aesKey);if(4!=r.length)return!1;return(r[3]<<24|r[2]<<16|r[1]<<8|r[0])==t+1},e.prototype.chkKeyValidationFailedNonce=function(t,e,r){var n=4294967295&(t+1&4294967295^e),o=new Uint8Array([255&n,n>>8&255,n>>16&255,n>>24&255]);try{var s=this.aesDecrypt(r,o)}catch(t){return!1}if(68!=s.length)return!1;return!((s[63]<<24|s[62]<<16|s[61]<<8|s[60])!=t&4294967295)&&!!i.fromServerBtyes(s.subarray(0,y))},e.prototype.addTimeStampToData=function(t,e){var r=new Uint8Array(16+e.length);return r.set(Buffer.from(t,"utf8"),0),r.set(e,16),r},e.prototype.compress=function(t){return new Zlib.gzipSync(t)},e.prototype.decompress=function(t){return new Zlib.gunzipSync(t)},e.prototype.compressDeflater=function(t){return new Zlib.deflateSync(t)},e.prototype.decompressInflater=function(t){return new Zlib.inflateSync(t)},e.prototype.setTimeStampValid=function(t){if("boolean"!=typeof t)throw"error";o.isValid=t},e.prototype.timeStampIsValid=function(){return o.isValid},e.prototype.decryptTimeStamp=function(t){if("string"!=typeof t)throw"error";var e=this.base64_to_bytes(t),r=this.aesDecrypt(e,i.aesKey);if(15!=r.length)throw"error";return UINT64(r[0]|r[1]<<8,r[2]|r[3]<<8,r[4]|r[5]<<8,r[6]|r[7]<<8)},e.prototype.setTimeStampHeader=function(t){var e=this.decryptTimeStamp(t);o.setTimeStamp(e)},e.prototype.getTimeStampHeader=function(){for(var t=r(15),e=(o.getTimeStampWithOffset,0);e<8;e++)t[e]=i.ID.clone().shiftRight(8*e).and(UINT64(255)).toNumber();var n=this.aesEncrypt(t,i.aesKey);return asmCrypto.bytes_to_base64(n)},e.prototype.string_to_bytes=function(t){return asmCrypto.string_to_bytes(t)},e.prototype.hex_to_bytes=function(t){return asmCrypto.hex_to_bytes(t)},e.prototype.base64_to_bytes=function(t){return asmCrypto.base64_to_bytes(t)},e.prototype.bytes_to_string=function(t){return asmCrypto.bytes_to_string(t)},e.prototype.bytes_to_hex=function(t){return asmCrypto.bytes_to_hex(t)},e.prototype.bytes_to_base64=function(t){return asmCrypto.bytes_to_base64(t)},e.prototype.selfTesting=function(){if("29a10fbff249093e056ec5aaa71d885a1c2195b479cb4baf4be64b6b6c438a44ee5ddcae690f781ccda2c3a9bced4200750c39779f09a20ec99530d4082ace6430569fbd8198ee10eb348f1c8ef459ebd5990b9d01c148550a21f7eab2b769bb647c8c9ba31da601958a88568dbb5f4efe430918b3ff7fdf40f7a839ea4c0624117201e1fd79a35ab1008fd4bd9251b7fb6c99dbca821d73d5f4c47f211540a7fc03148e41e98a9a146c2d629c76158aee241c409101b339237cd5a3d7492d779015172962eaab7e5f0cdab0d058dc79f467b4b523ff2a1c0a1d440017970a7e777e7d21f7e7f36c5548257d4471cbcde36d48038512ba8979bf57e2a5f1cf66"!==this.rsaEncryptTEST("test"))return!1;var t=this.aesEncrypt(this.string_to_bytes("test"),this.string_to_bytes("12345"));return"71d3aab73b84f116944e5462347622bf"===this.bytes_to_hex(t)&&("74657374"===this.bytes_to_hex(this.aesDecrypt(t,this.string_to_bytes("12345")))&&(73204161===this.adler32("test")&&"fe8697f742d080405d1270e6163316f9"===this.hmacMd5("12345","test").toString()))},"undefined"!=typeof define&&define.amd?define([],function(){return e}):"undefined"!=typeof module&&module.exports?module.exports=e:t.TUTIL=e}(this);