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

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    tab = getCurrentTab()
    tab.then(function(result) {
        if (result.url.includes("www.youtube.com")) {
            console.log(result.url)
        }
     })
});
