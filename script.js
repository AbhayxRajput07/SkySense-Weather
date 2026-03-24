const headlineRotator = document.querySelector(".headline-rotator");

const rotatingPhrases = [
  "before it hits",
  "in real time",
  "with precision",
  "with absolute clarity"
];

let phraseIndex = 0;

if (headlineRotator) {
  setInterval(() => {
    phraseIndex = (phraseIndex + 1) % rotatingPhrases.length;
    headlineRotator.style.opacity = "0";
    headlineRotator.style.transform = "translateY(8px)";

    setTimeout(() => {
      headlineRotator.textContent = rotatingPhrases[phraseIndex];
      headlineRotator.style.opacity = "1";
      headlineRotator.style.transform = "translateY(0)";
    }, 400); // quick, smooth fade
  }, 4000); 
}



if ("serviceWorker" in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register("sw.js").catch((err) => {
      console.error("Service worker registration failed:", err);
    });
  });
}
