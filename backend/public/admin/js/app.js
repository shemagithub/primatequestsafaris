const TOKEN_KEY = "pq_admin_token";
const API = "/api";

const state = {
  admin: null,
  dashboard: null,
  tours: [],
  gallery: [],
  inquiries: [],
  testimonials: [],
  faqs: [],
  subscribers: [],
  posts: [],
  settings: {},
  inquiryFilter: "all",
  inquirySearch: "",
  editing: null,
  galleryEdit: null,
  menuOpen: false,
  searchTimer: null,
};

const CLEAN_CONSERVATION_BODY =
  "The survival of the mountain gorilla is one of the world's greatest conservation success stories. We dedicate a percentage of our profits to grassroots conservation efforts that protect forests, wildlife, and the communities who live beside them.";

function cleanSettings(settings) {
  const next = { ...(settings || {}) };
  delete next.about_partner_title;
  delete next.about_partner_body;
  delete next.about_partner_cta;
  if (/Rwanda Development Board|RDB Partner|\bRDB\b/i.test(next.conservation_body || "")) {
    next.conservation_body = CLEAN_CONSERVATION_BODY;
  }
  return next;
}

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const token = () => localStorage.getItem(TOKEN_KEY);
const escapeHtml = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const nl = (value) => escapeHtml(value).replaceAll("\n", "<br>");

