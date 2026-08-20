/* ============================================================
   AI LAWYER - Main Application
   app.js - All Platform Functionality
   ============================================================ */
(function () {
    "use strict";

    /* ================== Core Utilities ================== */
    const $ = (s, c) => (c || document).querySelector(s);
    const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
    const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
    const money = (n) => {
        if (n == null) return "Custom quote";
        if (n === 0) return "Free";
        const str = n.toLocaleString("en-IN");
        if (n >= 100000) return "\u20B9" + (n / 100000).toLocaleString("en-IN", { maximumFractionDigits: 1 }) + "L";
        if (n >= 1000) return "\u20B9" + str;
        return "\u20B9" + str;
    };
    const store = {
        get: (k, d) => { try { const v = localStorage.getItem("ail_" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
        set: (k, v) => { try { localStorage.setItem("ail_" + k, JSON.stringify(v)); } catch (e) { } }
    };
    const seededRng = (seed) => { let s = seed; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; };

    const CATEGORY_MAP = {};
    CATEGORIES.forEach((c) => { CATEGORY_MAP[c.id] = c; });
    const langMap = {};
    LANGUAGES.forEach((l) => { langMap[l.code] = l; });

    let currentLang = "en";
    let currentUser = store.get("session", null);
    let chatState = { conversations: store.get("conversations", []), saved: store.get("saved_responses", []) };
    let bookings = store.get("bookings", []);
    let complaints = store.get("complaints", null) || SEED_COMPLAINTS.slice();
    let state = {
        lawyerFilters: { categories: new Set(["all"]), location: "", minRating: 0, feeMin: 0, feeMax: 50000, types: new Set(["private", "government", "pro-bono"]), availability: new Set(), sort: "rating", view: "grid", page: 1, perPage: 6 },
        caseFilters: { category: "", courtLevel: "", keywords: "", yearFrom: "", yearTo: "", minWin: 0, sort: "relevance", page: 1, perPage: 10, selectedCat: "" },
        courts: { userLoc: null, type: "", distance: 100, search: "", selected: null },
        constitution: { filter: "all", activeId: null, bookmarks: store.get("constitution_bookmarks", []) },
        callBot: { config: JSON.parse(JSON.stringify(CALL_BOT_CONFIG)), callsToday: 0, forwarded: 0, resolved: 0, blocked: 0, totalDuration: 0, callLog: [] },
        botRunning: false
    };

    /* ================== Toast System ================== */
    const evan = (t) => esc(t);

    const toast = (msg, type = "info", title = "") => {
        let container = $(".toast-container");
        if (!container) { container = document.createElement("div"); container.className = "toast-container"; document.body.appendChild(container); }
        const icons = { success: "fa-circle-check", error: "fa-circle-xmark", warning: "fa-triangle-exclamation", info: "fa-circle-info" };
        const t = document.createElement("div");
        t.className = "toast " + type;
        t.innerHTML = '<div class="toast-icon"><i class="fas ' + icons[type] + '"></i></div><div class="toast-text">' + (title ? "<b>" + esc(title) + "</b><br>" : "") + esc(msg) + '</div><button class="toast-close"><i class="fas fa-xmark"></i></button>';
        container.appendChild(t);
        const kill = () => { t.classList.add("out"); setTimeout(() => t.remove(), 350); };
        t.querySelector(".toast-close").addEventListener("click", kill);
        setTimeout(kill, 4200);
    };

    /* ================== Loading Screen ================== */
    function bootLoading() {
        const bar = $(".loading-progress");
        const text = $(".loading-text");
        const steps = ["Initializing Legal Intelligence...", "Loading lawyer database...", "Verifying constitutional texts...", "Preparing AI assistant...", "Ready"];
        let p = 0;
        const maxSteps = steps.length - 1;
        const iv = setInterval(() => {
            p += 7;
            if (p > 100) p = 100;
            bar.style.width = p + "%";
            text.textContent = steps[Math.min(maxSteps, Math.floor(p / 20))];
            if (p >= 100) {
                clearInterval(iv);
                setTimeout(() => {
                    const ls = $("#loading-screen");
                    ls.classList.add("hidden");
                    const main = $("#main-app");
                    if (!currentUser) {
                        $("#login-modal").classList.add("active");
                        main.classList.remove("hidden");
                    } else {
                        main.classList.remove("hidden");
                        initDashboard();
                        toast("Welcome back, " + (currentUser.name || "User") + "!", "success");
                    }
                }, 1500);
            }
        }, 50);
    }

    /* ================== Auth System ================== */
    function initAuth() {
        const emailIn = $("#email"), passIn = $("#password"), form = $("#login-form");
        let tab = "user";
        const loginRoles = { user: "Client", lawyer: "Lawyer", govt: "Government Access" };

        $$(".login-tabs .tab-btn").forEach((btn) => {
            btn.addEventListener("click", () => {
                $$(".login-tabs .tab-btn").forEach((b) => b.classList.remove("active"));
                btn.classList.add("active");
                tab = btn.dataset.tab;
                // Show extra field / messaging for lawyers
                const barGroup = $("#bar-group");
                const h1 = $(".login-header h1");
                const p = $(".login-header p");
                if (tab === "lawyer") {
                    if (barGroup) barGroup.style.display = "";
                    if (h1) h1.textContent = "Lawyer Sign In";
                    if (p) p.textContent = "Verified lawyers get Practice Session access and advanced tools.";
                    $(".btn-login").textContent = "Sign In";
                } else {
                    if (barGroup) barGroup.style.display = "none";
                    if (h1) h1.textContent = "Welcome to Nyaya Guide";
                    if (p) p.textContent = "Your Premium Legal Intelligence Platform";
                    $(".btn-login").textContent = "Sign In";
                }
            });
        });

        $(".toggle-password").addEventListener("click", () => {
            if (passIn.type === "password") { passIn.type = "text"; $(".toggle-password i").className = "fas fa-eye-slash"; }
            else { passIn.type = "password"; $(".toggle-password i").className = "fas fa-eye"; }
        });

        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = emailIn.value.trim(), pass = passIn.value;
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast("Please enter a valid email address", "error", "Invalid Input"); return; }
            if (pass.length < 4) { toast("Password must be at least 4 characters", "error", "Weak Password"); return; }
            // If lawyer login, require a bar registration value (basic validation)
            if (tab === "lawyer") {
                const barVal = $("#bar-number") ? $("#bar-number").value.trim() : "";
                if (!barVal || !/^[A-Za-z0-9\-\/\s]{3,}$/.test(barVal)) { toast("Please enter a valid Bar Council registration number", "error", "Verification required"); return; }
            }
            const btn = $(".btn-login");
            btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Verifying...';
            setTimeout(() => {
                currentUser = { name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()), email, role: loginRoles[tab], loginTime: Date.now() };
                if (tab === "lawyer") { currentUser.barNumber = $("#bar-number").value.trim(); }
                store.set("session", currentUser);
                $("#login-modal").classList.remove("active");
                $("#main-app").classList.remove("hidden");
                $("#user-dropdown").querySelector(".user-name").textContent = currentUser.name;
                $("#user-dropdown").querySelector(".user-role").textContent = currentUser.role;
                // Reveal practice FAB and nav link for lawyers; hide for others
                const fabPractice = document.querySelector('.fab-item[data-section="practice"]');
                const navPractice = document.querySelector('.nav-link[data-section="practice"]');
                const practiceSection = document.getElementById('practice');
                if (currentUser.role === 'Lawyer') {
                    if (fabPractice) fabPractice.style.display = 'flex';
                    if (navPractice) navPractice.style.display = '';
                    if (practiceSection) practiceSection.style.display = '';
                    const practiceCard = document.getElementById('practice-card');
                    if (practiceCard) practiceCard.style.display = '';
                    // refresh badge/history if function exposed
                    if (window.renderPracticeCard) window.renderPracticeCard();
                } else {
                    if (fabPractice) fabPractice.style.display = 'none';
                    if (navPractice) navPractice.style.display = 'none';
                    if (practiceSection) practiceSection.style.display = 'none';
                    const practiceCard = document.getElementById('practice-card');
                    if (practiceCard) practiceCard.style.display = 'none';
                }
                btn.disabled = false; btn.innerHTML = "Sign In";
                initDashboard();
                setTimeout(() => toast("Signed in as " + currentUser.name + " (" + currentUser.role + ")", "success", "Login Successful"), 400);
            }, 900);
        });

        $("#signup-link").addEventListener("click", (e) => {
            e.preventDefault();
            const h1 = $(".login-header h1"), p = $(".login-header p");
            const link = $("#signup-link");
            const prompt = link.parentElement; // <p class="signup-prompt">New here? <a id="signup-link">Create Account</a></p>
            if (h1.textContent === "Welcome to AI Lawyer") {
                // switch to registration view
                h1.textContent = "Create Your Account";
                p.textContent = "Join the platform in seconds";
                $(".btn-login").textContent = "Create Account";
                $(".forgot-password").style.display = "none";
                // update bottom prompt to offer Sign In
                if (prompt && prompt.firstChild) prompt.firstChild.nodeValue = "Already have an account? ";
                link.textContent = "Sign In";
            } else {
                // switch back to login view
                h1.textContent = "Welcome to AI Lawyer";
                p.textContent = "Your Premium Legal Intelligence Platform";
                $(".btn-login").textContent = "Sign In";
                $(".forgot-password").style.display = "";
                // update bottom prompt to offer Create Account
                if (prompt && prompt.firstChild) prompt.firstChild.nodeValue = "New here? ";
                link.textContent = "Create Account";
            }
        });

        $("#logout-btn").addEventListener("click", () => {
            currentUser = null;
            store.set("session", null);
            $("#main-app").classList.add("hidden");
            $("#login-modal").classList.add("active");
            $("#user-dropdown").classList.remove("open");
            // Hide practice when signed out
            const fabPractice = document.querySelector('.fab-item[data-section="practice"]');
            const navPractice = document.querySelector('.nav-link[data-section="practice"]');
            const practiceSection = document.getElementById('practice');
            const practiceCard = document.getElementById('practice-card');
            if (fabPractice) fabPractice.style.display = 'none';
            if (navPractice) navPractice.style.display = 'none';
            if (practiceSection) practiceSection.style.display = 'none';
            if (practiceCard) practiceCard.style.display = 'none';
            toast("You have been signed out", "info", "See you soon");
        });

        if (currentUser) {
            $("#user-dropdown").querySelector(".user-name").textContent = currentUser.name;
            $("#user-dropdown").querySelector(".user-role").textContent = currentUser.role;
        }
    }

    /* ================== Navigation ================== */
    function initNav() {
        const links = $$(".nav-link");
        const showSection = (id) => {
            $$(".content-section").forEach((s) => s.classList.remove("active"));
            const target = $(id);
            if (target) target.classList.add("active");
            links.forEach((l) => { l.classList.toggle("active", l.dataset.section === id.replace("#", "")); });
            $(".nav-list").classList.remove("mobile-open");
            $(".mobile-menu-btn") && $(".mobile-menu-btn").classList.remove("active");
            window.scrollTo({ top: 0, behavior: "smooth" });
            if (id === "#dashboard") initDashboard();
        };
        links.forEach((l) => l.addEventListener("click", (e) => { e.preventDefault(); showSection(l.dataset.section ? "#" + l.dataset.section : l.getAttribute("href")); }));
        $$(".action-btn[data-section], .fab-item[data-section]").forEach((a) => a.addEventListener("click", () => showSection("#" + a.dataset.section)));
        $$(".view-all").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); showSection("#lawyers"); }));

        $(".mobile-menu-btn").addEventListener("click", () => {
            $("#nav-list").classList.toggle("mobile-open");
            $(".mobile-menu-btn").classList.toggle("active");
        });

        // user dropdown
        $("#user-menu-btn").addEventListener("click", (e) => { e.stopPropagation(); $("#user-dropdown").classList.toggle("open"); });
        document.addEventListener("click", (e) => { if (!e.target.closest(".user-menu")) $("#user-dropdown").classList.remove("open"); });
        $$(".dropdown-item[href]").forEach((a) => a.addEventListener("click", (e) => {
            e.preventDefault();
            $("#user-dropdown").classList.remove("open");
            if (a.getAttribute("href") === "#profile") { toast("Profile editing coming in the next update", "info"); return; }
            if (a.getAttribute("href") === "#billing") { toast("Billing history is managed by your wallet provider", "info"); return; }
            openSettingsPanel(a.getAttribute("href").replace("#", ""));
        }));

        // FAB
        $("#fab-main").addEventListener("click", () => $("#fab-menu").classList.toggle("open"));
        document.addEventListener("click", (e) => { if (!e.target.closest(".fab")) $("#fab-menu").classList.remove("open"); });

        // generic modal closes
        $$(".modal-backdrop, .modal-close").forEach((el) => {
            el.addEventListener("click", () => {
                const modal = el.closest(".modal");
                if (modal) {
                    modal.classList.remove("active");
                    if (modal.id === "lawyer-profile-modal") resetProfileModal();
                }
            });
        });

        currentSection = (id) => showSection(id);
    }
    let currentSection = null;

    /* ================== Dashboard ================== */
    const RECENT_CASE_POOL = [
        { title: "Sharma v. State (Criminal Appeal)", cat: "criminal", meta: "Tis Hazari Court - Next hearing Fri", icon: "fa-gavel" },
        { title: "Property Dispute - Saket Row", cat: "civil", meta: "Saket District Court - Written Statement filed", icon: "fa-file-signature" },
        { title: "Cheque Bounce Petition No. 138/2026", cat: "criminal", meta: "185th MM - Evidence stage", icon: "fa-money-bill-wave" },
        { title: "Maintenance Application under Section 125", cat: "family", meta: "Family Court Dwarka - Interim order passed", icon: "fa-people-roof" },
        { title: "Consumer Complaint - Flat Delay", cat: "consumer", meta: "District Commission - Rejoinder filed", icon: "fa-building-circle-exclamation" },
        { title: "GST Appeal - ITC Reversal", cat: "tax", meta: "CESTAT - Stay granted", icon: "fa-file-invoice-dollar" }
    ];

    function initDashboard() {
        $("#active-cases").textContent = 3 + (bookings.length % 2);
        $("#saved-lawyers").textContent = store.get("saved_lawyers", []).length;
        $("#upcoming-meetings").textContent = bookings.length + 2;
        $("#total-spent").textContent = money(125000 + bookings.length * 2500);
        const cl = $("#recent-cases-list");
        cl.innerHTML = RECENT_CASE_POOL.slice(0, 4).map((c, i) =>
            '<div class="mini-case">' +
            '<div class="mini-case-icon"><i class="fas ' + c.icon + '"></i></div>' +
            '<div class="mini-case-info"><div class="mini-case-title">' + esc(c.title) + '</div><div class="mini-case-meta">' + esc(c.meta) + "</div></div>" +
            '<span class="lc-badge ' + (c.cat === "criminal" ? "private" : c.cat === "family" ? "pro-bono" : "government") + '">' + esc(CATEGORY_MAP[c.cat] ? CATEGORY_MAP[c.cat].name : c.cat) + "</span>" +
            "</div>").join("");

        const rec = $("#recommended-lawyers");
        rec.innerHTML = LAWYERS.slice(0, 4).map((l) =>
            '<div class="mini-lawyer" data-lid="' + l.id + '" style="cursor:pointer">' +
            '<img src="' + l.avatar + '" alt="' + esc(l.name) + '">' +
            "<div><div class=\"mini-lawyer-name\">" + esc(l.name) + "</div><div class=\"mini-lawyer-meta\">" + esc(l.specializations[0]) + " - " + l.experience + " yrs</div></div>" +
            '<span class="mini-lawyer-stars"><i class="fas fa-star"></i> ' + l.rating.toFixed(1) + "</span></div>").join("");
        $$("#recommended-lawyers .mini-lawyer").forEach((el) => el.addEventListener("click", () => openLawyerProfile(el.dataset.lid)));
    }

    /* ================== Lawyers: computed stats & history ================== */
    function lawyerCaseHistory(lw) {
        const rng = seededRng(parseInt(lw.id.replace(/\D/g, ""), 10) || 42);
        const pool = COURT_CASES.filter((c) => lw.categories.includes(c.category));
        const yearsActive = 2026 - (2026 - lw.experience + 2000) + 1990;
        const count = 8 + Math.floor(rng() * 8); // 8-15 cases
        const maxYear = 2026 - Math.floor(rng() * 2);
        const minYear = maxYear - Math.floor((lw.experience) * 1.25);
        const cats = lw.categories;
        const cases = [];
        const yearSpan = Math.max(2, maxYear - minYear);
        for (let i = 0; i < count; i++) {
            const cat = cats[Math.floor(rng() * cats.length)];
            const template = pool.filter((c) => c.category === cat);
            let title, court, courtLevel, year;
            if (template.length && rng() < 0.6) {
                const t = template[Math.floor(rng() * template.length)];
                title = t.title; court = t.court; courtLevel = t.courtLevel;
            } else {
                title = CATEGORY_CASES[cat][Math.floor(rng() * CATEGORY_CASES[cat].length)];
                const levels = cat === "consumer" ? ["District Consumer Forum", "State Consumer Commission"] : cat === "constitutional" ? ["High Court", "Supreme Court"] : cat === "environment" ? ["NGT", "District Court"] : ["District Court", "High Court"];
                court = levels[Math.floor(rng() * levels.length)];
                courtLevel = (i * 7) % 2 === 0 ? "district" : "high-court";
            }
            year = minYear + Math.floor(rng() * Math.max(2, yearSpan));
            const roll = rng();
            let result = "pending";
            let role = "Counsel for " + (roll > 0.85 ? "Opponent" : "Petitioner");
            if (lw.type === "government" && rng() < 0.3) role = "State Counsel / Govt Pleader";
            if (year < maxYear) {
                const winChance = lw.rating / 5.2;
                result = roll < winChance * 0.86 ? "won" : roll < winChance * 0.86 + 0.12 ? "lost" : "pending";
                if (roll < winChance * 0.86 + 0.06) role = "Senior / Lead Counsel";
            }
            cases.push({ id: "ch-" + lw.id + "-" + i, title, category: cat, court, courtLevel, year, result, role });
        }
        return cases.sort((a, b) => b.year - a.year);
    }

    const CATEGORY_CASES = {
        criminal: ["State v. Accused (Theft case)", "Bail Application - Session Court", "Cheating & Forgery Trial", "NDPS Possession Case", "Downy demand case (498A)", "Public servant bribery trial"],
        civil: ["Suit for recovery of money", "Specific performance of contract", "Partition suit - ancestral property", "Injunction - encroachment", "Breach of lease agreement", "Defamation suit"],
        family: ["Divorce petition (mutual consent)", "Divorce petition (contested)", "Child custody application", "Maintenance application", "Restitution of conjugal rights", "Guardianship petition"],
        corporate: ["Shareholders' dispute arbitration", "Share purchase agreement dispute", "Board resolution challenge", "Brand licensing breach", "Debenture default recovery", "Minority oppression petition"],
        constitutional: ["Writ petition - service matter", "PIL - fundamental rights", "Writ - illegal detention", "Challenge to state notification", "Habeas corpus petition"],
        consumer: ["Flat possession delay complaint", "Insurance claim repudiation", "Medical negligence complaint", "Defective goods complaint", "Loan recovery harassment", "Brokerage misconduct"],
        labor: ["Wrongful termination claim", "EPF dues recovery", "ESI coverage dispute", "Industrial dispute reference", "Notice pay recovery"],
        tax: ["Income tax appeal - ITAT", "GST input credit reversal", "Service tax demand appeal", "Assessment order challenge", "TP adjustment appeal"],
        ipr: ["Copyright infringement suit", "Trademark passing off", "Patent revocation petition", "Design piracy complaint", "Geographical indication dispute"],
        environment: ["Pollution complaint - NGT", "Environmental clearance challenge", "Coastal zone violation", "Industrial effluent case", "Land acquisition compensation"]
    };

    function lawyerStats(lw) {
        const cases = lawyerCaseHistory(lw);
        const decided = cases.filter((c) => c.result !== "pending");
        const won = decided.filter((c) => c.result === "won").length;
        const lost = decided.filter((c) => c.result === "lost").length;
        const pending = cases.length - decided.length;
        const winRate = decided.length ? Math.round((won / decided.length) * 100) : 0;
        const breakdown = {};
        cases.forEach((c) => { breakdown[c.category] = breakdown[c.category] || { total: 0, won: 0 }; breakdown[c.category].total++; if (c.result === "won") breakdown[c.category].won++; });
        return { cases, won, lost, pending, winRate, decided: decided.length, total: cases.length, breakdown };
    }

    /* ================== Lawyers: listing & filters ================== */
    function initLawyers() {
        const chips = $("#category-chips");
        chips.innerHTML = CATEGORIES.map((c, i) => '<button class="filter-chip' + (i === 0 ? " active" : "") + '" data-cat="' + c.id + '">' + (c.id === "all" ? "" : '<i class="fas ' + c.icon + '"></i> ') + c.name + "</button>").join("");
        $$("#category-chips .filter-chip").forEach((chip) => chip.addEventListener("click", () => {
            const cat = chip.dataset.cat;
            if (cat === "all") {
                state.lawyerFilters.categories = new Set(["all"]);
                $$("#category-chips .filter-chip").forEach((c) => c.classList.toggle("active", c === chip));
            } else {
                state.lawyerFilters.categories.delete("all");
                chip.classList.toggle("active");
                if (chip.classList.contains("active")) state.lawyerFilters.categories.add(cat);
                else state.lawyerFilters.categories.delete(cat);
                if (!state.lawyerFilters.categories.size) { state.lawyerFilters.categories.add("all"); $$("#category-chips .filter-chip").forEach((c) => c.classList.toggle("active", c.dataset.cat === "all")); }
            }
            state.lawyerFilters.page = 1;
            renderLawyers();
        }));

        $("#location-filter").addEventListener("input", (e) => {
            state.lawyerFilters.location = e.target.value;
            const box = $("#location-suggestions");
            const q = e.target.value.trim().toLowerCase();
            if (!q) { box.classList.remove("visible"); renderLawyers(); return; }
            const sugg = LAWYERS.map((l) => l.location.city + ", " + l.location.state).filter((v, i, a) => a.indexOf(v) === i && (v.toLowerCase().includes(q) || v.toLowerCase().replace("new delhi", "delhi").includes(q)));
            box.innerHTML = sugg.slice(0, 4).map((s) => "<div>" + esc(s) + "</div>").join("");
            box.classList.add("visible");
            $$("#location-suggestions div").forEach((d) => d.addEventListener("click", () => { $("#location-filter").value = d.textContent; box.classList.remove("visible"); state.lawyerFilters.location = d.textContent; renderLawyers(); }));
            renderLawyers();
        });
        document.addEventListener("click", (e) => { if (!e.target.closest(".filter-section:nth-of-type(2)")) $("#location-suggestions").classList.remove("visible"); });

        $("#rating-slider").addEventListener("input", (e) => {
            const v = parseFloat(e.target.value);
            $("#rating-value").textContent = v === 0 ? "Any Rating" : v + " +";
            state.lawyerFilters.minRating = v;
            renderLawyers();
        });
        const f = (id, bind) => $(id).addEventListener("input", (e) => { bind(parseInt(e.target.value, 10)); $("#" + f.idx + "value").textContent = money(parseInt(e.target.value, 10)); renderLawyers(); });
        (function () {
            const sync = () => {
                const a = parseInt($("#fee-min").value, 10), b = parseInt($("#fee-max").value, 10);
                if (a >= b) { $("#fee-min").value = b > 0 ? b - 5000 : 0; }
                $("#fee-min-value").textContent = money(parseInt($("#fee-min").value, 10));
                $("#fee-max-value").textContent = money(parseInt($("#fee-max").value, 10)) + "<span>+</span>";
            };
            $("#fee-min").addEventListener("input", () => { sync(); state.lawyerFilters.feeMin = parseInt($("#fee-min").value, 10); renderLawyers(); });
            $("#fee-max").addEventListener("input", () => { sync(); state.lawyerFilters.feeMax = parseInt($("#fee-max").value, 10); renderLawyers(); });
            sync();
        })();

        $$('input[name="lawyer-type"]').forEach((el) => el.addEventListener("change", () => {
            const set = new Set();
            $$('input[name="lawyer-type"]:checked').forEach((x) => set.add(x.value));
            state.lawyerFilters.types = set;
            renderLawyers();
        }));
        [["#available-now", "online"], ["#available-today", "today"], ["#available-week", "week"]].forEach(([id, key]) => {
            $(id).addEventListener("change", () => {
                if ($(id).checked) state.lawyerFilters.availability.add(key); else state.lawyerFilters.availability.delete(key);
                renderLawyers();
            });
        });
        $("#sort-by").addEventListener("change", (e) => { state.lawyerFilters.sort = e.target.value; renderLawyers(); });
        $("#clear-filters").addEventListener("click", () => {
            state.lawyerFilters = { categories: new Set(["all"]), location: "", minRating: 0, feeMin: 0, feeMax: 50000, types: new Set(["private", "government", "pro-bono"]), availability: new Set(), sort: "rating", page: 1, perPage: 6 };
            $$("#category-chips .filter-chip").forEach((c) => c.classList.toggle("active", c.dataset.cat === "all"));
            $("#location-filter").value = ""; $("#rating-slider").value = 0; $("#rating-value").textContent = "Any Rating";
            $("#fee-min").value = 0; $("#fee-max").value = 50000;
            $("#fee-min-value").textContent = "\u20B90"; $("#fee-max-value").textContent = "\u20B950,000+";
            $$('input[name="lawyer-type"]').forEach((el) => el.checked = true);
            $$("#available-now, #available-today, #available-week").forEach((el) => el.checked = false);
            $("#sort-by").value = "rating";
            renderLawyers();
        });
        $$(".view-btn").forEach((b) => b.addEventListener("click", () => {
            $$(".view-btn").forEach((x) => x.classList.remove("active"));
            b.classList.add("active");
            state.lawyerFilters.view = b.dataset.view;
            renderLawyers();
        }));
        renderLawyers();
    }

    function filteredLawyers() {
        const f = state.lawyerFilters;
        let list = LAWYERS.filter((l) => {
            if (!f.types.has(l.type)) return false;
            if (f.availability.size && !f.availability.has(l.availabilityStatus)) return false;
            if (f.minRating > 0 && l.rating < f.minRating) return false;
            const consult = (l.fees.consultation && l.fees.consultation.amount) || 0;
            if (consult < f.feeMin || consult > f.feeMax) return false;
            if (f.location && !(l.location.city + " " + l.location.state + " " + l.location.area + " " + l.location.pin).toLowerCase().includes(f.location.trim().toLowerCase())) return false;
            if (!f.categories.has("all")) { const inter = [...f.categories].some((c) => l.categories.includes(c)); if (!inter) return false; }
            return true;
        });
        const stats = list.map((l) => { const s = lawyerStats(l); return { l, s }; });
        switch (f.sort) {
            case "rating": stats.sort((a, b) => b.l.rating - a.l.rating || b.l.reviewCount - a.l.reviewCount); break;
            case "win-rate": stats.sort((a, b) => b.s.winRate - a.s.winRate); break;
            case "experience": stats.sort((a, b) => b.l.experience - a.l.experience); break;
            case "fee-low": stats.sort((a, b) => (a.l.fees.consultation.amount || 0) - (b.l.fees.consultation.amount || 0)); break;
            case "fee-high": stats.sort((a, b) => (b.l.fees.consultation.amount || 0) - (a.l.fees.consultation.amount || 0)); break;
            case "recent": stats.sort((a, b) => b.l.experience - a.l.experience); break;
        }
        return stats;
    }

    function availLabel(l) {
        const map = { online: ["online", "Available Now"], today: ["today", "Available Today"], week: ["week", "Available This Week"], unavailable: ["unavailable", "Unavailable"] };
        const m = map[l.availabilityStatus] || map.unavailable;
        return '<span class="availability-dot ' + m[0] + '"></span>' + m[1];
    }

    function renderLawyers() {
        const stats = filteredLawyers();
        const total = stats.length;
        const pp = state.lawyerFilters.perPage;
        const pages = Math.max(1, Math.ceil(total / pp));
        state.lawyerFilters.page = Math.min(state.lawyerFilters.page, pages);
        const page = state.lawyerFilters.page;
        const slice = stats.slice((page - 1) * pp, page * pp);
        $("#results-count").textContent = total;
        const grid = $("#lawyers-grid");
        grid.className = "lawyers-grid" + (state.lawyerFilters.view === "list" ? " list-view" : "");
        const savedSet = new Set(store.get("saved_lawyers", []));
        grid.innerHTML = slice.map(({ l, s }, i) => {
            const catName = CATEGORY_MAP[l.categories[0]] ? CATEGORY_MAP[l.categories[0]].name : l.categories[0];
            const fee = money(l.fees.consultation.amount);
            return '<article class="lawyer-card stagger" data-lid="' + l.id + '" style="animation-delay:' + (i * 0.05) + 's">' +
                '<div class="lawyer-card-header">' +
                '<img src="' + l.avatar + '" alt="' + esc(l.name) + '">' +
                '<div class="lc-info">' +
                '<span class="lc-cat">' + esc(catName) + "</span><br>" +
                '<span class="lc-name">' + esc(l.name) + '</span><div class="lc-loc"><i class="fas fa-map-marker-alt"></i> ' + esc(l.location.city + ", " + l.location.state) + "</div>" +
                '<div class="stars">' + renderStars(l.rating) + "</div>" +
                "</div>" +
                '<span class="lc-badge ' + l.type + '">' + esc(l.type === "private" ? "Private" : l.type === "government" ? "Government" : "Pro Bono") + "</span></div>" +
                '<div class="lawyer-card-body"><div class="lc-tags">' + l.specializations.slice(0, 3).map((s) => "<span class=\"lc-tag\">" + esc(s) + "</span>").join("") + "</div></div>" +
                '<div class="lawyer-card-stats">' +
                '<div class="lc-stat"><span>' + s.winRate + "</span><label>Win Rate</label></div>" +
                '<div class="lc-stat"><span>' + l.experience + " yrs</span><label>Experience</label></div>" +
                '<div class="lc-stat"><span class="stars" style="font-size:11px">' + renderStars(l.rating) + '</span><label>' + l.rating.toFixed(1) + " (" + l.reviewCount + ")</label></div>" +
                "</div>" +
                '<div class="lawyer-card-footer">' +
                '<button class="btn btn-secondary btn-sm" data-lid="' + l.id + '" data-action="profile"><i class="fas fa-user-tie"></i> Profile</button>' +
                '<button class="btn btn-primary btn-sm" data-lid="' + l.id + '" data-action="book"><i class="fas fa-calendar-plus"></i> Book</button>' +
                '</div><div class="lawyer-card-body" style="padding:8px 20px 14px;font-size:12px;color:var(--text-2)"><i class="fas fa-hourglass-half" style="margin-right:5px"></i>Consultation ' + fee + " &nbsp;&bull;&nbsp; " + availLabel(l) + "</div></article>";
        }).join("");

        $$("#lawyers-grid [data-action]").forEach((btn) => btn.addEventListener("click", (e) => {
            e.stopPropagation();
            const id = btn.dataset.lid;
            if (btn.dataset.action === "profile") openLawyerProfile(id);
            else openBookingModal(id);
        }));
        $$("#lawyers-grid .lawyer-card").forEach((card) => card.addEventListener("click", (e) => { if (!e.target.closest("button")) openLawyerProfile(card.dataset.lid); }));

        const pg = $("#pagination");
        pg.innerHTML = "";
        const mk = (label, p, disabled, active) => '<button class="page-btn' + (active ? " active" : "") + (disabled ? " disabled" : "") + '" data-page="' + p + '">' + label + "</button>";
        pg.innerHTML = mk('<i class="fas fa-chevron-left"></i>', page - 1, page === 1, false) + Array.from({ length: pages }, (_, k) => mk(k + 1, k + 1, false, k + 1 === page)).join("") + mk('<i class="fas fa-chevron-right"></i>', page + 1, page === pages, false);
        $$("#pagination .page-btn:not(.disabled)").forEach((b) => b.addEventListener("click", () => { state.lawyerFilters.page = parseInt(b.dataset.page, 10); renderLawyers(); window.scrollTo({ top: 0, behavior: "smooth" }); }));
        if (!total) grid.innerHTML = '<div class="empty-state"><i class="fas fa-user-slash"></i><p>No lawyers match your filters. Try removing some filters.</p></div>';
    }

    function renderStars(rating) {
        let out = "";
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) out += '<i class="fas fa-star"></i>';
            else if (rating >= i - 0.5) out += '<i class="fas fa-star-half-alt"></i>';
            else out += '<i class="far fa-star"></i>';
        }
        return out;
    }

    /* ================== Lawyer Profile Modal ================== */
    let activeLawyer = null;
    let selectedSlot = null;

    function openLawyerProfile(id) {
        const lw = LAWYERS.find((l) => l.id === id);
        if (!lw) return;
        activeLawyer = lw;
        selectedSlot = null;
        $("#profile-avatar").src = lw.avatar;
        $("#profile-name").textContent = lw.name;
        const badge = $("#profile-type-badge");
        badge.textContent = lw.type === "private" ? "Private" : lw.type === "government" ? "Govt Lawyer" : "Pro Bono";
        badge.className = "profile-type-badge " + lw.type;
        $("#profile-category").textContent = lw.categories.map((c) => CATEGORY_MAP[c].name).join(" | ");
        $("#profile-location").innerHTML = '<i class="fas fa-map-marker-alt"></i> ' + esc(lw.location.area + ", " + lw.location.city + " - " + lw.location.pin);
        $("#profile-experience").innerHTML = '<i class="fas fa-briefcase"></i> ' + lw.experience + " years experience";
        $("#profile-stars").innerHTML = renderStars(lw.rating);
        $("#profile-rating-value").textContent = lw.rating.toFixed(1);
        $("#profile-review-count").textContent = "(" + lw.reviewCount + " reviews)";
        const savedSet = new Set(store.get("saved_lawyers", []));
        $("#save-lawyer").innerHTML = savedSet.has(lw.id) ? '<i class="fas fa-bookmark"></i> Saved' : '<i class="fas fa-bookmark"></i> Save';
        renderProfileTab("overview");
        $$(".profile-tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === "overview"));
        $("#lawyer-profile-modal").classList.add("active");
    }

    function resetProfileModal() { activeLawyer = null; selectedSlot = null; }

    function renderProfileTab(tabId) {
        if (!activeLawyer) return;
        $$(".profile-tab").forEach((t) => t.classList.toggle("active", t.dataset.tab === tabId));
        $$(".tab-panel").forEach((p) => p.classList.remove("active"));
        $("#tab-" + tabId).classList.add("active");
        if (tabId === "cases") renderProfileCases();
        if (tabId === "fees") renderProfileFees();
        if (tabId === "availability") renderProfileAvailability();
        if (tabId === "reviews") renderProfileReviews();
    }

    function renderProfileCases() {
        const lw = activeLawyer, s = lawyerStats(lw);
        $("#total-cases").textContent = s.total;
        $("#won-cases").textContent = s.won;
        $("#lost-cases").textContent = s.lost;
        $("#pending-cases").textContent = s.pending;
        $("#win-rate").textContent = s.winRate + "%";
        $("#case-breakdown").innerHTML = Object.keys(s.breakdown).map((cat) => {
            const b = s.breakdown[cat];
            const pct = Math.round(((b.won / b.total) * 100) || 0);
            const c = CATEGORY_MAP[cat];
            return '<div class="breakdown-item"><div class="bd-label"><i class="fas ' + c.icon + '"></i> ' + c.name + '</div><div class="bd-bar"><span style="width:' + pct + '%"></span></div><div class="bd-pct">' + b.won + "/" + b.total + " won (" + pct + "%)</div></div>";
        }).join("") || '<div class="empty-state"><p>No case breakdown available</p></div>';
        $("#cases-table-body").innerHTML = s.cases.map((c) =>
            "<tr><td><b>" + esc(c.title) + "</b></td><td>" + esc(CATEGORY_MAP[c.category] ? CATEGORY_MAP[c.category].name : c.category) + "</td><td>" + esc(c.court) + "</td><td>" + c.year + "</td><td><span class=\"result-badge " + c.result + "\">" + c.result.toUpperCase() + "</span></td><td>" + esc(c.role) + "</td></tr>").join("");
    }

    function renderProfileFees() {
        const f = activeLawyer.fees;
        const items = [
            { icon: "fa-comments", title: "Consultation", amt: f.consultation, note: f.consultation.note },
            { icon: "fa-gavel", title: "Per Hearing", amt: f.hearing, note: f.hearing.note },
            { icon: "fa-handshake", title: "Retainer", amt: f.retainer, note: f.retainer ? f.retainer.note : "Not offered" },
            { icon: "fa-percent", title: "Contingency", amt: f.contingency, note: f.contingency ? "Optional success fee: " + f.contingency + "% of recovered amount - " + f.contingency.note : "Not offered" },
            { icon: "fa-file-lines", title: "Documents", amt: f.document, note: f.document.note }
        ].filter((i) => i.amt);
        $("#fee-structure").innerHTML = items.map((i) =>
            '<div class="fee-card"><h4><i class="fas ' + i.icon + '"></i> ' + i.title + '</h4><div class="fee-amount">' + (i.amt && i.amt.amount ? money(i.amt.amount) : "Custom") + (i.amt && i.amt.amount === 0 ? "" : "") + '</div><div class="fee-note"><i class="fas fa-circle-info"></i>' + esc(i.note) + "</div></div>").join("");
    }

    function renderProfileAvailability() {
        const lw = activeLawyer;
        const now = new Date();
        const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        $("#availability-calendar").innerHTML = lw.slots.map((n, i) => {
            const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
            const key = d.toDateString();
            return '<div class="avail-slot' + (selectedSlot === key ? " selected" : "") + '" data-day="' + now.toISOString().slice(0, 7) + "-" + d.getDate() + '" data-key="' + key + '">' +
                '<div class="av-date">' + labels[d.getDay()] + ", " + d.getDate() + " " + d.toLocaleString("en", { month: "short" }) + "</div>" +
                '<div class="av-time">' + n + " slot" + (n === 1 ? "" : "s") + " available</div>" +
                '<div class="av-select"><i class="fas fa-check-circle"></i> Selected</div></div>';
        }).join("");
        $$("#availability-calendar .avail-slot").forEach((el) => el.addEventListener("click", () => {
            $$("#availability-calendar .avail-slot").forEach((x) => x.classList.remove("selected"));
            el.classList.add("selected");
            selectedSlot = el.dataset.key;
        }));
        if (state.botRunning) return;
    }

    function renderProfileReviews() {
        $("#reviews-list").innerHTML = activeLawyer.reviews.map((r) =>
            '<div class="review-card"><div class="review-head">' +
            '<img src="https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(r.name) + '" alt="' + esc(r.name) + '">' +
            '<div><div class="rv-name">' + esc(r.name) + '</div><div class="rv-cat">' + esc(r.category) + "</div></div>" +
            '<span class="stars" style="font-size:11px">' + renderStars(r.rating) + "</span>" +
            '<span class="rv-date">' + esc(r.date) + "</span></div>" +
            "<p>" + esc(r.text) + "</p></div>").join("");
    }

    $$(".profile-tab").forEach((t) => t.addEventListener("click", () => renderProfileTab(t.dataset.tab)));
    $("#save-lawyer").addEventListener("click", () => {
        if (!activeLawyer) return;
        const set = new Set(store.get("saved_lawyers", []));
        if (set.has(activeLawyer.id)) { set.delete(activeLawyer.id); $("#save-lawyer").innerHTML = '<i class="fas fa-bookmark"></i> Save'; toast(activeLawyer.name + " removed from saved list", "info", "Removed"); }
        else { set.add(activeLawyer.id); $("#save-lawyer").innerHTML = '<i class="fas fa-bookmark"></i> Saved'; toast(activeLawyer.name + " added to your saved lawyers", "success", "Saved"); }
        store.set("saved_lawyers", [...set]);
    });
    $("#share-lawyer").addEventListener("click", () => {
        if (!activeLawyer) return;
        const data = { title: activeLawyer.name, text: "Check out " + activeLawyer.name + " on AI Lawyer - rated " + activeLawyer.rating + "/5 with " + activeLawyer.experience + " years experience.", url: location.href };
        if (navigator.share) navigator.share(data).catch(() => { });
        else { navigator.clipboard.writeText(data.text + " " + data.url).then(() => toast("Profile link copied to clipboard", "success", "Copied!")).catch(() => toast("Share not supported in this browser", "warning")); }
    });
    $("#book-consultation").addEventListener("click", () => { if (activeLawyer) openBookingModal(activeLawyer.id); });

    /* ================== Booking / Scheduler ================== */
    function openBookingModal(id) {
        const lw = LAWYERS.find((l) => l.id === id);
        if (!lw) return;
        if (!currentUser) { $("#login-modal").classList.add("active"); toast("Please sign in to book a consultation", "warning"); return; }
        const overlay = document.createElement("div");
        overlay.className = "modal booking-modal";
        const now = new Date();
        const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const times = ["10:00 AM", "11:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"];
        const daysHTML = lw.slots.map((n, i) => {
            const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
            const slots = times.slice(0, Math.max(0, n));
            return '<div class="schedule-day"><div class="sd-date">' + labels[d.getDay()] + ", " + d.getDate() + " " + d.toLocaleString("en", { month: "short" }) + "</div>" +
                '<div class="sd-slots">' + n + " open</div>" +
                slots.map((t, k) => '<button class="sd-slot-chip" data-day="' + d.toDateString() + '" data-time="' + t + (k % 2 ? '" data-taken="1"' : '"') + ">" + t + "</button>").join("") +
                (n === 0 ? '<div class="sd-slot-chip taken">Full day</div>' : "") + "</div>";
        }).join("");
        overlay.innerHTML = '<div class="modal-backdrop"></div><div class="modal-content" style="max-width:640px;padding-bottom:26px">' +
            '<div class="modal-header"><h2><i class="fas fa-calendar-plus" style="color:var(--indigo);margin-right:8px"></i>Book Consultation</h2><button class="modal-close"><i class="fas fa-times"></i></button></div>' +
            '<div style="padding:24px 28px"><div class="booking-summary">' +
            '<div class="bs-row"><span>Lawyer</span><b>' + esc(lw.name) + "</b></div>" +
            '<div class="bs-row"><span>Type</span><b>' + (lw.type === "private" ? "Private" : lw.type === "government" ? "Government" : "Pro Bono") + "</b></div>" +
            '<div class="bs-row"><span>Consultation Fee</span><b>' + money(lw.fees.consultation.amount) + "</b></div>" +
            '<div class="bs-row rs-select-row"><span>Session</span><b style="color:var(--indigo)" id="bs-session">Select a slot below</b></div>' +
            '<div class="bs-row bs-total"><span>Total (incl. platform fee)</span><b>' + (money((lw.fees.consultation.amount || 0) + 199)) + "</b></div></div>" +
            "<h4 style='margin-bottom:12px;color:var(--primary-dark)'>Choose Date &amp; Time <span style='font-size:12px;color:var(--text-3);font-weight:400'>- Real-time availability</span></h4>" +
            '<div class="schedule-calendar">' + daysHTML + "</div>" +
            '<div class="form-row" style="grid-template-columns:1fr 1fr;margin-top:18px">' +
            '<div class="form-group"><label>Your Full Name</label><input type="text" id="bk-name" placeholder="e.g. Rahul Sharma" value="' + esc(currentUser.name) + '"></div>' +
            '<div class="form-group"><label>Phone Number</label><input type="tel" id="bk-phone" placeholder="10-digit mobile"></div></div>' +
            '<button class="btn btn-primary" style="width:100%;padding:13px;margin-top:8px" id="bk-confirm" disabled><i class="fas fa-check-circle"></i> Confirm Booking</button>' +
            "</div></div>";
        document.body.appendChild(overlay);
        overlay.classList.add("active");
        overlay.querySelector(".modal-close").addEventListener("click", () => { overlay.classList.remove("active"); setTimeout(() => overlay.remove(), 350); });
        overlay.querySelector(".modal-backdrop").addEventListener("click", () => { overlay.classList.remove("active"); setTimeout(() => overlay.remove(), 350); });
        let chosen = null;
        $$(".sd-slot-chip", overlay).forEach((chip) => chip.addEventListener("click", () => {
            $$(".sd-slot-chip", overlay).forEach((c) => c.style.background = "");
            chosen = { day: chip.dataset.day, time: chip.dataset.time };
            chip.style.background = "var(--primary)";
            chip.style.color = "#fff";
            $("#bs-session", overlay).textContent = chosen.day + " at " + chosen.time;
            const valid = $("#bk-phone", overlay).value.replace(/\D/g, "").length >= 10;
            $("#bk-confirm", overlay).disabled = !valid;
        }));
        $("#bk-phone", overlay).addEventListener("input", (e) => { $("#bk-confirm", overlay).disabled = !chosen || e.target.value.replace(/\D/g, "").length < 10; });
        $("#bk-confirm", overlay).addEventListener("click", () => {
            if (!chosen) return;
            bookings.push({ id: "BK-" + Date.now(), lawyer: lw.name, lawyerId: lw.id, fee: lw.fees.consultation.amount || 0, day: chosen.day, time: chosen.time, name: $("#bk-name", overlay).value, phone: $("#bk-phone", overlay).value });
            store.set("bookings", bookings);
            overlay.classList.remove("active"); setTimeout(() => overlay.remove(), 350);
            toast("Consultation with " + lw.name + " confirmed for " + chosen.day + " at " + chosen.time, "success", "Booking Confirmed");
            toast(lw.fees.consultation.amount === 0 ? "This pro bono consultation is FREE of charge" : "Payment link sent to your phone - total " + money((lw.fees.consultation.amount || 0) + 199), "info");
        });
    }

    /* ================== AI Legal Assistant ================== */
    let chatInputBusy = false;
    const GREETINGS = [
        "Hello! I'm your AI Legal Assistant. I can help you with:\n" +
        "• Legal questions & explanations\n• Finding relevant laws & sections\n• Case law research\n• Document drafting guidance\n• Procedure explanations\n• Multi-language support (100+ languages)\n\nHow can I assist you today?",
        "Namaste! I am LegalAI - your personal legal guide. Ask me about any legal matter and I will answer with sources.\nTry: \"Section 420 IPC\", \"Divorce procedure\", \"Cheque bounce\"."
    ];

    function initAssistant() {
        const input = $("#chat-input");
        const autoResize = () => { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 140) + "px"; };
        input.addEventListener("input", autoResize);
        input.addEventListener("keydown", (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendChat(); } });
        $("#send-message").addEventListener("click", sendChat);
        $$(".suggestion-chip").forEach((chip) => chip.addEventListener("click", () => { input.value = chip.dataset.query; input.focus(); }));
        $("#clear-chat-btn").addEventListener("click", () => {
            $("#chat-messages").innerHTML = '<div class="message ai-message"><div class="message-avatar"><i class="fas fa-robot"></i></div><div class="message-content"><p>' + esc(GREETINGS[1]) + "</p></div></div>";
            toast("Conversation cleared", "info");
        });
        $("#voice-input-btn").addEventListener("click", toggleVoiceInput);
        $("#chat-settings-btn").addEventListener("click", () => toast("Multilingual auto-detection active. Select response language below the input box.", "info", "AI Settings"));
        const langs = ["auto", "en", "hi", "ta", "te", "bn", "mr", "gu", "kn", "ml", "pa", "or", "as", "ur"];
        const sel = $("#response-language");
        langs.forEach((code) => { if (![...sel.options].some((o) => o.value === code)) { const o = document.createElement("option"); o.value = code; o.textContent = langMap[code] ? langMap[code].name : code; sel.appendChild(o); } });
        renderConversations();
        renderSavedResponses();
        const topics = ["Bail process", "Filing FIR", "Consumer complaint", "Property registration", "Legal aid", "Writ petition", "Divorce procedure", "Cheque bounce"];
        $("#popular-topics").innerHTML = topics.map((t) => '<span class="topic-tag" data-query="' + t + '">' + t + "</span>").join("");
        $$("#popular-topics .topic-tag").forEach((t) => t.addEventListener("click", () => { input.value = t.dataset.query; input.focus(); }));
    }

    function detectLang(text) {
        if ("#response-language" in window && $("#response-language") && $("#response-language").value !== "auto") return $("#response-language").value;
        const scriptPatterns = [
            [/[\u0900-\u097F]/, "hi"], [/[\u0B80-\u0BFF]/, "ta"], [/[\u0C00-\u0C7F]/, "te"], [/[\u0980-\u09FF]/, "bn"],
            [/[\u0D00-\u0D7F]/, "ml"], [/[\u0A80-\u0AFF]/, "gu"], [/[\u0C80-\u0CFF]/, "kn"], [/[\u0A00-\u0A7F]/, "pa"],
            [/[\u0B00-\u0B7F]/, "or"], [/[\u0600-\u06FF]/, "ur"]
        ];
        for (const [re, code] of scriptPatterns) if (re.test(text)) return code;
        return "en";
    }

    /* ================== AI disclaimer translations & utilities ================== */
    const AI_DISCLAIMERS = {
        en: "<strong>Note:</strong> The AI assistant provides general information and may not always be accurate or complete. Please verify important details with an experienced lawyer or official sources before acting on this information.",
        hi: "<strong>नोट:</strong> AI सहायक सामान्य जानकारी प्रदान करता है और हमेशा सटीक या पूर्ण नहीं हो सकता। कृपया महत्वपूर्ण जानकारी पर कार्रवाई करने से पहले किसी अनुभवी वकील या आधिकारिक स्रोत से सत्यापित करें।"
    };

    function getAIDisclaimerText(lang) { return AI_DISCLAIMERS[lang] || AI_DISCLAIMERS['en']; }
    function getAIDisclaimerHtml(langCode) { return '<div class="ai-disclaimer" style="margin-top:12px;font-size:12px;color:var(--text-3);line-height:1.3;border-top:1px dashed var(--border-2);padding-top:8px">' + getAIDisclaimerText(langCode) + '</div>'; }

    function addMessage(role, html) {
        const box = $("#chat-messages");
        const div = document.createElement("div");
        div.className = "message " + (role === "user" ? "user-message" : "ai-message");
        div.innerHTML = '<div class="message-avatar"><i class="fas ' + (role === "user" ? "fa-user" : "fa-robot") + '"></i></div><div class="message-content">' + html + "</div>";
        box.appendChild(div);
        box.scrollTop = box.scrollHeight;
        return div;
    }

    function getCaseCategoryFromQuery(q) {
        const text = (q || "").toLowerCase();
        // explicit phrase map for common issues
        const phraseMap = {
            family: ["divorce", "custody", "child custody", "maintenance", "alimony", "domestic violence", "498a", "dowry", "matrimonial", "restoration of conjugal rights"],
            criminal: ["fir", "bail", "ipc", "section", "murder", "theft", "robbery", "assault", "rape", "ndps", "cheque bounce", "fraud", "dacoity"],
            consumer: ["consumer", "defective", "insurance claim", "medical negligence", "deficiency of service", "consumer forum", "oppose"],
            labor: ["termination", "employee", "labour", "employment", "wages", "esi", "pf", "industrial dispute"],
            corporate: ["company", "startup", "incorporation", "shareholder", "merger", "acquisition", "contract", "nda", "commercial"],
            tax: ["tax", "gst", "income tax", "tds", "assessment", "notice", "tax evasion"],
            ipr: ["patent", "trademark", "copyright", "infringement", "ip", "design", "passing off"],
            environment: ["pollution", "environment", "ngt", "environmental", "coastal", "clearance"],
            constitutional: ["writ", "fundamental rights", "article", "pib", "public interest", "constitution", "p i l", "p i l"]
        };
        // exact phrase detection (longer phrases first)
        for (const [cat, arr] of Object.entries(phraseMap)) {
            for (const ph of arr) {
                if (text.indexOf(ph) !== -1) return cat;
            }
        }
        // fallback to keyword-based simple mapping
        const keywords = {
            family: ["marriage", "wife", "husband", "custodian"],
            criminal: ["accused", "charge", "complaint"],
            consumer: ["complaint", "seller", "service"],
            labor: ["employer", "dismissal", "salary"],
            corporate: ["company", "director", "share"],
            tax: ["assessment", "demand", "notice"],
            ipr: ["trademark", "patent", "copyright"],
            environment: ["pollution", "environment"],
            constitutional: ["writ", "petition", "constitution"]
        };
        for (const [cat, arr] of Object.entries(keywords)) {
            if (arr.some((k) => text.indexOf(k) !== -1)) return cat;
        }
        return "";
    }

    function extractIssueKeywords(q) {
        const text = (q || "").toLowerCase();
        const issues = [];
        const patterns = [
            [/(?:section\s*\d+|sec\.?\s*\d+|s\.?\s*\d+)/i, 'statute'],
            [/\b(fir)\b/, 'fir'],
            [/\b(bail)\b/, 'bail'],
            [/\b(divorce|custody|maintenance|alimony)\b/, 'family'],
            [/\b(cheque bounce|section 138|138)\b/, 'cheque-bounce'],
            [/\b(trademark|patent|copyright|infringement)\b/, 'ipr'],
            [/\b(gst|income tax|tds|tax)\b/, 'tax'],
            [/\b(consumer|defective|medical negligence|insurance)\b/, 'consumer']
        ];
        for (const [re, tag] of patterns) if (re.test(text)) issues.push(tag);
        return Array.from(new Set(issues));
    }

    function findRecommendedLawyers(q) {
        const query = (q || "").toLowerCase();
        const category = getCaseCategoryFromQuery(query);
        const issues = extractIssueKeywords(query);

        function scoreLawyer(lawyer) {
            const doc = [lawyer.name, lawyer.bio, ...(lawyer.specializations || []), ...(lawyer.categories || [])].join(" ").toLowerCase();
            let score = 0;
            // strong boost for category match
            if (category && lawyer.categories && lawyer.categories.includes(category)) score += 40;
            // match specific issue keywords against specializations & bio
            for (const issue of issues) {
                if (issue === 'statute') {
                    // if user mentioned a statute/section, prefer litigators (criminal/civil/constitutional)
                    if (lawyer.categories.includes('criminal') || lawyer.categories.includes('constitutional') || lawyer.categories.includes('civil')) score += 12;
                } else {
                    // check specializations for the issue phrase
                    const inSpec = (lawyer.specializations || []).some((s) => s.toLowerCase().includes(issue.replace(/[-_]/g, ' ')));
                    const inBio = doc.indexOf(issue) !== -1;
                    if (inSpec) score += 20;
                    if (inBio) score += 6;
                }
            }
            // phrase-level match for specialization
            for (const spec of lawyer.specializations || []) {
                const sp = spec.toLowerCase();
                if (query.indexOf(sp) !== -1) score += 20;
            }
            // partial word match from specialization tokens
            for (const spec of lawyer.specializations || []) {
                for (const token of spec.toLowerCase().split(/\W+/)) {
                    if (token.length > 4 && query.indexOf(token) !== -1) score += 8;
                }
            }
            // category name mention
            for (const cat of lawyer.categories || []) if (query.indexOf(cat) !== -1) score += 6;
            // location match
            if (lawyer.location && ((query.indexOf(lawyer.location.city.toLowerCase()) !== -1) || (query.indexOf(lawyer.location.state.toLowerCase()) !== -1))) score += 6;
            // direct substring match in profile
            if (doc.indexOf(query) !== -1) score += 8;
            // rating & experience small boosts
            score += (lawyer.rating || 0) * 4; // up to 20
            score += Math.min(lawyer.experience || 0, 30) / 30 * 6; // up to 6
            // review count small boost
            score += Math.min(lawyer.reviewCount || 0, 500) / 500 * 4; // up to 4
            return score;
        }

        const scored = LAWYERS.map((l) => ({ lawyer: l, score: scoreLawyer(l) }));
        const positives = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score || b.lawyer.rating - a.lawyer.rating);
        if (positives.length) return positives.slice(0, 3).map((p) => p.lawyer);

        // fallback: if category known, return top-rated in that category
        if (category) {
            const catList = LAWYERS.filter((l) => l.categories && l.categories.includes(category)).sort((a, b) => b.rating - a.rating || b.experience - a.experience);
            if (catList.length) return catList.slice(0, 3);
        }

        // final fallback: overall top rated
        return LAWYERS.slice().sort((a, b) => b.rating - a.rating || b.experience - a.experience).slice(0, 3);
    }

    /* ================== Recommendation logging & diagnostics ================== */
    function logRecommendationClick(lawyerId, query) {
        try {
            const entries = store.get('recommend_clicks', []);
            entries.unshift({ lawyerId, query: query || '', time: Date.now() });
            store.set('recommend_clicks', entries.slice(0, 200));
        } catch (e) { console.warn('Failed to log recommendation click', e); }
    }

    function runRecommendationDiagnostics() {
        const samples = [
            'I need bail after FIR for theft',
            'How to file for divorce and custody',
            'Patent infringement - cease and desist',
            'Received GST assessment notice',
            'Medical negligence compensation claim'
        ];
        const results = samples.map((s) => ({ q: s, recommendations: findRecommendedLawyers(s).map((l) => ({ id: l.id, name: l.name, categories: l.categories })) }));
        try { store.set('recommendation_diagnostics', { time: Date.now(), results }); } catch (e) { }
        console.group('Recommendation diagnostics');
        console.table(results.map(r => ({ query: r.q, recommended: r.recommendations.map(rr => rr.name).join(', ') })));
        console.groupEnd();
        try { toast('Recommendation diagnostics run (open console for details)', 'info'); } catch (e) { }
        return results;
    }

    function buildRecommendedLawyersHtml(q) {
        const lawyers = findRecommendedLawyers(q);
        if (!lawyers.length) return "";
        return '<div style="margin-top:14px;padding:12px 12px 8px;border:1px solid var(--border-2);border-radius:12px;background:rgba(99,102,241,0.05);box-shadow:inset 0 0 0 1px rgba(99,102,241,0.04);">' +
            '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;gap:8px;">' +
            '<strong style="font-size:12px;color:var(--text-1);">Recommended lawyers for this case</strong>' +
            '<span style="font-size:10px;color:var(--text-3);">From lawyer database</span>' +
            '</div>' +
            lawyers.map((lawyer) => {
                const cat = lawyer.categories.map((c) => CATEGORY_MAP[c] ? CATEGORY_MAP[c].name : c).slice(0, 2).join(" • ");
                return '<div style="display:flex;gap:10px;padding:8px 0;border-top:1px solid var(--border-2);">' +
                    '<img src="' + lawyer.avatar + '" alt="' + esc(lawyer.name) + '" style="width:42px;height:42px;border-radius:50%;object-fit:cover;border:2px solid rgba(99,102,241,0.2);">' +
                    '<div style="flex:1;min-width:0;">' +
                    '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">' +
                    '<div style="min-width:0;">' +
                    '<div style="font-size:12px;font-weight:700;color:var(--text-1);">' + esc(lawyer.name) + '</div>' +
                    '<div style="font-size:10px;color:var(--text-3);">' + esc(lawyer.location.city + ", " + lawyer.location.state) + '</div>' +
                    '</div>' +
                    '<span style="white-space:nowrap;font-size:10px;color:var(--accent);">' + renderStars(lawyer.rating).replace(/<i /g, '<i style="font-size:9px;" ') + ' ' + lawyer.rating.toFixed(1) + '</span>' +
                    '</div>' +
                    '<div style="font-size:10px;color:var(--text-2);margin-top:4px;">' + esc(cat) + '</div>' +
                    '<div style="font-size:10px;color:var(--text-3);margin-top:4px;">' + esc(lawyer.specializations.slice(0, 2).join(" • ")) + '</div>' +
                    '<button type="button" class="recommendation-profile-btn" data-lid="' + lawyer.id + '" style="margin-top:6px;padding:5px 9px;border:none;border-radius:999px;background:var(--primary);color:#fff;font-size:10px;font-weight:700;cursor:pointer;">View profile</button>' +
                    '</div>' +
                    '</div>';
            }).join("") +
            '</div>';
    }

    function findKBAnswer(q) {
        const ql = q.toLowerCase();
        let best = null, bestScore = 0;
        for (const item of LEGAL_KB) {
            let score = 0;
            for (const kw of item.keywords) if (ql.includes(kw)) score += kw.length > 3 ? 2 : 1;
            if (score > bestScore) { bestScore = score; best = item; }
        }
        if (best && bestScore >= 2) return best;
        const caseHit = COURT_CASES.find((c) => c.title.toLowerCase().includes(ql) || c.citation.toLowerCase().includes(ql) || c.tags.some((t) => ql.includes(t)));
        if (caseHit) return { topic: "Case Summary: " + caseHit.title, response: caseHit.citation + " - " + caseHit.summary + "\n\nCourt: " + caseHit.court + " (" + caseHit.year + ")", cites: [] };
        return null;
    }

    function sendChat() {
        const input = $("#chat-input");
        const q = input.value.trim();
        if (!q || chatInputBusy) return;
        chatInputBusy = true;
        const lang = detectLang(q);
        input.value = "";
        input.style.height = "auto";
        addMessage("user", esc(q));
        const typing = addMessage("ai", '<span class="typing-indicator"><span></span><span></span><span></span></span>');
        const answer = findKBAnswer(q);
        setTimeout(() => {
            let html;
            const opt = $("#cite-sources").checked;
            if (answer) {
                const cites = answer.cites || [];
                let out = answer.response.split("\n").map((p) => { const t = p.trim(); return t ? "<p>" + evan(t) + "</p>" : ""; }).join("");
                if (/^\w[\w\s]/i.test(answer.topic)) out = "<blockquote style='border-left:3px solid var(--accent);padding-left:12px;margin-bottom:8px;color:var(--text-2)'><strong>" + esc(answer.topic) + "</strong></blockquote>" + out;
                if (opt && cites.length) out += "<div class='citation'><i class='fas fa-bookmark' style='margin-right:5px;color:var(--indigo)'></i>Cited: " + cites.map((c) => "<a href='#case-search'>" + esc(c) + "</a>").join(", ") + "</div>";
                const related = COURT_CASES.filter((c) => answer.topic && answer.topic.includes("Case Summary") ? false : true).slice(0, 0);
                html = out;
            } else if (/^(hi|hello|namaste|namaskar|good|hey)/i.test(q.trim())) {
                html = "<p>" + esc(GREETINGS[1]) + "</p>";
            } else if (/\b(fee|fees|charge|cost|price)\b/.test(q.toLowerCase())) {
                html = "<p>Fee structures are fully transparent on our platform. Every lawyer profile displays a <strong>Fee Structure</strong> tab with consultation, hearing, retainer, contingency and document fees.</p><p>Legal aid and pro bono lawyers charge <strong>zero consultation fees</strong>. Government lawyers have fixed subsidized rates.</p><p>Open the <a href='#lawyers'><strong>Find Lawyers</strong></a> section and click any profile to see itemized published fees.</p>";
            } else if (/\b(find|suggest|recommend|need|hire)\b/.test(q.toLowerCase()) && q.toLowerCase().includes("lawyer")) {
                const top = LAWYERS.slice().sort((a, b) => b.rating - a.rating)[0];
                html = "<p>Based on your query, I recommend booking a consultation with <strong>" + esc(top.name) + "</strong> - rated " + top.rating.toFixed(1) + "/5 with " + top.experience + " years experience.</p><p>Use the <a href='#lawyers'><strong>Find Lawyers</strong></a> section with filters for practice area, location, rating and fee range.</p>";
            } else if (q.trim().endsWith("?")) {
                html = "<p>Let me guide you on <strong>" + esc(q.replace("?", "").trim()) + "</strong>.</p><p>Try rephrasing with key legal terms such as \"Section 420\", \"divorce procedure\", \"cheque bounce\", \"consumer complaint\", or \"FIR filing\", and I will provide a detailed sourced answer.</p><p>You can also browse the <a href='#constitution'><strong>Constitutional Library</strong></a> for statute texts.</p>";
            } else {
                html = "<p>I couldn't find a direct match for that query in my knowledge base.</p><p>You can try:</p><ul><li>A specific statute or section (e.g., <em>Section 138 NI Act</em>)</li><li>A procedure (e.g., <em>divorce procedure</em>, <em>RTI filing</em>)</li><li>A topic (e.g., <em>wills</em>, <em>custody</em>, <em>GST</em>)</li></ul>";
            }
            const messageContent = typing.querySelector(".message-content");
            messageContent.innerHTML = html;
            const recommendations = buildRecommendedLawyersHtml(q);
            if (recommendations) {
                messageContent.insertAdjacentHTML("beforeend", recommendations);
                messageContent.querySelectorAll(".recommendation-profile-btn").forEach((btn) => {
                    btn.addEventListener("click", function(e) {
                        try { logRecommendationClick(this.dataset.lid, q); } catch (ex) { }
                        openLawyerProfile(this.dataset.lid);
                    });
                });
            }
            // Add AI accuracy disclaimer after each AI response (translated based on detected language)
            try {
                const langCode = detectLang(q) || 'en';
                messageContent.insertAdjacentHTML("beforeend", getAIDisclaimerHtml(langCode));
            } catch (e) { }
            if ($("#voice-response").checked) speakText($("#cite-sources").checked ? html.replace(/<[^>]*>/g, "") : html.replace(/<[^>]*>/g, ""), lang);
            chatInputBusy = false;
            const convo = chatState.conversations;
            convo.unshift({ q: q.slice(0, 80), time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) });
            chatState.conversations = convo.slice(0, 6);
            store.set("conversations", convo.slice(0, 6));
            renderConversations();
            const saveBtn = typing.querySelector(".message-content");
            const body = document.createElement("button");
            body.style.cssText = "margin-top:8px;font-size:11px;font-weight:700;color:var(--indigo);background:none;border:1px dashed var(--border-2);border-radius:8px;padding:4px 10px";
            body.innerHTML = '<i class="fas fa-bookmark"></i> Save response';
            body.addEventListener("click", () => {
                chatState.saved.unshift({ topic: answer ? answer.topic : q.slice(0, 60), text: typing.textContent.slice(0, 100) });
                store.set("saved_responses", chatState.saved);
                renderSavedResponses();
                toast("Response saved to your library", "success", "Saved");
                body.remove();
            });
            typing.querySelector(".message-content").appendChild(body);
        }, 900 + Math.random() * 800);
    }

    function renderConversations() {
        const box = $("#conversation-list");
        box.innerHTML = chatState.conversations.length ? chatState.conversations.map((c) =>
            '<div class="conversation-item"><i class="fas fa-message"></i><span class="ci-title">' + esc(c.q) + '</span><span class="ci-time">' + c.time + "</span></div>").join("")
            : '<div class="empty-state" style="padding:14px 4px"><i class="fas fa-comments" style="font-size:22px"></i><p style="font-size:12px">No conversations yet</p></div>';
        $$("#conversation-list .conversation-item").forEach((el) => el.addEventListener("click", () => { $("#chat-input").value = el.querySelector(".ci-title").textContent; sendChat(); }));
    }

    function renderSavedResponses() {
        const box = $("#saved-responses");
        box.innerHTML = chatState.saved.length ? chatState.saved.map((s, i) =>
            '<div class="saved-item" data-key="' + i + '"><i class="fas fa-bookmark"></i><span class="si-text">' + esc(s.topic) + '</span><i class="fas fa-times" style="font-size:10px;cursor:pointer" data-rm="' + i + '"></i></div>').join("")
            : '<div class="empty-state" style="padding:14px 4px"><i class="fas fa-bookmark" style="font-size:22px"></i><p style="font-size:12px">Save responses with the bookmark icon</p></div>';
        $$("#saved-responses [data-rm]").forEach((x) => x.addEventListener("click", (e) => {
            e.stopPropagation();
            chatState.saved.splice(parseInt(x.dataset.rm, 10), 1);
            store.set("saved_responses", chatState.saved);
            renderSavedResponses();
        }));
        $$("#saved-responses .saved-item").forEach((el) => el.addEventListener("click", (e) => { if (e.target.dataset.rm !== undefined) return; const item = chatState.saved[parseInt(el.dataset.key, 10)]; if (item) { $("#chat-input").value = item.topic.replace(/^Case Summary:\s*/, ""); sendChat(); } }));
    }

    /* -------- Voice Input / Output (Web Speech API) -------- */
    let recognition = null, listening = false;
    function toggleVoiceInput() {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { toast("Voice input not supported in this browser. Use Chrome/Edge/Safari.", "warning", "Unsupported"); return; }
        if (listening) { try { recognition.stop(); } catch (e) { } return; }
        recognition = new SR();
        recognition.lang = "en-IN";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        const btn = $("#voice-input-btn");
        btn.classList.add("recording");
        listening = true;
        toast("Listening... speak now", "info", "Voice Input");
        recognition.onresult = (ev) => {
            const transcript = ev.results[0][0].transcript;
            $("#chat-input").value = transcript;
            listening = false;
            btn.classList.remove("recording");
            sendChat();
        };
        recognition.onerror = (e) => { listening = false; btn.classList.remove("recording"); if (e.error !== "aborted") toast("Voice recognition error: " + e.error, "warning"); };
        recognition.onend = () => { listening = false; btn.classList.remove("recording"); };
        recognition.start();
    }

    function speakText(text, lang) {
        if (!("speechSynthesis" in window)) { toast("Text-to-speech not supported in this browser", "warning"); return; }
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = (langMap[lang] ? lang : "en") + "-IN";
        const voices = window.speechSynthesis.getVoices();
        const v = voices.find((x) => x.lang && x.lang.startsWith((langMap[lang] ? lang : "en") + "-")) || voices.find((x) => x.lang === "en-IN") || voices[0];
        if (v) u.voice = v;
        u.rate = 0.95;
        window.speechSynthesis.speak(u);
    }

    /* ================== Constitution Library ================== */
    let currentArticle = null;

    function initConstitution() {
        $("#last-update-date").textContent = DATA_LAST_UPDATED;
        renderToc();
        bindConstitutionNav();
        $("#constitution-search").addEventListener("input", (e) => {
            const q = e.target.value.trim().toLowerCase();
            renderToc(q);
        });
        $$(".toc-filters .filter-btn").forEach((btn) => btn.addEventListener("click", () => {
            $$(".toc-filters .filter-btn").forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");
            state.constitution.filter = btn.dataset.filter;
            renderToc($("#constitution-search").value.trim().toLowerCase());
        }));
        $("#check-updates").addEventListener("click", checkConstitutionUpdates);
        $("#bookmark-article").addEventListener("click", () => { if (currentArticle) toggleArticleBookmark(currentArticle); });
        $("#share-article").addEventListener("click", () => {
            if (!currentArticle) return;
            const text = "Article: " + currentArticle.title + " - AI Lawyer Constitution Library";
            if (navigator.share) navigator.share({ title: text, url: location.href }).catch(() => { });
            else { navigator.clipboard.writeText(text).then(() => toast("Article link copied", "success")); }
        });
        $("#print-article").addEventListener("click", () => window.print());
        $("#voice-read").addEventListener("click", () => {
            if (!currentArticle) { toast("Select an article first", "warning"); return; }
            speakText(currentArticle.text.replace(/[()]/g, ", "), "en");
            toast("Reading aloud...", "info", "Voice Reader");
        });
        flipBookmarkBtn();
        $$(".quick-links a, [data-article] a").forEach((a) => a.addEventListener("click", (e) => {
            if (!a.dataset.article) return;
            e.preventDefault();
            showArticle(getArticleById(a.dataset.article), "part");
        }));
        renderWelcomeArticle();
    }

    function renderToc(searchQ) {
        const box = $("#constitution-toc");
        const f = state.constitution.filter;
        let html = "";
        const hl = (t) => { if (searchQ) { const i = t.toLowerCase().indexOf(searchQ); if (i >= 0) return t.slice(0, i) + "<mark class='search-highlight'>" + t.slice(i, i + searchQ.length) + "</mark>" + t.slice(i + searchQ.length); } return esc(t); };
        const match = (t, type) => { if (!searchQ) return true; return t.toLowerCase().includes(searchQ) || type.toLowerCase().includes(searchQ); };
        const isActive = (id) => currentArticle && currentArticle.id === id;

        if (f === "all" || f === "articles") html += '<button class="toc-item-header' + (isActive("preamble") ? " active" : "") + '" data-id="preamble"><i class="fas fa-star toc-icon" style="color:var(--accent)"></i> Preamble</button>';

        CONSTITUTION.parts.forEach((part) => {
            if (f !== "all" && f !== "parts" && f !== "articles") return;
            const kids = part.articles.filter((a) => !searchQ || match(a.title, "article"));
            if (!kids.length) return;
            const open = searchQ || (currentArticle && part.articles.some((a) => a.id === currentArticle.id));
            html += '<div class="toc-item"><button class="toc-item-header" data-part="' + part.id + '"><i class="fas ' + (open ? "fa-chevron-down" : "fa-chevron-right") + '"></i><span class="toc-icon">' + hl(part.title) + "</span></button>";
            html += '<div class="toc-children" style="display:' + (open ? "block" : "none") + '">' + kids.map((a) =>
                '<button class="toc-child' + (isActive(a.id) ? " active" : "") + '" data-id="' + a.id + '">' + hl(a.title) + "</button>").join("") + "</div></div>";
        });
        if (f === "all" || f === "schedules") {
            html += '<div class="toc-item"><button class="toc-item-header" data-group="schedules"><i class="fas fa-chevron-right"></i><span class="toc-icon">Schedules</span></button><div class="toc-children" style="display:none">' +
                CONSTITUTION.schedules.filter((s) => !searchQ || match(s.title, "schedule")).map((s) => '<button class="toc-child' + (isActive(s.id) ? " active" : "") + '" data-id="' + s.id + '">' + hl(s.title) + "</button>").join("") + "</div></div>";
        }
        if (f === "all" || f === "amendments") {
            html += '<div class="toc-item"><button class="toc-item-header" data-group="amendments"><i class="fas fa-chevron-right"></i><span class="toc-icon">Amendments</span></button><div class="toc-children" style="display:none">' +
                CONSTITUTION.amendments.filter((s) => !searchQ || match(s.title, "amendment")).map((s) => '<button class="toc-child' + (isActive(s.id) ? " active" : "") + '" data-id="' + s.id + '">' + esc("Amendment " + s.num + " (" + s.year + ")") + "</button>").join("") + "</div></div>";
        }
        box.innerHTML = html || '<div class="empty-state"><p>No results found</p></div>';
        bindConstitutionNav();
    }

    function bindConstitutionNav() {
        $$("#constitution-toc .toc-item-header[data-part], #constitution-toc .toc-item-header[data-group]").forEach((h) => h.addEventListener("click", () => {
            const kids = h.parentElement.querySelector(".toc-children");
            if (!kids) return;
            const isOpen = kids.style.display !== "none";
            kids.style.display = isOpen ? "none" : "block";
            h.querySelector("i").className = "fas " + (isOpen ? "fa-chevron-right" : "fa-chevron-down");
        }));
        $$("#constitution-toc [data-id]").forEach((el) => el.addEventListener("click", () => {
            const art = getArticleById(el.dataset.id);
            if (art) showArticle(art, el.dataset.id === "preamble" ? "preamble" : art.type || (el.dataset.id.startsWith("am-") ? "amendment" : el.dataset.id.startsWith("schedule-") ? "schedule" : "part"));
        }));
    }

    function getArticleById(id) {
        if (id === "preamble") return CONSTITUTION.preamble;
        const p = CONSTITUTION.parts.flatMap((x) => x.articles).find((a) => a.id === id);
        if (p) return { ...p, type: "part" };
        const s = CONSTITUTION.schedules.find((x) => x.id === id);
        if (s) return { ...s, type: "schedule" };
        const a = CONSTITUTION.amendments.find((x) => x.id === id);
        if (a) return { ...a, type: "amendment" };
        return null;
    }

    function showArticle(art, type) {
        currentArticle = art;
        $("#article-title").textContent = art.title;
        const meta = [];
        if (type === "amendment") meta.push({ cls: "amended", text: "Amendment " + art.num + " - " + art.year });
        if (type === "schedule") meta.push({ cls: "schedule", text: "Schedule" });
        if (type === "part" || type === "preamble") meta.push({ cls: "part", text: "Constitution of India" });
        if (art.meta) art.meta.forEach((m) => meta.push({ cls: "", text: m }));
        if (type === "amendment") meta.push({ cls: "amended", text: "Auto-updated via library" });
        $("#article-meta").innerHTML = meta.map((m) => '<span class="meta-chip ' + m.cls + '">' + esc(m.text) + "</span>").join("");
        $("#article-text").innerHTML = formatArticleText(art.text);
        flipBookmarkBtn();
        renderToc($("#constitution-search").value.trim().toLowerCase());
    }

    function formatArticleText(text) {
        return text.split("\n").map((line) => {
            const t = line.trim();
            if (!t) return "";
            if (/^\(\d+\)/.test(t)) return '<div class="clause">' + esc(t) + "</div>";
            return "<p>" + esc(t) + "</p>";
        }).join("");
    }

    function renderWelcomeArticle() {
        if (!currentArticle && $("#article-title").textContent === "Select an Article or Part") {
            $("#article-meta").innerHTML = "";
            $("#article-text").innerHTML = '<div class="welcome-message"><i class="fas fa-book-open"></i><h3>Welcome to the Constitution Library</h3><p>Select any Part, Article, Schedule, or Amendment from the sidebar to view the complete legal text. Search highlights matching sections.</p><div class="quick-links">' +
                '<a href="#" data-article="preamble">Preamble</a><a href="#" data-article="article-14">Article 14 - Equality</a><a href="#" data-article="article-19">Article 19 - Freedom</a><a href="#" data-article="article-21">Article 21 - Life &amp; Liberty</a><a href="#" data-article="article-32">Article 32 - Remedies</a>' + "</div></div>";
            $$(".quick-links a").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); showArticle(getArticleById(a.dataset.article), "part"); }));
        }
    }

    function flipBookmarkBtn() {
        const bookmarked = currentArticle && currentArticle.id && state.constitution.bookmarks.includes(currentArticle.id);
        $("#bookmark-article").classList.toggle("bookmarked", !!bookmarked);
        $("#bookmark-article").innerHTML = '<i class="fas ' + (bookmarked ? "fa-bookmark" : "far fa-bookmark") + '"></i>';
    }

    function toggleArticleBookmark(art) {
        const bk = state.constitution.bookmarks;
        const i = bk.indexOf(art.id);
        if (i >= 0) { bk.splice(i, 1); toast("Article bookmark removed", "info"); }
        else { bk.push(art.id); toast("Article bookmarked in your constitution library", "success", "Bookmarked"); }
        state.constitution.bookmarks = bk;
        store.set("constitution_bookmarks", bk);
        flipBookmarkBtn();
    }

    function checkConstitutionUpdates() {
        const btn = $("#check-updates");
        const orig = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Checking...';
        setTimeout(() => {
            const upToDate = Math.random() > 0.4;
            btn.disabled = false;
            btn.innerHTML = orig;
            if (upToDate) {
                $("#last-update-date").textContent = DATA_LAST_UPDATED;
                toast("Constitution Library is up to date - version " + DATA_VERSION, "success", "Up to Date");
            } else {
                $("#last-update-date").textContent = new Date().toISOString().slice(0, 10);
                toast("3 amendment notices fetched from the Legislative Database", "success", "Updates Applied");
                toast("Amendment 106 (Nari Shakti Vandan) verified & reflected", "info");
            }
        }, 1600);
    }

    /* ================== Case Search ================== */
    function initCaseSearch() {
        renderCategoryStats();
        $("#search-cases").addEventListener("click", () => { state.caseFilters.page = 1; renderCases(); });
        $("#case-keywords").addEventListener("keydown", (e) => { if (e.key === "Enter") { state.caseFilters.page = 1; renderCases(); } });
        $("#case-category").addEventListener("change", (e) => { state.caseFilters.category = e.target.value; renderCategoryStats(e.target.value); renderCases(); });
        $("#court-level").addEventListener("change", (e) => { state.caseFilters.courtLevel = e.target.value; renderCases(); });
        $("#case-sort").addEventListener("change", (e) => { state.caseFilters.sort = e.target.value; renderCases(); });
        $("#win-rate-filter").addEventListener("input", (e) => { state.caseFilters.minWin = parseInt(e.target.value, 10); $("#win-rate-value").textContent = e.target.value === "0" ? "Any" : e.target.value + "%+"; renderCases(); });
        $("#results-per-page").addEventListener("change", (e) => { state.caseFilters.perPage = parseInt(e.target.value, 10); state.caseFilters.page = 1; renderCases(); });
        ["#year-from", "#year-to"].forEach((id) => $(id).addEventListener("change", (e) => { state.caseFilters[id === "#year-from" ? "yearFrom" : "yearTo"] = e.target.value; renderCases(); }));
        renderCases();
    }

    function renderCategoryStats(activeCat) {
        const box = $("#category-stats");
        box.innerHTML = CASE_TYPE_STATS.map((cs) => {
            const c = CATEGORY_MAP[cs.category];
            const isActive = cs.category === (activeCat !== undefined ? activeCat : state.caseFilters.category);
            return '<div class="category-stat' + (isActive ? " active" : "") + '" data-cat="' + cs.category + '"><div class="cs-name">' + esc(cs.label) + ' <i class="fas ' + c.icon + '"></i></div>' +
                '<div class="cs-meta"><span>' + cs.cases.toLocaleString("en-IN") + ' cases</span><span><i class="fas fa-trophy"></i> <b>' + cs.winRate + "% win</b></span></div>" +
                '<div class="cs-bar"><span style="width:' + cs.winRate + '%"></span></div></div>';
        }).join("");
        $$("#category-stats .category-stat").forEach((el) => el.addEventListener("click", () => {
            const cat = el.dataset.cat;
            const current = state.caseFilters.category === cat ? "" : cat;
            state.caseFilters.category = current;
            $("#case-category").value = current;
            $("#search-cases").click();
        }));
    }

    function renderCases() {
        const fc = state.caseFilters;
        let list = COURT_CASES.filter((c) => {
            if (fc.category && c.category !== fc.category) return false;
            if (fc.courtLevel && c.courtLevel !== fc.courtLevel) return false;
            if (fc.minWin > 0 && c.winRate < fc.minWin) return false;
            if (fc.yearFrom && c.year < parseInt(fc.yearFrom, 10)) return false;
            if (fc.yearTo && c.year > parseInt(fc.yearTo, 10)) return false;
            if (fc.keywords) {
                const q = fc.keywords.toLowerCase();
                const hay = (c.title + " " + c.citation + " " + c.summary + " " + c.tags.join(" ")).toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });
        if (fc.sort === "date") list.sort((a, b) => b.year - a.year);
        else if (fc.sort === "win-rate") list.sort((a, b) => b.winRate - a.winRate);
        else if (fc.sort === "citations") list.sort((a, b) => b.citations - a.citations);
        else list.sort((a, b) => (b.citations * 0.6 + b.winRate * 10) - (a.citations * 0.6 + a.winRate * 10));
        const pp = fc.perPage, pages = Math.max(1, Math.ceil(list.length / pp));
        fc.page = Math.min(fc.page, pages);
        const slice = list.slice((fc.page - 1) * pp, fc.page * pp);
        $("#case-results-count").textContent = list.length + " cases found";
        const box = $("#case-cards");
        box.innerHTML = slice.map((c, i) => {
            const cat = CATEGORY_MAP[c.category];
            const wrClass = c.winRate >= 75 ? "high" : c.winRate >= 50 ? "mid" : "low";
            return '<article class="case-card" style="animation-delay:' + i * 0.04 + 's">' +
                '<div class="case-card-header"><div class="case-card-icon"><i class="fas ' + cat.icon + '"></i></div>' +
                '<div><div class="case-card-title">' + esc(c.title) + '</div><div class="case-card-cite">' + esc(c.citation) + "</div></div></div>" +
                '<div class="case-card-metas"><span class="cc-cat">' + esc(cat.name) + '</span><span class="cc-court">' + esc(c.court) + "</span>" +
                c.tags.slice(0, 3).map((t) => "<span>" + esc(t) + "</span>").join("") + "</div>" +
                "<p>" + esc(c.summary) + "</p>" +
                '<div class="case-card-foot"><span class="win-rate-pill ' + wrClass + '"><i class="fas fa-trophy"></i> ' + c.winRate + "% win rate</span>" +
                '<span class="cc-links"><a href="#" data-cite="' + esc(c.citation) + '"><i class="fas fa-quote-right"></i> Cite</a></span>' +
                '<span class="cc-year">' + c.year + " - " + c.citations.toLocaleString("en-IN") + " citations</span></div></article>";
        }).join("");
        if (!list.length) box.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><p>No cases match your search criteria.</p></div>';
        $$("#case-cards .cc-links a").forEach((a) => a.addEventListener("click", (e) => {
            e.preventDefault();
            navigator.clipboard.writeText(a.dataset.cite).then(() => toast("Citation copied: " + a.dataset.cite, "success", "Copied"));
        }));
        const pg = $("#case-pagination");
        pg.innerHTML = "";
        const mk = (label, p, disabled, active) => '<button class="page-btn' + (active ? " active" : "") + (disabled ? " disabled" : "") + '" data-page="' + p + '">' + label + "</button>";
        pg.innerHTML = mk('<i class="fas fa-chevron-left"></i>', fc.page - 1, fc.page === 1, false) + Array.from({ length: pages }, (_, k) => mk(k + 1, k + 1, false, k + 1 === fc.page)).join("") + mk('<i class="fas fa-chevron-right"></i>', fc.page + 1, fc.page === pages, false);
        $$("#case-pagination .page-btn:not(.disabled)").forEach((b) => b.addEventListener("click", () => { fc.page = parseInt(b.dataset.page, 10); renderCases(); }));
    }

    /* ================== AI Call Bot ================== */
    const CALLER_SCRIPTS = {
        "new-client": {
            label: "New Client Inquiry",
            language: "en",
            lines: [
                { from: "caller", text: "Hello, is this Mr. Sharma's law office?" },
                { from: "bot", text: "Namaste! Yes, you have reached the law office. I am the AI Legal Assistant. What is the purpose of your call today?" },
                { from: "caller", text: "I have a property dispute with my neighbor. I need a lawyer talk." },
                { from: "bot", text: "I understand, sir. Which court and case type does this relate to? Also, are you a new or existing client?" },
                { from: "caller", text: "New client. It's about the boundary wall he built on my land." },
                { from: "bot", text: "Noted. I am forwarding your details to our civil litigation desk. Mr. Sharma will call you back within 2 working hours. Anything urgent, please press 1." },
                { from: "caller", text: "Okay, thank you." },
                { from: "bot", text: "Thank you for calling. Your case reference number is CL-2841. Have a good day!" }
            ],
            decision: { type: "forward", text: "Forwarded to Civil Desk" }
        },
        "existing-client": {
            label: "Existing Client",
            language: "en",
            lines: [
                { from: "caller", text: "Hi, this is Rahul. I have a case ID RK-2024-078." },
                { from: "bot", text: "Welcome back, Mr. Rahul. I can see your case RK-2024-078 (Consumer Complaint). Are you calling for a case update?" },
                { from: "caller", text: "Yes, is there any hearing scheduled?" },
                { from: "bot", text: "Your next hearing is on 20 August at 11:30 AM before the District Commission, Court 2. The case file has been updated today." },
                { from: "caller", text: "Great, thanks a lot." },
                { from: "bot", text: "Your call has been logged and a summary sent to your case-handling advocate. Have a good day!" }
            ],
            decision: { type: "forward", text: "Logged to Case Advocate" }
        },
        "court-notice": {
            label: "Court Notice",
            language: "en",
            lines: [
                { from: "caller", text: "This is the registry of the District Court calling. There is a notice in matter number 145/2025." },
                { from: "bot", text: "Thank you for the notice. I am recording it under 'court notice'. May I note the next hearing date?" },
                { from: "caller", text: "Next hearing is 5 September at 10:00 AM. The respondent has filed a counter-affidavit." },
                { from: "bot", text: "Noted. Court notice for matter 145/2025 - hearing 5 September 10:00 AM, counter-affidavit received. I am alerting the case advocate immediately by SMS and email." },
                { from: "caller", text: "Make sure the counsel is present." },
                { from: "bot", text: "Confirmed. An emergency alert has been dispatched. Thank you for calling." }
            ],
            decision: { type: "flag", text: "EMERGENCY - Advocate Alerted" }
        },
        "opposing-counsel": {
            label: "Opposing Counsel",
            language: "en",
            lines: [
                { from: "caller", text: "Good morning, this is advocate Verma's office. We represent the opposite party in the divorce matter." },
                { from: "bot", text: "Good morning. How may I route this communication?" },
                { from: "caller", text: "We are open to settlement terms. Please share the latest proposal with your client." },
                { from: "bot", text: "Understood. Your settlement proposal is being forwarded to the managing associate handling the matter. A written acknowledgement will be sent to your office today." },
                { from: "caller", text: "Thank you." },
                { from: "bot", text: "Please provide a callback number for official records." }
            ],
            decision: { type: "forward", text: "Forwarded to Managing Associate" }
        },
        "spam": {
            label: "Spam / Marketing",
            language: "en",
            lines: [
                { from: "caller", text: "Hello sir, congratulations! You have won a free lawyer marketing package worth Rs 50000. Please press 1 to claim." },
                { from: "bot", text: "Thank you for calling. Your call could not be processed. Goodbye." },
                { from: "bot", text: "(Number flagged as spam - added to block list - call terminated)" }
            ],
            decision: { type: "block", text: "Blocked as Spam" }
        }
    };

    function initCallBot() {
        $("#simulate-call").addEventListener("click", simulateCall);
        renderCallBotConfig();
        renderCallLog();
        renderBotAnalytics();
        renderBotLanguages();
        $(".simulator-controls .btn").addEventListener("click", () => { });
        const btn = $("#simulate-call");
        btn.addEventListener("click", simulateCall);

        $$(".config-tab").forEach((t) => t.addEventListener("click", () => {
            $$(".config-tab").forEach((x) => x.classList.remove("active"));
            t.classList.add("active");
            $$(".config-panel").forEach((p) => p.classList.remove("active"));
            $("#config-" + t.dataset.config).classList.add("active");
        }));
        $("#add-intake-question").addEventListener("click", () => {
            const q = prompt("Enter new intake question:");
            if (q && q.trim()) {
                CALL_BOT_CONFIG.intakeQuestions.push({ id: "iq" + Date.now(), question: q.trim(), active: true });
                renderCallBotConfig();
                toast("Intake question added", "success");
            }
        });
        $("#add-forwarding-rule").addEventListener("click", () => {
            const c = prompt("Enter condition (e.g. 'Call after office hours'):");
            const a = prompt("Enter action:");
            if (c && a) {
                CALL_BOT_CONFIG.forwardingRules.push({ id: "fr" + Date.now(), condition: c, action: a, active: true });
                renderCallBotConfig();
                toast("Forwarding rule added", "success");
            }
        });
        $("#add-auto-response").addEventListener("click", () => {
            const t = prompt("Enter trigger (e.g. 'Payment question'):");
            const r = prompt("Enter auto response:");
            if (t && r) {
                CALL_BOT_CONFIG.autoResponses.push({ id: "ar" + Date.now(), trigger: t, response: r, active: true });
                renderCallBotConfig();
                toast("Auto response added", "success");
            }
        });
    }

    function renderCallBotConfig() {
        $("#intake-questions").innerHTML = CALL_BOT_CONFIG.intakeQuestions.map((q) =>
            '<div class="config-row"><div class="cr-input"><input type="text" value="' + esc(q.question) + '" data-qid="' + q.id + '"></div><div class="cr-toggle' + (q.active ? " on" : "") + '" data-qid="' + q.id + '"></div><button class="cr-action" data-del="' + q.id + '"><i class="fas fa-trash"></i></button></div>').join("");
        $("#forwarding-rules").innerHTML = CALL_BOT_CONFIG.forwardingRules.map((r) =>
            '<div class="config-row"><div class="cr-input"><input type="text" value="' + esc(r.condition) + ' - ' + esc(r.action) + '"></div><div class="cr-toggle' + (r.active ? " on" : "") + '" data-fid="' + r.id + '"></div><button class="cr-action" data-del="f-' + r.id + '"><i class="fas fa-trash"></i></button></div>').join("");
        $("#auto-responses").innerHTML = CALL_BOT_CONFIG.autoResponses.map((r) =>
            '<div class="config-row"><div class="cr-input"><input type="text" value="' + esc(r.trigger) + ': ' + esc(r.response) + '"></div><div class="cr-toggle' + (r.active ? " on" : "") + '" data-aid="' + r.id + '"></div><button class="cr-action" data-del="a-' + r.id + '"><i class="fas fa-trash"></i></button></div>').join("");
        bindConfigControls();
    }

    function bindConfigControls() {
        $$(".config-row .cr-toggle").forEach((t) => t.addEventListener("click", () => {
            t.classList.toggle("on");
            if (t.dataset.qid) CALL_BOT_CONFIG.intakeQuestions.find((x) => x.id === t.dataset.qid).active = t.classList.contains("on");
            if (t.dataset.fid) CALL_BOT_CONFIG.forwardingRules.find((x) => x.id === t.dataset.fid).active = t.classList.contains("on");
            if (t.dataset.aid) CALL_BOT_CONFIG.autoResponses.find((x) => x.id === t.dataset.aid).active = t.classList.contains("on");
            if (t.dataset.lid) CALL_BOT_CONFIG.botLanguages.find((x) => x.code === t.dataset.lid).active = t.classList.contains("on");
            toast("Configuration updated", "info");
        }));
        $$(".config-row .cr-action").forEach((b) => b.addEventListener("click", () => {
            const id = b.dataset.del;
            if (id.startsWith("f-")) { CALL_BOT_CONFIG.forwardingRules = CALL_BOT_CONFIG.forwardingRules.filter((x) => x.id !== id.slice(2)); }
            else if (id.startsWith("a-")) { CALL_BOT_CONFIG.autoResponses = CALL_BOT_CONFIG.autoResponses.filter((x) => x.id !== id.slice(2)); }
            else { CALL_BOT_CONFIG.intakeQuestions = CALL_BOT_CONFIG.intakeQuestions.filter((x) => x.id !== id); }
            renderCallBotConfig();
            toast("Item removed", "info");
        }));
    }

    function renderBotLanguages() {
        $("#language-support").innerHTML = CALL_BOT_CONFIG.botLanguages.map((l) =>
            '<div class="lang-support-item"><i class="fas fa-language" style="color:var(--indigo)"></i> <b>' + esc(l.name) + '</b> <span style="color:var(--text-3);font-size:12px;flex:1">' + esc(l.code) + '</span><div class="cr-toggle' + (l.active ? " on" : "") + '" data-lid="' + l.code + '"></div></div>').join("");
        $$("#language-support .cr-toggle").forEach((t) => t.addEventListener("click", () => {
            t.classList.toggle("on");
            CALL_BOT_CONFIG.botLanguages.find((x) => x.code === t.dataset.lid).active = t.classList.contains("on");
            toast("Language support updated", "info");
        }));
    }

    function simulateCall() {
        if (state.botRunning) { toast("A call is already in progress", "warning"); return; }
        const type = $("#caller-type").value;
        const lang = $("#caller-language").value;
        const script = CALLER_SCRIPTS[type];
        const box = $("#call-transcript");
        box.innerHTML = "";
        state.botRunning = true;
        $("#simulate-call").disabled = true;
        $("#calls-today").textContent = ++state.callBot.callsToday;
        const duration = script.lines.length * 900;
        state.callBot.totalDuration += duration;
        $("#avg-duration").textContent = Math.round(state.callBot.totalDuration / state.callBot.callsToday / 1000) + "s";
        state.callBot.callsToday = parseInt($("#calls-today").textContent, 10);
        let i = 0;
        const say = (line, role) => {
            const div = document.createElement("div");
            div.className = "transcript-line " + role;
            div.innerHTML = '<div class="t-role"><i class="fas ' + (role === "bot" ? "fa-robot" : "fa-phone-volume") + '"></i></div><div>' + esc(line.text) + "</div>";
            box.appendChild(div);
            box.scrollTop = box.scrollHeight;
            if (state.callBot.callsToday % 3 === 0 && lang !== "en") { } // language noted
        };
        const step = () => {
            if (i >= script.lines.length) {
                const d = script.decision;
                const div = document.createElement("div");
                div.className = "decision-tag " + (d.type === "forward" ? "forward" : d.type === "flag" ? "flag" : d.type === "block" ? "block" : "resolve");
                div.innerHTML = '<i class="fas ' + (d.type === "forward" ? "fa-share" : d.type === "flag" ? "fa-siren" : d.type === "block" ? "fa-ban" : "fa-check") + '"></i> ' + d.text;
                box.appendChild(div);
                const log = document.createElement("div");
                log.className = "call-log-item";
                log.innerHTML = '<div class="cli-icon"><i class="fas ' + (d.type === "block" ? "fa-ban" : "fa-phone") + '"></i></div>' +
                    '<div class="cli-info"><div class="cli-title">' + esc(script.label) + '</div><div class="cli-meta">' + (lang.toUpperCase()) + " - " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + "</div></div>" +
                    '<span class="cli-status ' + (d.type === "forward" ? "forwarded" : d.type === "block" ? "blocked" : "flagged") + '">' + d.type.toUpperCase() + "</span>";
                $("#call-log").prepend(log);
                if (d.type === "forward") state.callBot.forwarded++;
                else if (d.type === "block") state.callBot.blocked++;
                $("#calls-forwarded").textContent = state.callBot.forwarded;
                $("#calls-resolved").textContent = state.callBot.blocked + state.callBot.forwarded;
                renderBotAnalytics();
                state.botRunning = false;
                $("#simulate-call").disabled = false;
                if (d.type === "flag") toast("Duty lawyer alerted immediately (Emergency protocol)", "warning", "Court Notice Flagged");
                else if (d.type === "block") toast("Number added to block list", "info", "Spam Blocked");
                else toast("Call " + d.text.toLowerCase() + " - transcript saved", "success", "Call Complete");
                return;
            }
            const line = script.lines[i];
            say(line, line.from === "bot" ? "bot" : "caller");
            i++;
            setTimeout(step, 700 + Math.random() * 900);
        };
        step();
    }

    function renderCallLog() {
        const box = $("#call-log");
        const logs = [
            { icon: "fa-gavel", title: "Adv. Sharma - Bail Matter", meta: "EN - 09:42 AM", status: "forwarded" },
            { icon: "fa-people-roof", title: "Divorce Client - Mehta", meta: "HI - 09:15 AM", status: "resolved" },
            { icon: "fa-ban", title: "Unknown Number +91-98XXXX12", meta: "EN - 08:50 AM", status: "blocked" },
            { icon: "fa-landmark", title: "High Court Registry", meta: "EN - 08:22 AM", status: "flagged" }
        ];
        box.innerHTML = logs.map((l) =>
            '<div class="call-log-item"><div class="cli-icon"><i class="fas ' + l.icon + '"></i></div>' +
            '<div class="cli-info"><div class="cli-title">' + esc(l.title) + '</div><div class="cli-meta">' + l.meta + "</div></div>" +
            '<span class="cli-status ' + l.status + '">' + l.status.toUpperCase() + "</span></div>").join("");
    }

    function renderBotAnalytics() {
        const { forwardRate = 48, resolveRate = 34, blockRate = 18, util = 62 } = {};
        const fw = state.callBot.callsToday ? Math.round((state.callBot.forwarded / state.callBot.callsToday) * 100) : 48;
        const rl = state.callBot.callsToday ? Math.round(((state.callBot.forwarded + state.callBot.blocked) / state.callBot.callsToday) * 100) : 34;
        const bl = state.callBot.callsToday ? Math.round((state.callBot.blocked / state.callBot.callsToday) * 100) : 18;
        $("#analytics-mini").innerHTML =
            '<div class="analytics-bar">Calls Forwarded <b>' + fw + "%</b><div class='ab-track'><div class='ab-fill' style='width:" + fw + "%'></div></div></div>" +
            '<div class="analytics-bar">Auto-Resolved <b>' + rl + "%</b><div class='ab-track'><div class='ab-fill green' style='width:" + rl + "%'></div></div></div>" +
            '<div class="analytics-bar">Spam Blocked <b>' + bl + "%</b><div class='ab-track'><div class='ab-fill red' style='width:" + bl + "%'></div></div></div>" +
            '<div class="analytics-bar">Missed-Call Recovery <b>62%</b><div class="ab-track"><div class="ab-fill gold" style="width:62%"></div></div></div>';
    }

    /* ================== Complaints Portal ================== */
    function initComplaints() {
        renderComplaints("submitted");
        renderComplaintStats();
        $$(".complaint-filters .filter-chip").forEach((chip) => chip.addEventListener("click", () => {
            $$(".complaint-filters .filter-chip").forEach((c) => c.classList.remove("active"));
            chip.classList.add("active");
            renderComplaints(chip.dataset.status);
        }));
        bindComplaintForm();
        $("#view-flagged").addEventListener("click", showFlaggedLawyers);
        $("#save-draft").addEventListener("click", () => {
            const d = { lawyer: $("#complaint-lawyer-name").value, desc: $("#complaint-description").value };
            store.set("draft_complaint", d);
            toast("Complaint draft saved locally", "success", "Draft Saved");
        });
        const draft = store.get("draft_complaint", null);
        if (draft) { $("#complaint-lawyer-name").value = draft.lawyer || ""; $("#complaint-description").value = draft.desc || ""; }
    }

    function bindComplaintForm() {
        const upload = $("#evidence-upload");
        const input = $("#evidence-files");
        let files = [];
        const renderFiles = () => {
            $("#uploaded-files").innerHTML = files.map((f, i) =>
                '<div class="uploaded-file"><i class="fas fa-paperclip"></i><span class="uf-name">' + esc(f.name) + '</span><span class="uf-size">' + (f.size / 1024).toFixed(0) + " KB</span><button class=\"uf-remove\" data-i=\"" + i + "\"><i class=\"fas fa-times\"></i></button></div>").join("");
            $$("#uploaded-files .uf-remove").forEach((b) => b.addEventListener("click", () => { files.splice(parseInt(b.dataset.i, 10), 1); renderFiles(); }));
        };
        upload.addEventListener("dragover", (e) => { e.preventDefault(); upload.classList.add("dragover"); });
        upload.addEventListener("dragleave", () => upload.classList.remove("dragover"));
        upload.addEventListener("drop", (e) => {
            e.preventDefault(); upload.classList.remove("dragover");
            const dropped = [...e.dataTransfer.files];
            if (files.length + dropped.length > 5) { toast("Maximum 5 evidence files", "warning"); return; }
            dropped.forEach((f) => { if (f.size > 10 * 1024 * 1024) toast(f.name + " exceeds 10MB", "warning"); else files.push(f); });
            renderFiles();
        });
        input.addEventListener("change", () => {
            const picked = [...input.files];
            if (files.length + picked.length > 5) { toast("Maximum 5 evidence files", "warning"); return; }
            picked.forEach((f) => { if (f.size > 10 * 1024 * 1024) toast(f.name + " exceeds 10MB", "warning"); else files.push(f); });
            renderFiles();
        });
        $(".browse-link", upload).addEventListener("click", () => input.click());

        $("#complaint-form").addEventListener("submit", (e) => {
            e.preventDefault();
            const name = $("#complaint-lawyer-name").value.trim();
            const type = $("#complaint-lawyer-type").value;
            const cat = $("#complaint-category").value;
            const desc = $("#complaint-description").value.trim();
            if (!name || !type || !cat || !desc || !$("#complaint-anonymous").checked) {
                toast("Please fill all required fields and confirm the declaration", "error", "Incomplete Form");
                return;
            }
            const num = Math.floor(Math.random() * 100);
            const c = { id: "CMP-2026-" + String(num).padStart(3, "0"), lawyerName: name, lawyerType: type, category: cat, description: desc, date: new Date().toISOString().slice(0, 10), status: "submitted", progress: 10, evidence: files.map((f) => f.name) };
            complaints.unshift(c);
            store.set("complaints", complaints);
            renderComplaints();
            renderComplaintStats();
            $("#complaint-form").reset();
            files = []; renderFiles();
            toast("Complaint " + c.id + " submitted. Reference sent to your email.", "success", "Complaint Registered");
            toast("Acknowledgment in 24 hrs - Preliminary review in 7 days", "info");
            const notif = NOTIFICATIONS[0];
            document.querySelector(".notification-badge").classList.add("hidden");
        });
    }

    function renderComplaints(filter) {
        const list = complaints.filter((c) => !filter || c.status === filter);
        $("#complaint-list").innerHTML = list.length ? list.map((c, i) =>
            '<div class="complaint-card"><div class="complaint-card-head"><span class="cc-id">' + esc(c.id) + '</span><span class="complaint-lawyer">' + esc(c.lawyerName) + '</span><span class="cc-cat">' + esc(COMPLAINT_CATS[c.category] || "Other") + "</span></div>" +
            "<p>" + esc(c.description) + "</p>" +
            (c.evidence && c.evidence.length ? '<div class="case-card-metas" style="margin-bottom:10px">' + c.evidence.map((ev) => '<span><i class="fas fa-paperclip"></i> ' + esc(ev) + "</span>").join("") + "</div>" : "") +
            '<div class="complaint-card-foot"><span class="status-badge ' + c.status + '">' + esc(c.status.replace("-", " ").toUpperCase()) + '</span><span class="cc-date">Filed: ' + esc(c.date) + '</span><span style="font-size:11.5px;color:var(--text-3)">Next action: ' + progressNote(c.status, c.progress) + "</span></div>" +
            '<div class="progress-bar"><span style="width:' + c.progress + '%"></span></div></div>').join("")
            : '<div class="empty-state"><i class="fas fa-flag"></i><p>No complaints in this category</p></div>';
    }

    function progressNote(status, progress) {
        if (status === "submitted") return "Acknowledgment (24 hrs)";
        if (status === "under-review") return "Preliminary review - " + Math.max(1, Math.round(7 - progress / 10)) + " days";
        if (status === "investigation") return "Investigation - 30 day cycle";
        if (status === "resolved") return "Completed - action taken";
        if (status === "dismissed") return "Closed - appeal available";
        return "Awaiting";
    }

    function renderComplaintStats() {
        $("#total-complaints").textContent = complaints.length;
        $("#resolved-complaints").textContent = complaints.filter((c) => c.status === "resolved").length;
        $("#govt-lawyer-complaints").textContent = complaints.filter((c) => c.lawyerType === "government").length;
        $("#avg-resolution").textContent = 24;
    }

    function showFlaggedLawyers() {
        const overlay = document.createElement("div");
        overlay.className = "modal";
        overlay.innerHTML = '<div class="modal-backdrop"></div><div class="modal-content" style="max-width:660px;padding-bottom:24px">' +
            '<div class="modal-header"><h2><i class="fas fa-flag" style="color:var(--warning);margin-right:8px"></i>Flagged Government Lawyers</h2><button class="modal-close"><i class="fas fa-times"></i></button></div>' +
            '<div style="padding:20px 28px">' + FLAGGED_LAWYERS.map((l) =>
                '<div class="complaint-card" style="margin-bottom:12px"><div class="complaint-card-head"><span class="cc-id">' + esc(l.barNumber) + '</span><span class="complaint-lawyer">' + esc(l.name) + '</span><span class="status-badge ' + (l.severity === "high" ? "investigation" : l.severity === "medium" ? "under-review" : "submitted") + '">' + l.severity.toUpperCase() + " RISK</span></div>" +
                '<div class="case-card-metas" style="margin-bottom:8px"><span class="cc-court">' + esc(l.location) + "</span></div>" +
                '<ul class="flag-indicators" style="margin-bottom:8px">' + l.flags.map((f) => "<li><i class='fas fa-exclamation-triangle' style='color:var(--warning)'></i>" + esc(f) + "</li>").join("") + "</ul></div>").join("") +
            "</div></div>";
        document.body.appendChild(overlay);
        overlay.classList.add("active");
        overlay.querySelector(".modal-close").addEventListener("click", () => { overlay.classList.remove("active"); setTimeout(() => overlay.remove(), 350); });
        overlay.querySelector(".modal-backdrop").addEventListener("click", () => { overlay.classList.remove("active"); setTimeout(() => overlay.remove(), 350); });
    }

    const COMPLAINT_CATS = {
        negligence: "Negligence / Non-performance", "fee-collection": "Fees Without Service", misconduct: "Professional Misconduct",
        delay: "Unreasonable Delays", conflict: "Conflict of Interest", incompetence: "Incompetence", communication: "Failure to Communicate", other: "Other"
    };

    /* ================== Court Finder & Map ================== */
    const MAP_BOUNDS = { latMin: 28.4, latMax: 28.85, lngMin: 76.9, lngMax: 77.45 };
    const COURT_TYPE_ICONS = { supreme: "fa-landmark", "high-court": "fa-crown", district: "fa-scale-balanced", session: "fa-user-tie", magistrate: "fa-gavel", family: "fa-house", consumer: "fa-cart-shopping", labor: "fa-helm-safety", tribunal: "fa-building-columns" };
    const COURT_MARK_CLASS = { supreme: "mark-sup", "high-court": "mark-high", district: "mark-district", session: "mark-district", magistrate: "mark-district", family: "mark-family", consumer: "mark-special", labor: "mark-special", tribunal: "mark-special" };

    function haversine(a, b) {
        const R = 6371, dLat = (b.lat - a.lat) * Math.PI / 180, dLng = (b.lng - a.lng) * Math.PI / 180;
        const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
        return 2 * R * Math.asin(Math.sqrt(h));
    }

    let mapUserLoc = { lat: 28.6139, lng: 77.2090, name: "New Delhi (Default)" };

    function initCourts() {
        $("#use-location").addEventListener("click", useGeoLocation);
        $("#court-search").addEventListener("input", (e) => { state.courts.search = e.target.value; renderCourtMap(); });
        $("#court-type-filter").addEventListener("change", (e) => { state.courts.type = e.target.value; renderCourtMap(); });
        $("#distance-filter").addEventListener("change", (e) => { state.courts.distance = parseInt(e.target.value, 10); renderCourtMap(); });
        const opt = document.createElement("option");
        opt.value = "5000"; opt.textContent = "All India";
        $("#distance-filter").appendChild(opt);
        $("#refresh-courts").addEventListener("click", () => { renderCourtMap(); toast("Court locations refreshed", "success"); });
        renderCourtMap();
    }

    function useGeoLocation() {
        if (!navigator.geolocation) { toast("Geolocation not supported in this browser", "warning"); return; }
        toast("Locating you...", "info", "GPS");
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                mapUserLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude, name: "Your Location" };
                $("#court-search").value = "";
                state.courts.search = "";
                state.courts.distance = Math.max(state.courts.distance, 100);
                state.courts.distance = 5000;
                $("#distance-filter").value = "5000";
                renderCourtMap();
                toast("Location detected - showing nearest courts", "success", "GPS Located");
            },
            () => { toast("Could not access GPS. Using default location (New Delhi).", "warning"); },
            { timeout: 9000, maximumAge: 60000 }
        );
    }

    function renderCourtMap() {
        const mapEl = $("#court-map");
        const type = state.courts.type, q = state.courts.search.toLowerCase(), maxDist = state.courts.distance;
        let courts = COURTS_LIST.filter((c) => {
            if (type && c.type !== type) return false;
            if (q && !(c.name + " " + c.address + " " + c.chief).toLowerCase().includes(q)) return false;
            const dist = haversine(mapUserLoc, c);
            return dist <= maxDist;
        }).map((c) => ({ ...c, dist: haversine(mapUserLoc, c) }))
            .filter((c) => maxDist < 5000 || c.dist <= maxDist)
            .sort((a, b) => a.dist - b.dist);

        const latMin = Math.min(...courts.map((c) => c.lat), mapUserLoc.lat) - 0.05;
        const latMax = Math.max(...courts.map((c) => c.lat), mapUserLoc.lat) + 0.05;
        const lngMin = Math.min(...courts.map((c) => c.lng), mapUserLoc.lng) - 0.05;
        const lngMax = Math.max(...courts.map((c) => c.lng), mapUserLoc.lng) + 0.06;
        const x = (lng) => ((lng - lngMin) / (lngMax - lngMin)) * 100;
        const y = (lat) => 100 - ((lat - latMin) / (latMax - latMin)) * 100;

        const grid = "\u200b";
        mapEl.innerHTML = '<div class="map-grid-layer"></div>' + (courts.length ? courts.map((c) => {
            const cls = COURT_MARK_CLASS[c.type] || "mark-district";
            const icon = COURT_TYPE_ICONS[c.type] || "fa-gavel";
            return '<div class="court-map-marker ' + cls + '" data-cid="' + c.id + '" style="left:' + x(c.lng) + "%;top:" + y(c.lat) + '%"><div class="pin"><i class="fas ' + icon + '"></i></div><span class="pin-label">' + esc(c.name) + "</span></div>";
        }).join("") : "") +
            '<div class="court-map-marker user-location" style="left:' + x(mapUserLoc.lng) + "%;top:" + y(mapUserLoc.lat) + '%"><div class="pin"></div></div>';

        $$(".court-map-marker[data-cid]").forEach((m) => m.addEventListener("click", () => openCourtDetail(m.dataset.cid)));
        renderCourtsList(courts);
    }

    function renderCourtsList(courts) {
        const box = $("#courts-list");
        box.innerHTML = courts.length ? courts.map((c) => {
            const iconCls = c.type === "high-court" ? "high" : c.type === "family" ? "family" : (c.type === "supreme" || c.type === "district" || c.type === "session" || c.type === "magistrate") ? "district" : "special";
            return '<div class="court-card" data-cid="' + c.id + '"><div class="court-card-icon ' + iconCls + '"><i class="fas ' + (COURT_TYPE_ICONS[c.type] || "fa-gavel") + '"></i></div>' +
                '<div class="cc-court-info"><div class="court-name">' + esc(c.name) + '</div><div class="court-addr">' + esc(c.address) + '</div>' +
                '<div class="court-dist"><i class="fas fa-location-arrow"></i>' + c.dist.toFixed(1) + " km" + (mapUserLoc.name !== "Your Location" ? " from " + esc(mapUserLoc.name) : " from you") + "</div></div></div>";
        }).join("") : '<div class="empty-state"><i class="fas fa-map-location-dot"></i><p>No courts found in this range. Widen the distance filter or clear search.</p></div>';
        $$("#courts-list .court-card").forEach((card) => card.addEventListener("click", () => openCourtDetail(card.dataset.cid)));
    }

    function openCourtDetail(cid) {
        const c = COURTS_LIST.find((x) => x.id === cid);
        if (!c) return;
        const dist = haversine(mapUserLoc, c);
        const overlay = document.createElement("div");
        overlay.className = "modal";
        overlay.innerHTML = '<div class="modal-backdrop"></div><div class="modal-content court-detail-card" style="max-width:720px;padding-bottom:28px">' +
            '<div class="modal-header"><h2><i class="fas ' + (COURT_TYPE_ICONS[c.type] || "fa-gavel") + '" style="color:var(--indigo);margin-right:8px"></i>' + esc(c.name) + '</h2><button class="modal-close"><i class="fas fa-times"></i></button></div>' +
            '<div class="court-detail-info"><div class="case-card-metas"><span class="cc-court">' + esc(c.type.toUpperCase().replace("-", " ")) + "</span><span>" + esc(c.chief) + "</span><span>" + c.dist.toFixed(1) + " km away</span></div>" +
            '<div class="detail-contact">' +
            '<div class="dc-item"><b>Address</b><i class="fas fa-map-pin"></i>' + esc(c.address) + "</div>" +
            '<div class="dc-item"><b>Phone</b><i class="fas fa-phone"></i>' + esc(c.phone) + "</div>" +
            '<div class="dc-item"><b>Hours</b><i class="fas fa-clock"></i>' + esc(c.hours) + "</div>" +
            '<div class="dc-item"><b>Website</b><i class="fas fa-globe"></i>' + esc(c.website) + "</div>" +
            '<div class="dc-item"><b>Caseload</b><i class="fas fa-folder-open"></i>' + esc(c.caseload) + "</div></div>" +
            '<div class="court-detail-actions" style="margin-top:20px">' +
            '<button class="btn btn-primary" data-act="directions"><i class="fas fa-diamond-turn-right"></i> Get Directions</button>' +
            '<button class="btn btn-secondary" data-act="walk"><i class="fas fa-person-walking"></i> Walking</button>' +
            '<button class="btn btn-secondary" data-act="drive"><i class="fas fa-car"></i> Driving</button>' +
            '<button class="btn btn-secondary" data-act="transit"><i class="fas fa-bus"></i> Public Transport</button>' +
            '<button class="btn btn-secondary" data-act="schedule"><i class="fas fa-calendar-check"></i> Schedule Visit</button>' +
            "</div></div></div>";
        document.body.appendChild(overlay);
        overlay.classList.add("active");
        overlay.querySelector(".modal-close").addEventListener("click", () => { overlay.classList.remove("active"); setTimeout(() => overlay.remove(), 350); });
        overlay.querySelector(".modal-backdrop").addEventListener("click", () => { overlay.classList.remove("active"); setTimeout(() => overlay.remove(), 350); });
        $$("[data-act]", overlay).forEach((btn) => btn.addEventListener("click", () => {
            const act = btn.dataset.act;
            if (act === "directions") {
                toast("Opening route in Google Maps...", "info");
                setTimeout(() => window.open("https://www.google.com/maps/dir/?api=1&destination=" + c.lat + "," + c.lng, "_blank"), 500);
            } else if (act === "walk" || act === "drive" || act === "transit") {
                const mode = act === "walk" ? "walking" : act === "drive" ? "driving" : "transit";
                toast("Calculating " + mode + " route to " + c.name, "info");
                setTimeout(() => window.open("https://www.google.com/maps/dir/?api=1&origin=" + mapUserLoc.lat + "," + mapUserLoc.lng + "&destination=" + c.lat + "," + c.lng + "&travelmode=" + mode, "_blank"), 600);
            } else if (act === "schedule") {
                openCourtSchedule(c);
            }
        }));
    }

    function openCourtSchedule(c) {
        const overlay = document.createElement("div");
        overlay.className = "modal";
        const now = new Date();
        const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
            const slots = ["09:30", "11:00", "12:30", "15:00", "16:30"];
            const taken = (d.getDate() * 3 + i) % 3; // simulate full slots
            return { d, slots: slots.slice(taken) };
        });
        overlay.innerHTML = '<div class="modal-backdrop"></div><div class="modal-content" style="max-width:680px;padding-bottom:26px">' +
            '<div class="modal-header"><h2><i class="fas fa-calendar-check" style="color:var(--indigo);margin-right:8px"></i>Schedule Court Visit - ' + esc(c.name) + '</h2><button class="modal-close"><i class="fas fa-times"></i></button></div>' +
            '<div style="padding:24px 28px">' +
            '<p style="font-size:13px;color:var(--text-2);margin-bottom:16px">Book a time slot for in-person filing or hearing attendance (a.k.a. <b>e-lok Adalat / e-appointment</b> style scheduling). Slots sync automatically with court registry availability.</p>' +
            '<div class="schedule-calendar">' + days.map(({ d, slots }) =>
                '<div class="schedule-day"><div class="sd-date">' + labels[d.getDay()] + ", " + d.getDate() + " " + d.toLocaleString("en", { month: "short" }) + '</div><div class="sd-slots">' + slots.length + " open</div>" +
                slots.map((t) => '<button class="sd-slot-chip" data-time="' + t + '">' + t + "</button>").join("") +
                (slots.length === 0 ? '<div class="sd-slot-chip taken">Full</div>' : "") + "</div>").join("") + "</div>" +
            '<div id="cs-selected" style="margin:16px 0 10px;font-size:13.5px;color:var(--indigo);font-weight:700">Select a slot above</div>' +
            '<div class="form-row" style="grid-template-columns:1fr 1fr"><div class="form-group"><label>Purpose of visit</label><select id="cs-purpose" class="filter-select"><option>Case filing</option><option>Hearing attendance</option><option>Document inspection</option><option>Consultation with registry</option></select></div><div class="form-group"><label>Mobile number</label><input type="tel" id="cs-phone" placeholder="10-digit"></div></div>' +
            '<button class="btn btn-primary" style="width:100%;padding:13px;margin-top:10px" id="cs-confirm" disabled><i class="fas fa-check-circle"></i> Confirm Appointment</button></div></div>';
        document.body.appendChild(overlay);
        overlay.classList.add("active");
        overlay.querySelector(".modal-close").addEventListener("click", () => { overlay.classList.remove("active"); setTimeout(() => overlay.remove(), 350); });
        overlay.querySelector(".modal-backdrop").addEventListener("click", () => { overlay.classList.remove("active"); setTimeout(() => overlay.remove(), 350); });
        let slot = null;
        $$(".sd-slot-chip", overlay).forEach((chip) => chip.addEventListener("click", () => {
            $$(".sd-slot-chip", overlay).forEach((x) => { x.style.background = ""; x.style.color = ""; });
            slot = chip.closest(".schedule-day").querySelector(".sd-date").textContent + " - " + chip.dataset.time;
            chip.style.background = "var(--success)"; chip.style.color = "#fff";
            $("#cs-selected", overlay).textContent = "Selected: " + slot;
            $("#cs-confirm", overlay).disabled = $("#cs-phone", overlay).value.replace(/\D/g, "").length < 10;
        }));
        $("#cs-phone", overlay).addEventListener("input", () => { $("#cs-confirm", overlay).disabled = !slot || $("#cs-phone", overlay).value.replace(/\D/g, "").length < 10; });
        $("#cs-confirm", overlay).addEventListener("click", () => {
            if (!slot) return;
            bookings.push({ id: "CV-" + Date.now(), court: c.name, day: slot, name: $("#cs-purpose", overlay).value, phone: $("#cs-phone", overlay).value });
            store.set("bookings", bookings);
            overlay.classList.remove("active"); setTimeout(() => overlay.remove(), 350);
            toast("Appointment confirmed at " + c.name + " - " + slot, "success", "Court Visit Scheduled");
        });
    }

    /* ================== Notifications & Settings Panels ================== */
    function initPanels() {
        const openPanel = (sel) => { $(sel).classList.add("open"); };
        const closePanel = (sel) => $(sel).classList.remove("open");
        $("#notifications-btn").addEventListener("click", () => { openPanel("#notifications-panel"); renderNotifications("all"); });
        $("#settings-panel .panel-close").addEventListener("click", () => closePanel("#settings-panel"));
        $("#notifications-panel .panel-close").addEventListener("click", () => closePanel("#notifications-panel"));
        $$(".notif-tab").forEach((t) => t.addEventListener("click", () => {
            $$(".notif-tab").forEach((x) => x.classList.remove("active"));
            t.classList.add("active");
            renderNotifications(t.dataset.tab);
        }));
        $$(".settings-nav-item").forEach((item) => item.addEventListener("click", (e) => {
            e.preventDefault();
            $$(".settings-nav-item").forEach((x) => x.classList.remove("active"));
            item.classList.add("active");
            renderSettings(item.id);
        }));
        renderSettings("profile-settings");
        renderNotifications("all");
    }

    function renderNotifications(tab) {
        const list = NOTIFICATIONS.filter((n) => tab === "all" || n.type === tab);
        $("#notification-list").innerHTML = list.map((n) =>
            '<div class="notif-item' + (n.unread ? " unread" : "") + '"><div class="ni-icon"><i class="fas ' + n.icon + '"></i></div><div class="ni-text"><div class="ni-title">' + esc(n.title) + "</div><div class=\"ni-desc\">" + esc(n.desc) + '</div><div class="ni-time">' + esc(n.time) + "</div></div>" +
            (n.unread ? '<span class="unread-dot"></span>' : "") + "</div>").join("");
        const unread = NOTIFICATIONS.filter((n) => n.unread).length;
        document.querySelector(".notification-badge").textContent = unread;
        document.querySelector(".notification-badge").classList.toggle("hidden", unread === 0);
        $$("#notification-list .notif-item").forEach((el) => el.addEventListener("click", () => { el.classList.remove("unread"); el.querySelector(".unread-dot") && el.querySelector(".unread-dot").remove(); }));
    }

    function renderSettings(tab) {
        const box = $("#settings-content");
        const toggle = (label, desc, on, id) => '<div class="setting-row"><div class="setting-label"><div><strong>' + label + '</strong><small>' + desc + "</small></div></div><label class='toggle-switch" + (on ? " on" : "") + "' data-t='"+ id +"'></label></div>";
        if (tab === "profile-settings") {
            box.innerHTML = '<div class="setting-group"><h4>Profile</h4>' +
                '<div class="setting-row"><span class="sr-label"><i class="fas fa-user"></i> Name</span><input type="text" value="' + esc(currentUser ? currentUser.name : "John Doe") + '"></div>' +
                '<div class="setting-row"><span class="sr-label"><i class="fas fa-envelope"></i> Email</span><input type="text" value="' + esc(currentUser ? currentUser.email : "john@example.com") + '"></div>' +
                '<div class="setting-row"><span class="sr-label"><i class="fas fa-mobile"></i> Mobile</span><input type="text" value="+91 98XXX 00000"></div></div>' +
                '<div class="setting-group"><h4>Legal Preferences</h4>' + toggle("Case alerts", "Email + SMS for hearings and orders", true, "case-alert") + toggle("Newsletter", "Weekly legal updates digest", false, "legal-news") + "</div>" +
                '<button class="btn btn-primary" style="width:100%;padding:12px">Save Profile</button>';
            box.querySelector(".btn").addEventListener("click", () => toast("Profile preferences saved", "success"));
        } else if (tab === "notification-settings") {
            box.innerHTML = '<div class="setting-group"><h4>Notification Channels</h4>' + toggle("Hearing reminders", "24 hrs before each hearing", true, "hearing") + toggle("Case updates", "Progress on your matters", true, "case") + toggle("AI assistant tips", "Weekly legal tips from LegalAI", false, "tips") + toggle("Marketing offers", "Lawyer promotions & discounts", false, "marketing") + "</div>";
            bindToggles(box);
        } else if (tab === "privacy-settings") {
            box.innerHTML = '<div class="setting-group"><h4>Privacy & Security</h4>' + toggle("Two-factor authentication", "OTP on login for better security", false, "2fa") + toggle("Biometric login", "Fingerprint / Face ID support", true, "bio") + toggle("Data sharing with lawyers", "Share case documents with your counsel", true, "share") + '<div class="setting-row"><span class="sr-label"><i class="fas fa-trash-can"></i> Delete account</span><button class="btn btn-danger btn-sm">Request Deletion</button></div></div>';
            bindToggles(box);
        } else if (tab === "language-settings") {
            box.innerHTML = '<div class="setting-group"><h4>Interface Language</h4><div class="setting-row"><span class="sr-label"><i class="fas fa-globe"></i> Primary language</span><select class="filter-select" style="width:180px;padding:8px">' + ["English", "Hindi", "Tamil", "Telugu", "Bengali", "Marathi"].map((l) => "<option>" + l + "</option>").join("") + "</select></div>" +
                "<p style='font-size:12px;color:var(--text-3);margin-top:8px'>Voice and chat support available in 100+ languages via the AI Assistant.</p></div>";
        } else if (tab === "accessibility-settings") {
            box.innerHTML = '<div class="setting-group"><h4>Accessibility</h4>' + toggle("High contrast mode", "Stronger colors for readability", false, "contrast") + toggle("Larger text", "Increase base font size by 15%", false, "bigtext") + toggle("Reduce motion", "Turn off most animations", false, "motion") + "</div>";
            bindToggles(box);
        } else if (tab === "billing-settings") {
            box.innerHTML = '<div class="setting-group"><h4>Billing Summary</h4>' +
                '<div class="stat-mini"><div class="stat-mini-item"><span>\u20B91,25,000</span><label>Total Engaged</label></div><div class="stat-mini-item"><span>' + bookings.length + '</span><label>Active Bookings</label></div></div>' +
                '<div class="setting-row" style="margin-top:14px"><span class="sr-label"><i class="fas fa-credit-card"></i> Default payment</span><select class="filter-select" style="width:180px;padding:8px"><option>UPI (GPay)</option><option>Credit Card</option><option>Net Banking</option></select></div>' +
                "<p style='font-size:12px;color:var(--text-3);margin-top:10px'>Invoices are generated automatically per consultation and retained for 6 years as required by the Legal Advisory guidelines.</p></div>";
        }
        function bindToggles(scope) {
            $$(".toggle-switch", scope).forEach((t) => t.addEventListener("click", () => { t.classList.toggle("on"); toast(t.dataset.t.replace(/-/g, " ") + " updated", "info"); }));
        }
    }

    /* ================== Language Selector ================== */
    function initLanguage() {
        const grid = $("#language-grid");
        grid.innerHTML = LANGUAGES.map((l) =>
            '<div class="language-card' + (l.code === currentLang ? " active" : "") + '" data-code="' + l.code + '"><div><div class="lang-name">' + esc(l.name) + '</div><div class="lang-native">' + esc(l.native) + "</div></div><span class='lang-code' style='position:static'>" + l.code.toUpperCase() + "</span></div>").join("");
        $$("#language-grid .language-card").forEach((card) => card.addEventListener("click", () => {
            setLanguage(card.dataset.code);
            $("#language-modal").classList.remove("active");
        }));
        $("#language-search").addEventListener("input", (e) => {
            const q = e.target.value.toLowerCase();
            $$("#language-grid .language-card").forEach((c) => c.style.display = c.textContent.toLowerCase().includes(q) ? "" : "none");
        });
        $("#language-btn").addEventListener("click", (e) => { e.stopPropagation(); $("#language-modal").classList.add("active"); });
    }

    function setLanguage(code) {
        currentLang = code;
        const l = langMap[code];
        $(".lang-code").textContent = (l ? l.name : code).slice(0, 2).toUpperCase();
        toast("Interface language set to " + (l ? l.name : code), "success", "Language Updated");
    }

    /* ================== Practice Session (Lawyer) ================== */
