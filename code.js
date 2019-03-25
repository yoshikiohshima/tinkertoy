let gps = {}; //{id: {iframe: iframe, div: div, running: bool, loading: bool}}

let holder; // DOM
let stillLoading = false;
let loaderDots = ['.', '..', '...', '....'];
let loaderIndex = 0;

window.onscroll = evt => {
    let docViewTop = window.scrollY;
    let docViewBottom = docViewTop + window.innerHeight;

    Object.entries(gps).forEach(([key, gp]) => {
        let elemTop = gp.iframe.offsetTop;
        let elemBottom = elemTop + gp.iframe.offsetHeight;
        let visible = elemTop < docViewBottom && docViewTop < elemBottom;
        if (gp.running !== visible) {
            console.log(gp.iframe.id, "switch to: ", visible);
            let message = visible ? "resume GP" : "suspend GP";
            gp.running = visible;
            gp.iframe.contentWindow.postMessage(message, '*');
        }
    });
};

window.onload = () => {
    holder = document.getElementById("loaderholder");

    addGP("afterWanderAndAvoid", "wanderAndAvoid.gpp", "720px", "540px");
    addGP("afterNudibranchNeuronChain", "NudibranchNeuronChain.gpp", "720px", "540px");
    stillLoading = true;
    loaderAnimation();
};

window.onmessage = (msg) => {
    let data = msg.data;
    let name = data.split(" ")[0];
    let origin = msg.origin;
    let source = msg.source;

    console.log(data, origin, source, name);
    if (gps[name] && gps[name].loading) {
        gps[name].loading();
        gps[name].loading = null;
    }

    stillLoading = false;
    for (let k in gps) {
        stillLoading = stillLoading || gps[k].loading;
    }
};

function addGP(after, projectName, width, height, optDOM) {
    let prev = window.document.getElementById(after);
    let parent = prev.parentNode;
    let div = optDOM || makeGP(after, projectName, width, height);
    parent.insertBefore(div, prev);
    return div;
}

function moveGP(projectName) {
    let gp = gps[projectName];
    if (gp) {
        gp.div.classList.remove("loading");
        gp.div.style.removeProperty("top");
        gp.div.style.removeProperty("right");
        gp.iframe.classList.remove("loading");
    }
}

function makeGP(after, projectName, width, height) {
    let loc = window.location;
    let last = loc.pathname.lastIndexOf("/");
    let dir = loc.pathname.slice(0, last+1);

    let hostPart;
    if (loc.protocol !== "https:" && loc.protocol !== "http:") {
	hostPart = "tinlizzie.org/~ohshima/";
    } else {
	hostPart = loc.hostname + dir;
    }

    let src = hostPart + projectName;

    let iframe = window.document.createElement("iframe");
    iframe.id = projectName;
    iframe.classList.add("gp");
    iframe.src = "https://gpblocks.org/run/go.html#" + src;
    iframe.setAttribute("allow", "autoplay; fullscreen");
    iframe.style.height = height;
    iframe.style.width = width;

    let div = document.createElement("div");
    div.appendChild(iframe);

    iframe.classList.add("loading");
    div.classList.add("loading");

    let top = holder.offsetTop;
    let right = holder.offsetLeft + holder.offsetWidth;
    let left = right - (Object.keys(gps).length * 80 + 30);

    div.style.top = (top + 20) + "px";
    div.style.left = left + "px";

    gps[projectName] = {
        iframe, div, running: true, loading: () => {
            iframe.classList.remove("loading");
            div.classList.remove("loading");
            moveGP(projectName);}
    };
    return div;
}

function loaderAnimation() {
    if (stillLoading) {
        if (holder) {
            let label = holder.querySelector('#loaderLabel');
            let labelDots = holder.querySelector('#loaderDots');

            loaderIndex = (loaderIndex + 1) % loaderDots.length;
            let dots = loaderDots[loaderIndex];

            labelDots.innerText = dots + ")";
        }
        setTimeout(loaderAnimation, 600);
    } else {
        holder.innerText = "";
    }
}

function backFromFootnote() {
    if (window.location.hash.length > 0) {
	window.history.back();
    }
}
