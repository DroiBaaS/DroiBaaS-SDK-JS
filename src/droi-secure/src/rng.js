function rng_seed_int(r){rng_pool[rng_pptr++]^=255&r,rng_pool[rng_pptr++]^=r>>8&255,rng_pool[rng_pptr++]^=r>>16&255,rng_pool[rng_pptr++]^=r>>24&255,rng_pptr>=rng_psize&&(rng_pptr-=rng_psize)}function rng_seed_time(){rng_seed_int((new Date).getTime())}function rng_get_byte(){if(null==rng_state){for(rng_seed_time(),(rng_state=prng_newstate()).init(rng_pool),rng_pptr=0;rng_pptr<rng_pool.length;++rng_pptr)rng_pool[rng_pptr]=0;rng_pptr=0}return rng_state.next()}function rng_get_bytes(r){var n;for(n=0;n<r.length;++n)r[n]=rng_get_byte()}function SecureRandom(){}var rng_state,rng_pool,rng_pptr,rng_psize=require("./prng4.js").rng_psize,prng_newstate=require("./prng4.js").prng_newstate;if(null==rng_pool){rng_pool=new Array,rng_pptr=0;var t;if("undefined"!=typeof window&&window.crypto){if(window.crypto.getRandomValues){var ua=new Uint8Array(32);for(window.crypto.getRandomValues(ua),t=0;t<32;++t)rng_pool[rng_pptr++]=ua[t]}if("Netscape"==navigator.appName&&navigator.appVersion<"5"){var z=window.crypto.random(32);for(t=0;t<z.length;++t)rng_pool[rng_pptr++]=255&z.charCodeAt(t)}}for(;rng_pptr<rng_psize;)t=Math.floor(65536*Math.random()),rng_pool[rng_pptr++]=t>>>8,rng_pool[rng_pptr++]=255&t;rng_pptr=0,rng_seed_time()}SecureRandom.prototype.nextBytes=rng_get_bytes,module.exports.SecureRandom=SecureRandom;