// script.js - handle comments with localStorage and render on pages
(function () {
  const STORAGE_KEY = "bt_comments";

  function escapeHTML(s) {
    return s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function loadComments() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.error("Could not parse stored comments", e);
      return [];
    }
  }

  function saveComments(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function renderList(targetEl) {
    if (!targetEl) return;
    const list = loadComments();
    if (list.length === 0) {
      targetEl.innerHTML = "<p>Chưa có bình luận nào.</p>";
      return;
    }
    targetEl.innerHTML = list
      .map((c) => {
        const time = new Date(c.created).toLocaleString();
        return `<article class="comment" tabindex="0"><div class="meta"><strong>${escapeHTML(c.name)}</strong> — <span class="time">${time}</span></div><div class="text">${escapeHTML(c.comment)}</div></article>`;
      })
      .join("");
  }

  function onSubmitForm(e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const comment = document.getElementById("comment").value.trim();
    if (!name || !comment) return;
    const list = loadComments();
    list.unshift({ name, comment, created: new Date().toISOString() });
    saveComments(list);
    // redirect to thank you page
    window.location.href = "binhluan.html";
  }

  document.addEventListener("DOMContentLoaded", function () {
    // Render comments where present
    const commentsList = document.getElementById("comments-list");
    const savedList = document.getElementById("saved-list");
    if (commentsList) renderList(commentsList);
    if (savedList) renderList(savedList);

    // Attach form handler on main page
    const form = document.getElementById("comment-form");
    if (form) {
      form.addEventListener("submit", onSubmitForm);
    }

    // If on binhluan page, announce latest comment
    const thanksTitle = document.getElementById("thanks-title");
    if (thanksTitle) {
      const list = loadComments();
      if (list.length > 0) {
        const latest = list[0];
        const el = document.createElement("div");
        el.className = "comment";
        el.innerHTML = `<div class="meta"><strong>${escapeHTML(latest.name)}</strong></div><div class="text">${escapeHTML(latest.comment)}</div>`;
        el.setAttribute("aria-live", "polite");
        const saved = document.getElementById("saved-list");
        if (saved) saved.insertAdjacentElement("afterbegin", el);
      }
    }
  });
})();
