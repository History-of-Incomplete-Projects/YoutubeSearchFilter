let ysf_installed = false;

chrome.runtime.onInstalled.addListener(() => {
    ysf_installed = true;
    console.log('Youtube Search Filter is installed');
});

async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

async function getLocalStorageValue() {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.get('search', function (value) {
                resolve(value);
            })
        }
        catch (ex) {
            reject(ex);
        }
    });
}

async function setLocalStorageValue(value) {
    return new Promise((resolve, reject) => {
        try {
            chrome.storage.sync.set({search: value}, function() {
                resolve(value);
            });
        }
        catch (ex) {
            reject(ex);
        }
    });
}


async function getChannelName(id) {
    return chrome.scripting.executeScript({
        target: {tabId: id, allFrames: true},
        function() {
            content = document.getElementById("content");
            channel_name = content.getElementsByClassName("ytd-channel-name")[0];
            // alert(channel_name.textContent);
            return channel_name.textContent;
        }
    });
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    tab = getCurrentTab();
    tab.then(function(result) {
        if (result.url.match("youtube.com") && result.url.match("about$")) {
            new_edition = "";
            
            channel_name_element = getChannelName(result.id);
            channel_name_element.then(function(result1) {
                full_string = result1[0].result.replace(/(?:\r\n|\r|\n)/g, '');
                middle = Math.floor(full_string.length / 2);
                half_string = full_string.substr(0, middle);
                channel_name = half_string.trim();

                new_edition = channel_name;

                storage = getLocalStorageValue();
                storage.then(function(result) {
                    current_search = result.search;
                    console.log("result.search: " + result.search);
                    console.log(result.search);
                    console.log("result.search isArray?: " + Array.isArray(result.search));
                    new_search = [];
                    if (current_search === undefined || ! Array.isArray(current_search)) {
                        new_search.push(new_edition);
                    }
                    else {
                        new_search = current_search;
                        if (current_search.indexOf(new_edition) === -1) {
                            new_search.push(new_edition);
                        }
                    }
                    new_storage = setLocalStorageValue(new_search);
                    new_storage.then(function(result) {
                        console.log(result);
                    });
                });
            });
        }
     });
});
