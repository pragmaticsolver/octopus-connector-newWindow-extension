const href = window.location.href;

/**
 * Run when the page is loaded, ensures we're on wufoo.com for now so
 * that it doesn't run code on EVERY page.
 */
function init() {
    if(!href.includes('wufoo.com')){
	return;
    }

    /*
     * Add message handler. If the message is a fillField message,
     * find the field and populate the value.
     **/
    chrome.runtime.onMessage.addListener(function(msg, sender, response ){
	if(msg.type === "fillField"){
	    const target = document.getElementById(msg.field);
	    if(!target) {
		return;
	    }
	    target.value = msg.value;
	}
    })

}

init();
