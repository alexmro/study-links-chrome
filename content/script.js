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
            if (href[0] == '/') {
                href = host + href;
            } else if (href[0] == '#') {
                href = host + window.location.pathname + href;
            }

            if (href.substr(0, 3) == '../') {
                let locationParts = window.location.pathname.split('/').filter(i => i);
                if (locationParts[locationParts.length - 1].includes('.')) {
                    locationParts = locationParts.slice(0, -2);
                }
                href = host + '/' + locationParts.join('/') + '/' + href.substr(3);
            }

            if (!href.includes('://')) {
                let locationParts = window.location.pathname.split('/').filter(i => i);
                if (locationParts.length > 0 && locationParts[locationParts.length - 1].includes('.')) {
                    locationParts = locationParts.slice(0, -1);
                    href = host + '/' + locationParts.join('/') + '/' + href;
                } else {
                    href = host + window.location.pathname + href;
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

    chrome.storage.sync.get(["linksToRead"]).then((result) => {
        if (typeof result.linksToRead !== 'undefined' && result.linksToRead.length > 0) {
            let linksToRead = JSON.parse(result.linksToRead);
            anchors.forEach(anchor => {
                if (validAnchor(anchor)) {
                    let href = anchor.getAttribute('href');
                    if (linksToRead.includes(fullUrl(href))) {
                        placeMarker(anchor, '📙', 'To be read');
                        anchor.classList.add('linkToRead');
                    }
                }
            });
        }
    });

    chrome.storage.sync.get(["linksReading"]).then((result) => {
        if (typeof result.linksReading !== 'undefined' && result.linksReading.length > 0) {
            let linksReading = JSON.parse(result.linksReading);

            anchors.forEach(anchor => {
                if (validAnchor(anchor)) {
                    let href = anchor.getAttribute('href');
                    if (linksReading.includes(fullUrl(href))) {
                        placeMarker(anchor, '📘', 'Still reading');
                        anchor.classList.add('linkReading');
                    }
                }
            });
        }
    });

    chrome.storage.sync.get(["linksDone"]).then((result) => {
        if (typeof result.linksDone !== 'undefined' && result.linksDone.length > 0) {
            let linksDone = JSON.parse(result.linksDone);

            anchors.forEach(anchor => {
                if (validAnchor(anchor)) {
                    let href = anchor.getAttribute('href');
                    if (linksDone.includes(fullUrl(href))) {
                        placeMarker(anchor, '📗', 'Done reading');
                        anchor.classList.add('linkDone');
                    }
                }
            });
        }
    });
}) ();