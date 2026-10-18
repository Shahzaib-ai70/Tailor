const loginForm = document.getElementById("login-form");
const loginFeedback = document.getElementById("login-feedback");

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

async function checkSession() {
  try {
    await requestJSON("/api/admin/session");
    window.location.href = "/admin/dashboard";
  } catch (_error) {
    // Stay on login page when there is no valid session.
  }
}

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);

  try {
    await requestJSON("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: formData.get("username"),
        password: formData.get("password"),
      }),
    });
    setFeedback(loginFeedback, "Login successful. Opening dashboard...");
    window.location.href = "/admin/dashboard";
  } catch (error) {
    setFeedback(loginFeedback, error.message, true);
  }
});

checkSession();
