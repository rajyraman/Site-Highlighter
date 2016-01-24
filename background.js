var notificationId = 'notification.information';

function hideNotification(done) {
  chrome.notifications.clear(notificationId, function() {
    if (done) done();
  });
}

function showNotification(title,message){
    hideNotification(function(){
        chrome.notifications.create(notificationId, {
        message: message, 
        title: title, 
        type: 'basic', 
        iconUrl: chrome.runtime.getURL('icon-48.png')}, 
        function(){});
    });
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if(message.type === 'showNotification')  showNotification(message.title, message.text, function(){
        sendResponse('Notification sent');
    });
});