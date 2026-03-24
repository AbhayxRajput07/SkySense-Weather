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

function setupInstallPrompt() {
  const PROMPT_DISMISSED_KEY = "skysenseInstallDismissed";
  const VISIT_COUNT_KEY = "skysenseVisitCount";
  const INSTALL_ACCEPTED_KEY = "skysenseInstalled";
  let deferredPrompt = null;

  const isStandalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone === true;

  if (isStandalone) {
    localStorage.setItem(INSTALL_ACCEPTED_KEY, "1");
    return;
  }

  const previousVisits = Number(localStorage.getItem(VISIT_COUNT_KEY) || "0");
  const visitCount = previousVisits + 1;
  localStorage.setItem(VISIT_COUNT_KEY, String(visitCount));

  const alreadyInstalled = localStorage.getItem(INSTALL_ACCEPTED_KEY) === "1";
  const dismissed = localStorage.getItem(PROMPT_DISMISSED_KEY) === "1";
  if (alreadyInstalled || dismissed || visitCount < 2) {
    return;
  }

  const banner = document.createElement("section");
  banner.className = "install-tab";
  banner.setAttribute("aria-live", "polite");
  banner.innerHTML = `
    <div class="install-tab-content">
      <p class="install-tab-title">Install SkySense</p>
      <p class="install-tab-text">Add this app to your home screen for one-tap access.</p>
    </div>
    <div class="install-tab-actions">
      <button type="button" class="install-btn install-btn-primary" id="install-now-btn">Add</button>
      <button type="button" class="install-btn install-btn-secondary" id="install-close-btn" aria-label="Close install prompt">Later</button>
    </div>
  `;

  document.body.appendChild(banner);

  const installNowBtn = document.getElementById("install-now-btn");
  const closeBtn = document.getElementById("install-close-btn");

  const closeBanner = (permanentDismiss) => {
    if (permanentDismiss) {
      localStorage.setItem(PROMPT_DISMISSED_KEY, "1");
    }
    banner.classList.add("install-tab-hidden");
    setTimeout(() => banner.remove(), 280);
  };

  closeBtn?.addEventListener("click", () => closeBanner(true));

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    banner.classList.add("install-tab-ready");
  });

  window.addEventListener("appinstalled", () => {
    localStorage.setItem(INSTALL_ACCEPTED_KEY, "1");
    localStorage.removeItem(PROMPT_DISMISSED_KEY);
    closeBanner(false);
  });

  installNowBtn?.addEventListener("click", async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const result = await deferredPrompt.userChoice;
      if (result.outcome === "accepted") {
        localStorage.setItem(INSTALL_ACCEPTED_KEY, "1");
        closeBanner(false);
      }
      deferredPrompt = null;
      return;
    }

    // iOS Safari and some desktop browsers do not expose beforeinstallprompt.
    alert(
      "To install: open your browser menu and choose 'Add to Home Screen' (or 'Install App')."
    );
    closeBanner(true);
  });
}

setupInstallPrompt();