function initPractice() {
    const practiceSection = document.getElementById('practice');
    if (!practiceSection) return;
    // ensure the section is shown only when a lawyer is active
    if (currentUser && currentUser.role === 'Lawyer') practiceSection.style.display = '';
    else practiceSection.style.display = 'none';

    const toggleBtn = document.getElementById('practice-toggle');
    const timerEl = document.getElementById('practice-timer');
    const caseSelect = document.getElementById('practice-case-select');
    const transcript = document.getElementById('practice-transcript');
    const practiceCardEl = document.getElementById('practice-card');
    const practiceBadge = document.getElementById('practice-badge');
    const practiceBadgeScore = document.getElementById('practice-badge-score');
    const historyPreview = document.getElementById('practice-history-preview');
    const historyList = document.getElementById('practice-history-list');

    // simple state helper
    function isRunning() { return !!timer; }

    function renderPracticeCard() {
        // expose to global so other modules (login) can refresh it
        window.renderPracticeCard = renderPracticeCard;
        try {
            const saved = store.get('practice_notes', []);
            if (!historyPreview || !historyList) return;
            if (saved && saved.length) {
                historyPreview.style.display = '';
                if (practiceBadge && practiceBadgeScore) {
                    const s0 = saved[0].score;
                    if (typeof s0 === 'number') {
                        practiceBadge.style.display = '';
                        practiceBadgeScore.textContent = s0;
                    } else {
                        practiceBadge.style.display = 'none';
                    }
                }
                historyList.innerHTML = saved.slice(0,5).map((entry) => {
                    const dt = new Date(entry.time).toLocaleString();
                    const sc = (typeof entry.score === 'number') ? ('<span class="ph-score">' + entry.score + '/100</span>') : '';
                    const txt = esc((entry.note || '').slice(0,80)) + ((entry.note || '').length>80? '…':'');
                    return '<li style="padding:8px 0;border-bottom:1px solid var(--border-2);display:flex;justify-content:space-between;align-items:center;gap:8px"><div style="min-width:0"><div style="font-size:12px;color:var(--text-1)">' + txt + '</div><div style="font-size:11px;color:var(--text-3)">' + dt + '</div></div><div>' + sc + '<button class="btn btn-sm btn-secondary practice-load" data-time="' + entry.time + '" style="margin-left:8px">Load</button></div></li>';
                }).join('');
                // attach listeners
                $$('.practice-load', historyList).forEach((btn) => btn.addEventListener('click', (e) => {
                    const t = btn.dataset.time;
                    const savedAll = store.get('practice_notes', []);
                    const entry = savedAll.find(s => String(s.time) === t);
                    if (entry) {
                        if (transcript) transcript.value = entry.note || '';
                        if (caseSelect && entry.case) caseSelect.value = entry.case;
                        if (entry.score !== undefined && feedback) feedback.innerHTML = '<div style="font-weight:700;margin-bottom:8px">Loaded score: ' + entry.score + '/100</div>';
                        currentSection('#practice');
                    }
                }));
            } else {
                historyPreview.style.display = 'none';
                if (practiceBadge) practiceBadge.style.display = 'none';
                historyList.innerHTML = '';
            }
        } catch (e) { console.warn('renderPracticeCard failed', e); }
    }


    const evaluateBtn = document.getElementById('practice-evaluate');
    const feedback = document.getElementById('practice-feedback');
    const saveBtn = document.getElementById('practice-save');

    let timer = null, seconds = 0;
    function fmt(s) { const mm = String(Math.floor(s/60)).padStart(2,'0'); const ss = String(s%60).padStart(2,'0'); return mm+":"+ss; }

    // Start / Stop toggle for a simpler UX
    if (toggleBtn) toggleBtn.addEventListener('click', () => {
        if (!isRunning()) {
            // start
            toggleBtn.textContent = 'Stop Practice';
            toggleBtn.classList.add('active');
            transcript && transcript.focus();
            seconds = 0; timerEl.textContent = fmt(seconds);
            timer = setInterval(() => { seconds++; timerEl.textContent = fmt(seconds); }, 1000);
            toast('Practice session started', 'info');
        } else {
            // stop
            clearInterval(timer); timer = null;
            toggleBtn.textContent = 'Start Practice';
            toggleBtn.classList.remove('active');
            toast('Practice session stopped', 'success');
        }
    });

    if (caseSelect) caseSelect.addEventListener('change', () => {
        const v = caseSelect.value;
        if (v === 'criminal-bail') transcript.value = 'Practice prompt: Represent client for a bail application in a non-bailable offence. Focus on urgency, community ties and lack of flight risk.';
        else if (v === 'family-custody') transcript.value = 'Practice prompt: Argue for interim custody emphasizing welfare of child and parent-child bond.';
        else if (v === 'consumer-delay') transcript.value = 'Practice prompt: Draft opening for consumer claim based on delay in possession and losses incurred.';
        else if (v === 'corporate-dispute') transcript.value = 'Practice prompt: Argue against board resolution validity on grounds of procedure breach.';
    });

    if (evaluateBtn) evaluateBtn.addEventListener('click', () => {
        // stop running timer first for a stable evaluation
        if (isRunning()) { clearInterval(timer); timer = null; if (toggleBtn) { toggleBtn.textContent = 'Start Practice'; toggleBtn.classList.remove('active'); } }
        const text = (transcript && transcript.value || '').trim();
        if (!text) { toast('Write or paste your argument before evaluating', 'warning'); return; }
        // Heuristic rubric scoring (client-side only)
        const words = text.split(/\s+/).filter(Boolean).length;
        const sentences = text.split(/[.!?]+/).map(s=>s.trim()).filter(Boolean).length || 1;
        const avgWordsPerSentence = words / sentences;

        // Structure (0-30): detect presence of Issue / Rule / Application / Conclusion
        const structTokens = ['issue','rule','application','conclusion','analysis','submit','submissions'];
        let foundStruct = 0;
        structTokens.forEach(tok => { if (new RegExp('\\b'+tok+'\\b','i').test(text)) foundStruct++; });
        let structureScore = Math.round(Math.min(30, (foundStruct / structTokens.length) * 30 + (Math.min(400, words) / 400) * 8));

        // Legal accuracy & citations (0-30): look for Section/Article/Act/IPC and numeric section patterns
        let legalMatches = 0;
        if (/\b(section|sec\.?|article|art\.?|act|ipc|code)\b/i.test(text)) legalMatches += 1;
        if (/section\s*\d+/i.test(text) || /s\.?\s*\d+/i.test(text) || /article\s*\d+/i.test(text)) legalMatches += 1;
        if (/\b(case|v\.|versus)\b/i.test(text)) legalMatches += 1;
        let legalScore = Math.min(30, legalMatches * 10 + (foundStruct > 1 ? 4 : 0));

        // Clarity & concision (0-20): ideal avg words per sentence between 8 and 18
        let clarityScore = 0;
        const ideal = 13;
        const diff = Math.abs(avgWordsPerSentence - ideal);
        clarityScore = Math.max(0, Math.round(20 - Math.min(20, (diff / ideal) * 20)));

        // Persuasiveness (0-10): presence of persuasive connectors / assertive language
        const persuasiveTokens = ['therefore','hence','thus','accordingly','submit','respectfully','we submit','strongly','demonstrate','clearly'];
        let pcount = 0; persuasiveTokens.forEach(tok => { if (new RegExp('\\b'+tok+'\\b','i').test(text)) pcount++; });
        let persuasionScore = Math.min(10, pcount * 2 + (words > 80 ? 2 : 0));

        // Time management (0-10): prefer concise practice under 5 minutes. If timer running use seconds else neutral 6
        let secs = 0;
        if (timerEl && timerEl.textContent) {
            const parts = timerEl.textContent.split(':').map(Number);
            secs = (parts[0] || 0) * 60 + (parts[1] || 0);
        }
        let timeScore = 6;
        if (secs > 0) {
            timeScore = Math.max(0, Math.round(10 * Math.max(0, 1 - secs / 300)));
        }

        const total = structureScore + legalScore + clarityScore + persuasionScore + timeScore;
        // choose tip based on lowest component
        const comps = [
            {key:'Structure',score:structureScore,tip:'Follow the Issue → Rule → Application → Conclusion structure closely and label sections.'},
            {key:'Legal accuracy',score:legalScore,tip:'Cite specific statutes or recent precedent by name/section where relevant.'},
            {key:'Clarity',score:clarityScore,tip:'Shorten long sentences and focus on one legal point per paragraph.'},
            {key:'Persuasiveness',score:persuasionScore,tip:'Use clear signposting (therefore, hence) and assertive conclusions.'},
            {key:'Time management',score:timeScore,tip:'Aim for a 2-4 minute opening; practice with the timer.'}
        ];
        comps.sort((a,b)=>a.score-b.score);
        const lowest = comps[0];

        // Build breakdown HTML
        const pct = (n, max) => Math.round((n/max)*100);
        const breakdownHtml = comps.map(c => {
            const w = c.key === 'Structure' ? 30 : c.key === 'Legal accuracy' ? 30 : c.key === 'Clarity' ? 20 : c.key === 'Persuasion' ? 10 : 10;
            const displayScore = c.score;
            const percent = pct(displayScore, w);
            return '<div style="margin-bottom:8px"><div style="display:flex;justify-content:space-between;font-size:13px"><div><strong>' + esc(c.key) + '</strong></div><div>' + displayScore + '/' + w + '</div></div><div style="background:var(--border-2);height:8px;border-radius:6px;overflow:hidden;margin-top:6px"><div style="width:' + percent + '%;height:8px;background:linear-gradient(90deg,var(--indigo),var(--success));"></div></div></div>';
        }).join('');

        if (feedback) feedback.innerHTML = '<div style="font-weight:700;margin-bottom:8px">Total: ' + total + '/100</div><div style="margin-bottom:8px;color:var(--text-2)">Top tip: ' + esc(lowest.tip) + '</div>';
        const breakdownBox = document.getElementById('practice-breakdown');
        if (breakdownBox) breakdownBox.innerHTML = breakdownHtml;
        // Save evaluation into history
        try {
            const saved = store.get('practice_notes', []);
            saved.unshift({ time: Date.now(), note: text, case: caseSelect ? caseSelect.value : '', score: total, duration: secs });
            store.set('practice_notes', saved.slice(0, 50));
        } catch (e) { console.warn('failed saving practice note', e); }
        renderPracticeCard();
        toast('Practice evaluated — score ' + total + '/100', 'success', 'Evaluation');
    });

    if (saveBtn) saveBtn.addEventListener('click', () => {
        const text = (transcript && transcript.value || '').trim();
        if (!text) { toast('Nothing to save', 'warning'); return; }
        const saved = store.get('practice_notes', []);
        saved.unshift({ time: Date.now(), note: text, case: caseSelect ? caseSelect.value : '' });
        store.set('practice_notes', saved.slice(0, 50));
        renderPracticeCard();
        toast('Practice notes saved', 'success');
    });
    renderPracticeCard();
}

/* ================== Init ================== */
    document.addEventListener("DOMContentLoaded", () => {
        bootLoading();
        initAuth();
        initNav();
        initLawyers();
        initAssistant();
        initConstitution();
        initCaseSearch();
        initCallBot();
        initComplaints();
        initCourts();
        initPanels();
        initLanguage();
        initPractice();
        // Wire practice open button on dashboard
        const pc = document.getElementById('practice-open');
        if (pc) pc.addEventListener('click', () => {
            // Only open if currentUser is a lawyer
            if (currentUser && currentUser.role === 'Lawyer') {
                currentSection('#practice');
            } else {
                toast('Practice Room available for verified lawyers only', 'warning');
            }
        });
        if (currentUser) initDashboard();
    });
})();
