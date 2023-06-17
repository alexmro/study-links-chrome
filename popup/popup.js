(() => {
    document.addEventListener(
        'DOMContentLoaded',
        () => {
            let latestLinksList = document.getElementById("latest-links-list");
            
            chrome.storage.sync.get(["linksToRead"]).then((result) => {
                latestLinksList.innerHTML = '';
                if (typeof result.linksToRead !== 'undefined' && result.linksToRead.length > 0) {
                    let linksToRead = JSON.parse(result.linksToRead);
                    linksToRead.slice(-5).forEach(link => {
                        let item = document.createElement('li');
                        item.innerHTML = '📙 <a href="' + link + '" target="_blank">' + 
                        link.substring(0, 48) + '</a>';
                        latestLinksList.appendChild(item);
                    });
                }
            });

            chrome.storage.sync.get(["linksReading"]).then((result) => {
                if (typeof result.linksReading !== 'undefined' && result.linksReading.length > 0) {
                    let linksReading = JSON.parse(result.linksReading);
                    linksReading.slice(-5).forEach(link => {
                        let item = document.createElement('li');
                        item.innerHTML = '📘 <a href="' + link + '" target="_blank">' + 
                        link.substring(0, 48) + '</a>';
                        latestLinksList.appendChild(item);
                    });
                }
            });

            chrome.storage.sync.get(["linksDone"]).then((result) => {
                if (typeof result.linksDone !== 'undefined' && result.linksDone.length > 0) {
                    let linksDone = JSON.parse(result.linksDone);
                    linksDone.slice(-5).forEach(link => {
                        let item = document.createElement('li');
                        item.innerHTML = '📗 <a href="' + link + '" target="_blank">' + 
                        link.substring(0, 48) + '</a>';
                        latestLinksList.appendChild(item);
                    });
                }
            });
        },
        false
    );
}) ();