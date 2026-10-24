const STORAGE_KEY = "verdant-social-state-v1";
const ADMIN_CREDENTIALS = { username: "verdantadmin", password: "verdantstaff2024" };

function createOfficialVerdantUser() {
  return {
    id: "verdant",
    username: "verdant",
    handle: "@verdant",
    displayName: "Verdant",
    aboutMe: "The official Verdant home for community, creativity, and thoughtful conversation.",
    website: "https://verdant.social",
    profilePicture: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80",
    favoriteGame: "Minecraft",
    followers: 0,
    following: [],
    official: true,
    banned: false,
    password: "verdantofficial",
    createdAt: new Date().toISOString(),
  };
}

const defaultState = {
  currentUserId: null,
  selectedProfileId: "verdant",
  activeView: "feed",
  users: [createOfficialVerdantUser()],
  posts: [],
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return structuredClone(defaultState);

    const merged = {
      ...structuredClone(defaultState),
      ...saved,
      users: Array.isArray(saved.users) && saved.users.length ? saved.users : defaultState.users,
      posts: Array.isArray(saved.posts) ? saved.posts : [],
    };

    if (!merged.users.some((user) => user.id === "verdant")) {
      merged.users.unshift(createOfficialVerdantUser());
    }

    return merged;
  } catch (error) {
    return structuredClone(defaultState);
  }
}

const state = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeUsername(value) {
  return String(value || "").trim().replace(/^@/, "").toLowerCase();
}

function findUserById(id) {
  return state.users.find((user) => user.id === id) || null;
}

function findUserByUsername(usernameOrHandle) {
  const normalized = normalizeUsername(usernameOrHandle);
  return state.users.find((user) => normalizeUsername(user.username) === normalized || normalizeUsername(user.handle) === normalized) || null;
}

function getCurrentUser() {
  return findUserById(state.currentUserId);
}

function isVerifiedUser(user) {
  if (!user) return false;
  return user.official || (Number(user.followers || 0) >= 1000);
}

function getVerificationMarkup(user) {
  if (!user) return "";
  if (user.official) {
    return '<span class="verification-badge official"><span class="leaf-icon"></span>Official</span>';
  }
  if (Number(user.followers || 0) >= 1000) {
    return '<span class="verification-badge standard"><span class="leaf-icon"></span>Verified</span>';
  }
  return "";
}

