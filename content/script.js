(() => {
    const markerClass = 'saved-link-marker';

    let anchors = document.querySelectorAll('a');

    anchors.forEach(anchor => {
        anchor.classList.remove('linkToRead');
        anchor.classList.remove('linkReading');
        anchor.classList.remove('linkDone');

        let marker = anchor.querySelector('.' + markerClass);
        if (marker != null) {
            anchor.removeChild(marker);
        }
    });

    /**
     * Checks if an anchor element has a valid link for marking
     * 
     * @param {DOM} anchor Anchor element
     * @returns 
     */
    function validAnchor(anchor) {
        let href = anchor.getAttribute('href');
        if (href == null) {
            return false;
        }
        if (href == '#' && anchor.innerHTML.length == 0) {
            return false;
        }

        return true;
    }

    function fullUrl(href) {
        let host = window.location.protocol + '//' + window.location.hostname;

        if (href.length > 0) {
            if (href.substr(0, 2) == '//') {
                href = window.location.protocol + href;
            }

            if (href[0] == '/') {
                href = host + href;
            } else if (href[0] == '#') {
                href = host + window.location.pathname + href;
            }

            if (!href.includes('://')) {
                let locationParts = window.location.pathname.split('/').filter(i => i);

                if (href[0] == '.') {
                    let hrefParts = href.substr(1).split('/');
                    href = host + '/' + locationParts.join('/');
                    if (locationParts.length > 0) {
                        href = host + '/' + locationParts.join('/');
                    } else {
                        href = host + hrefParts.join('/');
                    }
                } else if (href[0] == '..') {
                    if (locationParts[locationParts.length - 1].includes('.')) {
                        locationParts = locationParts.slice(0, -2);
                    }
                    href = host + '/' + locationParts.join('/') + '/' + href.substr(3);
                } else {
                    if (locationParts.length > 0 && locationParts[locationParts.length - 1].includes('.')) {
                        locationParts = locationParts.slice(0, -1);
                        href = host + '/' + locationParts.join('/') + 
                            (locationParts.length > 0 ? '/' : '') + href;
                    } else {
                        href = host + window.location.pathname + href;
                    }
                }
            }
        }

        return href;
    }

    function placeMarker(anchor, icon, title) {
        let dom = document.createElement('span');
        dom.innerHTML = icon;
        dom.className = markerClass;
        dom.setAttribute('title', title);

        let childNodes = anchor.children;
        if (childNodes.length > 0) {
            if (childNodes[0].localName == 'img') {
                anchor.style.position = 'relative';
                dom.style.position = 'absolute';
                dom.style.right = 0;
                dom.style.top = 0;
            }
        }
        anchor.appendChild(dom);
    }

    chrome.storage.local.get(["linksList"]).then((result) => {
        if (typeof result.linksList !== 'undefined' && result.linksList.length > 0) {
            let linksList = JSON.parse(result.linksList);
            let markerTypes = {
                pending: { icon: '📙', title: 'Pending', cssClass: 'linkPending' },
                progress: { icon: '📘', title: 'In progress', cssClass: 'linkInProgress' },
                done: { icon: '📗', title: 'Done', cssClass: 'linkDone' }
            }
            anchors.forEach(anchor => {
                if (validAnchor(anchor)) {
                    let href = anchor.getAttribute('href');
                    let index = linksList.findIndex(link => link.url === fullUrl(href));
                    if (index > -1) {
                        let icon = markerTypes[linksList[index].status].icon;
                        let title = markerTypes[linksList[index].status].title;
                        let cssClass = markerTypes[linksList[index].status].cssClass;
                        placeMarker(anchor, icon, title);
                        anchor.classList.add(cssClass);
                    }
                }
            });
        }
    });
}) ();