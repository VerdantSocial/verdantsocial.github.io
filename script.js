:root {
  --bg: #f3f2ed;
  --bg-alt: #ece8e0;
  --panel: #ffffff;
  --panel-soft: #f7f6f2;
  --panel-deep: #ece8df;
  --text: #1d2a22;
  --text-soft: #586960;
  --verdant: #2d7a59;
  --verdant-strong: #1f5e43;
  --verdant-soft: rgba(45, 122, 89, 0.12);
  --leaf: #7ec59d;
  --gold: #c79a34;
  --gold-soft: rgba(199, 154, 52, 0.12);
  --line: rgba(30, 58, 44, 0.1);
  --danger: #b64b48;
  --shadow: 0 18px 42px rgba(30, 42, 34, 0.08);
  --radius: 24px;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  min-height: 100%;
  font-family: Inter, "Segoe UI", sans-serif;
  background: linear-gradient(180deg, var(--bg-alt) 0%, #f7f6f3 100%);
  color: var(--text);
}

body {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 30px 20px;
}

button,
input,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

img {
  max-width: 100%;
  display: block;
}

textarea,
input {
  border: 1px solid var(--line);
  border-radius: 14px;
  background: #fff;
  color: var(--text);
  padding: 12px 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

textarea:focus,
input:focus {
  outline: none;
  border-color: rgba(45, 122, 89, 0.4);
  box-shadow: 0 0 0 4px rgba(45, 122, 89, 0.08);
}

.app-shell {
  width: min(1440px, 100%);
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(27, 46, 37, 0.08);
  border-radius: 28px;
  padding: 16px 20px;
  box-shadow: var(--shadow);
  backdrop-filter: blur(12px);
  position: sticky;
  top: 18px;
  z-index: 10;
}

.brand-wrap {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-kicker {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--verdant-strong);
  margin: 0;
}

.brand-wrap strong {
  font-size: 1.2rem;
}

.brand-mark {
  width: 42px;
  height: 42px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(126, 197, 157, 0.18), rgba(45, 122, 89, 0.2));
  border: 1px solid rgba(45, 122, 89, 0.2);
  display: grid;
  place-items: center;
  position: relative;
  overflow: hidden;
}

.brand-mark.small-mark {
  width: 28px;
  height: 28px;
  border-radius: 10px;
}

.brand-mark-inner {
  width: 18px;
  height: 20px;
  display: block;
  background: linear-gradient(180deg, var(--leaf), var(--verdant));
  clip-path: polygon(44% 0%, 92% 16%, 76% 100%, 18% 100%, 8% 34%);
  transform: rotate(-14deg);
  opacity: 0.95;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  justify-content: center;
}

.nav-btn,
.primary-btn,
.ghost-btn,
.secondary-btn,
.danger-btn,
.token-btn,
.action-button,
.inline-button,
.auth-tab {
  border-radius: 12px;
  border: 1px solid transparent;
  transition: 0.2s ease;
}

.nav-btn {
  background: transparent;
  color: var(--text-soft);
  border-color: transparent;
  padding: 10px 14px;
  font-weight: 600;
}

.nav-btn.active {
  background: rgba(45, 122, 89, 0.08);
  color: var(--verdant-strong);
  border-color: rgba(45, 122, 89, 0.14);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.primary-btn,
.secondary-btn,
.ghost-btn,
.danger-btn,
.inline-button,
.action-button {
  padding: 10px 16px;
  font-weight: 600;
}

.primary-btn {
  background: linear-gradient(180deg, var(--verdant), var(--verdant-strong));
  color: white;
  border-color: rgba(31, 94, 67, 0.15);
}

.ghost-btn,
.secondary-btn,
.action-button,
.inline-button,
.auth-tab {
  background: rgba(255, 255, 255, 0.75);
  border-color: var(--line);
  color: var(--text);
}

.danger-btn {
  background: rgba(182, 75, 72, 0.08);
  border-color: rgba(182, 75, 72, 0.24);
  color: var(--danger);
}

.full-width {
  width: 100%;
}

.layout-grid {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr) 300px;
  gap: 22px;
  margin-top: 24px;
}

.sidebar,
.panel-card,
.composer-card,
.profile-header,
.post-card,
.leaf-card,
.side-panel {
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(27, 46, 37, 0.08);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
}

.sidebar {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-self: start;
}

.profile-preview-card,
.side-panel {
  padding: 18px;
}

.profile-mini {
  display: grid;
  gap: 14px;
}

.profile-topline {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--verdant), var(--leaf));
  display: grid;
  place-items: center;
  color: white;
  font-weight: 700;
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.4);
  overflow: hidden;
}

