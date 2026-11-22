(() => {
  const screens = {
    login: document.getElementById("screen-login"),
    profile: document.getElementById("screen-profile"),
    "guest-body": document.getElementById("screen-guest-body"),
    "guest-survey": document.getElementById("screen-guest-survey"),
    results: document.getElementById("screen-results"),
  };

  const userChip = document.querySelector("[data-user-chip]");
  const loginLink = document.querySelector("[data-login-link]");
  const toast = document.getElementById("toast");
  const profileForm = document.getElementById("profile-form");
  const guestBodyForm = document.getElementById("guest-body-form");
  const guestSurveyForm = document.getElementById("guest-survey-form");

  let toastTimer;
  let guestDraft = { name: "박준호", height: 170, weight: 72 };
  let currentMode = "self";

  const SELF_RESULT = {
    name: "강유나",
    avgScore: 95,
    games: [
      { date: "2025.11.15", iso: "2025-11-15", score: 98 },
      { date: "2025.11.08", iso: "2025-11-08", score: 92 },
      { date: "2025.11.01", iso: "2025-11-01", score: 95 },
    ],
    headSpeed: 33,
    ballSpeed: 46,
    smash: 1.39,
    totalDist: 144,
    carry: 129,
    launch: 16,
    run: 15,
    peerCarry: 122,
    flightLabel: "풀스트레이트",
    flightEn: "PullStraight",
    flightDesc: "좌측 출발 후 직진",
    clubPath: -8,
    backspin: 3556,
    overall: 4.5,
    ratings: [
      { label: "구질 방향성", score: 5 },
      { label: "비거리", score: 5 },
      { label: "탄도", score: 5 },
      { label: "정타율", score: 3 },
    ],
    trajPos: "50%",
    flightPos: "50%",
    trajTag: "MIDDLE",
    flightTag: "STRAIGHT",
    gbtiName: "퍼펙트 스트레이터",
    gbtiCode: "MID-ST",
    gbtiShare: "13.4%",
    gbtiDesc: "GBTI 유형 분석 결과 · 미드 스트레이터 유형은 적정 탄도에 안정적인 스트레이트 구질이 특징이에요.",
    pros: [
      { type: "pro", text: "탄도가 적정 수준이라 공의 높이와 거리 사이의 균형이 좋아요." },
      { type: "pro", text: "구질이 스트레이트라 방향성이 안정적이고, 샷 결과를 예측하기 쉬워요." },
      { type: "neutral", text: "분석 결과, 뚜렷한 단점은 발견되지 않았어요." },
    ],
    clubDirection:
      "지금의 탄도와 구질 밸런스가 좋으니, 기존 스윙 특성을 해치지 않는 클럽을 고르시면 충분해요. 특정 상황에서 탄도나 구질을 조절해야 할 때는, 피팅 결과를 기준으로 로프트와 샤프트를 세밀하게 맞추는 것을 추천드려요.",
    improve: [
      { type: "pro", text: "지금의 안정적인 스트레이트 구질은 그대로 유지하세요." },
      { type: "tip", text: "다양한 구질 연습(페이드, 드로우 등)을 병행하면 샷 메뉴가 넓어지고, 골프의 재미도 한층 더 느끼실 수 있어요." },
    ],
  };

  const SCORE_MAP = {
    "70대": { avg: 74, games: [72, 76, 74] },
    "80대": { avg: 84, games: [82, 87, 83] },
    "90대": { avg: 93, games: [91, 96, 92] },
    "100대": { avg: 104, games: [102, 107, 103] },
    "110대 이상": { avg: 114, games: [111, 118, 113] },
  };

  const DIST_MAP = {
    "150m 미만": { total: 138, carry: 124, headSpeed: 34, ballSpeed: 47, smash: 1.38, launch: 15 },
    "150–180m": { total: 168, carry: 151, headSpeed: 38, ballSpeed: 54, smash: 1.42, launch: 14 },
    "180–210m": { total: 196, carry: 176, headSpeed: 42, ballSpeed: 60, smash: 1.43, launch: 13 },
    "210–240m": { total: 224, carry: 201, headSpeed: 46, ballSpeed: 66, smash: 1.43, launch: 12 },
    "240m 이상": { total: 248, carry: 222, headSpeed: 49, ballSpeed: 71, smash: 1.45, launch: 11 },
  };

  const TRAJ_MAP = {
    낮다: { tag: "LOW", pos: "16%", launchBoost: -2 },
    중간: { tag: "MIDDLE", pos: "50%", launchBoost: 0 },
    높다: { tag: "HIGH", pos: "84%", launchBoost: 3 },
  };

  const FLIGHT_MAP = {
    "풀 훅": { tag: "HOOK", pos: "8%", en: "PullHook", desc: "왼쪽 출발 후 더 왼쪽", name: "풀 후커", code: "LOW-HO" },
    "풀 스트레이트": { tag: "STRAIGHT", pos: "30%", en: "PullStraight", desc: "왼쪽 출발 후 직진", name: "풀 스트레이터", code: "MID-PS" },
    "풀 슬라이스": { tag: "SLICE", pos: "70%", en: "PullSlice", desc: "왼쪽 출발 후 오른쪽", name: "풀 슬라이서", code: "MID-SL" },
    드로우: { tag: "DRAW", pos: "30%", en: "Draw", desc: "가운데 출발 후 살짝 왼쪽", name: "드로우어", code: "MID-DR" },
    스트레이트: { tag: "STRAIGHT", pos: "50%", en: "Straight", desc: "가운데 출발 후 직진", name: "퍼펙트 스트레이터", code: "MID-ST" },
    페이드: { tag: "FADE", pos: "70%", en: "Fade", desc: "가운데 출발 후 살짝 오른쪽", name: "페이더", code: "MID-FA" },
    "푸시 훅": { tag: "HOOK", pos: "30%", en: "PushHook", desc: "오른쪽 출발 후 왼쪽", name: "푸시 후커", code: "MID-PH" },
    "푸시 스트레이트": { tag: "STRAIGHT", pos: "70%", en: "PushStraight", desc: "오른쪽 출발 후 직진", name: "푸시 스트레이터", code: "MID-PST" },
    "푸시 슬라이스": { tag: "SLICE", pos: "92%", en: "PushSlice", desc: "오른쪽 출발 후 더 오른쪽", name: "푸시 슬라이서", code: "HIGH-SL" },
  };

  function showToast(message) {
    toast.hidden = false;
    toast.textContent = message;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 2200);
  }

  function setLoggedIn(isLoggedIn, name = "강유나") {
    userChip.hidden = !isLoggedIn;
    userChip.textContent = `${name} 님`;
    loginLink.hidden = isLoggedIn;
    loginLink.textContent = isLoggedIn ? "" : "로그인";
  }

  function go(name) {
    Object.entries(screens).forEach(([key, el]) => {
      if (!el) return;
      const active = key === name;
      el.hidden = !active;
      el.classList.toggle("is-active", active);
      if (!active) el.classList.remove("is-ready");
    });

    if (name === "profile") {
      setLoggedIn(true, "강유나");
    } else if (name === "results") {
      setLoggedIn(true, currentMode === "guest" ? guestDraft.name : "강유나");
    } else if (name === "guest-body" || name === "guest-survey") {
      setLoggedIn(false);
    } else {
      setLoggedIn(false);
    }

    window.scrollTo({ top: 0, behavior: "smooth" });

    if (name === "results") {
      requestAnimationFrame(() => {
        screens.results.classList.add("is-ready");
        animateCounts();
      });
    }
  }

  function animateCounts() {
    document.querySelectorAll("[data-count]").forEach((el) => {
      const target = Number(el.dataset.count);
      const duration = 900;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = String(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });

    document.querySelectorAll("[data-count-decimal]").forEach((el) => {
      const target = Number(el.dataset.countDecimal);
      const duration = 1000;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (target * eased).toFixed(1);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  function requireRadio(form, name, label) {
    if (!form.querySelector(`input[name="${name}"]:checked`)) {
      showToast(`${label}을(를) 선택해 주세요.`);
      return false;
    }
    return true;
  }

  function buildGuestResult(survey) {
    const scorePack = SCORE_MAP[survey.score] || SCORE_MAP["90대"];
    const distPack = DIST_MAP[survey.driverDist] || DIST_MAP["180–210m"];
    const traj = TRAJ_MAP[survey.trajectory] || TRAJ_MAP["중간"];
    const flight = FLIGHT_MAP[survey.flight] || FLIGHT_MAP["스트레이트"];
    const launch = Math.max(8, distPack.launch + traj.launchBoost);
    const peerCarry = Math.max(100, distPack.carry - 8);
    const run = distPack.total - distPack.carry;
    const dirScore = /스트레이트|드로우|페이드/.test(survey.flight) ? 4 : 3;
    const distScore = distPack.total >= 180 ? 4 : 3;
    const trajScore = survey.trajectory === "중간" ? 5 : 4;
    const smashScore = distPack.smash >= 1.42 ? 4 : 3;
    const overall = Number(((dirScore + distScore + trajScore + smashScore) / 4).toFixed(1));

    const gbtiName =
      survey.trajectory === "중간" && survey.flight === "스트레이트"
        ? "퍼펙트 스트레이터"
        : `${traj.tag === "HIGH" ? "하이" : traj.tag === "LOW" ? "로우" : "미드"} ${flight.name}`;

    const code =
      `${traj.tag === "HIGH" ? "HI" : traj.tag === "LOW" ? "LO" : "MID"}-${flight.tag.slice(0, 2)}`;

    return {
      name: guestDraft.name,
      avgScore: scorePack.avg,
      games: [
        { date: "2025.11.18", iso: "2025-11-18", score: scorePack.games[0] },
        { date: "2025.11.10", iso: "2025-11-10", score: scorePack.games[1] },
        { date: "2025.11.03", iso: "2025-11-03", score: scorePack.games[2] },
      ],
      headSpeed: distPack.headSpeed,
      ballSpeed: distPack.ballSpeed,
      smash: distPack.smash,
      totalDist: distPack.total,
      carry: distPack.carry,
      launch,
      run,
      peerCarry,
      flightLabel: survey.flight,
      flightEn: flight.en,
      flightDesc: flight.desc,
      clubPath: survey.landing.includes("왼쪽") ? -6 : survey.landing.includes("오른쪽") ? 5 : -2,
      backspin: survey.trajectory === "높다" ? 4200 : survey.trajectory === "낮다" ? 2800 : 3500,
      overall,
      ratings: [
        { label: "구질 방향성", score: dirScore },
        { label: "비거리", score: distScore },
        { label: "탄도", score: trajScore },
        { label: "정타율", score: smashScore },
      ],
      trajPos: traj.pos,
      flightPos: flight.pos,
      trajTag: traj.tag,
      flightTag: flight.tag,
      gbtiName,
      gbtiCode: code,
      gbtiShare: "8.7%",
      gbtiDesc: `GBTI 유형 분석 결과 · ${survey.trajectory} 탄도와 ${survey.flight} 구질 조합으로 산출된 유형입니다.`,
      pros: [
        { type: "pro", text: `탄도가 ${survey.trajectory} 수준이라 코스 상황에 맞춰 거리감을 잡기 쉬워요.` },
        { type: "pro", text: `구질이 ${survey.flight}라 볼의 출발·도착 패턴을 예측하기 좋아요.` },
        {
          type: survey.landing.includes("OB") ? "tip" : "neutral",
          text: survey.landing.includes("OB")
            ? `낙하 지점이 ${survey.landing} 쪽이라 방향 안정성을 함께 보완하면 좋아요.`
            : `낙하 지점이 ${survey.landing}이라 큰 미스 패턴은 제한적이에요.`,
        },
      ],
      clubDirection: `${guestDraft.name}님의 ${survey.driverDist} 드라이버 비거리와 ${survey.ironDist} 아이언 비거리를 기준으로, 탄도·구질을 해치지 않는 스펙을 우선 추천합니다.`,
      improve: [
        { type: "pro", text: `현재 ${survey.flight} 패턴을 기준으로 일관된 셋업을 유지해 보세요.` },
        { type: "tip", text: "페이드/드로우를 의도적으로 연습하면 공략 폭이 넓어집니다." },
      ],
    };
  }

  function applyResult(data) {
    const setHtml = (key, html) => {
      const el = document.querySelector(`[data-r="${key}"]`);
      if (el) el.innerHTML = html;
    };

    setHtml(
      "gamesIntro",
      `가장 최근에 플레이하신 3경기의 데이터를 성공적으로 추출했습니다. 3경기 평균 데이터를 산출하여, <strong>${data.name}</strong>님의 샷 데이터를 정밀하게 분석하겠습니다.`
    );
    setHtml(
      "aiLead",
      `<strong>${data.name}</strong>님의 스크린 경기 결과를 분석하겠습니다. 최근 3경기 평균스코어는 <em>${data.avgScore}타</em>로, ${
        data.avgScore <= 95 ? "높은 수준의" : data.avgScore <= 105 ? "안정적인" : "성장 가능성이 큰"
      } 골프 실력을 가지고 계시네요.`
    );

    const avgEl = document.querySelector('[data-r="avgScore"]');
    if (avgEl) {
      avgEl.dataset.count = String(data.avgScore);
      avgEl.textContent = "0";
    }

    const scoreList = document.querySelector('[data-r="scoreList"]');
    if (scoreList) {
      scoreList.innerHTML = data.games
        .map(
          (g) => `<li><time datetime="${g.iso}">${g.date}</time><strong>${g.score}</strong></li>`
        )
        .join("");
    }

    setHtml("headSpeed", `${data.headSpeed} <small>m/s</small>`);
    setHtml("ballSpeed", `${data.ballSpeed} <small>m/s</small>`);
    setHtml("smash", String(data.smash));
    setHtml("totalDist", `${data.totalDist} <small>m</small>`);
    setHtml("carry", `${data.carry} <small>m</small>`);
    setHtml("launch", `${data.launch}°`);

    const diff = data.carry - data.peerCarry;
    setHtml(
      "insightSwing",
      `${data.headSpeed} m/s의 헤드스피드에 볼스피드 ${data.ballSpeed} m/s를 기록하셨고, 스매시팩터 ${data.smash}는 ${
        data.smash >= 1.42 ? "양호한" : "보통 수준의"
      } 정타율입니다. 런 포함 비거리는 ${data.totalDist} m이며, 캐리 ${data.carry} m는 동급 기준 ${data.peerCarry} m보다 <strong>${Math.abs(diff)} m ${
        diff >= 0 ? "상회" : "하회"
      }</strong>하는 수준입니다. 캐리 후에는 약 ${data.run} m의 런거리가 더해지고 있어요.`
    );

    setHtml(
      "insightFlight",
      `런치앵글(발사각도)은 ${data.launch}°로 ${
        data.launch >= 14 && data.launch <= 17 ? "이상적인" : "특성에 맞는"
      } 탄도를 보이고 계십니다. <strong>${data.flightLabel}</strong> (${data.flightDesc}) 구질이 더해져 방향성과 거리 패턴이 뚜렷합니다.`
    );

    const overallEl = document.querySelector('[data-r="overall"]');
    if (overallEl) {
      overallEl.dataset.countDecimal = String(data.overall);
      overallEl.textContent = "0.0";
    }

    const bars = document.querySelector('[data-r="ratingBars"]');
    if (bars) {
      bars.innerHTML = data.ratings
        .map(
          (r) =>
            `<li><span>${r.label}</span><div class="bar" style="--v:${r.score * 20}%"><i></i></div><strong>${r.score}</strong></li>`
        )
        .join("");
    }

    setHtml(
      "ratingNote",
      `종합적으로 구질 방향성 ${data.ratings[0].score}점, 비거리 ${data.ratings[1].score}점, 탄도 ${data.ratings[2].score}점, 정타율 ${data.ratings[3].score}점입니다. 종합평가점수는 ${data.overall}점입니다. (5점 만점)`
    );

    setHtml(
      "gbtiTitle",
      `<span class="name-accent">${data.name}</span>님은 <em>${data.gbtiName}</em> 의 골퍼시네요!`
    );
    setHtml("gbtiDesc", data.gbtiDesc);
    setHtml(
      "gbtiTags",
      `<span class="pill pill--green">${data.trajTag}</span><span class="pill pill--violet">${data.flightTag}</span>`
    );
    setHtml("gbtiFlightLabel", `${data.gbtiName} 구질`);
    setHtml(
      "gbtiStat",
      `<span class="pill pill--violet">${data.gbtiCode}</span> ${data.gbtiShare}`
    );
    setHtml("gbtiHeadSpeed", `${data.headSpeed} m/s`);
    setHtml("gbtiDist", `${data.totalDist} m`);
    setHtml("gbtiCode", data.gbtiCode);

    const trajPos = document.querySelector('[data-r="trajPos"]');
    const flightPos = document.querySelector('[data-r="flightPos"]');
    if (trajPos) trajPos.style.setProperty("--pos", data.trajPos);
    if (flightPos) flightPos.style.setProperty("--pos", data.flightPos);

    const renderList = (key, items) => {
      const el = document.querySelector(`[data-r="${key}"]`);
      if (!el) return;
      el.innerHTML = items
        .map((item) => {
          const cls = item.type === "pro" ? "is-pro" : item.type === "tip" ? "is-tip" : "is-neutral";
          const label = item.type === "pro" ? "장점" : item.type === "tip" ? "팁" : "참고";
          return `<li class="${cls}"><strong>${label}</strong> ${item.text}</li>`;
        })
        .join("");
    };

    renderList("prosCons", data.pros);
    renderList("improvePoints", data.improve);
    setHtml("clubDirection", data.clubDirection);
    setHtml(
      "fittingIntro",
      `골프존마켓 피팅전문가들이 신중하게 선정한 <strong>${data.name}</strong>님의 드라이버 피팅결과는 다음과 같습니다.`
    );
    setHtml(
      "detailSummary",
      `<li>헤드스피드 <strong>${data.headSpeed} m/s</strong> · 볼스피드 <strong>${data.ballSpeed} m/s</strong> · 스매시팩터 <strong>${data.smash}</strong></li>
       <li>구질 <strong>${data.flightEn}</strong> (${data.flightDesc}) · 캐리 <strong>${data.carry} m</strong></li>
       <li>클럽패스 <strong>${data.clubPath}°</strong> · 론치앵글 <strong>${data.launch}°</strong> · 백스핀 <strong>${data.backspin.toLocaleString()} rpm</strong></li>`
    );
  }

  document.querySelectorAll("[data-go]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      go(el.dataset.go);
    });
  });

  loginLink?.addEventListener("click", () => go("login"));

  profileForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(profileForm);
    const height = Number(data.get("height"));
    const weight = Number(data.get("weight"));
    const consent1 = profileForm.consent1.checked;
    const consent2 = profileForm.consent2.checked;

    if (!height || !weight) {
      showToast("신장과 체중을 모두 입력해 주세요.");
      return;
    }
    if (!consent1 || !consent2) {
      showToast("필수 동의 항목을 모두 체크해 주세요.");
      return;
    }

    currentMode = "self";
    applyResult(SELF_RESULT);
    showToast("AI 분석을 시작합니다…");
    setTimeout(() => go("results"), 450);
  });

  guestBodyForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(guestBodyForm);
    const name = String(data.get("guestName") || "").trim();
    const height = Number(data.get("height"));
    const weight = Number(data.get("weight"));

    if (!name) {
      showToast("고객 이름을 입력해 주세요.");
      return;
    }
    if (!height || !weight) {
      showToast("신장과 체중을 모두 입력해 주세요.");
      return;
    }

    guestDraft = { name, height, weight };
    go("guest-survey");
  });

  guestSurveyForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const checks = [
      ["gender", "성별"],
      ["age", "나이"],
      ["score", "평균 스코어"],
      ["driverDist", "드라이버 비거리"],
      ["ironDist", "아이언 비거리"],
      ["trajectory", "탄도"],
      ["flight", "구질"],
      ["landing", "낙하 지점"],
    ];

    for (const [name, label] of checks) {
      if (!requireRadio(guestSurveyForm, name, label)) return;
    }

    const formData = new FormData(guestSurveyForm);
    const survey = Object.fromEntries(formData.entries());
    currentMode = "guest";
    applyResult(buildGuestResult(survey));
    showToast(`${guestDraft.name}님 AI 분석을 시작합니다…`);
    setTimeout(() => go("results"), 450);
  });

  document.querySelectorAll(".consent summary .check").forEach((label) => {
    label.addEventListener("click", (e) => e.stopPropagation());
  });

  const tabButtons = document.querySelectorAll("[data-tab]");
  const panels = document.querySelectorAll("[data-panel]");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.tab;
      tabButtons.forEach((b) => {
        const on = b === btn;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", String(on));
      });
      panels.forEach((panel) => {
        const on = panel.dataset.panel === id;
        panel.classList.toggle("is-active", on);
        panel.hidden = !on;
      });
    });
  });

  const tocLinks = document.querySelectorAll(".result-toc a");
  const sections = [...tocLinks].map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);

  if (tocLinks.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          tocLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
    );
    sections.forEach((sec) => observer.observe(sec));
  }

  applyResult(SELF_RESULT);
  go("login");
})();
