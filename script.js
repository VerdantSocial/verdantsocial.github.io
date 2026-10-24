const state = {
  currentUser: null,
  activeView: "feed",
  selectedProfile: "maya",
  selectedPost: null,
  replyTarget: null,
  adminLoggedIn: false,
  following: new Set(["verdantofficial", "maya"]),
  users: [
    {
      id: "maya",
      name: "Maya Reed",
      handle: "@maya",
      bio: "Mapping out bright ideas and plant-powered business circles.",
      followers: 1205,
      following: 332,
      official: false,
      banned: false,
      avatar: "M",
    },
    {
      id: "verdantofficial",
      name: "Verdant Official",
      handle: "@verdantofficial",
      bio: "Open-source social features, wellness culture, and green product updates.",
      followers: 12840,
      following: 432,
      official: true,
      banned: false,
      avatar: "V",
    },
    {
      id: "aribloom",
      name: "Ari Bloom",
      handle: "@aribloom",
      bio: "Landscape designer turning tiny ideas into big green futures.",
      followers: 980,
      following: 287,
      official: false,
      banned: false,
      avatar: "A",
    },
    {
      id: "leafcrew",
      name: "Leaf Crew",
      handle: "@leafcrew",
      bio: "Monthly community sessions and stories for sustainable creators.",
      followers: 2350,
      following: 601,
      official: false,
      banned: false,
      avatar: "L",
    },
  ],
  posts: [
    {
      id: "leaf-1",
      authorId: "maya",
      content:
        "Our open-source community grows when we share the small wins. A good idea can bloom in a single thread. 🌱",
      likes: 182,
      shares: 27,
      replies: 4,
      liked: true,
      createdAt: "2h ago",
    },
    {
      id: "leaf-2",
      authorId: "verdantofficial",
      content:
        "Verdant launch checklist is live. We are building accessible tools for connected, green communities.",
      likes: 451,
      shares: 94,
      replies: 22,
      liked: false,
      createdAt: "5h ago",
    },
    {
      id: "leaf-3",
      authorId: "aribloom",
      content:
        "Tiny urban gardens are proof that every patch of soil can become a story of care, growth, and resilience.",
      likes: 106,
      shares: 31,
      replies: 9,
      liked: false,
      createdAt: "1d ago",
    },
  ],
};

const adminCredentials = {
  username: "verdantadmin",
  password: "verdantstaff2024",
};

const $ = (selector) => document.querySelector(selector);

function getUserById(userId) {
  return state.users.find((user) => user.id === userId) || state.currentUser;
}

function isVerified(user) {
  return !!user && (user.official || user.followers >= 1000);
}

function getVerificationMarkup(user) {
  if (!user) return "";
  if (user.official) {
    return '<span class="verification-badge official"><span class="leaf-icon"></span>Official</span>';
  }
  if (user.followers >= 1000) {
    return '<span class="verification-badge"><span class="leaf-icon"></span>Verified</span>';
  }
  return "";
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

function setView(viewName) {
  state.activeView = viewName;
  document.querySelectorAll(".nav-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.view === viewName);
  });
  document.querySelectorAll(".view-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.id === `${viewName}View`);
  });

  if (viewName === "profile") {
    renderProfile();
  }

  if (viewName === "feed") {
    renderFeed();
  }

  if (viewName === "account") {
    renderAccount();
  }
}

