const API_URL =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://cvapi.reeflinklabs.com";

function navigateTo(page) {
  if (page === "login") {
    window.location.href = "/login.html";
  } else if (page === "signup") {
    window.location.href = "/signup.html";
  }
}

async function makeFetchRequest(path, options = {}) {
  const token = sessionStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token && !path.includes("/signup") && !path.includes("/login")) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    const responseText = await response.text();

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = responseText;
    }

    if (!response.ok) {
      throw new Error(
        responseData.error || `${response.status}: ${response.statusText}`
      );
    }

    return responseData;
  } catch (error) {
    console.error("Fetch request failed:", error);
    throw error;
  }
}

async function signupUser(event) {
  event.preventDefault();

  const user = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  const signupButton = document.getElementById("signupButton");
  const spinner = document.getElementById("spinner");

  signupButton.disabled = true;
  spinner.classList.remove("hidden");

  try {
    const data = await makeFetchRequest("/v1/users/signup", {
      method: "POST",
      body: JSON.stringify(user),
    });

    sessionStorage.setItem("userEmail", data.email);
    sessionStorage.setItem("token", data.token);

    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Signup failed:", error);
    alert(
      "Error signing up. Ensure your email has not been used, your password is at least 8 characters long and try again."
    );
    signupButton.disabled = false;
    spinner.classList.add("hidden");
  }
}

async function loginUser(event) {
  event.preventDefault();

  const credentials = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  const loginButton = document.getElementById("loginButton");
  const spinner = document.getElementById("spinner");

  loginButton.disabled = true;
  spinner.classList.remove("hidden");

  try {
    const data = await makeFetchRequest("/v1/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    sessionStorage.setItem("userEmail", data.email);
    sessionStorage.setItem("token", data.token);

    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Login failed:", error);
    alert("Error logging in. Check your email & password and try again.");
    loginButton.disabled = false;
    spinner.classList.add("hidden");
  }
}

function logoutUser() {
  sessionStorage.clear();
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("signupForm")?.addEventListener("submit", signupUser);
  document.getElementById("loginForm")?.addEventListener("submit", loginUser);
});
