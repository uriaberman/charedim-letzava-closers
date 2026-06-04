/* חרדים לצבא — מנוע סגיר. בונה DOM + מריץ אנימציה לפי data-concept.
   קונספטים: merge | stamp | cine | draw                                */
(function () {
  const body = document.body;
  const concept = body.dataset.concept || "merge";
  const LABELS = { merge: "החיבור", stamp: "החותם", cine: "חשיפה קולנועית", draw: "קו הזהות", minimal: "מינימל לבן" };

  // ---------- markup ----------
  const frame = document.createElement("div");
  frame.className = "frame";
  frame.innerHTML = `
    <div class="stage" id="stage">
      <div class="bg"></div>
      <div class="world" id="world">
        <img class="hat"  id="hat"  src="assets/hat.png" alt="">
        <img class="hatL" id="hatL" src="assets/hat.png" alt="">
        <img class="hatR" id="hatR" src="assets/hat.png" alt="">
        <div class="seam" id="seam"></div>
        <img class="swashL" id="swashL" src="assets/swash.png" alt="">
        <img class="swashR" id="swashR" src="assets/swash.png" alt="">
        <img class="logoFull"  id="logoFull"  src="assets/logo-text.png" alt="חרדים לצבא">
        <img class="logoTop"   id="logoTop"   src="assets/logo-charedim-letzava.png" alt="חרדים לצבא">
        <img class="logoStrip" id="logoStrip" src="assets/logo-strip.png" alt="שומרים על הזהות">
        <div class="goldline" id="goldline"></div>
      </div>
      <div class="grain"></div>
      <div class="tag">${LABELS[concept] || ""}</div>
    </div>`;
  body.appendChild(frame);

  const $ = (id) => document.getElementById(id);
  const stage = $("stage");

  // ---------- scale-to-fit ----------
  function fit() {
    const s = Math.min(window.innerWidth / 1080, window.innerHeight / 1920);
    stage.style.transform = `translate(-50%,-50%) scale(${s})`;
  }
  window.addEventListener("resize", fit);
  fit();

  // wait for images, then play
  const imgs = Array.from(stage.querySelectorAll("img"));
  let loaded = 0;
  const ready = () => { if (++loaded >= imgs.length) start(); };
  imgs.forEach((im) => { if (im.complete) ready(); else { im.onload = ready; im.onerror = ready; } });

  function start() {
    const E = gsap.parseEase;
    const out = "power3.out", io = "power2.inOut";

    // helper: fade whole stage out at end then the timeline repeats from initial state
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.6, defaults: { ease: out } });

    if (concept === "merge") {
      // הכובע מורכב משני חצאים שנכנסים מהצדדים ומתאחדים, ואז הלוגו המלא עולה כבלוק
      gsap.set("#hat", { autoAlpha: 0 });
      gsap.set("#hatL", { display: "block", autoAlpha: 1, clipPath: "inset(0 50% 0 0)", x: -260, xPercent: -50, rotation: -6 });
      gsap.set("#hatR", { display: "block", autoAlpha: 1, clipPath: "inset(0 0 0 50%)", x: 260, xPercent: -50, rotation: 6 });
      gsap.set("#logoFull", { autoAlpha: 0, y: 64 });
      gsap.set("#seam", { display: "block" });

      tl.to("#hatL", { x: 0, rotation: 0, duration: 1.0, ease: "power4.out" }, 0.2)
        .to("#hatR", { x: 0, rotation: 0, duration: 1.0, ease: "power4.out" }, 0.2)
        .to("#seam", { opacity: 0.9, duration: 0.12 }, 1.05)
        .to("#seam", { opacity: 0, duration: 0.5 }, 1.2)
        .to("#hatL", { y: "-=10", duration: 0.18, yoyo: true, repeat: 1 }, 1.1) // micro impact
        .to("#hatR", { y: "-=10", duration: 0.18, yoyo: true, repeat: 1 }, 1.1)
        .to("#logoFull", { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" }, 1.45)
        .to({}, { duration: 1.7 })
        .to("#world > *", { autoAlpha: 0, duration: 0.5 });
    }

    else if (concept === "stamp") {
      // הכובע צונח מלמעלה עם impact, רעד מסך, הטקסט נחבט פנימה
      gsap.set(["#hatL", "#hatR", "#seam", "#logoTop", "#logoStrip"], { display: "none" });
      gsap.set("#hat", { autoAlpha: 0, y: -520, scale: 1.25, rotation: -3 });
      gsap.set("#logoFull", { autoAlpha: 0, scale: 1.8, filter: "blur(8px)" });

      tl.to("#hat", { autoAlpha: 1, y: 0, scale: 1, rotation: 0, duration: 0.62, ease: "power4.in" }, 0.25)
        .to("#world", { keyframes: { x: [0, -24, 19, -11, 6, 0] }, duration: 0.45, ease: "none" }, 0.85) // shake
        .fromTo("#hat", { y: 0 }, { y: -14, duration: 0.1, yoyo: true, repeat: 1 }, 0.85)
        .to("#logoFull", { autoAlpha: 1, scale: 1, filter: "blur(0px)", duration: 0.5, ease: "back.out(1.6)" }, 1.05)
        .to({}, { duration: 1.9 })
        .to("#world > *", { autoAlpha: 0, duration: 0.5 });
    }

    else if (concept === "cine") {
      // תקריב על הכובע → זום-אאוט איטי חושף → הטקסט עולה blur-to-focus
      gsap.set(["#hatL", "#hatR", "#seam", "#logoTop", "#logoStrip"], { display: "none" });
      gsap.set("#hat", { autoAlpha: 0, scale: 3.2, x: -90, y: 60, transformOrigin: "62% 52%" }); // מתחיל על סמל צה"ל
      gsap.set("#logoFull", { autoAlpha: 0, y: 50, filter: "blur(14px)" });

      tl.to("#hat", { autoAlpha: 1, duration: 0.9, ease: "power1.out" }, 0.2)
        .to("#hat", { scale: 1, x: 0, y: 0, duration: 2.4, ease: "power2.inOut" }, 0.4)
        .to("#logoFull", { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.1, ease: "power2.out" }, 2.1)
        .to({}, { duration: 1.8 })
        .to("#world > *", { autoAlpha: 0, duration: 0.7 });
    }

    else if (concept === "draw") {
      // הכובע מופיע → הלוגו המלא נחשף ב-wipe מימין לשמאל → קו זהוב → פיתוחים כעיטור
      gsap.set(["#hatL", "#hatR", "#seam"], { display: "none" });
      gsap.set("#hat", { autoAlpha: 0, scale: 0.8, y: -18 });
      gsap.set("#logoFull", { autoAlpha: 1, clipPath: "inset(0 0 0 100%)" }); // נחשף מימין (RTL)
      gsap.set("#goldline", { display: "block", width: 0 });
      gsap.set("#swashL", { display: "block", autoAlpha: 0, x: -46, scale: 0.7 });
      gsap.set("#swashR", { display: "block", autoAlpha: 0, x: 46, scale: 0.7 });

      tl.to("#hat", { autoAlpha: 1, scale: 1, y: 0, duration: 0.85, ease: "back.out(1.3)" }, 0.25)
        .to("#logoFull", { clipPath: "inset(0 0 0 0%)", duration: 1.0, ease: "power2.inOut" }, 0.95)
        .to("#goldline", { width: 520, duration: 0.7, ease: "power2.inOut" }, 1.7)
        .to(["#swashL", "#swashR"], { autoAlpha: 0.9, x: 0, scale: 1, duration: 0.7, ease: "power3.out" }, 2.0)
        .to({}, { duration: 1.5 })
        .to("#world > *", { autoAlpha: 0, duration: 0.5 });
    }

    else if (concept === "minimal") {
      // נקי ושקט על לבן — הכובע נוחת בעדינות, הלוגו עולה, נושם
      gsap.set(["#hatL", "#hatR", "#seam", "#logoTop", "#logoStrip", "#swashL", "#swashR"], { display: "none" });
      gsap.set("#hat", { autoAlpha: 0, y: -46, scale: 1.05 });
      gsap.set("#logoFull", { autoAlpha: 0, y: 46 });

      tl.to("#hat", { autoAlpha: 1, y: 0, scale: 1, duration: 1.0, ease: "power3.out" }, 0.3)
        .to("#logoFull", { autoAlpha: 1, y: 0, duration: 0.9, ease: "power3.out" }, 0.85)
        .to("#hat", { y: -8, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: 1 }, 1.6) // נשימה עדינה
        .to({}, { duration: 0.6 })
        .to("#world > *", { autoAlpha: 0, duration: 0.6 });
    }

    window.__tl = tl; // לשליטת review (play/restart)
  }
})();