function toast(message, type = "ok") {
  const el = document.createElement("div");
  el.className = `toast ${type === "error" ? "error" : ""}`;
  el.innerHTML = `<span class="toast-dot"></span><span>${escapeHtml(message)}</span>`;
  $("#toasts").appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

let confirmOpen = false;

function confirmCard({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = true,
  icon = "alert-triangle",
} = {}) {
  return new Promise((resolve) => {
    if (confirmOpen) {
      resolve(false);
      return;
    }
    confirmOpen = true;
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay confirm-overlay";
    overlay.innerHTML = `
      <div class="modal modal-card modal-confirm" role="alertdialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-copy">
        <div class="confirm-icon ${danger ? "danger" : "gold"}">
          <i data-lucide="${escapeHtml(icon)}"></i>
        </div>
        <h2 id="confirm-title">${escapeHtml(title)}</h2>
        <p id="confirm-copy">${escapeHtml(message)}</p>
        <div class="confirm-actions">
          <button type="button" class="btn ghost" data-confirm="no">${escapeHtml(cancelLabel)}</button>
          <button type="button" class="btn ${danger ? "danger" : "gold"}" data-confirm="yes">${escapeHtml(confirmLabel)}</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    document.body.classList.add("modal-open");
    icons();
    overlay.querySelector('[data-confirm="no"]')?.focus();

    const finish = (ok) => {
      if (!confirmOpen) return;
      confirmOpen = false;
      window.removeEventListener("keydown", onKey, true);
      overlay.remove();
      document.body.classList.toggle("modal-open", Boolean(state.galleryEdit));
      resolve(ok);
    };
    const onKey = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      finish(false);
    };
    window.addEventListener("keydown", onKey, true);
    overlay.addEventListener("click", (event) => {
      event.stopPropagation();
      if (!event.target.closest(".modal")) {
        finish(false);
        return;
      }
      const choice = event.target.closest("[data-confirm]")?.dataset.confirm;
      if (choice === "yes") finish(true);
      if (choice === "no") finish(false);
    });
  });
}

function route() {
  const hash = location.hash.replace(/^#/, "") || "/dashboard";
  const parts = hash.split("/").filter(Boolean);
  return { path: `/${parts.join("/")}`, parts };
}

async function api(path, { method = "GET", json, form } = {}) {
  const headers = {};
  if (token()) headers.Authorization = `Bearer ${token()}`;
  let body;
  if (json) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  } else if (form) {
    body = form;
  }
  const res = await fetch(API + path, { method, headers, body });
  const data = await res.json().catch(() => ({}));
  if (res.status === 401) {
    if (path !== "/auth/login") {
      localStorage.removeItem(TOKEN_KEY);
      state.admin = null;
      render();
    }
    throw new Error(data.error || "Please sign in.");
  }
  if (!res.ok) throw new Error(data.error || "Request failed.");
  return data;
}

async function uploadFile(file) {
  const form = new FormData();
  form.append("file", file);
  return api("/admin/upload", { method: "POST", form });
}

function icons() {
  if (window.lucide) window.lucide.createIcons();
}

function setLocks() {
  document.body.classList.toggle("nav-open", Boolean(state.menuOpen));
  document.body.classList.toggle("modal-open", Boolean(state.galleryEdit));
}

function applyImage(picker, url) {
  if (!picker) return;
  const value = String(url || "").trim();
  const img = $(".img-preview", picker);
  const placeholder = $(".img-picker-placeholder", picker);
  const input = $(".img-url", picker);
  if (input && input.value !== value) input.value = value;
  if (img) {
    img.src = value;
    img.hidden = !value;
  }
  if (placeholder) placeholder.hidden = Boolean(value);
}

function field({
  name,
  label,
  type = "text",
  value = "",
  placeholder = "",
  required = false,
  hint = "",
  icon = "",
  extra = "",
  multiline = false,
  autocomplete = "",
  minlength = "",
} = {}) {
  const req = required ? "required" : "";
  const star = required ? ` <span class="req">*</span>` : "";
  const auto = autocomplete ? `autocomplete="${escapeHtml(autocomplete)}"` : "";
  const min = minlength ? `minlength="${escapeHtml(String(minlength))}"` : "";
  const control = multiline
    ? `<textarea name="${escapeHtml(name)}" placeholder="${escapeHtml(placeholder)}" ${req}>${escapeHtml(value)}</textarea>`
    : `<input type="${escapeHtml(type)}" name="${escapeHtml(name)}" value="${escapeHtml(value)}" placeholder="${escapeHtml(placeholder)}" ${req} ${auto} ${min} />`;
  return `<div class="field ${extra}">
    <label>${label}${star}</label>
    <div class="field-shell ${icon ? "has-icon" : ""} ${multiline ? "is-area" : ""}">
      ${icon ? `<i data-lucide="${icon}"></i>` : ""}
      ${control}
    </div>
    ${hint ? `<p class="field-hint">${hint}</p>` : ""}
  </div>`;
}

function imagePicker({ name = "", value = "", placeholder = "Paste an image URL or /uploads/photo.jpg" } = {}) {
  const src = value || "";
  const nameAttr = name ? `name="${escapeHtml(name)}"` : "";
  return `
    <div class="img-picker">
      <div class="img-picker-frame">
        <img class="img-preview" src="${escapeHtml(src)}" alt="" ${src ? "" : "hidden"} />
        <div class="img-picker-placeholder" ${src ? "hidden" : ""}>
          <i data-lucide="image-plus"></i>
          <span>Drop, upload, or paste a link</span>
        </div>
      </div>
      <div class="img-picker-controls">
        <input type="text" class="img-url" ${nameAttr} value="${escapeHtml(src)}" placeholder="${escapeHtml(placeholder)}" inputmode="url" autocomplete="off" />
        <div class="img-picker-actions">
          <label class="btn sm ghost img-upload-btn">
            <i data-lucide="upload"></i> Upload file
            <input type="file" accept="image/*" />
          </label>
          <button type="button" class="btn sm ghost" data-action="clear-image">Clear</button>
        </div>
        <p class="img-picker-hint">Upload a photo, drop one here, or paste a full image link.</p>
      </div>
    </div>`;
}

function navItem(href, icon, label, count) {
  const current = route().path;
  const active = current === href || current.startsWith(`${href}/`);
  return `<a href="#${href}" class="${active ? "active" : ""}">
    <i data-lucide="${icon}"></i> ${label}
    ${count ? `<span class="badge">${count}</span>` : ""}
  </a>`;
}

function layout(title, subtitle, inner, actions = "") {
  const newCount = state.dashboard?.stats?.newInquiries || 0;
  const logo = state.settings?.logo || "/uploads/logo.png";
  return `
    <div class="shell ${state.menuOpen ? "open" : ""}">
      <div class="sidebar-overlay" data-action="close-menu"></div>
      <aside class="sidebar">
        <div class="brand">
          <img src="${escapeHtml(logo)}" alt="Primate Quest" />
          <div>
            <strong>Primate Quest</strong>
            <span>Admin Panel</span>
          </div>
        </div>
        <nav class="nav">
          ${navItem("/dashboard", "layout-dashboard", "Dashboard")}
          ${navItem("/home", "house", "Home page")}
          ${navItem("/tours", "map", "Tours")}
          ${navItem("/about", "book-open", "About page")}
          ${navItem("/blog", "pen-line", "Blog")}
          ${navItem("/inquiries", "inbox", "Inquiries", newCount)}
          ${navItem("/gallery", "images", "Gallery")}
          ${navItem("/testimonials", "quote", "Testimonials")}
          ${navItem("/faqs", "help-circle", "FAQs")}
          ${navItem("/subscribers", "mail", "Subscribers")}
          ${navItem("/settings", "settings", "Settings")}
        </nav>
        <div class="sidebar-foot">
          <p>${escapeHtml(state.admin?.name || "Administrator")}<br>${escapeHtml(state.admin?.email || "")}</p>
          <button class="btn ghost" data-action="logout"><i data-lucide="log-out"></i> Sign out</button>
        </div>
      </aside>
      <section class="main">
        <div class="topbar">
          <div class="topbar-left">
            <button class="menu-toggle" type="button" data-action="toggle-menu" aria-label="Open menu">
              <i data-lucide="${state.menuOpen ? "x" : "menu"}"></i>
            </button>
            <div>
              <h1>${title}</h1>
              <p>${subtitle}</p>
            </div>
          </div>
          <div class="toolbar">${actions}</div>
        </div>
        <div class="content">${inner}</div>
      </section>
    </div>`;
}

function loginView() {
  return `
    <div class="login-shell">
      <div class="login-art">
        <div class="login-brand">
          <img src="/uploads/logo.png" alt="Primate Quest" />
        </div>
        <p class="eyebrow">Primate Quest Safaris</p>
        <h1>Command<br>the wild.</h1>
        <p>Manage expeditions, bookings, gallery, and every story on the website from one place.</p>
      </div>
      <div class="login-panel">
        <form class="login-card" id="login-form">
          <h2>Welcome back</h2>
          <p class="sub">Sign in to the operations desk. Default login is already filled in.</p>
          ${field({ name: "email", label: "Email", type: "email", value: "admin@primatesquest.com", placeholder: "you@studio.com", required: true, icon: "mail", autocomplete: "username" })}
          <div style="height:16px"></div>
          ${field({ name: "password", label: "Password", type: "password", value: "Admin@12345", placeholder: "Your password", required: true, icon: "lock", autocomplete: "current-password" })}
          <div style="height:24px"></div>
          <button class="btn gold" type="submit">Enter admin</button>
          <p class="login-hint">Works on phone, tablet, and desktop. Use the sidebar menu on smaller screens.</p>
        </form>
      </div>
    </div>`;
}

function statCard(icon, label, value, hint) {
  return `<div class="stat">
    <div class="stat-icon"><i data-lucide="${icon}"></i></div>
    <div>
      <div class="label">${label}</div>
      <div class="value">${value}</div>
      <div class="hint">${hint}</div>
    </div>
  </div>`;
}

function dashboardView() {
  const s = state.dashboard?.stats || {};
  const recent = state.dashboard?.recentInquiries || [];
  const statuses = state.dashboard?.inquiryStatus || [];
  return layout(
    "Dashboard",
    "A live view of the safari operation.",
    `
    <div class="stats">
      ${statCard("map", "Tours", s.tours || 0, `${s.publishedTours || 0} live on the site`)}
      ${statCard("pen-line", "Blog posts", s.posts || 0, "Stories on the Journal")}
      ${statCard("inbox", "Inquiries", s.inquiries || 0, `${s.newInquiries || 0} waiting for reply`)}
      ${statCard("images", "Gallery", s.gallery || 0, "Photos on Visual Journey")}
      ${statCard("mail", "Subscribers", s.subscribers || 0, "Wild Circle list")}
    </div>
    <div class="grid-2">
      <div class="card">
        <div class="card-head"><h2>Latest inquiries</h2><a class="btn sm ghost" href="#/inquiries">View all</a></div>
        ${recent.length ? `
          <div class="table-wrap"><table class="stack-table">
            <thead><tr><th>Guest</th><th>Tour</th><th>Status</th><th></th></tr></thead>
            <tbody>
              ${recent.map((item) => `
                <tr>
                  <td data-label="Guest"><strong>${escapeHtml(item.name)}</strong><br><span class="meta">${escapeHtml(item.email)}</span></td>
                  <td data-label="Tour">${escapeHtml(item.tourTitle)}</td>
                  <td data-label="Status"><span class="badge ${item.status}">${item.status}</span></td>
                  <td class="row-actions"><a class="btn sm ghost" href="#/inquiries/${item.id}">Open</a></td>
                </tr>`).join("")}
            </tbody>
          </table></div>` : `<div class="empty"><i data-lucide="inbox"></i>No inquiries yet.</div>`}
      </div>
      <div class="card">
        <div class="card-head"><h2>Pipeline</h2></div>
        <div class="pipeline">
        ${["new","contacted","quoted","booked","closed"].map((status) => {
          const count = Number(statuses.find((row) => row.status === status)?.count || 0);
          const max = Math.max(1, ...["new","contacted","quoted","booked","closed"].map((key) => Number(statuses.find((row) => row.status === key)?.count || 0)));
          const width = Math.round((count / max) * 100);
          return `<div class="pipeline-row">
            <span class="badge ${status}">${status}</span>
            <div class="bar"><span style="width:${width}%"></span></div>
            <strong>${count}</strong>
          </div>`;
        }).join("")}
        </div>
      </div>
    </div>`,
  );
}

function toursView() {
  return layout(
    "Tours",
    "Every expedition that appears on the website.",
    state.tours.length
      ? `<div class="tour-grid">${state.tours.map((tour) => `
          <article class="tour-card">
            ${tour.featured ? `<div class="ribbon">Signature</div>` : ""}
            <div class="media"><img src="${escapeHtml(tour.image || "/uploads/hero-gorilla.jpg")}" alt="" /></div>
            <div class="body">
              <h3>${escapeHtml(tour.title)}</h3>
              <div class="meta"><span>${escapeHtml(tour.duration)}</span><span>${escapeHtml(tour.park)}</span></div>
              <p class="price-line">${escapeHtml(tour.price)}</p>
              <div class="row-actions">
                <span class="badge ${tour.published ? "on" : "off"}">${tour.published ? "Live" : "Hidden"}</span>
                <a class="btn sm gold" href="#/tours/${tour.dbId}">Edit</a>
                <button class="btn sm danger" data-action="delete-tour" data-id="${tour.dbId}">Delete</button>
              </div>
            </div>
          </article>`).join("")}</div>`
      : `<div class="empty"><i data-lucide="map"></i>No tours yet. Add your first expedition.</div>`,
    `<a class="btn gold" href="#/tours/new"><i data-lucide="plus"></i> New tour</a>`,
  );
}

function dateFieldValue(value) {
  if (!value) return "";
  const text = String(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);
  const parsed = new Date(text);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
}

function postsView() {
  return layout(
    "Blog",
    "Stories on /blog — write, hide, or delete posts here.",
    state.posts.length
      ? `<div class="tour-grid">${state.posts.map((post) => `
          <article class="tour-card">
            <div class="media"><img src="${escapeHtml(post.image || "/uploads/rwanda-hills.jpg")}" alt="" /></div>
            <div class="body">
              <h3>${escapeHtml(post.title)}</h3>
              <div class="meta"><span>${escapeHtml(post.category || "Safari")}</span><span>${escapeHtml(dateFieldValue(post.publishedAt) || "Draft")}</span></div>
              <p class="price-line">${escapeHtml(post.excerpt || "").slice(0, 110)}${(post.excerpt || "").length > 110 ? "…" : ""}</p>
              <div class="row-actions">
                <span class="badge ${post.published ? "on" : "off"}">${post.published ? "Live" : "Hidden"}</span>
                <a class="btn sm gold" href="#/blog/${post.dbId}">Edit</a>
                <button class="btn sm danger" data-action="delete-post" data-id="${post.dbId}">Delete</button>
              </div>
            </div>
          </article>`).join("")}</div>`
      : `<div class="empty"><i data-lucide="pen-line"></i>No posts yet. Write your first journal story.</div>`,
    `<a class="btn gold" href="#/blog/new"><i data-lucide="plus"></i> New post</a>`,
  );
}

function postFormView() {
  const post = state.editing || {
    title: "",
    slug: "",
    excerpt: "",
    body: "",
    image: "",
    gallery: [],
    category: "Safari",
    author: "Primate Quest Safaris",
    published: true,
    publishedAt: "",
  };
  const isNew = route().parts[1] === "new";
  const categories = ["Gorillas", "Primates", "Safari", "Conservation", "Travel tips"];
  const currentCat = post.category || "Safari";
  if (currentCat && !categories.includes(currentCat)) categories.unshift(currentCat);
  return layout(
    isNew ? "New blog post" : "Edit blog post",
    "This appears on the Blog page and the individual story page.",
    `<form id="post-form" class="panel">
      <div class="panel-head"><span class="dot"></span><h2>Story</h2></div>
      <p class="field-hint" style="margin:0 0 16px">Save, then refresh the public website. Uncheck Published to keep a draft off /blog.</p>
      <div class="form-grid">
        ${field({ name: "title", label: "Title", value: post.title, placeholder: "How to prepare for a gorilla trek", required: true, extra: "full" })}
        ${field({ name: "slug", label: "URL slug", value: post.slug || "", placeholder: "how-to-prepare-for-gorilla-trekking", hint: "Shown as /blog/your-slug. Leave blank to generate from the title." })}
        <div class="field">
          <label>Category</label>
          <div class="field-shell">
            <select name="category">${categories.map((cat) => `<option value="${escapeHtml(cat)}" ${cat === currentCat ? "selected" : ""}>${escapeHtml(cat)}</option>`).join("")}</select>
          </div>
        </div>
        ${field({ name: "author", label: "Author", value: post.author || "Primate Quest Safaris" })}
        ${field({ name: "publishedAt", label: "Publish date", type: "date", value: dateFieldValue(post.publishedAt) })}
        <div class="switch"><input type="checkbox" name="published" ${post.published ? "checked" : ""} /> Published on website</div>
        ${field({ name: "excerpt", label: "Short summary", value: post.excerpt || "", placeholder: "One or two sentences for the Blog listing…", multiline: true, extra: "full" })}
        ${field({ name: "body", label: "Full story", value: post.body || "", placeholder: "Write the article. Use a blank line between paragraphs.", multiline: true, extra: "full is-story", hint: "Press Enter twice for a new paragraph. Story photos appear between paragraphs in order. Optional: put [photo] on its own line to place the next photo exactly there." })}
        <div class="field full"><label>Cover photo</label>${imagePicker({ name: "image", value: post.image || "" })}<p class="field-hint">The large photo at the top of the story.</p></div>
        <div class="field full"><label>Story photos</label>
          <p class="field-hint" style="margin:0 0 10px">These appear in the article between paragraphs, in this order. Add a caption under each photo.</p>
          ${galleryEditor(post.gallery && post.gallery.length ? post.gallery : [{ src: "", caption: "" }])}
        </div>
      </div>
      <div class="toolbar" style="margin-top:24px">
        <button class="btn gold" type="submit">Save post</button>
        <a class="btn ghost" href="#/blog">Cancel</a>
      </div>
    </form>`,
    `<a class="btn sm ghost" href="/blog" target="_blank" rel="noopener">View live blog</a>`,
  );
}

function listEditor(name, items, placeholder) {
  return `
    <div class="repeater" data-list="${name}">
      ${(items || []).map((item) => `
        <div class="repeater-row">
          <input type="text" value="${escapeHtml(item)}" placeholder="${placeholder}" />
          <button type="button" class="btn sm danger" data-action="remove-row">×</button>
        </div>`).join("")}
    </div>
    <button type="button" class="btn sm ghost" data-action="add-row" data-list="${name}" style="margin-top:8px">Add item</button>`;
}

function itineraryEditor(items) {
  return `
    <div class="repeater" data-list="itinerary">
      ${(items || []).map((item) => `
        <div class="itinerary-row">
          <input type="number" min="1" value="${escapeHtml(item.day)}" placeholder="Day" />
          <div>
            <input type="text" value="${escapeHtml(item.title)}" placeholder="Title" />
            <textarea placeholder="What happens this day">${escapeHtml(item.body)}</textarea>
          </div>
          <button type="button" class="btn sm danger" data-action="remove-row">×</button>
        </div>`).join("")}
    </div>
    <button type="button" class="btn sm ghost" data-action="add-itinerary" style="margin-top:8px">Add day</button>`;
}

function galleryItemEditor(item = {}) {
  return `
    <div class="repeater-row">
      <div>
        ${imagePicker({ name: "", value: item.src || "", placeholder: "Paste image URL" })}
        <input type="hidden" class="gallery-src" value="${escapeHtml(item.src || "")}" />
        <div style="height:8px"></div>
        <input type="text" class="gallery-caption" value="${escapeHtml(item.caption || "")}" placeholder="Caption" />
      </div>
      <button type="button" class="btn sm danger" data-action="remove-row">×</button>
    </div>`;
}

function galleryEditor(items) {
  return `
    <div class="repeater" data-list="gallery">
      ${(items || []).map((item) => galleryItemEditor(item)).join("")}
    </div>
    <button type="button" class="btn sm ghost" data-action="add-gallery" style="margin-top:8px">Add photo</button>`;
}

function tourFormView() {
  const tour = state.editing || {
    title: "", slug: "", park: "", duration: "", price: "", description: "",
    longDescription: "", difficulty: "", bestTime: "", groupSize: "", image: "",
    featured: false, published: true, sortOrder: 0, highlights: [""], itinerary: [{ day: 1, title: "", body: "" }],
    inclusions: [""], exclusions: [""], gallery: [{ src: "", caption: "" }],
  };
  const isNew = route().parts[1] === "new";
  return layout(
    isNew ? "New tour" : "Edit tour",
    "This content appears on the Tours page and the expedition detail page.",
    `<form id="tour-form" class="panel">
      <div class="panel-head"><span class="dot"></span><h2>Expedition details</h2></div>
      <div class="form-grid">
        ${field({ name: "title", label: "Title", value: tour.title, placeholder: "Mountain Gorilla Trekking", required: true })}
        ${field({ name: "slug", label: "Slug / URL", value: tour.slug || "", placeholder: "gorilla-trekking" })}
        ${field({ name: "park", label: "Park / region", value: tour.park || "", placeholder: "Volcanoes National Park" })}
        ${field({ name: "duration", label: "Duration", value: tour.duration || "", placeholder: "3 days" })}
        ${field({ name: "price", label: "Price", value: tour.price || "", placeholder: "From $1,500" })}
        ${field({ name: "sortOrder", label: "Sort order", type: "number", value: String(tour.sortOrder || 0) })}
        ${field({ name: "description", label: "Short description", value: tour.description || "", placeholder: "A short summary for tour cards…", multiline: true, extra: "full" })}
        ${field({ name: "longDescription", label: "Long description", value: tour.longDescription || "", placeholder: "The full story of the expedition…", multiline: true, extra: "full" })}
        ${field({ name: "difficulty", label: "Difficulty", value: tour.difficulty || "", placeholder: "Moderate" })}
        ${field({ name: "bestTime", label: "Best time", value: tour.bestTime || "", placeholder: "June – September" })}
        ${field({ name: "groupSize", label: "Group size", value: tour.groupSize || "", placeholder: "Max 8 guests" })}
        <div class="switch"><input type="checkbox" name="featured" ${tour.featured ? "checked" : ""} /> Signature / featured</div>
        <div class="switch"><input type="checkbox" name="published" ${tour.published ? "checked" : ""} /> Published on website</div>
        <div class="field full"><label>Cover image</label>${imagePicker({ name: "image", value: tour.image || "" })}</div>
        <div class="field full"><label>Highlights</label>${listEditor("highlights", tour.highlights, "Highlight")}</div>
        <div class="field full"><label>Day by day itinerary</label>${itineraryEditor(tour.itinerary)}</div>
        <div class="field full"><label>What's included</label>${listEditor("inclusions", tour.inclusions, "Included item")}</div>
        <div class="field full"><label>Not included</label>${listEditor("exclusions", tour.exclusions, "Excluded item")}</div>
        <div class="field full"><label>Tour gallery</label>${galleryEditor(tour.gallery)}</div>
      </div>
      <div class="toolbar" style="margin-top:24px">
        <button class="btn gold" type="submit">Save tour</button>
        <a class="btn ghost" href="#/tours">Cancel</a>
      </div>
    </form>`,
  );
}

function filteredInquiries() {
  const filter = state.inquiryFilter;
  const q = state.inquirySearch.toLowerCase();
  return state.inquiries.filter((item) => {
    const matchStatus = filter === "all" || item.status === filter;
    const hay = `${item.name} ${item.email} ${item.tourTitle} ${item.phone}`.toLowerCase();
    return matchStatus && (!q || hay.includes(q));
  });
}

function inquiriesTableHtml() {
  const rows = filteredInquiries();
  if (!rows.length) return `<div class="empty"><i data-lucide="search"></i>No inquiries in this view.</div>`;
  return `<div class="table-wrap"><table class="stack-table">
        <thead><tr><th>Guest</th><th>Tour</th><th class="hide-sm">Dates</th><th class="hide-sm">Guests</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${rows.map((item) => `
            <tr>
              <td data-label="Guest"><strong>${escapeHtml(item.name)}</strong><br>${escapeHtml(item.email)}</td>
              <td data-label="Tour">${escapeHtml(item.tourTitle)}</td>
              <td class="hide-sm" data-label="Dates">${escapeHtml(item.dates)}</td>
              <td class="hide-sm" data-label="Guests">${item.guests}</td>
              <td data-label="Status"><span class="badge ${item.status}">${item.status}</span></td>
              <td class="row-actions">
                <a class="btn sm gold" href="#/inquiries/${item.id}">Open</a>
                <button class="btn sm danger" data-action="delete-inquiry" data-id="${item.id}">Delete</button>
              </td>
            </tr>`).join("")}
        </tbody>
      </table></div>`;
}

function inquiriesView() {
  const filter = state.inquiryFilter;
  return layout(
    "Inquiries",
    "Booking requests from the contact form.",
    `
    <div class="filters">
      ${["all","new","contacted","quoted","booked","closed"].map((status) =>
        `<button class="chip ${filter === status ? "active" : ""}" data-action="filter-inquiries" data-status="${status}">${status}</button>`
      ).join("")}
      <div class="search field-shell has-icon"><i data-lucide="search"></i><input type="search" id="inquiry-search" placeholder="Search guests..." value="${escapeHtml(state.inquirySearch)}" /></div>
    </div>
    <div class="card" id="inquiries-table">${inquiriesTableHtml()}</div>`,
  );
}

function inquiryDetailView() {
  const item = state.editing;
  if (!item) return layout("Inquiry", "", `<div class="empty">Not found.</div>`);
  return layout(
    item.name,
    `${item.tourTitle} · ${new Date(item.createdAt).toLocaleString()}`,
    `<div class="grid-2">
      <div class="panel">
        <div class="panel-head"><span class="dot"></span><h2>Guest details</h2></div>
        <div class="detail-grid">
          <div><span>Expeditions</span>${escapeHtml(item.tourTitle)}</div>
          <div><span>Email</span><a href="mailto:${escapeHtml(item.email)}">${escapeHtml(item.email)}</a></div>
          <div><span>Phone</span>${item.phone ? `<a href="tel:${escapeHtml(item.phone)}">${escapeHtml(item.phone)}</a>` : "—"}</div>
          <div><span>Country</span>${escapeHtml(item.country)}</div>
          <div><span>Language</span>${escapeHtml(item.language)}</div>
          <div><span>Dates</span>${escapeHtml(item.dates)}</div>
          <div><span>Guests</span>${item.guests}</div>
          <div><span>Budget</span>${escapeHtml(item.budgetLabel)}</div>
          <div><span>Source</span>${escapeHtml(item.source || "—")}</div>
          <div><span>WhatsApp first</span>${item.whatsappPref ? "Yes" : "No"}</div>
          <div><span>Dietary</span>${escapeHtml(item.dietary || "—")}</div>
          <div class="full" style="grid-column:1/-1"><span>Message</span>${nl(item.message || "—")}</div>
        </div>
      </div>
      <form class="panel" id="inquiry-form">
        <div class="panel-head"><span class="dot"></span><h2>Follow-up</h2></div>
        <label>Status</label>
        <div class="field-shell" style="margin-bottom:16px">
        <select name="status">${["new","contacted","quoted","booked","closed"].map((status) =>
          `<option value="${status}" ${item.status === status ? "selected" : ""}>${status}</option>`).join("")}</select>
        </div>
        ${field({ name: "notes", label: "Internal notes", value: item.notes || "", placeholder: "Follow-up details, lodge preferences, permit status…", multiline: true })}
        <div class="toolbar" style="margin-top:18px">
          <button class="btn gold" type="submit">Save</button>
          <a class="btn ghost" href="#/inquiries">Back</a>
        </div>
      </form>
    </div>`,
  );
}

function galleryEditModal(item) {
  return `
    <div class="modal-overlay" data-action="close-modal">
      <div class="modal modal-card" role="dialog" aria-modal="true">
        <div class="modal-head">
          <h2>Edit photo</h2>
          <button type="button" class="btn sm ghost" data-action="close-modal" aria-label="Close"><i data-lucide="x"></i></button>
        </div>
        <form id="gallery-edit-form">
          <input type="hidden" name="id" value="${item.id}" />
          <div class="form-grid">
            <div class="full"><label>Image</label>${imagePicker({ name: "src", value: item.src || "" })}</div>
            ${field({ name: "alt", label: "Caption / alt text", value: item.alt || "", placeholder: "Describe the photo", required: true })}
            <div class="field">
              <label>Category</label>
              <div class="field-shell">
              <select name="category">
                ${["Gorillas","Primates","Landscapes","Safari"].map((cat) =>
                  `<option ${item.category === cat ? "selected" : ""}>${cat}</option>`).join("")}
              </select>
              </div>
            </div>
            ${field({ name: "sortOrder", label: "Sort order", type: "number", value: String(item.sortOrder || 0) })}
          </div>
          <div class="toolbar" style="margin-top:18px">
            <button class="btn gold" type="submit">Save photo</button>
            <button class="btn ghost" type="button" data-action="close-modal">Cancel</button>
          </div>
        </form>
      </div>
    </div>`;
}

function galleryView() {
  return layout(
    "Gallery",
    "Photos on the Visual Journey page. Upload a file or paste an image link.",
    `
    <form class="panel" id="gallery-form" style="margin-bottom:18px">
      <div class="panel-head"><span class="dot"></span><h2>Add a photo</h2></div>
      <div class="form-grid">
        <div class="field full"><label>Image</label>${imagePicker({ name: "src", value: "" })}</div>
        ${field({ name: "alt", label: "Caption / alt text", placeholder: "Silverback in the mist", required: true })}
        <div class="field">
          <label>Category</label>
          <div class="field-shell">
            <select name="category">
              ${["Gorillas","Primates","Landscapes","Safari"].map((cat) => `<option>${cat}</option>`).join("")}
            </select>
          </div>
        </div>
        ${field({ name: "sortOrder", label: "Sort order", type: "number", value: "0" })}
      </div>
      <button class="btn gold" style="margin-top:16px" type="submit">Add to gallery</button>
    </form>
    <div class="gallery-grid">
      ${state.gallery.map((item) => `
        <article class="gallery-card">
          <div class="media"><img src="${escapeHtml(item.src)}" alt="" /></div>
          <div class="body">
            <h3 style="font-size:20px">${escapeHtml(item.alt)}</h3>
            <div class="meta"><span>${escapeHtml(item.category)}</span></div>
            <div class="row-actions" style="margin-top:10px">
              <button class="btn sm ghost" data-action="edit-gallery" data-id="${item.id}">Edit</button>
              <button class="btn sm danger" data-action="delete-gallery" data-id="${item.id}">Delete</button>
            </div>
          </div>
        </article>`).join("")}
    </div>
    ${state.galleryEdit ? galleryEditModal(state.galleryEdit) : ""}`,
  );
}

function simpleCollectionView(title, subtitle, rows, formId, fields) {
  return layout(
    title,
    subtitle,
    `<form class="panel" id="${formId}" style="margin-bottom:18px">
      <div class="panel-head"><span class="dot"></span><h2>Add or edit</h2></div>
      <div class="form-grid">${fields}</div>
      <button class="btn gold" style="margin-top:16px" type="submit">Save</button>
    </form>
    <div class="card">${rows.includes("<table") ? `<div class="table-wrap">${rows}</div>` : rows}</div>`,
  );
}

function testimonialsView() {
  return simpleCollectionView(
    "Testimonials",
    "Quotes on the home page carousel.",
    state.testimonials.length
      ? `<table class="stack-table"><thead><tr><th>Guest</th><th>Quote</th><th></th></tr></thead><tbody>
        ${state.testimonials.map((item) => `
          <tr>
            <td data-label="Guest"><strong>${escapeHtml(item.author)}</strong><br>${escapeHtml(item.sub)}<br>
              <span class="badge ${item.published ? "on" : "off"}">${item.published ? "Live" : "Hidden"}</span></td>
            <td data-label="Quote">${escapeHtml(item.text)}</td>
            <td class="row-actions">
              <button class="btn sm ghost" data-action="edit-testimonial" data-id="${item.id}">Edit</button>
              <button class="btn sm danger" data-action="delete-testimonial" data-id="${item.id}">Delete</button>
            </td>
          </tr>`).join("")}</tbody></table>`
      : `<div class="empty"><i data-lucide="quote"></i>No testimonials yet.</div>`,
    "testimonial-form",
    `${field({ name: "author", label: "Author", placeholder: "e.g. Sarah Mitchell", required: true, icon: "user", hint: "Guest name as it appears on the homepage." })}
     ${field({ name: "sub", label: "Trip / year", placeholder: "Gorilla Trek · 2025", icon: "calendar", hint: "Short line under the name, such as the trip and year." })}
     ${field({ name: "text", label: "Quote", placeholder: "Write the guest’s words here…", required: true, multiline: true, extra: "full", hint: "This quote appears in the homepage carousel." })}
     ${field({ name: "sortOrder", label: "Sort order", type: "number", value: "0", placeholder: "0" })}
     <div class="switch"><input type="checkbox" name="published" checked /> Published</div>
     <input type="hidden" name="id" />`,
  );
}

function faqsView() {
  return simpleCollectionView(
    "FAQs",
    "Questions shown on the contact page.",
    state.faqs.length
      ? `<table class="stack-table"><thead><tr><th>Question</th><th>Answer</th><th></th></tr></thead><tbody>
        ${state.faqs.map((item) => `
          <tr>
            <td data-label="Question">${escapeHtml(item.question)}<br><span class="badge ${item.published ? "on" : "off"}">${item.published ? "Live" : "Hidden"}</span></td>
            <td data-label="Answer">${escapeHtml(item.answer)}</td>
            <td class="row-actions">
              <button class="btn sm ghost" data-action="edit-faq" data-id="${item.id}">Edit</button>
              <button class="btn sm danger" data-action="delete-faq" data-id="${item.id}">Delete</button>
            </td>
          </tr>`).join("")}</tbody></table>`
      : `<div class="empty"><i data-lucide="help-circle"></i>No FAQs yet.</div>`,
    "faq-form",
    `${field({ name: "question", label: "Question", placeholder: "e.g. When should we book gorilla permits?", required: true, extra: "full", icon: "help-circle" })}
     ${field({ name: "answer", label: "Answer", placeholder: "Write a clear, helpful answer…", required: true, multiline: true, extra: "full" })}
     ${field({ name: "sortOrder", label: "Sort order", type: "number", value: "0", placeholder: "0" })}
     <div class="switch"><input type="checkbox" name="published" checked /> Published</div>
     <input type="hidden" name="id" />`,
  );
}

function subscribersView() {
  return layout(
    "Subscribers",
    "Emails collected from Join Our Wild Circle on the website.",
    `<div class="card">
      ${state.subscribers.length ? `<div class="table-wrap"><table class="stack-table">
        <thead><tr><th>Email</th><th>Joined</th><th></th></tr></thead>
        <tbody>${state.subscribers.map((item) => `
          <tr>
            <td data-label="Email">${escapeHtml(item.email)}</td>
            <td data-label="Joined">${new Date(item.createdAt).toLocaleString()}</td>
            <td class="row-actions"><button class="btn sm danger" data-action="delete-subscriber" data-id="${item.id}">Remove</button></td>
          </tr>`).join("")}</tbody>
      </table></div>` : `<div class="empty"><i data-lucide="mail"></i>No subscribers yet.</div>`}
    </div>`,
  );
}

function homeView() {
  const s = state.settings;
  const textField = (name, label, extra = "", hint = "") =>
    field({ name, label, value: s[name] || "", extra, hint });
  const area = (name, label, hint = "") =>
    field({ name, label, value: s[name] || "", multiline: true, extra: "full", hint });
  const image = (name, label, hint = "") =>
    `<div class="field full"><label>${label}</label>${imagePicker({ name, value: s[name] || "" })}${hint ? `<p class="field-hint">${hint}</p>` : ""}</div>`;
  return layout(
    "Home page",
    "The landing screen visitors see first — then the rest of the homepage.",
    `<form id="home-form">
      <section class="panel">
        <div class="panel-head"><span class="dot"></span><h2>Hero — full-screen landing</h2></div>
        <p class="field-hint" style="margin:0 0 16px">This is the gorilla photo with the gold line, big headline, and gold button. Save, then refresh the public website.</p>
        <div class="form-grid">
          ${image("hero_image", "Background photo", "The full-screen photo behind the headline.")}
          ${textField("hero_eyebrow", "Gold line above the headline", "full", "Example: Rwanda's Premier Wildlife Experience")}
          ${area("hero_title", "Main headline", "Press Enter to split onto two lines, as on the live page.")}
          ${textField("hero_cta", "Gold button text", "full", "This button always opens the Tours page.")}
        </div>
      </section>
      <section class="panel">
        <div class="panel-head"><span class="dot"></span><h2>Intro — below the hero</h2></div>
        <div class="form-grid">
          ${textField("intro_label", "Small label")}
          ${area("intro_title", "Heading")}
          ${area("intro_body", "Body")}
          ${image("intro_image", "Photo on the left")}
        </div>
      </section>
      <section class="panel">
        <div class="panel-head"><span class="dot"></span><h2>Gold stats bar</h2></div>
        <div class="form-grid">
          ${textField("years_experience", "Years experience")}
          ${textField("permit_success", "Permit success %")}
          ${textField("happy_guests", "Happy guests")}
          ${textField("national_parks", "National parks")}
        </div>
      </section>
      <section class="panel">
        <div class="panel-head"><span class="dot"></span><h2>Bottom call to action</h2></div>
        <div class="form-grid">
          ${textField("cta_title", "Title", "full")}
          ${area("cta_body", "Body")}
        </div>
      </section>
      <button class="btn gold" type="submit">Save Home page</button>
    </form>`,
    `<a class="btn sm ghost" href="/" target="_blank" rel="noopener">View live page</a>`,
  );
}

function aboutView() {
  const s = state.settings;
  const textField = (name, label, extra = "") =>
    field({ name, label, value: s[name] || "", extra });
  const area = (name, label) =>
    field({ name, label, value: s[name] || "", multiline: true, extra: "full" });
  const image = (name, label) =>
    `<div class="field full"><label>${label}</label>${imagePicker({ name, value: s[name] || "" })}</div>`;
  return layout(
    "About page",
    "Everything on /about — hero, our roots, and conservation.",
    `<form id="about-form">
      <section class="panel">
        <div class="panel-head"><span class="dot"></span><h2>Hero</h2></div>
        <div class="form-grid">
          ${textField("about_title", "Title", "full")}
          ${textField("about_subtitle", "Subtitle", "full")}
          ${area("about_intro", "Intro paragraph")}
        </div>
      </section>
      <section class="panel">
        <div class="panel-head"><span class="dot"></span><h2>Our Roots</h2></div>
        <div class="form-grid">
          ${textField("about_roots_label", "Small label")}
          ${textField("about_story_title", "Heading", "full")}
          ${area("about_story_p1", "Paragraph 1")}
          ${area("about_story_p2", "Paragraph 2")}
          ${image("about_image", "Landscape photo")}
        </div>
      </section>
      <section class="panel">
        <div class="panel-head"><span class="dot"></span><h2>Conservation</h2></div>
        <div class="form-grid">
          ${textField("conservation_label", "Small label")}
          ${textField("conservation_title", "Heading", "full")}
          ${area("conservation_body", "Body")}
          ${image("team_image", "Forest / trekkers photo")}
          ${textField("about_badge", "Gold badge words (three words)")}
          ${textField("about_stat_1_value", "Stat 1 value")}
          ${area("about_stat_1_text", "Stat 1 description")}
          ${textField("about_stat_2_value", "Stat 2 value")}
          ${area("about_stat_2_text", "Stat 2 description")}
          ${textField("about_stat_3_value", "Stat 3 value")}
          ${area("about_stat_3_text", "Stat 3 description")}
        </div>
      </section>
      <button class="btn gold" type="submit">Save About page</button>
    </form>`,
    `<a class="btn sm ghost" href="/about" target="_blank" rel="noopener">View live page</a>`,
  );
}

function settingsView() {
  const s = state.settings;
  const textField = (name, label, extra = "") =>
    field({ name, label, value: s[name] || "", extra });
  const area = (name, label) =>
    field({ name, label, value: s[name] || "", multiline: true, extra: "full" });
  const image = (name, label) =>
    `<div class="field full"><label>${label}</label>${imagePicker({ name, value: s[name] || "" })}</div>`;
  return layout(
    "Settings",
    "Logo, contact details, and copy used across the website.",
    `<form id="settings-form">
      <section class="panel">
        <div class="panel-head"><span class="dot"></span><h2>Company</h2></div>
        <div class="form-grid">
          ${image("logo", "Site logo")}
          ${textField("site_name", "Site name")}
          ${textField("tagline", "Tagline")}
          ${textField("phone", "Phone")}
          ${textField("whatsapp", "WhatsApp number (no + or spaces)")}
          ${textField("email", "Public email")}
          ${textField("email_bookings", "Bookings email")}
          ${textField("address_line1", "Address line 1")}
          ${textField("address_line2", "Address line 2")}
          ${textField("address_city", "City")}
          ${textField("instagram", "Instagram URL")}
          ${textField("facebook", "Facebook URL")}
          ${textField("twitter", "Twitter / X URL")}
          ${area("footer_blurb", "Footer description")}
        </div>
      </section>
      <p class="field-hint" style="margin:0 0 16px">Home page and About page each have their own editor in the sidebar.</p>
      <button class="btn gold" style="margin-top:8px" type="submit">Save settings</button>
    </form>
    <form id="password-form" class="panel" style="margin-top:16px">
      <div class="panel-head"><span class="dot"></span><h2>Change password</h2></div>
      <div class="form-grid">
        ${field({ name: "currentPassword", label: "Current password", type: "password", required: true, icon: "lock", placeholder: "Current password", autocomplete: "current-password" })}
        ${field({ name: "newPassword", label: "New password", type: "password", required: true, icon: "lock", placeholder: "At least 8 characters", minlength: "8", autocomplete: "new-password" })}
      </div>
      <button class="btn ghost" style="margin-top:16px" type="submit">Update password</button>
    </form>`,
  );
}

function collectList(name) {
  return $$(`[data-list="${name}"] > .repeater-row > input[type="text"]`)
    .map((el) => el.value.trim())
    .filter(Boolean);
}

function collectItinerary() {
  return $$('[data-list="itinerary"] .itinerary-row').map((row, index) => ({
    day: Number($("input[type='number']", row)?.value || index + 1),
    title: $("input[type='text']", row)?.value || "",
    body: $("textarea", row)?.value || "",
  })).filter((item) => item.title || item.body);
}

function collectTourGallery() {
  return $$('[data-list="gallery"] .repeater-row').map((row) => {
    const src = $(".img-url", row)?.value || $(".gallery-src", row)?.value || "";
    return {
      src: src.trim(),
      caption: $(".gallery-caption", row)?.value || "",
    };
  }).filter((item) => item.src);
}

function syncGalleryHidden(row) {
  const hidden = $(".gallery-src", row);
  const url = $(".img-url", row);
  if (hidden && url) hidden.value = url.value;
}

async function loadAll() {
  const [dashboard, tours, posts, gallery, inquiries, testimonials, faqs, subscribers, settings] =
    await Promise.all([
      api("/admin/dashboard"),
      api("/admin/tours"),
      api("/admin/posts"),
      api("/admin/gallery"),
      api("/admin/inquiries"),
      api("/admin/testimonials"),
      api("/admin/faqs"),
      api("/admin/subscribers"),
      api("/admin/settings"),
    ]);
  Object.assign(state, {
    dashboard,
    tours,
    posts,
    gallery,
    inquiries,
    testimonials,
    faqs,
    subscribers,
    settings: cleanSettings(settings),
  });
}

async function render() {
  const app = $("#app");
  if (!token()) {
    state.menuOpen = false;
    state.galleryEdit = null;
    setLocks();
    app.innerHTML = loginView();
    icons();
    return;
  }

  try {
    if (!state.admin) state.admin = await api("/auth/me");
    if (!state.dashboard) {
      app.innerHTML = `<div class="boot"><div class="spinner"></div><p>Loading operations desk...</p></div>`;
    }
    await loadAll();
  } catch (err) {
    toast(err.message, "error");
    app.innerHTML = loginView();
    icons();
    return;
  }

  const { path, parts } = route();
  try {
    if (path.startsWith("/tours/") && parts[1] && parts[1] !== "new") {
      state.editing = await api(`/admin/tours/${parts[1]}`);
      app.innerHTML = tourFormView();
    } else if (path === "/tours/new") {
      state.editing = null;
      app.innerHTML = tourFormView();
    } else if (path.startsWith("/blog/") && parts[1] && parts[1] !== "new") {
      state.editing = await api(`/admin/posts/${parts[1]}`);
      app.innerHTML = postFormView();
    } else if (path === "/blog/new") {
      state.editing = null;
      app.innerHTML = postFormView();
    } else if (path === "/blog") app.innerHTML = postsView();
    else if (path.startsWith("/inquiries/") && parts[1]) {
      state.editing = await api(`/admin/inquiries/${parts[1]}`);
      app.innerHTML = inquiryDetailView();
    } else if (path === "/tours") app.innerHTML = toursView();
    else if (path === "/inquiries") app.innerHTML = inquiriesView();
    else if (path === "/gallery") app.innerHTML = galleryView();
    else if (path === "/testimonials") app.innerHTML = testimonialsView();
    else if (path === "/faqs") app.innerHTML = faqsView();
    else if (path === "/subscribers") app.innerHTML = subscribersView();
    else if (path === "/home") app.innerHTML = homeView();
    else if (path === "/about") app.innerHTML = aboutView();
    else if (path === "/settings") app.innerHTML = settingsView();
    else app.innerHTML = dashboardView();
  } catch (err) {
    toast(err.message, "error");
    app.innerHTML = dashboardView();
  }
  setLocks();
  icons();
}

async function handlePickedFile(picker, file) {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    toast("Please choose an image file.", "error");
    return;
  }
  const uploaded = await uploadFile(file);
  applyImage(picker, uploaded.url);
  syncGalleryHidden(picker.closest(".repeater-row"));
  toast("Image uploaded.");
}

if (!window.__pqAdminBound) {
window.__pqAdminBound = true;

document.addEventListener("submit", async (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) return;
  event.preventDefault();
  if (form.dataset.busy === "1") return;
  form.dataset.busy = "1";
  const data = new FormData(form);
  const obj = Object.fromEntries(data.entries());

  try {
    if (form.id === "login-form") {
      const result = await api("/auth/login", { method: "POST", json: obj });
      localStorage.setItem(TOKEN_KEY, result.token);
      state.admin = result.admin;
      await loadAll();
      location.hash = "/dashboard";
      toast("Welcome back.");
      render();
      return;
    }
    if (form.id === "tour-form") {
      const payload = {
        ...obj,
        featured: data.get("featured") === "on",
        published: data.get("published") === "on",
        highlights: collectList("highlights"),
        inclusions: collectList("inclusions"),
        exclusions: collectList("exclusions"),
        itinerary: collectItinerary(),
        gallery: collectTourGallery(),
        sortOrder: Number(obj.sortOrder || 0),
      };
      const isNew = route().parts[1] === "new";
      if (isNew) await api("/admin/tours", { method: "POST", json: payload });
      else await api(`/admin/tours/${route().parts[1]}`, { method: "PUT", json: payload });
      await loadAll();
      toast("Tour saved.");
      location.hash = "/tours";
      return;
    }
    if (form.id === "post-form") {
      const payload = {
        ...obj,
        published: data.get("published") === "on",
        gallery: collectTourGallery(),
      };
      const isNew = route().parts[1] === "new";
      if (isNew) await api("/admin/posts", { method: "POST", json: payload });
      else await api(`/admin/posts/${route().parts[1]}`, { method: "PUT", json: payload });
      await loadAll();
      toast("Blog post saved. Refresh the website to see it.");
      location.hash = "/blog";
      return;
    }
    if (form.id === "inquiry-form") {
      await api(`/admin/inquiries/${route().parts[1]}`, { method: "PUT", json: obj });
      await loadAll();
      toast("Inquiry updated.");
      render();
      return;
    }
    if (form.id === "gallery-form") {
      if (!String(obj.src || "").trim()) throw new Error("Add an image file or paste an image link.");
      await api("/admin/gallery", { method: "POST", json: obj });
      await loadAll();
      toast("Photo added.");
      render();
      return;
    }
    if (form.id === "gallery-edit-form") {
      await api(`/admin/gallery/${obj.id}`, { method: "PUT", json: obj });
      state.galleryEdit = null;
      await loadAll();
      toast("Photo updated.");
      render();
      return;
    }
    if (form.id === "testimonial-form") {
      const payload = { ...obj, published: data.get("published") === "on", sortOrder: Number(obj.sortOrder || 0) };
      if (obj.id) await api(`/admin/testimonials/${obj.id}`, { method: "PUT", json: payload });
      else await api("/admin/testimonials", { method: "POST", json: payload });
      await loadAll();
      toast("Testimonial saved.");
      render();
      return;
    }
    if (form.id === "faq-form") {
      const payload = { ...obj, published: data.get("published") === "on", sortOrder: Number(obj.sortOrder || 0) };
      if (obj.id) await api(`/admin/faqs/${obj.id}`, { method: "PUT", json: payload });
      else await api("/admin/faqs", { method: "POST", json: payload });
      await loadAll();
      toast("FAQ saved.");
      render();
      return;
    }
    if (form.id === "settings-form" || form.id === "about-form" || form.id === "home-form") {
      await api("/admin/settings", { method: "PUT", json: obj });
      state.settings = cleanSettings(await api("/admin/settings"));
      const saved =
        form.id === "home-form"
          ? "Home page saved. Refresh the website to see it."
          : form.id === "about-form"
            ? "About page saved. Refresh the website to see it."
            : "Settings saved. The website will use these values.";
      toast(saved);
      render();
      return;
    }
    if (form.id === "password-form") {
      await api("/auth/password", { method: "PUT", json: obj });
      form.reset();
      toast("Password updated.");
    }
  } catch (err) {
    toast(err.message, "error");
  } finally {
    form.dataset.busy = "";
  }
});

document.addEventListener("click", async (event) => {
  const navLink = event.target.closest(".nav a");
  if (navLink && state.menuOpen) {
    state.menuOpen = false;
    document.querySelector(".shell")?.classList.remove("open");
    setLocks();
  }
  const actionEl = event.target.closest("[data-action]");
  if (!actionEl) return;
  const action = actionEl.dataset.action;
  const id = actionEl.dataset.id;

  if (action === "toggle-menu") {
    state.menuOpen = !state.menuOpen;
    const shell = document.querySelector(".shell");
    shell?.classList.toggle("open", state.menuOpen);
    const btn = document.querySelector(".menu-toggle");
    if (btn) {
      btn.innerHTML = `<i data-lucide="${state.menuOpen ? "x" : "menu"}"></i>`;
      icons();
    }
    setLocks();
    return;
  }
  if (action === "close-menu") {
    state.menuOpen = false;
    document.querySelector(".shell")?.classList.remove("open");
    setLocks();
    return;
  }
  if (action === "close-modal") {
    if (actionEl.classList.contains("modal-overlay") && event.target !== actionEl) return;
    state.galleryEdit = null;
    render();
    return;
  }
  if (action === "clear-image") {
    const picker = actionEl.closest(".img-picker");
    applyImage(picker, "");
    syncGalleryHidden(actionEl.closest(".repeater-row"));
    return;
  }
  if (action === "logout") {
    const ok = await confirmCard({
      title: "Sign out?",
      message: "You will need your email and password to manage the site again.",
      confirmLabel: "Sign out",
      danger: false,
      icon: "log-out",
    });
    if (!ok) return;
    localStorage.removeItem(TOKEN_KEY);
    state.admin = null;
    location.hash = "/";
    render();
    return;
  }
  if (action === "filter-inquiries") {
    state.inquiryFilter = actionEl.dataset.status;
    render();
    return;
  }
  if (action === "add-row") {
    const list = document.querySelector(`[data-list="${actionEl.dataset.list}"]`);
    const row = document.createElement("div");
    row.className = "repeater-row";
    row.innerHTML = `<input type="text" placeholder="Item" /><button type="button" class="btn sm danger" data-action="remove-row">×</button>`;
    list.appendChild(row);
    return;
  }
  if (action === "add-itinerary") {
    const list = document.querySelector('[data-list="itinerary"]');
    const row = document.createElement("div");
    row.className = "itinerary-row";
    row.innerHTML = `<input type="number" min="1" value="${list.children.length + 1}" /><div><input type="text" placeholder="Title" /><textarea></textarea></div><button type="button" class="btn sm danger" data-action="remove-row">×</button>`;
    list.appendChild(row);
    return;
  }
  if (action === "add-gallery") {
    const list = document.querySelector('[data-list="gallery"]');
    const wrap = document.createElement("div");
    wrap.innerHTML = galleryItemEditor();
    list.appendChild(wrap.firstElementChild);
    icons();
    return;
  }
  if (action === "remove-row") {
    actionEl.closest(".repeater-row, .itinerary-row")?.remove();
    return;
  }
  if (action === "edit-testimonial") {
    const item = state.testimonials.find((row) => String(row.id) === String(id));
    const form = $("#testimonial-form");
    if (!item || !form) return;
    form.author.value = item.author;
    form.sub.value = item.sub;
    form.text.value = item.text;
    form.sortOrder.value = item.sortOrder;
    form.published.checked = item.published;
    form.id.value = item.id;
    form.scrollIntoView({ behavior: "smooth" });
    return;
  }
  if (action === "edit-faq") {
    const item = state.faqs.find((row) => String(row.id) === String(id));
    const form = $("#faq-form");
    if (!item || !form) return;
    form.question.value = item.question;
    form.answer.value = item.answer;
    form.sortOrder.value = item.sortOrder;
    form.published.checked = item.published;
    form.id.value = item.id;
    form.scrollIntoView({ behavior: "smooth" });
    return;
  }
  if (action === "edit-gallery") {
    state.galleryEdit = state.gallery.find((row) => String(row.id) === String(id)) || null;
    render();
    return;
  }

  const deletes = {
    "delete-tour": {
      path: "/admin/tours/",
      title: "Delete this tour?",
      message: "It will be removed from the website. This cannot be undone.",
      confirmLabel: "Delete tour",
    },
    "delete-post": {
      path: "/admin/posts/",
      title: "Delete this blog post?",
      message: "It will disappear from the Journal. This cannot be undone.",
      confirmLabel: "Delete post",
    },
    "delete-inquiry": {
      path: "/admin/inquiries/",
      title: "Delete this inquiry?",
      message: "The guest request and notes will be removed from the inbox.",
      confirmLabel: "Delete inquiry",
    },
    "delete-gallery": {
      path: "/admin/gallery/",
      title: "Remove this photo?",
      message: "It will disappear from the Visual Journey gallery.",
      confirmLabel: "Remove photo",
    },
    "delete-testimonial": {
      path: "/admin/testimonials/",
      title: "Delete this testimonial?",
      message: "The quote will no longer appear on the website.",
      confirmLabel: "Delete quote",
    },
    "delete-faq": {
      path: "/admin/faqs/",
      title: "Delete this FAQ?",
      message: "The question will be removed from the contact page.",
      confirmLabel: "Delete FAQ",
    },
    "delete-subscriber": {
      path: "/admin/subscribers/",
      title: "Remove this subscriber?",
      message: "They will be taken off the Wild Circle list.",
      confirmLabel: "Remove",
    },
  };
  if (deletes[action]) {
    const item = deletes[action];
    const ok = await confirmCard({
      title: item.title,
      message: item.message,
      confirmLabel: item.confirmLabel,
    });
    if (!ok) return;
    try {
      await api(`${item.path}${id}`, { method: "DELETE" });
      await loadAll();
      toast("Deleted.");
      if (action === "delete-tour") location.hash = "/tours";
      if (action === "delete-post") location.hash = "/blog";
      render();
    } catch (err) {
      toast(err.message, "error");
    }
  }
});

document.addEventListener("input", (event) => {
  const el = event.target;
  if (el.id === "inquiry-search") {
    state.inquirySearch = el.value;
    clearTimeout(state.searchTimer);
    state.searchTimer = setTimeout(() => {
      const box = document.getElementById("inquiries-table");
      if (box) {
        box.innerHTML = inquiriesTableHtml();
        icons();
      }
    }, 80);
    return;
  }
  if (el.classList?.contains("img-url")) {
    const picker = el.closest(".img-picker");
    applyImage(picker, el.value);
    syncGalleryHidden(el.closest(".repeater-row"));
  }
});

document.addEventListener("change", async (event) => {
  const el = event.target;
  if (!(el instanceof HTMLInputElement) || el.type !== "file" || !el.files?.[0]) return;
  const picker = el.closest(".img-picker");
  if (!picker) return;
  try {
    await handlePickedFile(picker, el.files[0]);
  } catch (err) {
    toast(err.message, "error");
  } finally {
    el.value = "";
  }
});

document.addEventListener("dragover", (event) => {
  const picker = event.target.closest?.(".img-picker");
  if (!picker) return;
  event.preventDefault();
  picker.classList.add("is-drag");
});

document.addEventListener("dragleave", (event) => {
  const picker = event.target.closest?.(".img-picker");
  if (!picker) return;
  if (!picker.contains(event.relatedTarget)) picker.classList.remove("is-drag");
});

document.addEventListener("drop", async (event) => {
  const picker = event.target.closest?.(".img-picker");
  if (!picker) return;
  event.preventDefault();
  picker.classList.remove("is-drag");
  const file = event.dataTransfer?.files?.[0];
  const text = event.dataTransfer?.getData("text")?.trim();
  try {
    if (file) await handlePickedFile(picker, file);
    else if (text) {
      applyImage(picker, text);
      syncGalleryHidden(picker.closest(".repeater-row"));
      toast("Image link added.");
    }
  } catch (err) {
    toast(err.message, "error");
  }
});

document.addEventListener("paste", async (event) => {
  const picker = event.target.closest?.(".img-picker");
  if (!picker || !event.clipboardData) return;
  const item = [...event.clipboardData.items].find((entry) => entry.type.startsWith("image/"));
  if (!item) return;
  event.preventDefault();
  try {
    await handlePickedFile(picker, item.getAsFile());
  } catch (err) {
    toast(err.message, "error");
  }
});

window.addEventListener("hashchange", () => {
  state.menuOpen = false;
  state.galleryEdit = null;
  render();
});
window.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (confirmOpen) return;
  if (state.galleryEdit) {
    state.galleryEdit = null;
    render();
    return;
  }
  if (state.menuOpen) {
    state.menuOpen = false;
    document.querySelector(".shell")?.classList.remove("open");
    setLocks();
  }
});
}

render();
