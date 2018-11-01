console.log(location.href);

safari.self.addEventListener("message", handleMessage);
if(location.href.indexOf('q=Hello') < 0){
    refresh();
}

if( ((location.href.indexOf('www.bing') > -1) && (location.href.indexOf('form=APMCS1')> -1)) ||
   ((location.href.indexOf('www.google') > -1) && (location.href.indexOf('/search?client=safari')> -1)) ||
   (((location.href.indexOf('www.yahoo') > -1) || (location.href.indexOf('search.yahoo') > -1)) && (location.href.indexOf('/search?ei=utf-8&fr=aaplw&p=')> -1)) )
{
	console.log("Step1");
    if(location.href.indexOf('q=Hello') < 0){
        window.stop();
        refresh();
        
    }

	console.log(document.URL);
	var newurl = document.URL;
	safari.extension.dispatchMessage(newurl);
//    onBeforeSearch(document);
	
}
function refresh() {
    
    window.location.href = "https://www.google.com/search?client=safari&rls=en&q=Hello&ie=UTF-8&oe=UTF-8";
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


