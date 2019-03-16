let imageNames;
let images;

function backFromFootnote() {
    if (window.location.hash.length > 0) {
	window.history.back();
    }
}

window.onresize = () => {
    //adjust();
}

window.onload = () => {
    //imageNames = Array.from(document.getElementsByTagName("img")).filter((elem) => elem.classList.contains("right"));
    //images = imageNames.map((img) => {
    //return {img: img, origPercent: parseFloat(img.style.width)}
    //});
    //adjust();
    addGP("afterWanderAndAvoid", "wanderAndAvoid.gpp");
    addGP("afterNudibranchNeuronChain", "NudibranchNeuronChain.gpp");
}

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
    iframe.src = "https://gpblocks.org/run/go.html#" + src;
    iframe.style.height = "800px";
    iframe.style.width = "100%";
    parent.insertBefore(iframe, prev);
}


adjust = () => {
    for (let i = 0; i < images.length - 1; i++) {
	let data = images[i];
        let img = data.img;
        let nextImg = images[i + 1].img;
	let bottom = nextImg.previousElementSibling;

        if (img && bottom) {
	    let imgRect = img.getBoundingClientRect();
	    let origWidth = window.innerWidth * (data.origPercent / 100);
	    let origScale = origWidth / img.naturalWidth
	    let imgOrigHeight = img.naturalHeight * origScale;
	    let imgOrigBottom = img.offsetTop + imgOrigHeight;

	    let bottomRect = bottom.getBoundingClientRect();
	    let bottomBottom = bottom.offsetTop + bottomRect.height;

	    if (imgOrigBottom > bottomBottom) {
		let excess = imgOrigBottom - bottomBottom + 10;
		let ratio = (imgOrigHeight - excess) / imgOrigHeight;
		let newPercent = data.origPercent * ratio;
		img.style.width = newPercent.toFixed(2) + "%";
	    } else {
		img.style.width = data.origPercent + "%";
	    }
        }
    }
}
