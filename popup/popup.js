(() => {
    document.addEventListener(
        'DOMContentLoaded',
        () => {
            let latestLinksList = document.getElementById("latest-links-list");
            let websiteLinksList = document.getElementById("website-links-list");

            chrome.storage.local.get(["linksList"]).then((result) => {
                if (typeof result.linksList !== 'undefined' && result.linksList.length > 0) {
                    let linksList1 = JSON.parse(result.linksList);
                    let linksList2 = [];
                    let markerTypes = {
                        pending: { icon: '📙', title: 'Pending', cssClass: 'linkPending' },
                        progress: { icon: '📘', title: 'In progress', cssClass: 'linkInProgress' },
                        done: { icon: '📗', title: 'Done', cssClass: 'linkDone' }
                    }

                    linksList1.slice(-20).reverse().forEach(link => {
                        let icon = markerTypes[link.status].icon;

                        let item = document.createElement('li');
                        item.innerHTML = icon + ' <a href="' + link.url + '" target="_blank">' + 
                        link.url.substring(0, 42) + '</a>';
                        latestLinksList.appendChild(item);
                    });

                    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
                            if (tabs.length > 0) {
                                var tabUrl = tabs[0].url;

                                linksList1.forEach(link => {
                                    if (link.url.includes(tabUrl)) {
                                        linksList2.push(link);
                                    }
                                });
            
                                linksList2.slice(-20).reverse().forEach(link => {
                                    let icon = markerTypes[link.status].icon;
            
                                    let item = document.createElement('li');
                                    item.innerHTML = icon + ' <a href="' + link.url + '" target="_blank">' + 
                                    link.url.substring(0, 42) + '</a>';
                                    websiteLinksList.appendChild(item);
                                });
                            }
                        }
                    );
                }
            });

            document.getElementById('website-links-tab').addEventListener('click', () => {
                document.getElementById('latest-links-tab').className = '';
                document.getElementById('website-links-tab').className = 'active';
                document.getElementById('latest-links-container').className = 'hidden';
                document.getElementById('website-links-container').className = '';
            });

            document.getElementById('latest-links-tab').addEventListener('click', () => {
                document.getElementById('website-links-tab').className = '';
                document.getElementById('latest-links-tab').className = 'active';
                document.getElementById('website-links-container').className = 'hidden';
                document.getElementById('latest-links-container').className = '';
            });
        },
        false
    );
}) ();