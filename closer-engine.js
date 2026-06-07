/* חרדים לצבא — מנוע סגיר. בונה DOM + מריץ אנימציה לפי data-concept.
   קונספטים: merge | together | pop | draw | minimal
   ?render=1 → ריצה חד-פעמית בלי loop ובלי fade (לרינדור MP4 נקי). */
(function () {
  const body = document.body;
  const concept = body.dataset.concept || "merge";
  const RENDER = new URLSearchParams(location.search).has("render");

  const frame = document.createElement("div");
  frame.className = "frame";
  frame.innerHTML = `
    <div class="stage" id="stage">
      <div class="bg"></div>
      <div class="world" id="world">
        <img class="hat"  id="hat"  src="assets/hat.png" alt="">
        <img class="hatL" id="hatL" src="assets/hat.png" alt="">
        <img class="hatR" id="hatR" src="assets/hat.png" alt="">
        <img class="logoFull" id="logoFull" src="assets/logo-text.png" alt="חרדים לצבא">
        <img class="helpline" id="helpline" src="assets/helpline.png" alt="צריכים עזרה? אנחנו כאן">
      </div>
    </div>`;
  body.appendChild(frame);

  const stage = document.getElementById("stage");

  function fit() {
    const s = Math.min(window.innerWidth / 1080, window.innerHeight / 1920);
    stage.style.transform = `translate(-50%,-50%) scale(${s})`;
  }
  window.addEventListener("resize", fit);
  fit();

  const imgs = Array.from(stage.querySelectorAll("img"));
  let loaded = 0;
  const ready = () => { if (++loaded >= imgs.length) start(); };
  imgs.forEach((im) => { if (im.complete) ready(); else { im.onload = ready; im.onerror = ready; } });

  function start() {
    const tl = gsap.timeline({ repeat: RENDER ? 0 : -1, repeatDelay: 0.7, defaults: { ease: "power3.out" } });

    if (concept === "merge") {
      // המגבעת (חצי שמאל) והכומתה (חצי ימין) נכנסות ומתחברות ביחד — בעדינות, תנועה קצרה בלי סיבוב.
      // ברגע ההתלכדות cross-fade עדין לכובע השלם (עומק אחיד, בלי קו תפר). filter:none על החצאים מונע קו כהה במרכז.
      const DS = "drop-shadow(0 14px 30px rgba(40,38,18,.18))";
      // קו החצייה ב-47% (קו התפר מגבעת↔כומתה). הצבע נשמר במדויק — החצאים תמיד ב-opacity מלא,
      // הכובע השלם מופיע מעליהם בסוף לעומק (בלי cross-fade שמדהה את הכומתה אל הרקע הלבן).
      gsap.set("#hat", { autoAlpha: 0, filter: DS, zIndex: 6 });
      gsap.set("#hatL", { display: "block", autoAlpha: 1, clipPath: "inset(0 53% 0 0)", x: -72, xPercent: -50, filter: "none", zIndex: 4 });
      gsap.set("#hatR", { display: "block", autoAlpha: 1, clipPath: "inset(0 0 0 47%)", x: 72, xPercent: -50, filter: "none", zIndex: 4 });
      gsap.set("#logoFull", { autoAlpha: 0, y: 50 });

      tl.to("#hatL", { x: 0, duration: 1.35, ease: "power3.out" }, 0.3)
        .to("#hatR", { x: 0, duration: 1.35, ease: "power3.out" }, 0.3)
        .to("#hat", { autoAlpha: 1, duration: 0.5, ease: "power1.out" }, 1.55)   // כובע שלם מעל החצאים המלאים → עומק + תפר נקי, בלי דהייה
        .set(["#hatL", "#hatR"], { autoAlpha: 0 }, 2.1)                          // מוסתרים מתחת ל-hat המלא
        .to("#logoFull", { autoAlpha: 1, y: 0, duration: 0.95, ease: "power2.out" }, 1.95);
    }

    else if (concept === "together") {
      // הכובע מלמעלה והלוגו מלמטה נכנסים יחד, רך — נחיתה משותפת
      gsap.set(["#hatL", "#hatR"], { display: "none" });
      gsap.set("#hat", { autoAlpha: 0, y: -58 });
      gsap.set("#logoFull", { autoAlpha: 0, y: 58 });

      tl.to("#hat", { autoAlpha: 1, y: 0, duration: 1.05, ease: "power2.out" }, 0.35)
        .to("#logoFull", { autoAlpha: 1, y: 0, duration: 1.05, ease: "power2.out" }, 0.35)
        .to("#hat", { y: -6, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: RENDER ? 0 : 1 }, 1.5);
    }

    else if (concept === "pop") {
      // קליל וסושיאלי — הכובע קופץ פנימה, נדנוד שובב, הלוגו פופ
      gsap.set(["#hatL", "#hatR"], { display: "none" });
      gsap.set("#hat", { autoAlpha: 0, scale: 0.55, transformOrigin: "50% 72%" });
      gsap.set("#logoFull", { autoAlpha: 0, scale: 0.62, y: 18 });
      gsap.set("#helpline", { display: "block", autoAlpha: 0, y: 36, scale: 0.92 });

      tl.to("#hat", { autoAlpha: 1, scale: 1, duration: 0.7, ease: "back.out(1.7)" }, 0.25)
        .to("#hat", { rotation: -4, duration: 0.45, yoyo: true, repeat: 1, ease: "sine.inOut" }, 0.95)
        .to("#logoFull", { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(2)" }, 0.72)
        .to("#helpline", { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.6)" }, 1.45); // נכנס אחרי הלוגו
    }

    else if (concept === "draw") {
      // נקי — הכובע מופיע, הלוגו נחשף ב-wipe מימין לשמאל (RTL). בלי עיטורים מסיחים.
      gsap.set(["#hatL", "#hatR"], { display: "none" });
      gsap.set("#hat", { autoAlpha: 0, scale: 0.85, y: -14 });
      gsap.set("#logoFull", { autoAlpha: 1, clipPath: "inset(0 0 0 100%)" });

      tl.to("#hat", { autoAlpha: 1, scale: 1, y: 0, duration: 0.8, ease: "power3.out" }, 0.25)
        .to("#logoFull", { clipPath: "inset(0 0 0 0%)", duration: 1.1, ease: "power2.inOut" }, 0.9);
    }

    else if (concept === "minimal") {
      // הופעה עדינה ונקייה עם נשימה קלה
      gsap.set(["#hatL", "#hatR"], { display: "none" });
      gsap.set("#hat", { autoAlpha: 0, y: -38, scale: 1.04 });
      gsap.set("#logoFull", { autoAlpha: 0, y: 42 });

      tl.to("#hat", { autoAlpha: 1, y: 0, scale: 1, duration: 1.0, ease: "power3.out" }, 0.3)
        .to("#logoFull", { autoAlpha: 1, y: 0, duration: 0.95, ease: "power3.out" }, 0.9)
        .to("#hat", { y: -7, duration: 1.7, ease: "sine.inOut", yoyo: true, repeat: RENDER ? 0 : 1 }, 1.7);
    }

    // hold על הפריים הסופי
    tl.to({}, { duration: 1.5 });
    // fade-out רק במצב תצוגה (loop). ברינדור — נשארים על הלוגו.
    if (!RENDER) tl.to("#world > *", { autoAlpha: 0, duration: 0.5 });

    window.__tl = tl;
    window.__ready = true;
  }
})();
