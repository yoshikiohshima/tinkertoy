    let imageNames;
    let images;

    window.onresize = () => {
	//adjust();
    }

    window.onload = () => {
	//imageNames = Array.from(document.getElementsByTagName("img")).filter((elem) => elem.classList.contains("right"));
	//images = imageNames.map((img) => {
	//return {img: img, origPercent: parseFloat(img.style.width)}
	//});
	//adjust();
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
