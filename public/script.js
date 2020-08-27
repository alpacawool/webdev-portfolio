// Picture carousel
// Credit from : https://www.w3schools.com/howto/howto_js_slideshow.asp

var slideNo = 1;
showSlides(slideNo);
autoSlides();

function moveSlides(n) {
	showSlides(slideNo += n);
}

function showSlides(n) {
	var slide = document.getElementsByClassName("slide");

	if (n > slide.length) {
		slideNo = 1;
	}

	if (n <= 0) {
		slideNo = 3;
	}

	for (var i = 0; i < slide.length; i++) {
		slide[i].style.display = "none";
	}

	slide[slideNo-1].style.display = "block";
}

function autoSlides() {
	moveSlides(1);

	setTimeout(autoSlides, 6000);
}