function renderFeed() {
  const feedContainer = document.getElementById("feedContainer");
  feedContainer.innerHTML = state.posts
    .map((post) => {
      const author = getUserById(post.authorId);
      const authorVerified = getVerificationMarkup(author);
      const liked = post.liked ? "active" : "";
      const following = state.following.has(author.id) ? "Following" : "Follow";
      return `
        <article class="leaf-card" data-id="${post.id}">
          <div class="leaf-header">
            <div class="avatar">${author.avatar}</div>
            <div class="user-meta">
              <div class="meta-line">
                <h3>${author.name}</h3>
                ${authorVerified}
              </div>
              <p>${author.handle} • ${post.createdAt}</p>
            </div>
            <button class="ghost-btn small" type="button" data-action="toggle-follow" data-user-id="${author.id}">${following}</button>
          </div>

          <div class="content-body">${post.content}</div>

          <div class="leaf-toolbar">
            <button class="action-btn ${liked}" type="button" data-action="like-post" data-post-id="${post.id}">❤ ${post.likes}</button>
            <button class="action-btn" type="button" data-action="reply-post" data-post-id="${post.id}">↩ ${post.replies}</button>
            <button class="action-btn" type="button" data-action="share-post" data-post-id="${post.id}">↗ ${post.shares}</button>
            <button class="action-btn" type="button" data-action="open-post" data-post-id="${post.id}">Open Leaf</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderProfile() {
  const profileContainer = document.getElementById("profileContainer");
  const user = getUserById(state.selectedProfile || state.currentUser?.id || "maya");
  const userPosts = state.posts.filter((post) => post.authorId === user.id);
  const following = state.following.has(user.id);

  profileContainer.innerHTML = `
    <div class="profile-header">
      <div class="profile-top">
        <div class="avatar large">${user.avatar}</div>
        <div class="user-meta">
          <div class="meta-line">
            <h3>${user.name}</h3>
            ${getVerificationMarkup(user)}
          </div>
          <p>${user.handle}</p>
          <p class="profile-details">${user.bio}</p>
        </div>
      </div>

      <div class="profile-stats">
        <div class="stat-pill"><strong>${user.followers}</strong><span>Followers</span></div>
        <div class="stat-pill"><strong>${user.following}</strong><span>Following</span></div>
        <div class="stat-pill"><strong>${userPosts.length}</strong><span>Leaves</span></div>
      </div>

      <div class="button-row">
        <button class="primary-btn" type="button" data-action="toggle-follow" data-user-id="${user.id}">${following ? "Following" : "Follow"}</button>
        <button class="ghost-btn" type="button" data-action="open-post" data-post-id="${userPosts[0]?.id || "leaf-1"}">View latest leaf</button>
      </div>
    </div>

    <div class="profile-card" style="margin-top: 18px;">
      <div class="card-heading">
        <p class="eyebrow">Recent leaves</p>
        <h3>${user.name}'s activity</h3>
      </div>
      <div style="margin-top: 16px; display: grid; gap: 12px;">
        ${userPosts
          .map(
            (post) => `
            <div class="user-row">
              <div>
                <h4>${user.name}</h4>
                <p>${post.createdAt}</p>
              </div>
              <button class="ghost-btn" type="button" data-action="open-post" data-post-id="${post.id}">Open</button>
            </div>
          `
          )
          .join("") || '<p class="muted">No leaves yet.</p>'}
      </div>
    </div>
  `;
}

function renderAccount() {
  if (!state.currentUser) {
    document.getElementById("accountForm").reset();
    return;
  }

  const name = document.getElementById("accountName");
  const handle = document.getElementById("accountHandle");
  const bio = document.getElementById("accountBio");
  const password = document.getElementById("accountPassword");

  name.value = state.currentUser.name;
  handle.value = state.currentUser.handle;
  bio.value = state.currentUser.bio;
  password.value = "";
}

function renderVerifiedUsers() {
  const container = document.getElementById("verifiedUsers");
  const verifiedList = state.users.filter((user) => isVerified(user));
  container.innerHTML = `
    <div class="verified-user-list">
      ${verifiedList
        .map(
          (user) => `
            <div class="user-chip">
              <div class="user-meta">
                <div class="meta-line">
                  <strong>${user.name}</strong>
                  ${getVerificationMarkup(user)}
                </div>
                <p>${user.handle}</p>
              </div>
              <button class="ghost-btn" type="button" data-action="open-profile" data-user-id="${user.id}">View</button>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderAdminUsers() {
  const list = document.getElementById("adminUserList");
  list.innerHTML = state.users
    .map(
      (user) => `
        <div class="admin-user">
          <div class="meta-line">
            <strong>${user.name}</strong>
            ${getVerificationMarkup(user)}
          </div>
          <p class="muted">${user.handle}</p>
          <div class="admin-user-actions">
            <button class="ghost-btn" type="button" data-action="ban-user" data-user-id="${user.id}">${user.banned ? "Unban" : "Ban"}</button>
            <button class="primary-btn" type="button" data-action="toggle-verification" data-user-id="${user.id}">${user.official ? "Remove official" : "Make official"}</button>
          </div>
        </div>
      `
    )
    .join("");
}

function openProfile(userId) {
  state.selectedProfile = userId;
  setView("profile");
}

function openPost(postId) {
  const post = state.posts.find((item) => item.id === postId);
  if (!post) return;

  const author = getUserById(post.authorId);
  const template = `
    <div class="leaf-card">
      <div class="leaf-header">
        <div class="avatar">${author.avatar}</div>
        <div class="user-meta">
          <div class="meta-line">
            <h3>${author.name}</h3>
            ${getVerificationMarkup(author)}
          </div>
          <p>${author.handle} • ${post.createdAt}</p>
        </div>
      </div>
      <div class="content-body">${post.content}</div>
      <div class="leaf-toolbar">
        <button class="action-btn ${post.liked ? "active" : ""}" type="button" data-action="like-post" data-post-id="${post.id}">❤ ${post.likes}</button>
        <button class="action-btn" type="button" data-action="reply-post" data-post-id="${post.id}">↩ ${post.replies}</button>
        <button class="action-btn" type="button" data-action="share-post" data-post-id="${post.id}">↗ ${post.shares}</button>
      </div>
      <div class="comment-box">Replying to ${author.handle} is ready from the feed composer.</div>
    </div>
  `;

  document.getElementById("postDetailBody").innerHTML = template;
  document.getElementById("postModal").classList.remove("hidden");
  state.selectedPost = postId;
}

function closePostModal() {
  document.getElementById("postModal").classList.add("hidden");
}

function openAuthModal() {
  document.getElementById("authModal").classList.remove("hidden");
}

function closeAuthModal() {
  document.getElementById("authModal").classList.add("hidden");
}

function openAdminModal() {
  document.getElementById("adminModal").classList.remove("hidden");
}

function closeAdminModal() {
  document.getElementById("adminModal").classList.add("hidden");
}

function saveAccount() {
  const nameField = document.getElementById("accountName");
  const handleField = document.getElementById("accountHandle");
  const bioField = document.getElementById("accountBio");

  if (!state.currentUser) {
    showToast("Sign in before editing your account.");
    openAuthModal();
    return;
  }

  state.currentUser.name = nameField.value.trim() || state.currentUser.name;
  state.currentUser.handle = handleField.value.trim() || state.currentUser.handle;
  state.currentUser.bio = bioField.value.trim() || state.currentUser.bio;

  state.users = state.users.filter((user) => user.id !== state.currentUser.id);
  state.users.unshift(state.currentUser);

  renderFeed();
  renderProfile();
  renderVerifiedUsers();
  renderAdminUsers();
  showToast("Account updated.");
}

function deleteAccount() {
  if (!state.currentUser) {
    showToast("No active account to delete.");
    return;
  }

  const currentId = state.currentUser.id;
  state.users = state.users.filter((user) => user.id !== currentId);
  state.currentUser = null;
  state.following.clear();
  setView("feed");
  openAuthModal();
  showToast("Account deleted.");
}

function signInUser(nameValue, passwordValue) {
  const username = String(nameValue || "").trim();
  const password = String(passwordValue || "");

  if (!username || !password) {
    showToast("Please enter a username and password.");
    return;
  }

  const newUser = {
    id: `user-${Date.now()}`,
    name: username,
    handle: `@${username.toLowerCase().replace(/\s+/g, "")}`,
    bio: "Freshly sprouting ideas and community stories.",
    followers: 742,
    following: 420,
    official: false,
    banned: false,
    avatar: username.charAt(0).toUpperCase(),
  };

  state.currentUser = newUser;
  state.users.unshift(newUser);
  state.following.add(newUser.id);
  state.selectedProfile = newUser.id;
  closeAuthModal();
  setView("feed");
  renderVerifiedUsers();
  showToast(`Welcome, ${newUser.name}!`);
}

function handleGithubSignIn() {
  state.currentUser = {
    id: "github-user",
    name: "GitHub Angel",
    handle: "@githubangel",
    bio: "Open-source enthusiast cultivating collaborative tools.",
    followers: 1542,
    following: 436,
    official: false,
    banned: false,
    avatar: "G",
  };

  state.users.unshift(state.currentUser);
  state.following.add(state.currentUser.id);
  state.selectedProfile = state.currentUser.id;
  closeAuthModal();
  setView("feed");
  renderVerifiedUsers();
  showToast("Signed in with GitHub.");
}

function toggleFollow(userId) {
  if (!state.currentUser) {
    openAuthModal();
    showToast("Sign in to follow accounts.");
    return;
  }

  const user = getUserById(userId);
  const following = state.following.has(user.id);

  if (following) {
    state.following.delete(user.id);
    if (user.followers > 0) user.followers = Math.max(0, user.followers - 1);
  } else {
    state.following.add(user.id);
    user.followers += 1;
  }

  renderFeed();
  renderProfile();
  renderVerifiedUsers();
}

function handleLike(postId) {
  const post = state.posts.find((item) => item.id === postId);
  if (!post) return;

  post.liked = !post.liked;
  post.likes += post.liked ? 1 : -1;
  renderFeed();
  if (state.selectedPost === postId) openPost(postId);
}

function handleShare(postId) {
  const post = state.posts.find((item) => item.id === postId);
  if (!post) return;

  post.shares += 1;
  const shareLink = `https://verdantsocial.example/leaf/${post.id}`;
  navigator.clipboard?.writeText(shareLink).catch(() => {});
  renderFeed();
  showToast("Leaf link copied to clipboard.");
}

function handleReply(postId) {
  const post = state.posts.find((item) => item.id === postId);
  const author = getUserById(post.authorId);
  const composer = document.getElementById("leafComposer");
  const viewName = state.activeView;

  state.replyTarget = postId;
  composer.value = `Replying to ${author.handle}: `;
  composer.focus();
  setView(viewName === "account" ? "feed" : viewName);
  showToast(`Replying to ${author.handle}.`);
}

function createLeaf() {
  const composer = document.getElementById("leafComposer");
  const content = composer.value.trim();

  if (!content) {
    showToast("Write a leaf before publishing.");
    return;
  }

  if (!state.currentUser) {
    openAuthModal();
    showToast("Please sign in before posting.");
    return;
  }

  const author = state.currentUser;
  const newPost = {
    id: `leaf-${Date.now()}`,
    authorId: author.id,
    content,
    likes: 0,
    shares: 0,
    replies: 0,
    liked: false,
    createdAt: "just now",
  };

  state.posts.unshift(newPost);
  composer.value = "";
  state.replyTarget = null;
  renderFeed();
  if (state.activeView === "profile") {
    renderProfile();
  }
  showToast("Your leaf is now live.");
}

function openAdminPanel() {
  const username = document.getElementById("adminUsername").value.trim();
  const password = document.getElementById("adminPassword").value;

  if (username === adminCredentials.username && password === adminCredentials.password) {
    state.adminLoggedIn = true;
    document.getElementById("adminLoginForm").classList.add("hidden");
    document.getElementById("adminPanel").classList.remove("hidden");
    renderAdminUsers();
    showToast("Welcome to the staff backend.");
  } else {
    showToast("Admin credentials are invalid.");
  }
}

function toggleBanUser(userId) {
  const user = getUserById(userId);
  user.banned = !user.banned;
  renderAdminUsers();
  showToast(user.banned ? `${user.name} is banned.` : `${user.name} is unbanned.`);
}

function toggleOfficialVerification(userId) {
  const user = getUserById(userId);
  user.official = !user.official;
  renderAdminUsers();
  renderFeed();
  renderProfile();
  renderVerifiedUsers();
  showToast(user.official ? `${user.name} has official verification.` : `${user.name} lost official verification.`);
}

function initialize() {
  state.users.unshift({
    id: "verdantofficial",
    name: "Verdant Official",
    handle: "@verdantofficial",
    bio: "Open-source social features, wellness culture, and green product updates.",
    followers: 12840,
    following: 432,
    official: true,
    banned: false,
    avatar: "V",
  });

  document.getElementById("authForm").addEventListener("submit", (event) => {
    event.preventDefault();
    signInUser(document.getElementById("authUsername").value, document.getElementById("authPassword").value);
  });

  document.getElementById("accountForm").addEventListener("submit", (event) => {
    event.preventDefault();
    saveAccount();
  });

  document.getElementById("adminLoginForm").addEventListener("submit", (event) => {
    event.preventDefault();
    openAdminPanel();
  });

  document.getElementById("publishLeaf").addEventListener("click", createLeaf);

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-action]");
    if (!target) return;

    const action = target.dataset.action;
    const postId = target.dataset.postId;
    const userId = target.dataset.userId;
    const view = target.dataset.view;

    if (view) setView(view);
    if (action === "close-auth") closeAuthModal();
    if (action === "close-post") closePostModal();
    if (action === "close-admin") closeAdminModal();
    if (action === "open-signin") openAuthModal();
    if (action === "github-signin") handleGithubSignIn();
    if (action === "delete-account") deleteAccount();
    if (action === "open-profile") openProfile(userId);
    if (action === "open-post") openPost(postId);
    if (action === "toggle-follow") toggleFollow(userId);
    if (action === "like-post") handleLike(postId);
    if (action === "reply-post") handleReply(postId);
    if (action === "share-post") handleShare(postId);
    if (action === "ban-user") toggleBanUser(userId);
    if (action === "toggle-verification") toggleOfficialVerification(userId);
  });

  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.shiftKey && event.altKey && event.key.toLowerCase() === "v") {
      event.preventDefault();
      openAdminModal();
    }
  });

  renderFeed();
  renderVerifiedUsers();
  setView("feed");
  openAuthModal();
}

initialize();

window.addEventListener("beforeunload", () => {
  document.getElementById("authModal").classList.remove("hidden");
});












































































































































































































authUsername
