const csvtojson = require("csvtojson/v2");

let all_records = {};

/**
 *  Runs when the application starts to initialize all of the widget
 *  interactions.  These cannot be defined in the HTML due to cross
 *  site scripting issues. Chrome will complain if the injected code
 *  tries to run a script.
 */
function initializeWidget() {
    const connectDataButton = document.getElementById("connect_data");
    connectDataButton.addEventListener("click", connectData);

    const data_file = document.getElementById("data_file");
    data_file.addEventListener("change", loadData);

    const push_to_form = document.getElementById("push_to_form");
    push_to_form.addEventListener("click", pushToForm);
}

/**
 * Function is called when the "Push Data" button is pressed. Takes
 * the currently selected record and sends each field as a message to
 * the content-script.
 */
function pushToForm(){
    const select = document.getElementById('options');
    const record = all_records[select.value];
    for(const key of Object.keys(record)) {
	const value = record[key];
	const field = findField(key);
	if(field && value){
	    message = {
		type: "fillField",
		field: field,
		value: value,
	    };
	    chrome.runtime.sendMessage(message);
	}
    }
}

/**
 * Helper function which takes a key and finds the word "fieldXXX"
 * inside.
 */
function findField(key) {
    const words = key.split('_');
    for(const w of words){
	if(w.includes('field')){
	    return ('F' + w.substring(1)).trim();
	}
    }
    return false;
}

/**
 * Called when the "Connect Data" button is pressed. This causes the
 * hidden file input to be triggered.
 */
function connectData(){
    const data_file = document.getElementById("data_file");
    data_file.click();
    return false;
}

/**
 * Called when a file is selected. Treats the file as a CSV loading
 * it's contents and sending it to the handleDataLoaded function.
 */
function loadData(content) {
    if (!content) {
	return false;
    }
    const file = content.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
	const result = event.target.result;
	const data = csvtojson().fromString(result).then(handleDataLoaded);
    };

    reader.onerror = function(event) {
	console.error("File could not be read! Code " + event.target.error.code);
    };
    reader.readAsText(file);

}

/**
 * Called after a files contents are loaded. Find the Last Name, First
 * Name fields and treat those as a key. Adds or Updates each "Last
 * Name, First Name" key with the record supplied and rebuilds the
 * select options with the new records. The old records are kept.
 */
function handleDataLoaded(records) {
    // Loads records into all_records array
    for(const r of records) {
	const key = r['Name-Last_field237_Text'] + ', ' + r['Name-First_field236_Text'];
	all_records[key] = r;
    }

    // Rebuilds the dropdown
    const select = document.getElementById('options');
    while(select.options.length > 0){
	select.options.remove(0);
    }

    for(const r of getRecords()) {
	select.options.add(new Option(r, r));
    }
}


/**
 * Get all of the Last Name, First Name values sorted alphabetically.
 */
function getRecords(){
    const keys = Object.keys(all_records);
    keys.sort();
    return keys;
}

/**
 * After the app window has loaded, initialize the Widget
 */
$(document).ready(() => {
    initializeWidget();
});
