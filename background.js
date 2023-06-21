let linksToRead = [];
let linksReading = [];
let linksDone = [];

function removeLink(link) {
    if (linksToRead.includes(link)) {
        var index = linksToRead.indexOf(link);
        if (index !== -1) {
            linksToRead.splice(index, 1);
        }
        chrome.storage.sync.set({ linksToRead: JSON.stringify(linksToRead) });
    }
    if (linksReading.includes(link)) {
        var index = linksReading.indexOf(link);
        if (index !== -1) {
            linksReading.splice(index, 1);
        }
        chrome.storage.sync.set({ linksReading: JSON.stringify(linksReading) });
    }
    if (linksDone.includes(link)) {
        var index = linksDone.indexOf(link);
        if (index !== -1) {
            linksDone.splice(index, 1);
        }
        chrome.storage.sync.set({ linksDone: JSON.stringify(linksDone) });
    }
}

chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        "id": "markLink",
        "title": "Mark link as",
        "contexts": [ "link" ]
    });
    
    chrome.contextMenus.create({
        id: "markLinkToRead",
        parentId: "markLink",
        title: "📙 To read",
        contexts: [ "link" ]
    });
    
    chrome.contextMenus.create({
        id: "markLinkReading",
        parentId: "markLink",
        title: "📘 Reading",
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

chrome.storage.sync.get(["linksToRead"]).then((result) => {
    if (typeof result.linksToRead !== 'undefined' && result.linksToRead.length > 0) {
        linksToRead = JSON.parse(result.linksToRead);
    }
});

chrome.storage.sync.get(["linksReading"]).then((result) => {
    if (typeof result.linksReading !== 'undefined' && result.linksReading.length > 0) {
        linksReading = JSON.parse(result.linksReading);
    }
});

chrome.storage.sync.get(["linksDone"]).then((result) => {
    if (typeof result.linksDone !== 'undefined' && result.linksDone.length > 0) {
        linksDone = JSON.parse(result.linksDone);
    }
});

chrome.contextMenus.onClicked.addListener(function(clickData) {
    switch (clickData.menuItemId) {
        case "markLinkToRead":
            removeLink(clickData.linkUrl);
            linksToRead.push(clickData.linkUrl);
            chrome.storage.sync.set({ linksToRead: JSON.stringify(linksToRead) });
            break;
        case "markLinkReading":
            removeLink(clickData.linkUrl);
            linksReading.push(clickData.linkUrl);
            chrome.storage.sync.set({ linksReading: JSON.stringify(linksReading) });
            break;
        case "markLinkDone":
            removeLink(clickData.linkUrl);
            linksDone.push(clickData.linkUrl);
            chrome.storage.sync.set({ linksDone: JSON.stringify(linksDone) });
            break;
        case "markLinkClear":
            removeLink(clickData.linkUrl);
            break;
    }

    chrome.tabs.query({ active: true, lastFocusedWindow: true }, function(tabs) {
        tabs.forEach(tab => {
            if (!tab.url?.startsWith("chrome://") && !tab.url?.startsWith("edge://")) {
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
            if (!tab.url?.startsWith("chrome://") && !tab.url?.startsWith("edge://")) {
                chrome.scripting.executeScript({
                    target: {tabId: tab.id},
                    files: [ "content/script.js" ],
                });
            }
        }
    )
});