function formatDate(dateValue) {
  if (!dateValue) return "just now";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "just now";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function renderInlineTokens(text) {
  const escaped = escapeHtml(text);
  return escaped
    .replace(/(^|\s)#([a-zA-Z0-9_]+)/g, '$1<span class="token">#$2</span>')
    .replace(/(^|\s)@([a-zA-Z0-9_]+)/g, '$1<span class="token">@$2</span>');
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function setView(viewName) {
  state.activeView = viewName;

  document.querySelectorAll(".nav-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewName);
  });

  document.querySelectorAll(".view-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `${viewName}View`);
  });

  if (viewName === "feed") renderFeed();
  if (viewName === "discover") renderDiscover();
  if (viewName === "profile") renderProfile();
  if (viewName === "account") renderAccountForm();

  renderSidebarProfile();
}

function renderSidebarProfile() {
  const wrapper = document.getElementById("sidebarProfile");
  const user = getCurrentUser();

  if (!user) {
    wrapper.innerHTML = `
      <div class="profile-topline">
        <div class="avatar">V</div>
        <div class="profile-mini-meta">
          <h3>Guest</h3>
          <p class="handle-text">@guest</p>
        </div>
      </div>
      <p class="muted">Sign in to join the Verdant community.</p>
    `;
    return;
  }

  wrapper.innerHTML = `
    <div class="profile-topline">
      <div class="avatar">
        <img src="${escapeHtml(user.profilePicture || "")}" alt="${escapeHtml(user.displayName)}" onerror="this.style.display='none'; this.parentElement.textContent='${(user.displayName || "U").charAt(0).toUpperCase()}'" />
      </div>
      <div class="profile-mini-meta">
        <h3>${escapeHtml(user.displayName)}</h3>
        <p class="handle-text">${escapeHtml(user.handle)}</p>
      </div>
    </div>
    <div class="meta-row">
      <span>${Number(user.followers || 0)} followers</span>
      ${getVerificationMarkup(user)}
    </div>
  `;
}

function renderVerifiedUsers() {
  const wrapper = document.getElementById("verifiedContainer");
  const verified = state.users.filter(isVerifiedUser);

  if (!verified.length) {
    wrapper.innerHTML = '<div class="empty-state">No verified members yet.</div>';
    return;
  }

  wrapper.innerHTML = verified
    .map(
      (user) => `
        <div class="verified-item">
          <div>
            <strong>${escapeHtml(user.displayName)}</strong>
            <small>${escapeHtml(user.handle)}</small>
          </div>
          <button class="inline-button" type="button" data-action="open-profile" data-user-id="${user.id}">View</button>
        </div>
      `
    )
    .join("");
}

function renderFeed() {
  const wrapper = document.getElementById("feedContainer");
  const currentUser = getCurrentUser();
  const composerAvatar = document.getElementById("composerAvatar");
  composerAvatar.textContent = currentUser ? currentUser.displayName.charAt(0).toUpperCase() : "V";

  if (!state.posts.length) {
    wrapper.innerHTML = `
      <div class="empty-state">
        <p>No leaves yet.</p>
        <p>Start the conversation by publishing the first post.</p>
      </div>
    `;
    return;
  }

  wrapper.innerHTML = state.posts
    .slice()
    .reverse()
    .map((post) => {
      const author = findUserById(post.authorId) || createOfficialVerdantUser();
      const liked = !!currentUser && post.likes.includes(currentUser.id);
      const isFollowing = !!currentUser && currentUser.following.includes(author.id);

      return `
        <article class="leaf-card">
          <div class="post-header">
            <div class="avatar small">
              <img src="${escapeHtml(author.profilePicture || "")}" alt="${escapeHtml(author.displayName)}" onerror="this.style.display='none'; this.parentElement.textContent='${(author.displayName || 'U').charAt(0).toUpperCase()}'" />
            </div>
            <div class="post-author-meta">
              <div class="meta-row">
                <h3>${escapeHtml(author.displayName)}</h3>
                ${getVerificationMarkup(author)}
              </div>
              <p>${escapeHtml(author.handle)} • ${formatDate(post.createdAt)}</p>
            </div>
            <button class="ghost-btn" type="button" data-action="follow-user" data-user-id="${author.id}">${isFollowing ? "Following" : "Follow"}</button>
          </div>

          <div class="post-body">${renderInlineTokens(post.content)}</div>

          <div class="post-actions">
            <button class="action-button ${liked ? "is-active" : ""}" type="button" data-action="like-post" data-post-id="${post.id}">❤ ${post.likes.length}</button>
            <button class="action-button" type="button" data-action="reply-post" data-post-id="${post.id}">↩ ${post.replies.length}</button>
            <button class="action-button" type="button" data-action="share-post" data-post-id="${post.id}">↗ ${post.shares}</button>
            <button class="action-button" type="button" data-action="open-post" data-post-id="${post.id}">Open</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderDiscover() {
  const wrapper = document.getElementById("discoverContainer");
  const currentUser = getCurrentUser();

  const list = state.users.filter((user) => user.id !== (currentUser ? currentUser.id : ""));

  if (!list.length) {
    wrapper.innerHTML = '<div class="empty-state">No other users yet.</div>';
    return;
  }

  wrapper.innerHTML = list
    .map(
      (user) => `
        <div class="discover-entity">
          <div>
            <strong>${escapeHtml(user.displayName)}</strong>
            <small>${escapeHtml(user.handle)}</small>
          </div>
          <button class="ghost-btn" type="button" data-action="open-profile" data-user-id="${user.id}">View</button>
        </div>
      `
    )
    .join("");
}

function renderProfile() {
  const wrapper = document.getElementById("profileContainer");
  const user = findUserById(state.selectedProfileId) || getCurrentUser() || state.users[0];
  const currentUser = getCurrentUser();
  const isCurrentUser = !!currentUser && currentUser.id === user.id;
  const isFollowing = !!currentUser && currentUser.following.includes(user.id);
  const userPosts = state.posts.filter((post) => post.authorId === user.id);

  wrapper.innerHTML = `
    <div class="profile-header">
      <div class="profile-cover">
        <img src="${escapeHtml(user.coverPhoto || "")}" alt="${escapeHtml(user.displayName)} cover" onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(135deg, rgba(126,197,157,0.24), rgba(45,122,89,0.34))'" />
      </div>

      <div class="profile-header-body">
        <div class="profile-row">
          <div class="profile-picture-large">
            <img src="${escapeHtml(user.profilePicture || "")}" alt="${escapeHtml(user.displayName)}" onerror="this.style.display='none'; this.parentElement.textContent='${(user.displayName || 'U').charAt(0).toUpperCase()}'" />
          </div>

          <div class="profile-heading">
            <div class="meta-row">
              <h3>${escapeHtml(user.displayName)}</h3>
              ${getVerificationMarkup(user)}
            </div>
            <p class="handle-text">${escapeHtml(user.handle)}</p>
          </div>
        </div>

        <div class="profile-bio-block">
          <p class="profile-bio">${escapeHtml(user.aboutMe || "No bio yet.")}</p>

          <div class="profile-meta-grid">
            <div class="meta-item">
              <span>Website</span>
              <strong><a href="${escapeHtml(user.website || '#')}" target="_blank" rel="noreferrer">${escapeHtml(user.website || "Not provided")}</a></strong>
            </div>
            <div class="meta-item">
              <span>Favorite game</span>
              <strong>${escapeHtml(user.favoriteGame || "Not provided")}</strong>
            </div>
          </div>
        </div>

        <div class="profile-cta">
          <button class="primary-btn" type="button" data-action="follow-user" data-user-id="${user.id}">${isFollowing ? "Following" : "Follow"}</button>
          <button class="secondary-btn" type="button" data-action="open-post" data-post-id="${userPosts[0]?.id || ""}">${userPosts[0] ? "View latest" : "No posts yet"}</button>
          ${isCurrentUser ? '<button class="ghost-btn" type="button" data-action="go-account">Edit account</button>' : ""}
        </div>
      </div>
    </div>

    <div class="profile-card">
      <div class="panel-heading">
        <div>
          <p class="section-label">Activity</p>
          <h3>${escapeHtml(user.displayName)}'s leaves</h3>
        </div>
      </div>

      <div class="feed-container" style="margin-top: 14px;">
        ${userPosts.length ? userPosts.slice().reverse().map((post) => `
          <div class="user-row">
            <div>
              <h4>${escapeHtml(user.displayName)}</h4>
              <p class="muted">${formatDate(post.createdAt)}</p>
            </div>
            <button class="ghost-btn" type="button" data-action="open-post" data-post-id="${post.id}">Open</button>
          </div>
        `).join("") : '<div class="empty-state">No leaves yet.</div>'}
      </div>
    </div>
  `;
}

function renderAccountForm() {
  const user = getCurrentUser();
  if (!user) {
    document.getElementById("accountForm").reset();
    return;
  }

  document.getElementById("displayNameInput").value = user.displayName || "";
  document.getElementById("usernameInput").value = user.username || "";
  document.getElementById("bioInput").value = user.aboutMe || "";
  document.getElementById("websiteInput").value = user.website || "";
  document.getElementById("favoriteGameInput").value = user.favoriteGame || "";
  document.getElementById("profilePicInput").value = user.profilePicture || "";
  document.getElementById("coverPhotoInput").value = user.coverPhoto || "";
}

function openAuthModal(mode = "signin") {
  const modal = document.getElementById("authModal");
  modal.classList.remove("hidden");

  document.querySelectorAll(".auth-tab").forEach((button) => {
    button.classList.toggle("active", button.dataset.authMode === mode);
  });

  document.getElementById("signinPanel").classList.toggle("active", mode === "signin");
  document.getElementById("signupPanel").classList.toggle("active", mode === "signup");
}

function closeAuthModal() {
  document.getElementById("authModal").classList.add("hidden");
}

function openPost(postId) {
  const post = state.posts.find((item) => item.id === postId);
  if (!post) return;

  const author = findUserById(post.authorId) || createOfficialVerdantUser();
  document.getElementById("postDetailBody").innerHTML = `
    <article class="leaf-card">
      <div class="post-header">
        <div class="avatar small">
          <img src="${escapeHtml(author.profilePicture || "")}" alt="${escapeHtml(author.displayName)}" onerror="this.style.display='none'; this.parentElement.textContent='${(author.displayName || 'U').charAt(0).toUpperCase()}'" />
        </div>
        <div class="post-author-meta">
          <div class="meta-row">
            <h3>${escapeHtml(author.displayName)}</h3>
            ${getVerificationMarkup(author)}
          </div>
          <p>${escapeHtml(author.handle)} • ${formatDate(post.createdAt)}</p>
        </div>
      </div>

      <div class="post-body">${renderInlineTokens(post.content)}</div>

      <div class="post-actions">
        <button class="action-button" type="button" data-action="like-post" data-post-id="${post.id}">❤ ${post.likes.length}</button>
        <button class="action-button" type="button" data-action="reply-post" data-post-id="${post.id}">↩ ${post.replies.length}</button>
        <button class="action-button" type="button" data-action="share-post" data-post-id="${post.id}">↗ ${post.shares}</button>
      </div>
    </article>
  `;

  document.getElementById("postModal").classList.remove("hidden");
}

function closePostModal() {
  document.getElementById("postModal").classList.add("hidden");
}

function openAdminModal() {
  document.getElementById("adminModal").classList.remove("hidden");
}

function closeAdminModal() {
  document.getElementById("adminModal").classList.add("hidden");
}

function signInUser(usernameOrHandle, password) {
  const user = findUserByUsername(usernameOrHandle);
  if (!user) {
    showToast("No account with that username was found.");
    return;
  }

  if ((user.password || "") !== password) {
    showToast("Incorrect password.");
    return;
  }

  state.currentUserId = user.id;
  state.selectedProfileId = user.id;
  closeAuthModal();
  setView("feed");
  saveState();
  showToast(`Welcome back, ${user.displayName}`);
}

function createAccount({ displayName, username, password, aboutMe, website, favoriteGame, profilePicture, coverPhoto }) {
  const trimmedDisplayName = String(displayName || "").trim();
  const trimmedUsername = normalizeUsername(username);

  if (!trimmedDisplayName || !trimmedUsername || !password) {
    showToast("Display name, username, and password are required.");
    return;
  }

  if (findUserByUsername(trimmedUsername)) {
    showToast("That username already exists.");
    return;
  }

  const user = {
    id: `user-${Date.now()}`,
    username: trimmedUsername,
    handle: `@${trimmedUsername}`,
    displayName: trimmedDisplayName,
    aboutMe: String(aboutMe || "").trim(),
    website: String(website || "").trim(),
    favoriteGame: String(favoriteGame || "").trim(),
    profilePicture: String(profilePicture || "").trim(),
    coverPhoto: String(coverPhoto || "").trim(),
    followers: 0,
    following: [],
    official: false,
    banned: false,
    password: String(password),
    createdAt: new Date().toISOString(),
  };

  state.users.push(user);
  state.currentUserId = user.id;
  state.selectedProfileId = user.id;
  closeAuthModal();
  setView("profile");
  saveState();
  showToast("Account created successfully.");
}

function githubSignIn() {
  const user = {
    id: "github-user",
    username: "githubuser",
    handle: "@githubuser",
    displayName: "GitHub User",
    aboutMe: "Open-source creator building community tools.",
    website: "",
    favoriteGame: "Factorio",
    profilePicture: "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=400&q=80",
    coverPhoto: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=1200&q=80",
    followers: 0,
    following: [],
    official: false,
    banned: false,
    password: "github",
    createdAt: new Date().toISOString(),
  };

  if (!state.users.some((entry) => entry.id === "github-user")) {
    state.users.push(user);
  }

  state.currentUserId = user.id;
  state.selectedProfileId = user.id;
  closeAuthModal();
  setView("feed");
  saveState();
  showToast("Signed in with GitHub.");
}

function saveAccountChanges(event) {
  event.preventDefault();
  const user = getCurrentUser();
  if (!user) {
    showToast("Sign in to edit your profile.");
    openAuthModal("signin");
    return;
  }

  const nextUsername = normalizeUsername(document.getElementById("usernameInput").value);
  if (nextUsername && nextUsername !== normalizeUsername(user.username) && findUserByUsername(nextUsername)) {
    showToast("That username is already in use.");
    return;
  }

  user.displayName = document.getElementById("displayNameInput").value.trim() || user.displayName;
  user.username = nextUsername || user.username;
  user.handle = `@${user.username}`;
  user.aboutMe = document.getElementById("bioInput").value.trim();
  user.website = document.getElementById("websiteInput").value.trim();
  user.favoriteGame = document.getElementById("favoriteGameInput").value.trim();
  user.profilePicture = document.getElementById("profilePicInput").value.trim();
  user.coverPhoto = document.getElementById("coverPhotoInput").value.trim();

  state.selectedProfileId = user.id;
  saveState();
  renderFeed();
  renderProfile();
  renderSidebarProfile();
  renderVerifiedUsers();
  showToast("Profile updated.");
}

function deleteCurrentAccount() {
  const user = getCurrentUser();
  if (!user) {
    showToast("No account is signed in.");
    return;
  }

  state.users = state.users.filter((account) => account.id !== user.id);
  state.currentUserId = null;
  state.selectedProfileId = "verdant";
  saveState();
  setView("feed");
  showToast("Account deleted.");
}

function toggleFollowUser(userId) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    openAuthModal("signin");
    showToast("Sign in to follow people.");
    return;
  }

  const target = findUserById(userId);
  if (!target || target.id === currentUser.id) return;

  if (currentUser.following.includes(target.id)) {
    currentUser.following = currentUser.following.filter((id) => id !== target.id);
    target.followers = Math.max(0, Number(target.followers || 0) - 1);
  } else {
    currentUser.following.push(target.id);
    target.followers = Number(target.followers || 0) + 1;
  }

  saveState();
  renderFeed();
  renderProfile();
  renderDiscover();
  renderSidebarProfile();
  renderVerifiedUsers();
}

function likePost(postId) {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    openAuthModal("signin");
    showToast("Sign in to like posts.");
    return;
  }

  const post = state.posts.find((entry) => entry.id === postId);
  if (!post) return;

  if (post.likes.includes(currentUser.id)) {
    post.likes = post.likes.filter((id) => id !== currentUser.id);
  } else {
    post.likes.push(currentUser.id);
  }

  saveState();
  renderFeed();
}

function sharePost(postId) {
  const post = state.posts.find((entry) => entry.id === postId);
  if (!post) return;

  post.shares += 1;
  const shareUrl = `https://verdant.social/leaf/${postId}`;
  navigator.clipboard?.writeText(shareUrl).catch(() => {});
  saveState();
  renderFeed();
  showToast("Share link copied.");
}

function replyToPost(postId) {
  const post = state.posts.find((entry) => entry.id === postId);
  if (!post) return;

  const author = findUserById(post.authorId);
  const composer = document.getElementById("leafComposer");
  composer.value = `Replying to @${author?.username || "user"}: `;
  composer.focus();
  setView("feed");
  showToast(`Replying to ${author?.handle || "@user"}.`);
}

function publishLeaf() {
  const composer = document.getElementById("leafComposer");
  const content = composer.value.trim();
  const currentUser = getCurrentUser();

  if (!content) {
    showToast("Write a message before publishing.");
    return;
  }

  if (!currentUser) {
    openAuthModal("signin");
    showToast("Sign in to publish a leaf.");
    return;
  }

  if (currentUser.banned) {
    showToast("This account is banned.");
    return;
  }

  state.posts.push({
    id: `leaf-${Date.now()}`,
    authorId: currentUser.id,
    content,
    createdAt: new Date().toISOString(),
    likes: [],
    replies: [],
    shares: 0,
  });

  composer.value = "";
  saveState();
  renderFeed();
  renderProfile();
  showToast("Leaf published.");
}

function injectToken(token) {
  const composer = document.getElementById("leafComposer");
  const start = composer.selectionStart;
  const end = composer.selectionEnd;
  composer.value = composer.value.slice(0, start) + token + composer.value.slice(end);
  composer.focus();
  composer.setSelectionRange(start + 1, start + 1);
}

function renderAdminPanel() {
  const wrapper = document.getElementById("adminUserList");
  wrapper.innerHTML = state.users
    .map(
      (user) => `
        <div class="admin-user">
          <div class="meta-row">
            <strong>${escapeHtml(user.displayName)}</strong>
            ${getVerificationMarkup(user)}
          </div>
          <small class="muted">${escapeHtml(user.handle)}</small>
          <div class="admin-actions">
            <button class="ghost-btn" type="button" data-action="toggle-ban" data-user-id="${user.id}">${user.banned ? "Unban" : "Ban"}</button>
            <button class="primary-btn" type="button" data-action="toggle-official" data-user-id="${user.id}">${user.official ? "Remove official" : "Make official"}</button>
          </div>
        </div>
      `
    )
    .join("");
}

function handleAdminLogin(event) {
  event.preventDefault();
  const username = document.getElementById("adminUsername").value.trim();
  const password = document.getElementById("adminPassword").value;

  if (username !== ADMIN_CREDENTIALS.username || password !== ADMIN_CREDENTIALS.password) {
    showToast("Invalid admin credentials.");
    return;
  }

  document.getElementById("adminLoginForm").classList.add("hidden");
  document.getElementById("adminPanel").classList.remove("hidden");
  renderAdminPanel();
  showToast("Welcome to the staff backend.");
}

function toggleBanUser(userId) {
  const user = findUserById(userId);
  if (!user) return;

  user.banned = !user.banned;
  saveState();
  renderAdminPanel();
  showToast(user.banned ? `${user.displayName} is banned.` : `${user.displayName} is unbanned.`);
}

function toggleOfficialVerification(userId) {
  const user = findUserById(userId);
  if (!user) return;

  user.official = !user.official;
  saveState();
  renderAdminPanel();
  renderFeed();
  renderProfile();
  renderVerifiedUsers();
  renderSidebarProfile();
  showToast(user.official ? `${user.displayName} has official verification.` : `${user.displayName} lost official verification.`);
}

function bindEvents() {
  document.getElementById("signInButton").addEventListener("click", () => openAuthModal("signin"));
  document.getElementById("createAccountButton").addEventListener("click", () => openAuthModal("signup"));
  document.getElementById("publishLeaf").addEventListener("click", publishLeaf);
  document.getElementById("signinForm").addEventListener("submit", (event) => {
    event.preventDefault();
    signInUser(document.getElementById("signinUsername").value, document.getElementById("signinPassword").value);
  });

  document.getElementById("signupForm").addEventListener("submit", (event) => {
    event.preventDefault();
    createAccount({
      displayName: document.getElementById("signupDisplayName").value,
      username: document.getElementById("signupUsername").value,
      password: document.getElementById("signupPassword").value,
      aboutMe: document.getElementById("signupBio").value,
      website: document.getElementById("signupWebsite").value,
      favoriteGame: document.getElementById("signupFavoriteGame").value,
      profilePicture: document.getElementById("signupProfilePicture").value,
      coverPhoto: document.getElementById("signupCoverPhoto").value,
    });
  });

  document.getElementById("accountForm").addEventListener("submit", saveAccountChanges);
  document.getElementById("adminLoginForm").addEventListener("submit", handleAdminLogin);

  document.querySelectorAll(".auth-tab").forEach((button) => {
    button.addEventListener("click", () => openAuthModal(button.dataset.authMode));
  });

  document.querySelectorAll(".token-btn").forEach((button) => {
    button.addEventListener("click", () => injectToken(button.dataset.token));
  });

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;

    const action = target.dataset.action;
    const userId = target.dataset.userId;
    const postId = target.dataset.postId;
    const view = target.dataset.view;

    if (view) setView(view);
    if (action === "close-auth") closeAuthModal();
    if (action === "close-post") closePostModal();
    if (action === "close-admin") closeAdminModal();
    if (action === "github-signin") githubSignIn();
    if (action === "go-account") setView("account");
    if (action === "delete-account") deleteCurrentAccount();
    if (action === "open-profile") {
      state.selectedProfileId = userId;
      setView("profile");
    }
    if (action === "open-post") openPost(postId);
    if (action === "follow-user") toggleFollowUser(userId);
    if (action === "like-post") likePost(postId);
    if (action === "reply-post") replyToPost(postId);
    if (action === "share-post") sharePost(postId);
    if (action === "toggle-ban") toggleBanUser(userId);
    if (action === "toggle-official") toggleOfficialVerification(userId);
  });

  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.shiftKey && event.altKey && event.key.toLowerCase() === "v") {
      event.preventDefault();
      openAdminModal();
    }
  });
}

function boot() {
  bindEvents();
  renderFeed();
  renderDiscover();
  renderVerifiedUsers();
  renderSidebarProfile();
  renderProfile();
  renderAccountForm();
  setView("feed");
}

boot();
window.addEventListener("beforeunload", saveState);





































































































































































































































































































































































































































































































n






















y






















































































"}]},