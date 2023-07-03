// list with all the links as objects
let linksList = [];

async function addLink(url, status) {
    let index = linksList.findIndex(link => link.url === url);
    if (index > -1) {
        if (linksList[index].status != status) {
            linksList[index].status = status;
            chrome.storage.local.set({ linksList: JSON.stringify(linksList) });
        }
    } else {
        linksList.push({ url: url, status: status });
        chrome.storage.local.set({ linksList: JSON.stringify(linksList) });
    }
}

/**
 * Removes a link by its URL
 * 
 * @param {String} url Absolute URL to remove
 */
async function removeLink(url) {
    var deleted = [];
    for (var i = 0; i < linksList.length; i++) {
        if (linksList[i].url == url) {
            deleted = deleted.concat(linksList.splice(i, 1));
        }
    }
    if (deleted.length > 0) {
        chrome.storage.local.set({ linksList: JSON.stringify(linksList) });
    }
}

chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        "id": "markLink",
        "title": "Mark link",
        "contexts": [ "link" ]
    });
    
    chrome.contextMenus.create({
        id: "markLinkPending",
        parentId: "markLink",
        title: "📙 Pending",
        contexts: [ "link" ]
    });
    
    chrome.contextMenus.create({
        id: "markLinkInProgress",
        parentId: "markLink",
        title: "📘 In progress",
        contexts: [ "link" ]
    });
    
    chrome.contextMenus.create({
        id: "markLinkDone",
        parentId: "markLink",
        title: "📗 Done",
        contexts: [ "link" ]
    });
    
    chrome.contextMenus.create({
        id: "markLinkClear",
        parentId: "markLink",
        title: "📕 Clear",
        contexts: [ "link" ]
    });
});

chrome.storage.local.get(["linksList"]).then((result) => {
    if (typeof result.linksList !== 'undefined' && result.linksList.length > 0) {
        linksList = JSON.parse(result.linksList);
    }
});

chrome.contextMenus.onClicked.addListener(function(clickData) {
    switch (clickData.menuItemId) {
        case "markLinkPending":
            addLink(clickData.linkUrl, 'pending');
            break;
        case "markLinkInProgress":
            addLink(clickData.linkUrl, 'progress');
            break;
        case "markLinkDone":
            addLink(clickData.linkUrl, 'done');
            break;
        case "markLinkClear":
            removeLink(clickData.linkUrl);
            break;
    }

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
        tabs.forEach(tab => {
            if (typeof tab.url !== 'undefined') {
                chrome.scripting.executeScript({
                    target: {tabId: tab.id},
                    files: [ "content/script.js" ],
                });
            }
        })
    });
});

chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.tabs.get(
        activeInfo.tabId,
        (tab) => {
            if (typeof tab.url !== 'undefined') {
                chrome.scripting.executeScript({
                    target: {tabId: tab.id},
                    files: [ "content/script.js" ],
                });
            }
        }
    )
});