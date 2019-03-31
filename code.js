let gps = {}; //{id: {iframe: iframe, div: div, running: bool, loading: bool}}

let holder; // DOM
let startLoadingTime = null;
let stillLoading = null;
let loaderDots = ['.', '..', '...', '....'];
let loaderIndex = 0;


function detectMobile() {
    return (navigator.userAgent.match(/Android/i)
        || navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i)
        || navigator.userAgent.match(/BlackBerry/i)
        || navigator.userAgent.match(/Windows Phone/i));
};

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

    if (detectMobile) {
        addGPLauncher("afterWanderAndAvoid", "wanderAndAvoid.gpp", "720px", "540px");
        addGPLauncher("afterNudibranchNeuronChain", "NudibranchNeuronChain.gpp", "720px", "540px");
    } else {
        addGP("afterWanderAndAvoid", "wanderAndAvoid.gpp", "720px", "540px");
        addGPLauncher("afterNudibranchNeuronChain", "NudibranchNeuronChain.gpp", "720px", "540px");
    }

    stillLoading = true;
    startLoadingTime = Date.now();
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

function addGP(after, projectName, width, height, optReplacementopt) {
    let prev = window.document.getElementById(after);
    let parent = prev.parentNode;
    let div = makeGP(after, projectName, width, height);

    if (optReplacementopt) {
        parent.removeChild(optReplacementopt);
    }
    parent.insertBefore(div, prev);
    return div;
}

function addGPLauncher(after, projectName, width, height) {
    let prev = window.document.getElementById(after);
    let parent = prev.parentNode;
    let div = makeGPLauncher(after, projectName, width, height);
    parent.insertBefore(div, prev);
    return div;
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
    iframe.src = "https://gpblocks.org/run/load.html#" + src;
    iframe.setAttribute("allow", "autoplay; fullscreen");
    iframe.style.height = height;
    iframe.style.width = width;

    let div = document.createElement("div");
    div.appendChild(iframe);

    return div;
}

function makeGPLauncher(after, projectName, width, height) {
    let launcher = document.createElement("div");

    launcher.style.width = width;
    launcher.style.height = height;
    launcher.classList.add("launcher");

    //let button = document.createElement("img");
    //button.src = "round_blue_play_button_down.svg";

    //button.classList.add("launcherButton");

    launcher.style.setProperty("background-image", `url(${projectName + "-background.png"})`);
    //let buttonHolder = document.createElement("div");
    //buttonHolder.style.height = "220px";
    //buttonHolder.style.width = "220px";

    launcher.style.setProperty("background", `linear-gradient(rgba(0,0,0,0.5), rgba(0, 0, 0, 0.5) ),url(${projectName + "-background.png"}) no-repeat`);
    launcher.style.setProperty("background-size", "100%");

    let msg = document.createElement("div");
    msg.innerHTML = `
Tap here to start the dynamic content.<BR>
It may take up to a minute to launch.`;

    msg.classList.add("launcherMessage");

    //buttonHolder.appendChild(button);
    //launcher.appendChild(buttonHolder);

    launcher.appendChild(msg);

    launcher.onclick =() => {
        addGP(after, projectName, width, height, launcher);
        console.log("click", projectName);
    };

    return launcher;
}

function loaderAnimation() {
    let now = Date.now();
    if (stillLoading && now < startLoadingTime + 3000) {
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

/*
function thumbnailGP(div, iframe, projectName) {
    let top = holder.offsetTop;
    let right = holder.offsetLeft + holder.offsetWidth;
    let left = right - (Object.keys(gps).length * 80 + 30);

    div.style.top = (top + 20) + "px";
    div.style.left = left + "px";

    iframe.classList.add("loading");
    div.classList.add("loading");

    gps[projectName] = {
        iframe, div, running: true, loading: null};

    (() => {
            iframe.classList.remove("loading");
            div.classList.remove("loading");
            moveGP(projectName);})();
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
*/
