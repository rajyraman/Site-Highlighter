/// <reference path="typings/chrome/chrome.d.ts" />
var globalEnvironments = [],
    siteTypeControl = document.getElementById('sitetype'),
    siteColourControl = document.getElementById('sitecolour'),
    colourPickerControl = document.getElementById('colourpicker'),    
    siteUrlControl = document.getElementById('siteurl'),
    siteElementIdControl = document.getElementById('siteelementid'),
    settingIdControl = document.getElementById('settingid'),
    addButton = document.getElementById('add'),
    updateButton = document.getElementById('update'),
    deleteButton = document.getElementById('delete'),
    environmentsDiv = document.getElementById('environments'),
    environmentsTemplate = document.getElementById('environment-template'),
    elementTypeControl = document.getElementById('siteElementType'),
    errorDiv = document.getElementById('errorDiv');

function buttonClick(e){
    var invalidElements = document.querySelectorAll(":invalid" ).length;
    errorDiv.setAttribute('class', invalidElements > 0 ? 'error' : 'error hidden');
    if(invalidElements > 0 && e.target.id !== 'clear') return false;
    switch(e.target.id){
        case 'add':
            setEnvironmentOptions();
        break;
        case 'update':
        case 'delete':
            if(e.target.id === 'delete') {
                globalEnvironments = globalEnvironments.filter(function(e){
                    return e.type !== siteTypeControl.value;
                });
                settingIdControl.value = '';
                siteTypeControl.value = '';
                siteUrlControl.value = '';
                siteElementIdControl.value = '';
                colourPickerControl.value = '';
                siteColourControl.style.background = '';
                elementTypeControl.selectedIndex = 0;      
                addButton.removeAttribute('class');
                updateButton.setAttribute('class','hidden');
                deleteButton.setAttribute('class','hidden');                    
            }
            if(e.target.id === 'update') {
                globalEnvironments.forEach(function(e){
                    if(e.id === settingIdControl.value){
                        e.type = siteTypeControl.value;
                        e.colour = siteColourControl.value;
                        e.siteUrl = siteUrlControl.value;
                        e.siteElementId = siteElementIdControl.value;
                        e.siteElementType = elementTypeControl.selectedIndex;
                    }
                });
            }            
            chrome.storage.sync.set({
                environments: globalEnvironments
            }, function() {
                environmentsDiv.innerHTML = Mustache.render(environmentsTemplate.innerHTML, globalEnvironments);
            });
        break;
        case 'clear':
            errorDiv.setAttribute('class', 'error hidden');
            chrome.storage.sync.clear(function() {
                if(!chrome.runtime.lastError){
                    environmentsDiv.innerHTML = '';
                    globalEnvironments = [];
                    addButton.removeAttribute('class');
                    updateButton.setAttribute('class','hidden');
                    deleteButton.setAttribute('class','hidden');                    
                }
            });
        break;                
    }    
}    

function cardClick(e){
    globalEnvironments.forEach(function(o,i) {
        if(o.id === e.target.getAttribute('data-setting-key')){
            siteTypeControl.value = o.type;
            siteColourControl.value = o.colour;
            siteUrlControl.value = o.siteUrl;
            settingIdControl.value = i;
            siteElementIdControl.value = o.siteElementId;
            colourPickerControl.value = o.colour;
            elementTypeControl.selectedIndex = o.siteElementType;
            addButton.setAttribute('class','hidden');
            updateButton.removeAttribute('class');
            deleteButton.removeAttribute('class');
        }
    });
}

function getEnvironmentOptions() {
	chrome.storage.sync.get('environments', function(items){
        if(items.environments){
            globalEnvironments = items.environments;
            environmentsDiv.innerHTML = Mustache.render(environmentsTemplate.innerHTML, items.environments);
        }
    });
    chrome.tabs.getSelected(function(t) {
        if(t.url.startsWith('http')){
            siteUrlControl.value = t.url;
        }
    });  
}

function setEnvironmentOptions() {
    var siteType = siteTypeControl.value;
    var siteUrl = siteUrlControl.value;
    var siteColour = siteColourControl.value;
    var siteElementId = siteElementIdControl.value;
    
    if(siteType && siteUrl && siteColour && siteElementId){
        globalEnvironments.push({
            id: globalEnvironments.length.toString(),
            type: siteType, 
            colour: siteColour, 
            siteUrl: siteUrl,
            siteElementId: siteElementId,
            siteElementType: elementTypeControl.selectedIndex
        });        
        environmentsDiv.innerHTML = Mustache.render(environmentsTemplate.innerHTML, globalEnvironments);
        chrome.storage.sync.set({
            environments: globalEnvironments
        });
    }
}

function onDOMLoad(){
    getEnvironmentOptions();
}
document.addEventListener('DOMContentLoaded', onDOMLoad);

document.getElementById('environments').addEventListener('click', cardClick, false);
document.getElementById('buttonrow').addEventListener('click', buttonClick, false);

document.getElementById('colourpicker').addEventListener('change', function(e) {
    siteColourControl.value = e.target.value;
    siteColourControl.style.background = e.target.value;
});

document.getElementById('main').addEventListener("invalid", function(event) {
    event.preventDefault();
}, true);

document.getElementById('main').addEventListener("submit", function(e){
    event.preventDefault();
});