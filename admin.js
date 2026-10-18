const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const uploadForm = document.getElementById("upload-form");
const passwordForm = document.getElementById("password-form");
const logoutButton = document.getElementById("logout-button");
const uploadFeedback = document.getElementById("upload-feedback");
const passwordFeedback = document.getElementById("password-feedback");
const adminGalleryList = document.getElementById("admin-gallery-list");
const adminGalleryEmpty = document.getElementById("admin-gallery-empty");
const adminOrderList = document.getElementById("admin-order-list");
const adminOrderEmpty = document.getElementById("admin-order-empty");
const contactList = document.getElementById("contact-list");
const contactEmpty = document.getElementById("contact-empty");
const galleryCount = document.getElementById("gallery-count");
const orderCount = document.getElementById("order-count");
const contactCount = document.getElementById("contact-count");

function setFeedback(element, message, isError = false) {
  if (!element) {
    return;
  }

  element.textContent = message;
  element.dataset.state = isError ? "error" : "success";
}

async function requestJSON(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function buildGalleryPayload(row) {
  return {
    title: row.querySelector('[name="title"]').value,
    description: row.querySelector('[name="description"]').value,
    details: row.querySelector('[name="details"]').value,
    priceText: row.querySelector('[name="priceText"]').value,
    displayOrder: Number(row.querySelector('[name="displayOrder"]').value) || 0,
    isVisible: row.querySelector('[name="isVisible"]').checked,
  };
}

async function saveGalleryItem(row, visibilityOverride = null) {
  const id = row.dataset.id;
  const payload = buildGalleryPayload(row);

  if (typeof visibilityOverride === "boolean") {
    payload.isVisible = visibilityOverride;
  }

  await requestJSON(`/api/admin/gallery/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

function renderGallery(items) {
  if (!adminGalleryList || !adminGalleryEmpty) {
    return;
  }

  adminGalleryList.innerHTML = "";
  adminGalleryEmpty.hidden = items.length !== 0;

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "admin-product-row";
    card.dataset.id = item.id;
    card.innerHTML = `
      <div class="admin-product-top">
        <img class="admin-media-thumb" src="${item.imagePath}" alt="${escapeHTML(item.title)}" />
        <div class="admin-product-summary">
          <div class="admin-product-badges">
            <span class="admin-pill">${item.sourceType === "seeded" ? "Catalog" : "Upload"}</span>
            <span class="admin-pill ${item.isVisible ? "is-live" : "is-hidden"}">
              ${item.isVisible ? "Visible" : "Hidden"}
            </span>
          </div>
          <h3>${escapeHTML(item.title)}</h3>
          <p>${escapeHTML(item.description || "No description added.")}</p>
          <span>Published ${new Date(item.createdAt).toLocaleString()}</span>
          ${item.sourceUrl ? `<a class="admin-source-link" href="${item.sourceUrl}" target="_blank" rel="noreferrer">Source reference</a>` : ""}
        </div>
      </div>
      <div class="admin-product-editor">
        <label>
          Title
          <input type="text" name="title" value="${escapeHTML(item.title)}" />
        </label>
        <label>
          Price
          <input type="text" name="priceText" value="${escapeHTML(item.priceText || "")}" placeholder="Rs. 8,500" />
        </label>
        <label>
          Order
          <input type="number" name="displayOrder" value="${Number(item.displayOrder) || 0}" />
        </label>
        <label class="admin-inline-check">
          <input type="checkbox" name="isVisible" ${item.isVisible ? "checked" : ""} />
          Show on frontend
        </label>
        <label class="admin-editor-span">
          Short Description
          <textarea name="description" rows="3">${escapeHTML(item.description || "")}</textarea>
        </label>
        <label class="admin-editor-span">
          Full Product Details
          <textarea name="details" rows="4">${escapeHTML(item.details || "")}</textarea>
        </label>
      </div>
      <div class="admin-media-actions admin-product-actions">
        <a class="button secondary admin-view" href="${item.imagePath}" target="_blank" rel="noreferrer">View Image</a>
        <a class="button secondary admin-view" href="${item.productUrl}" target="_blank" rel="noreferrer">Open Product</a>
        <button class="button secondary admin-toggle" type="button">
          ${item.isVisible ? "Hide" : "Show"}
        </button>
        <button class="button primary admin-save" type="button">Save Changes</button>
        <button class="button secondary admin-delete" type="button">Delete</button>
      </div>
    `;
    adminGalleryList.appendChild(card);
  });

  adminGalleryList.querySelectorAll(".admin-save").forEach((button) => {
    button.addEventListener("click", async () => {
      const row = button.closest(".admin-product-row");

      try {
        await saveGalleryItem(row);
        setFeedback(uploadFeedback, "Product updated.");
        await loadDashboard();
      } catch (error) {
        setFeedback(uploadFeedback, error.message, true);
      }
    });
  });

  adminGalleryList.querySelectorAll(".admin-toggle").forEach((button) => {
    button.addEventListener("click", async () => {
      const row = button.closest(".admin-product-row");
      const checkbox = row.querySelector('[name="isVisible"]');

      try {
        await saveGalleryItem(row, !checkbox.checked);
        setFeedback(uploadFeedback, checkbox.checked ? "Product hidden." : "Product shown.");
        await loadDashboard();
      } catch (error) {
        setFeedback(uploadFeedback, error.message, true);
      }
    });
  });

  adminGalleryList.querySelectorAll(".admin-delete").forEach((button) => {
    button.addEventListener("click", async () => {
      const row = button.closest(".admin-product-row");
      const id = row.dataset.id;

      if (!window.confirm("Delete this product?")) {
        return;
      }

      try {
        await requestJSON(`/api/admin/gallery/${id}`, { method: "DELETE" });
        await loadDashboard();
      } catch (error) {
        setFeedback(uploadFeedback, error.message, true);
      }
    });
  });
}

function renderContacts(items) {
  if (!contactList || !contactEmpty) {
    return;
  }

  contactList.innerHTML = "";
  contactEmpty.hidden = items.length !== 0;

  items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "admin-contact-row";
    card.innerHTML = `
      <div class="admin-contact-head">
        <div>
          <h3>${item.name}</h3>
          <p>${item.email}</p>
        </div>
        <span>${new Date(item.createdAt).toLocaleString()}</span>
      </div>
      <p class="admin-contact-meta">Occasion: ${item.occasion || "Not specified"}</p>
      <p class="admin-contact-message">${item.message}</p>
    `;
    contactList.appendChild(card);
  });
}

function renderOrders(items) {
  if (!adminOrderList || !adminOrderEmpty) {
    return;
  }

  adminOrderList.innerHTML = "";
  adminOrderEmpty.hidden = items.length !== 0;

  items.forEach((item) => {
    const products = item.items
      .map((product) => `${product.title} x${product.quantity}`)
      .join(", ");
    const card = document.createElement("article");
    card.className = "admin-order-row";
    card.innerHTML = `
      <div class="admin-order-head">
        <div>
          <h3>Order #${item.id}</h3>
          <p>${escapeHTML(item.customerName)} | ${escapeHTML(item.phone)}</p>
        </div>
        <span>${new Date(item.createdAt).toLocaleString()}</span>
      </div>
      <p class="admin-order-meta">
        ${escapeHTML(item.city)} | ${escapeHTML(item.paymentMethod)} | Status: ${escapeHTML(item.status)}
      </p>
      <p class="admin-order-meta">${escapeHTML(item.address)}</p>
      <p class="admin-order-items">${escapeHTML(products || "No items")}</p>
      <div class="admin-order-total-row">
        <strong>Total: Rs. ${Number(item.totalAmount || 0).toLocaleString()}</strong>
        <span>Delivery: Rs. ${Number(item.deliveryFee || 0).toLocaleString()}</span>
      </div>
      ${item.notes ? `<p class="admin-order-note">Notes: ${escapeHTML(item.notes)}</p>` : ""}
    `;
    adminOrderList.appendChild(card);
  });
}

async function loadDashboard() {
  const [stats, gallery, orders, contacts] = await Promise.all([
    requestJSON("/api/admin/dashboard"),
    requestJSON("/api/admin/gallery"),
    requestJSON("/api/admin/orders"),
    requestJSON("/api/admin/contacts"),
  ]);

  galleryCount.textContent = String(stats.stats.galleryCount);
  orderCount.textContent = String(stats.stats.orderCount || 0);
  contactCount.textContent = String(stats.stats.contactCount);
  renderGallery(gallery.items);
  renderOrders(orders.items);
  renderContacts(contacts.items);
}

async function checkSession() {
  try {
    await requestJSON("/api/admin/session");
    await loadDashboard();
  } catch (_error) {
    window.location.href = "/admin";
  }
}

uploadForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const visibilityInput = form.querySelector('[name="isVisible"]');

  formData.set("isVisible", visibilityInput?.checked ? "true" : "false");

  try {
    const result = await requestJSON("/api/admin/gallery", {
      method: "POST",
      body: formData,
    });
    form.reset();
    setFeedback(uploadFeedback, result.message || "Designs uploaded.");
    await loadDashboard();
  } catch (error) {
    setFeedback(uploadFeedback, error.message, true);
  }
});

passwordForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);

  try {
    await requestJSON("/api/admin/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
      }),
    });
    form.reset();
    setFeedback(passwordFeedback, "Password updated.");
  } catch (error) {
    setFeedback(passwordFeedback, error.message, true);
  }
});

logoutButton?.addEventListener("click", async () => {
  await requestJSON("/api/admin/logout", { method: "POST" });
  window.location.href = "/admin";
});

checkSession();
