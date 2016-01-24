/// <reference path="typings/chrome/chrome.d.ts" />
var currentUrl = document.location.href;
chrome.storage.sync.get('environments', function(items) {
    if(items.environments){
        items.environments.forEach(function(e) {
            if(currentUrl.includes(e.siteUrl)) {
                var selector = e.siteElementId;
                switch(e.siteElementType){
                    case 0://id
                        selector = '#'+e.siteElementId;
                    break;
                    case 1://css class
                        selector = '.'+e.siteElementId;
                    break;
                }
                Array.from(document.querySelectorAll(selector)).forEach(function(el) {
                    if(el.style && el.style.background !== e.colour){
                        el.style.background = e.colour;
                    }
                }); 
                chrome.runtime.sendMessage({
                    type:'showNotification',
                    title:'Site Highligher',
                    text:'Background colour for element(s) matching selector "'+selector+'" has been set to "'+e.colour+'"'
                },function(response) {
                    console.log(response);
                });                 
            }
        });
    }
});