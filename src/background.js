var flag = true;

let extensionWindow = undefined;
let targetIFrame = undefined;

/**
 * Fires everytime the widget button is clicked
 */
function clickWidgetButton() {

    // Tries to find the form on the current page.
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	targetIFrame = tabs[0].id;
    });

    // Ensures the Widget Window exists and focuses it
    getWidgetWindow();

}

/**
 * Create the Widget Window and set the extensionWindow to be the
 * newly created window.
 */
function createWidgetWindow() {
    chrome.windows.create(
	{ url: chrome.extension.getURL("popup.html") },
	(window) => {
	    extensionWindow = window;
	    focusWidgetWindow();
	});
}

/**
 * Get the WidgetWindow if it exists and focuses it. If it doesn't
 * exists, creates one.
 */
function getWidgetWindow(){
    if ( extensionWindow ) {
	chrome.windows.get(extensionWindow.id, undefined, (window) => {
	    if(window){
		extensionWindow = window;
		focusWidgetWindow()
	    }else {
		createWidgetWindow();
	    }
	});
    } else {
	createWidgetWindow();
    }
}

/**
 * If there is a WidgetWindow, focus it, resize, and ensure it is not
 * maximized.
 */
function focusWidgetWindow() {
    if (!extensionWindow) {
	return;
    }
    chrome.windows.update(
	extensionWindow.id,
	{ width: 400, height: 700, focused: true, state: "normal" },
    );
}

/*
 * Forward a message to the content-script
 */
function sendToContentScript(message){
    if(!targetIFrame){
	return;
    }

    chrome.tabs.sendMessage(targetIFrame, message);
}

/**
 * Dictionary of messageHandlers.
 */

const messageHandlers = {};
/* Forward fillField messages to the contentScript */
messageHandlers['fillField'] = (message) => sendToContentScript(message);

/**
 * Fires everytime a message is recieved from anywhere
 */
function receiveMessage(message, sender, callback) {
    // Ignore blank messages
    if (!message) {
	return;
    }

    if (!(message.type in messageHandlers)){
	console.error("Unknown message type.");
	return;
    }

    const handler = messageHandlers[message.type];
    handler(message, callback);
}


// Add necessary listeners
chrome.browserAction.onClicked.addListener(clickWidgetButton);
chrome.runtime.onMessage.addListener(receiveMessage);