.avatar.small {
  width: 42px;
  height: 42px;
  font-size: 0.9rem;
}

.avatar img,
.profile-cover img,
.profile-picture {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.profile-cover {
  width: 100%;
  height: 120px;
  border-radius: 18px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(126, 197, 157, 0.24), rgba(45, 122, 89, 0.34));
  border: 1px solid rgba(45, 122, 89, 0.1);
}

.profile-mini-meta h3,
.profile-heading h3,
.post-author-meta h3,
.profile-card h3,
.panel-heading h2,
.composer-header h2,
.modal-card h2,
.account-form h2 {
  margin: 0;
}

.section-label {
  margin: 0 0 6px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.68rem;
  color: var(--verdant-strong);
  font-weight: 700;
}

.profile-mini-meta {
  display: grid;
  gap: 4px;
}

.handle-text,
.meta-line,
.muted {
  color: var(--text-soft);
}

.verification-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 10px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.72rem;
}

.verification-badge.official {
  background: var(--gold-soft);
  border: 1px solid rgba(199, 154, 52, 0.28);
  color: var(--gold);
}

.verification-badge.standard {
  background: rgba(45, 122, 89, 0.08);
  border: 1px solid rgba(45, 122, 89, 0.14);
  color: var(--verdant-strong);
}

.leaf-icon {
  display: inline-block;
  width: 10px;
  height: 12px;
  background: currentColor;
  clip-path: polygon(50% 0%, 100% 18%, 82% 100%, 18% 100%, 0% 18%);
  transform: rotate(-10deg);
}

.trend-list,
.mini-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 10px;
  color: var(--text-soft);
}

.trend-list li,
.mini-list li {
  background: rgba(247, 246, 242, 0.9);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 9px 12px;
}

.center-column {
  min-width: 0;
}

.view-panel {
  display: none;
}

.view-panel.active {
  display: block;
}

.composer-card,
.panel-card {
  padding: 18px;
}

.composer-header,
.panel-heading,
.profile-header-top,
.profile-meta-row,
.user-row,
.post-header,
.detail-meta,
.row-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.composer-header {
  justify-content: flex-start;
  margin-bottom: 14px;
}

#leafComposer {
  width: 100%;
  background: rgba(247, 246, 242, 0.9);
  resize: vertical;
  min-height: 110px;
  border-radius: 16px;
}

.composer-tools {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 14px;
}

.token-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.token-btn {
  width: 34px;
  height: 34px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.8);
  color: var(--text);
  border-radius: 10px;
  font-weight: 700;
}

.feed-container,
.discover-list {
  display: grid;
  gap: 18px;
  margin-top: 18px;
}

.leaf-card {
  padding: 18px;
}

.post-header {
  justify-content: flex-start;
}

.post-author-meta {
  flex: 1;
  min-width: 0;
}

.post-author-meta h3,
.profile-card h3 {
  font-size: 1.08rem;
}

.post-author-meta p,
.profile-bio,
.muted {
  margin: 0;
  color: var(--text-soft);
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  flex-wrap: wrap;
}

.post-body {
  margin: 16px 0;
  line-height: 1.7;
  color: #1c2c25;
}

.post-body .token {
  display: inline-block;
  background: rgba(45, 122, 89, 0.08);
  color: var(--verdant-strong);
  border-radius: 7px;
  padding: 0 5px;
  font-weight: 600;
  text-decoration: none;
}

.post-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.action-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 12px;
}

.action-button.is-active {
  background: rgba(45, 122, 89, 0.08);
  border-color: rgba(45, 122, 89, 0.16);
  color: var(--verdant-strong);
}

.profile-header {
  overflow: hidden;
}

