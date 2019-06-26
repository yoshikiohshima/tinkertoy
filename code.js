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
}

window.onload = () => {
    holder = document.getElementById("loaderholder");

    if (detectMobile()) {
        addGPLauncher("afterWanderAndAvoid", "wanderAndAvoid.gpp");
    } else {
        addGP("afterWanderAndAvoid", "wanderAndAvoid.gpp");
    }

    addGPLauncher("afterNudibranchNeuronChain", "NudibranchNeuronChain.gpp");
    addGPLauncher("afterMemoryTinkering", "MemoryTinkering8.gpp");
    addGPLauncher("afterConditiondReflex", "conditionedReflex12.gpp");

    stillLoading = true;
    startLoadingTime = Date.now();
    loaderAnimation();
};

window.onmessage = (msg) => {
    let data = msg.data;
    let name = data.split(" ")[0];
    let origin = msg.origin;
    let source = msg.source;

    window.o = origin;
    window.s = source;

    if (gps[name] && gps[name].loading) {
        gps[name].loading();
        gps[name].loading = null;
    }

    stillLoading = false;
    for (let k in gps) {
        stillLoading = stillLoading || gps[k].loading;
    }
};

function addGP(after, projectName, optReplacementopt) {
    let prev = window.document.getElementById(after);
    let parent = prev.parentNode;
    let div = makeGP(after, projectName);

    if (optReplacementopt) {
        parent.removeChild(optReplacementopt);
    }
    div.style.setProperty("display", "none");
    parent.insertBefore(div, prev);
    gps[projectName].loading = () => {
        gps[projectName].div.style.removeProperty("display");
        gps[projectName].iframe.contentWindow.postMessage("resume GP", "*");
        gps[projectName].iframe.contentWindow.postMessage("hideButton KeyboardButton", "*");
        gps[projectName].iframe.contentWindow.postMessage("hideButton BackspaceButton", "*");
        gps[projectName].iframe.contentWindow.postMessage("hideButton EnableMicrophoneButton", "*");
        gps[projectName].iframe.contentWindow.postMessage("hideButton UploadButton", "*");

        gps[projectName].iframe.contentWindow.postMessage("showButton FullscreenButton", "*");
        gps[projectName].iframe.contentWindow.postMessage("showButton SeeInsideButton", "*");
        gps[projectName].iframe.contentWindow.postMessage("showButton GoButton", "*");
        gps[projectName].iframe.contentWindow.postMessage("showButton StopButton", "*");
    };
    return div;
}

function addGPLauncher(after, projectName) {
    let prev = window.document.getElementById(after);
    let parent = prev.parentNode;
    let div = makeGPLauncher(after, projectName);
    parent.insertBefore(div, prev);
    return div;
}

function makeGP(after, projectName) {
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
    iframe.classList.add("gpExtent");
    iframe.src = "https://gpblocks.org/run/go.html#" + src;
    iframe.setAttribute("allow", "autoplay; fullscreen; microphone; camera");
    iframe.setAttribute("allowfullscreen", "true");
    iframe.setAttribute("overflow", "hidden");

    let div = document.createElement("div");
    div.classList.add("middle");
    div.classList.add("gpExtent");

    div.appendChild(iframe);

    gps[projectName] = {
        iframe, div, running: true, loading: null};

    return div;
}

function makeGPLauncher(after, projectName) {
    let launcher = document.createElement("div");

    launcher.classList.add("gpExtent");
    launcher.classList.add("launcher");

    launcher.style.setProperty("background-image", `url(${projectName + "-background.png"})`);

    launcher.style.setProperty("background", `linear-gradient(rgba(0,0,0,0.5), rgba(0, 0, 0, 0.5) ),url(${projectName + "-background.png"}) no-repeat`);
    launcher.style.setProperty("background-size", "100%");

    let msg = document.createElement("div");
    msg.innerHTML = document.getElementById("launcherMessage").innerHTML;

    msg.classList.add("launcherMessage");

    launcher.appendChild(msg);

    launcher.onclick =() => {
        let div = addGP(after, projectName, launcher);
        div.style.removeProperty("display"); // take this line out
    };

    return launcher;
}

function loaderAnimation() {
    let now = Date.now();
    if (stillLoading && now < startLoadingTime + 3000) {
        if (holder) {
            let labelDots = holder.querySelector('#loaderDots');

            loaderIndex = (loaderIndex + 1) % loaderDots.length;
            let dots = loaderDots[loaderIndex];

            labelDots.innerText = dots + ")";
        }
        setTimeout(loaderAnimation, 600);
    } else {
        holder.innerText = "";
        // just to make sure things get started
        for (let k in gps) {
            if (gps[k].loading) {
                gps[k].loading();
                gps[k].loading = null;
            }
        }
    }
}

function backFromFootnote() {
    if (window.location.hash.length > 0) {
	window.history.back();
    }
}
