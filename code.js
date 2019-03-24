let gps = []; //[{iframe: iframe, running: bool}]

window.onscroll = evt => {
    let docViewTop = window.scrollY;
    let docViewBottom = docViewTop + window.innerHeight;

    for (let i = 0; i < gps.length; i++) {
        let elemTop = gps[i].iframe.offsetTop;
        let elemBottom = elemTop + gps[i].iframe.offsetHeight;
        let visible = elemTop < docViewBottom && docViewTop < elemBottom;
        if (gps[i].running !== visible) {
            console.log(gps[i].iframe.id, "switch to: ", visible);
            let message = visible ? "resume GP" : "suspend GP";
            gps[i].running = visible;
            gps[i].iframe.contentWindow.postMessage(message, '*');
        }
    }
};

window.onload = () => {
    addGP("afterWanderAndAvoid", "wanderAndAvoid.gpp");
    addGP("afterNudibranchNeuronChain", "NudibranchNeuronChain.gpp");
};

function addGP(after, projectName) {
    let prev = window.document.getElementById(after);
    let parent = prev.parentNode;
    let loc = window.location;
    let last = loc.pathname.lastIndexOf("/");
    let dir = loc.pathname.slice(0, last+1);

    let hostPart;
    if (loc.protocol !== "https:" || loc.protocol !== "http:") {
	hostPart = "tinlizzie.org/~ohshima/";
    } else {
	hostPart = loc.protocol + "//" + loc.hostname + dir;
    }

    let src = hostPart + projectName;

    let iframe = window.document.createElement("iframe");
    iframe.id = projectName;
    iframe.src = "https://gpblocks.org/run/go.html#" + src;
    iframe.setAttribute("allowFullScreen", "true");
    iframe.style.height = "800px";
    iframe.style.width = "100%";
    parent.insertBefore(iframe, prev);
    //iframe.contentWindow.postMessage("suspend GP");
    gps.push({iframe, running: true});
}

function backFromFootnote() {
    if (window.location.hash.length > 0) {
	window.history.back();
    }
}