.profile-cover {
  height: 180px;
  border-radius: 0;
  border: none;
}

.profile-header-body {
  padding: 0 20px 20px;
}

.profile-row {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  margin-top: -34px;
}

.profile-picture-large {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.92);
  overflow: hidden;
  background: linear-gradient(135deg, var(--verdant), var(--leaf));
  box-shadow: 0 12px 30px rgba(45, 122, 89, 0.18);
}

.profile-card {
  padding: 18px;
  margin-top: 18px;
}

.profile-bio-block {
  display: grid;
  gap: 12px;
  margin-top: 12px;
}

.profile-meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 12px;
}

.meta-item {
  background: rgba(247, 246, 242, 0.9);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 12px 14px;
}

.meta-item span {
  display: block;
  color: var(--text-soft);
  font-size: 0.73rem;
  margin-bottom: 4px;
}

.meta-item strong a {
  color: var(--verdant-strong);
  text-decoration: none;
  word-break: break-word;
}

.profile-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.user-row {
  padding: 12px 0;
  border-top: 1px solid var(--line);
}

.user-row:first-child {
  border-top: none;
}

.verified-list,
.discover-list {
  display: grid;
  gap: 12px;
}

.verified-item,
.discover-entity {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: rgba(247, 246, 242, 0.9);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 10px 12px;
}

.verified-item strong,
.discover-entity strong {
  display: block;
}

.verified-item small,
.discover-entity small {
  color: var(--text-soft);
}

.empty-state {
  background: rgba(247, 246, 242, 0.9);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 24px;
  color: var(--text-soft);
  text-align: center;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(18, 28, 23, 0.42);
  backdrop-filter: blur(4px);
  display: grid;
  place-items: center;
  z-index: 30;
}

.modal-overlay.hidden {
  display: none;
}

.modal-card {
  width: min(560px, calc(100% - 28px));
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(27, 46, 37, 0.08);
  border-radius: 30px;
  box-shadow: var(--shadow);
  padding: 22px;
}

.post-card {
  width: min(720px, calc(100% - 28px));
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
}

.brand-panel {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  color: var(--verdant-strong);
}

.close-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1px solid var(--line);
  background: rgba(247, 246, 242, 0.8);
  color: var(--text);
  font-size: 1.2rem;
}

.auth-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
  background: rgba(247, 246, 242, 0.9);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 6px;
}

.auth-tab {
  flex: 1;
  padding: 10px 12px;
}

.auth-tab.active {
  background: rgba(45, 122, 89, 0.08);
  border-color: rgba(45, 122, 89, 0.14);
  color: var(--verdant-strong);
}

.auth-panel {
  display: none;
}

.auth-panel.active {
  display: block;
}

.stack-form,
.account-form {
  display: grid;
  gap: 16px;
}

.account-form label,
.stack-form label {
  display: grid;
  gap: 8px;
  color: var(--text-soft);
}

.form-grid {
  display: grid;
  gap: 16px;
}

.two-col {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.admin-panel {
  margin-top: 18px;
  border-top: 1px solid var(--line);
  padding-top: 18px;
}

.admin-panel.hidden {
  display: none;
}

.admin-user {
  background: rgba(247, 246, 242, 0.9);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 14px;
  display: grid;
  gap: 12px;
}

.admin-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.toast {
  position: fixed;
  right: 22px;
  bottom: 22px;
  background: rgba(29, 42, 34, 0.95);
  color: white;
  border-radius: 12px;
  padding: 12px 14px;
  box-shadow: var(--shadow);
  opacity: 0;
  transform: translateY(10px);
  transition: 0.2s ease;
  z-index: 50;
}

.toast.show {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 1100px) {
  .layout-grid {
    grid-template-columns: 1fr;
  }

  .topbar {
    flex-wrap: wrap;
  }

  .main-nav {
    order: 3;
    width: 100%;
    justify-content: flex-start;
    overflow-x: auto;
  }
}

@media (max-width: 720px) {
  body {
    padding: 16px;
  }

  .two-col {
    grid-template-columns: 1fr;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .profile-row {
    align-items: center;
  }
}































































































































































































































































