#!/bin/bash
set -e
echo "🧡 Monecome — Thème Orange Moderne (sans toucher à la logique)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ─────────────────────────────────────────────────────────────────────────────
# 1. src/styles.css  — Remplacement du thème vert par orange
# ─────────────────────────────────────────────────────────────────────────────
cat > src/styles.css << 'ENDOFFILE'
@import 'bootstrap/dist/css/bootstrap.min.css';

/* ══ Variables Orange Moderne ══════════════════════════════════════════════ */
:root {
  --primary:          #ff6b35;
  --primary-dark:     #e8541f;
  --primary-light:    #14b8a6; /* gardé pour les accents vendeur */
  --primary-gradient: linear-gradient(135deg, #ff6b35 0%, #ff9a5c 100%);
  --bg-light:         #f8fafc;
  --bg-white:         #ffffff;
  --text-dark:        #1e293b;
  --text-gray:        #64748b;
  --border:           #e2e8f0;
  --shadow:           0 1px 3px rgba(0,0,0,0.06);
  --shadow-hover:     0 8px 25px rgba(255,107,53,0.15);
  --orange-glow:      0 0 0 3px rgba(255,107,53,0.18);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: var(--bg-light);
  color: var(--text-dark);
}

/* ── Boutons Bootstrap ─────────────────────────────────────────────────── */
.btn-primary {
  background: var(--primary) !important;
  border-color: var(--primary) !important;
  font-weight: 600;
  transition: all 0.25s;
}
.btn-primary:hover, .btn-primary:focus {
  background: var(--primary-dark) !important;
  border-color: var(--primary-dark) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255,107,53,0.35) !important;
}
.btn-primary:disabled { opacity: 0.65; transform: none; }

.btn-outline-primary {
  color: var(--primary) !important;
  border-color: var(--primary) !important;
}
.btn-outline-primary:hover {
  background: var(--primary) !important;
  border-color: var(--primary) !important;
  color: white !important;
}

/* ── Formulaires ─────────────────────────────────────────────────────────── */
.form-control, .form-select {
  border-radius: 10px;
  border: 1.5px solid var(--border);
  padding: 10px 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-control:focus, .form-select:focus {
  border-color: var(--primary) !important;
  box-shadow: var(--orange-glow) !important;
  outline: none;
}

/* ── Cards ───────────────────────────────────────────────────────────────── */
.card {
  border-radius: 14px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  transition: transform 0.25s, box-shadow 0.25s;
}
.card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-hover);
}

/* ── Scrollbar ───────────────────────────────────────────────────────────── */
::-webkit-scrollbar { width: 7px; height: 7px; }
::-webkit-scrollbar-track { background: var(--border); border-radius: 10px; }
::-webkit-scrollbar-thumb { background: var(--primary); border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: var(--primary-dark); }

/* ── Alertes ─────────────────────────────────────────────────────────────── */
.alert-success { background: #fff3ee; border-color: #ffddcc; color: var(--primary-dark); }
.alert-warning { background: #fef3c7; border-color: #fde68a; color: #92400e; }
ENDOFFILE
echo "✔ src/styles.css"

# ─────────────────────────────────────────────────────────────────────────────
# 2. src/app/app.component.css  — Navbar orange
# ─────────────────────────────────────────────────────────────────────────────
cat > src/app/app.component.css << 'ENDOFFILE'
/* ══ Navbar — Thème Orange ═════════════════════════════════════════════════ */
.navbar {
  background: linear-gradient(135deg, #e8541f 0%, #ff6b35 100%) !important;
  box-shadow: 0 2px 12px rgba(232,84,31,0.25);
  padding: 0.75rem 0;
}

.navbar-brand { font-size: 1.3rem; }
.logo-icon    { font-size: 1.6rem; }
.logo-text    { font-weight: 700; color: white; }

/* Liens nav */
.navbar .nav-link { color: rgba(255,255,255,0.88) !important; font-weight: 500; }
.navbar .nav-link:hover { color: white !important; }

/* Boutons navbar */
.btn-outline-light {
  border-color: rgba(255,255,255,0.3);
  color: white;
  transition: all 0.2s;
  padding: 0.45rem 1rem;
  font-size: 0.9rem;
  font-weight: 500;
}
.btn-outline-light:hover {
  background: rgba(255,255,255,0.18);
  border-color: rgba(255,255,255,0.5);
  transform: translateY(-1px);
  color: white;
}

.btn-light {
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
}
.btn-light:hover { background: rgba(255,255,255,0.25); color: white; }

.vr { width: 1px; height: 30px; background: rgba(255,255,255,0.2); margin: 0 5px; }

/* Badge panier */
.cart-badge {
  position: absolute;
  top: -8px; right: -8px;
  background: #1e293b;
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 20px;
}

/* Dropdown */
.dropdown-menu {
  border: none;
  border-radius: 14px;
  box-shadow: 0 12px 35px rgba(0,0,0,0.14);
  margin-top: 10px;
}
.dropdown-item { padding: 0.6rem 1.2rem; font-size: 0.85rem; transition: all 0.15s; }
.dropdown-item i { width: 20px; margin-right: 8px; color: #ff6b35; }
.dropdown-item:hover { background: #fff3ee; color: #e8541f; }
.dropdown-item.text-danger:hover { background: #fee2e2; }

.auth-buttons { display: flex; gap: 8px; align-items: center; }

@media (max-width: 992px) {
  .flex-grow-1 { display: none; }
  .vr { display: none; }
}
ENDOFFILE
echo "✔ src/app/app.component.css"

# ─────────────────────────────────────────────────────────────────────────────
# 3. Login — CSS orange (garde le HTML et TS intacts)
# ─────────────────────────────────────────────────────────────────────────────
cat > src/app/components/login/login.component.css << 'ENDOFFILE'
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #e8541f 0%, #ff9a5c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container { width: 100%; max-width: 420px; }

.login-card {
  background: white;
  border-radius: 22px;
  padding: 42px 34px;
  box-shadow: 0 24px 50px rgba(0,0,0,0.14);
}

.login-card h2 { color: #1e293b; font-weight: 700; margin-bottom: 24px; }

.form-control {
  border-radius: 12px;
  padding: 12px 16px;
  border: 1.5px solid #e2e8f0;
  transition: all 0.2s;
}
.form-control:focus {
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255,107,53,0.15);
  outline: none;
}

.btn-login {
  background: linear-gradient(135deg, #e8541f, #ff6b35);
  border: none;
  color: white;
  padding: 14px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  width: 100%;
  transition: all 0.3s;
  cursor: pointer;
}
.btn-login:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(232,84,31,0.4);
  background: linear-gradient(135deg, #cc4519, #e8541f);
}
.btn-login:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

.alert-danger { background: #fee2e2; border: 1px solid #fecaca; color: #dc2626; border-radius: 12px; padding: 12px; }

.text-primary { color: #ff6b35 !important; text-decoration: none; font-weight: 600; }
.text-primary:hover { color: #e8541f !important; text-decoration: underline; }
ENDOFFILE
echo "✔ src/app/components/login/login.component.css"

# ─────────────────────────────────────────────────────────────────────────────
# 4. Register — CSS orange
# ─────────────────────────────────────────────────────────────────────────────
cat > src/app/components/register/register.component.css << 'ENDOFFILE'
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #e8541f 0%, #ff9a5c 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-container { width: 100%; max-width: 480px; }

.register-card {
  background: white;
  border-radius: 22px;
  padding: 42px 34px;
  box-shadow: 0 24px 50px rgba(0,0,0,0.14);
}

.register-card h2 { color: #1e293b; font-weight: 700; margin-bottom: 20px; }

.form-control, .form-select {
  border-radius: 12px;
  padding: 12px 16px;
  border: 1.5px solid #e2e8f0;
  transition: all 0.2s;
}
.form-control:focus, .form-select:focus {
  border-color: #ff6b35;
  box-shadow: 0 0 0 3px rgba(255,107,53,0.15);
  outline: none;
}

.btn-register {
  background: linear-gradient(135deg, #e8541f, #ff6b35);
  border: none;
  color: white;
  padding: 14px;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 50px;
  width: 100%;
  transition: all 0.3s;
  cursor: pointer;
}
.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(232,84,31,0.4);
}

.text-primary { color: #ff6b35 !important; text-decoration: none; font-weight: 600; }
.text-primary:hover { color: #e8541f !important; text-decoration: underline; }
ENDOFFILE
echo "✔ src/app/components/register/register.component.css"

# ─────────────────────────────────────────────────────────────────────────────
# 5. Admin Layout — CSS orange (sidebar + active)
# ─────────────────────────────────────────────────────────────────────────────
cat > src/app/components/admin/admin-layout/admin-layout.component.css << 'ENDOFFILE'
.admin-layout { display: flex; min-height: 100vh; background: #f8fafc; }

.admin-sidebar {
  width: 280px;
  background: #1e293b;
  position: fixed;
  top: 0; left: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow-y: auto;
}

.sidebar-header { padding: 24px; border-bottom: 1px solid #334155; }
.logo { display: flex; align-items: center; gap: 10px; }
.logo-icon { font-size: 1.6rem; }
.logo-text { font-size: 1.3rem; font-weight: 600; color: white; }

.sidebar-menu { flex: 1; padding: 20px 0; }

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.2s;
  font-size: 0.9rem;
  font-weight: 500;
}
.menu-item i { width: 22px; font-size: 1.1rem; }
.menu-item:hover { background: #334155; color: white; }

/* ← Orange à la place du vert */
.menu-item.active { background: #ff6b35; color: white; }

.sidebar-footer { padding: 20px; border-top: 1px solid #334155; }

.btn-logout {
  width: 100%;
  padding: 10px;
  background: #dc2626;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.btn-logout:hover { background: #b91c1c; transform: translateY(-1px); }

.admin-main {
  flex: 1;
  margin-left: 280px;
  padding: 24px;
  min-height: 100vh;
  background: #f8fafc;
}

.admin-sidebar::-webkit-scrollbar { width: 4px; }
.admin-sidebar::-webkit-scrollbar-track { background: #334155; }
.admin-sidebar::-webkit-scrollbar-thumb { background: #ff6b35; border-radius: 4px; }

@media (max-width: 768px) {
  .admin-sidebar { transform: translateX(-100%); transition: transform 0.3s ease; }
  .admin-sidebar.open { transform: translateX(0); }
  .admin-main { margin-left: 0; }
}
ENDOFFILE
echo "✔ src/app/components/admin/admin-layout/admin-layout.component.css"

# ─────────────────────────────────────────────────────────────────────────────
# 6. Dashboard admin — CSS orange
# ─────────────────────────────────────────────────────────────────────────────
cat > src/app/components/admin/dashboard/dashboard.component.css << 'ENDOFFILE'
.dashboard-container { max-width: 1200px; }

.stat-card {
  padding: 24px;
  border-radius: 16px;
  height: 100%;
  transition: transform 0.3s, box-shadow 0.3s;
  border: none;
}
.stat-card:hover { transform: translateY(-5px); box-shadow: 0 12px 28px rgba(0,0,0,0.15); }

.stat-icon { font-size: 2.2rem; margin-bottom: 12px; opacity: 0.9; }

/* Remplacer bg-primary Bootstrap par orange */
.stat-card.bg-primary { background: linear-gradient(135deg, #ff6b35, #e8541f) !important; }
.stat-card.bg-success { background: linear-gradient(135deg, #10b981, #059669) !important; }
.stat-card.bg-info    { background: linear-gradient(135deg, #3b82f6, #2563eb) !important; }
.stat-card.bg-warning { background: linear-gradient(135deg, #f59e0b, #d97706) !important; }
ENDOFFILE
echo "✔ src/app/components/admin/dashboard/dashboard.component.css"

# ─────────────────────────────────────────────────────────────────────────────
# 7. Boutiques admin — CSS orange
# ─────────────────────────────────────────────────────────────────────────────
cat > src/app/components/admin/boutiques-admin/boutiques-admin.component.css << 'ENDOFFILE'
.boutique-card {
  background: white;
  padding: 20px;
  border-radius: 14px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.2s;
  border-left: 4px solid transparent;
}
.boutique-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(255,107,53,0.12);
  border-left-color: #ff6b35;
}

.boutique-icon {
  font-size: 2.2rem;
  width: 60px; height: 60px;
  display: flex; align-items: center; justify-content: center;
  background: #fff3ee;
  border-radius: 14px;
}

/* Boutons admin orange */
.btn-outline-primary { color: #ff6b35 !important; border-color: #ff6b35 !important; }
.btn-outline-primary:hover { background: #ff6b35 !important; color: white !important; }
.btn-primary { background: #ff6b35 !important; border-color: #ff6b35 !important; }
.btn-primary:hover { background: #e8541f !important; border-color: #e8541f !important; }
ENDOFFILE
echo "✔ src/app/components/admin/boutiques-admin/boutiques-admin.component.css"

# ─────────────────────────────────────────────────────────────────────────────
# 8. Vendeurs admin — CSS orange
# ─────────────────────────────────────────────────────────────────────────────
cat > src/app/components/admin/vendeurs-admin/vendeurs-admin.component.css << 'ENDOFFILE'
.vendeur-card {
  background: white;
  padding: 20px;
  border-radius: 14px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.2s;
  border-left: 4px solid transparent;
}
.vendeur-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(255,107,53,0.12);
  border-left-color: #ff6b35;
}

/* Avatar orange */
.avatar {
  width: 50px; height: 50px;
  background: linear-gradient(135deg, #ff6b35, #e8541f);
  color: white;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: bold;
  font-size: 1.3rem;
}

.btn-group { display: flex; gap: 8px; }

.modal {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1050;
}
.modal-dialog { max-width: 500px; width: 90%; margin: 0 auto; }
.modal-content { border-radius: 18px; overflow: hidden; }
.modal-header { background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
.modal-footer { background: #f8fafc; border-top: 1px solid #e2e8f0; }

.btn-outline-primary { color: #ff6b35 !important; border-color: #ff6b35 !important; }
.btn-outline-primary:hover { background: #ff6b35 !important; color: white !important; }
.btn-primary { background: #ff6b35 !important; border-color: #ff6b35 !important; }
.btn-primary:hover { background: #e8541f !important; }
ENDOFFILE
echo "✔ src/app/components/admin/vendeurs-admin/vendeurs-admin.component.css"

# ─────────────────────────────────────────────────────────────────────────────
# 9. Abonnements admin — CSS orange
# ─────────────────────────────────────────────────────────────────────────────
cat > src/app/components/admin/abonnements-admin/abonnements-admin.component.css << 'ENDOFFILE'
.plan-card {
  background: white;
  padding: 32px 22px;
  border-radius: 18px;
  text-align: center;
  box-shadow: 0 4px 18px rgba(0,0,0,0.07);
  border-top: 5px solid;
  transition: transform 0.25s;
}
.plan-card:hover { transform: translateY(-5px); }

/* Orange pour le plan Primary */
.plan-card.border-primary { border-color: #ff6b35; }
.plan-card.border-success { border-color: #10b981; }
.plan-card.border-secondary { border-color: #6b7280; }

.boutique-abonnement {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  border-left: 3px solid #ff6b35;
}
ENDOFFILE
echo "✔ src/app/components/admin/abonnements-admin/abonnements-admin.component.css"

# ─────────────────────────────────────────────────────────────────────────────
# 10. Vendeur Layout — CSS orange
# ─────────────────────────────────────────────────────────────────────────────
cat > src/app/components/vendeur/vendeur-layout/vendeur-layout.component.css << 'ENDOFFILE'
.vendeur-layout { display: flex; min-height: 100vh; background: #f8fafc; }

.vendeur-sidebar {
  width: 280px;
  background: #1e293b;
  position: fixed;
  height: 100vh;
  display: flex; flex-direction: column;
  z-index: 100;
  overflow-y: auto;
}

.sidebar-header { padding: 24px; border-bottom: 1px solid #334155; }
.sidebar-header .logo { font-size: 1.3rem; font-weight: 600; color: white; }

.boutique-selector { padding: 20px; border-bottom: 1px solid #334155; }
.boutique-selector label { font-size: 12px; color: #94a3b8; display: block; margin-bottom: 8px; }
.boutique-selector select {
  width: 100%;
  padding: 10px;
  background: #334155;
  color: white;
  border: 1px solid #475569;
  border-radius: 8px;
  cursor: pointer;
}

.sidebar-nav { flex: 1; padding: 20px 0; }

.nav-item {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 24px;
  color: #94a3b8;
  text-decoration: none;
  transition: all 0.2s;
}
.nav-item i { width: 20px; font-size: 1.1rem; }
.nav-item:hover { background: #334155; color: white; }

/* ← Orange à la place du vert */
.nav-item.active { background: #ff6b35; color: white; }

.sidebar-footer { padding: 20px; border-top: 1px solid #334155; }

.vendeur-info {
  display: flex; align-items: center; gap: 12px;
  padding: 12px;
  background: #334155;
  border-radius: 12px;
  margin-bottom: 16px;
}

/* Avatar orange */
.avatar {
  width: 44px; height: 44px;
  background: linear-gradient(135deg, #ff6b35, #e8541f);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-weight: 600; font-size: 1.1rem; color: white;
}

.vendeur-details { flex: 1; }
.vendeur-name { font-weight: 600; color: white; font-size: 0.9rem; }
.vendeur-email { font-size: 0.7rem; color: #94a3b8; }

.btn-logout {
  width: 100%; padding: 10px;
  background: #dc2626; border: none;
  border-radius: 8px; color: white;
  font-weight: 500; cursor: pointer;
  transition: all 0.2s;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.btn-logout:hover { background: #b91c1c; transform: translateY(-1px); }

.vendeur-main {
  flex: 1;
  margin-left: 280px;
  padding: 24px;
  min-height: 100vh;
}

.vendeur-sidebar::-webkit-scrollbar { width: 4px; }
.vendeur-sidebar::-webkit-scrollbar-thumb { background: #ff6b35; border-radius: 4px; }

@media (max-width: 768px) {
  .vendeur-sidebar { transform: translateX(-100%); transition: transform 0.3s; }
  .vendeur-main { margin-left: 0; }
}
ENDOFFILE
echo "✔ src/app/components/vendeur/vendeur-layout/vendeur-layout.component.css"

# ─────────────────────────────────────────────────────────────────────────────
# 11. Vendeur Dashboard — CSS orange
# ─────────────────────────────────────────────────────────────────────────────
cat > src/app/components/vendeur/vendeur-dashboard/vendeur-dashboard.component.css << 'ENDOFFILE'
.dashboard { max-width: 1400px; margin: 0 auto; }
.dashboard-header { margin-bottom: 32px; }
.dashboard-header h1 { font-size: 28px; font-weight: 700; color: #1a1a2e; margin-bottom: 8px; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex; align-items: center; gap: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #e9ecef;
  transition: all 0.2s;
}
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(255,107,53,0.1); }

.stat-icon {
  width: 56px; height: 56px;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
}
.stat-icon i { font-size: 26px; color: white; }

/* ← Icônes orange pour le dashboard vendeur */
.stat-icon.purple { background: linear-gradient(135deg, #ff6b35, #e8541f); }
.stat-icon.teal   { background: linear-gradient(135deg, #10b981, #059669); }
.stat-icon.orange { background: linear-gradient(135deg, #f59e0b, #d97706); }
.stat-icon.green  { background: linear-gradient(135deg, #3b82f6, #2563eb); }

.stat-info { flex: 1; }
.stat-value { font-size: 28px; font-weight: 700; color: #1a1a2e; display: block; line-height: 1.2; }
.stat-label { font-size: 13px; color: #6c757d; display: block; margin-top: 4px; }
.stat-badge {
  display: inline-block;
  background: #fff3ee;
  color: #e8541f;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 20px;
  margin-top: 6px;
  font-weight: 600;
}

.stats-grid-small {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card-small {
  background: white;
  border-radius: 12px;
  padding: 16px;
  display: flex; align-items: center; gap: 12px;
  border: 1px solid #e9ecef;
}

.stat-icon-small {
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
}
.stat-icon-small i { font-size: 20px; color: white; }

/* ← Small icons orange */
.stat-icon-small.blue   { background: #ff6b35; }
.stat-icon-small.green  { background: #10b981; }
.stat-icon-small.cyan   { background: #3b82f6; }
.stat-icon-small.orange { background: #f59e0b; }

.stat-value-small { font-size: 20px; font-weight: 700; color: #1a1a2e; display: block; }
.stat-label-small { font-size: 12px; color: #6c757d; }

.shop-section, .actions-section { margin-bottom: 32px; }
.section-header { margin-bottom: 20px; }
.section-header h2 { font-size: 18px; font-weight: 600; color: #1a1a2e; }

.actions-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

.action-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex; gap: 16px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e9ecef;
  text-decoration: none;
  color: inherit;
}
.action-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255,107,53,0.12);
  border-color: #ff6b35;
}

/* Icône action orange */
.action-icon i { font-size: 28px; color: #ff6b35; }
.action-info h4 { font-size: 15px; font-weight: 600; color: #1a1a2e; margin-bottom: 4px; }
.action-info p { font-size: 12px; color: #6c757d; margin: 0; }

.alert {
  background: #fff3ee;
  border: 1px solid #ffddcc;
  color: #e8541f;
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
}
.alert a { color: #e8541f; font-weight: 600; }

@media (max-width: 1200px) {
  .stats-grid, .stats-grid-small, .actions-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .stats-grid, .stats-grid-small, .actions-grid { grid-template-columns: 1fr; }
}
ENDOFFILE
echo "✔ src/app/components/vendeur/vendeur-dashboard/vendeur-dashboard.component.css"

# ─────────────────────────────────────────────────────────────────────────────
# 12. Accueil — CSS orange (remplace le thème vert du hero)
# ─────────────────────────────────────────────────────────────────────────────
cat > src/app/components/client/accueil/accueil.component.css << 'ENDOFFILE'
.homepage { min-height: 100vh; background: #f8fafc; }

/* Hero orange */
.hero {
  background: linear-gradient(135deg, #e8541f 0%, #ff6b35 60%, #ff9a5c 100%);
  padding: 25px 0 20px 0;
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
}

.hero-title    { font-size: 1.8rem; font-weight: 700; margin-bottom: 6px; color: white; }
.hero-subtitle { font-size: 0.9rem; opacity: 0.9; margin-bottom: 15px; color: white; }

/* Barre de recherche */
.search-bar {
  max-width: 450px;
  margin: 0 auto 15px auto;
  display: flex;
  background: white;
  border-radius: 40px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}
.search-bar i { padding: 8px 0 8px 16px; color: #ff6b35; }
.search-bar input { flex: 1; padding: 8px 0; border: none; outline: none; }
.search-bar button {
  padding: 0 20px;
  background: #1e293b;
  color: white;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.search-bar button:hover { background: #0f172a; }

/* Filtres catégories */
.filters-wrapper {
  display: flex; flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  padding: 0 20px;
}

.filter-btn {
  display: flex; align-items: center; gap: 5px;
  padding: 5px 12px;
  background: rgba(255,255,255,0.2);
  border: none; border-radius: 25px;
  font-size: 0.75rem; color: white;
  cursor: pointer; transition: all 0.2s;
}
.filter-btn:hover { background: rgba(255,255,255,0.32); transform: translateY(-1px); }
.filter-btn.active { background: white; color: #ff6b35; font-weight: 700; }

.hero-spacer { height: 165px; }

/* Sections catégories */
.category-section { margin-bottom: 35px; }

.category-header {
  display: flex; justify-content: space-between; align-items: baseline;
  margin-bottom: 15px; padding-bottom: 8px;
  border-bottom: 2px solid #ff6b35;
}
.category-header h2 { font-size: 1.25rem; font-weight: 700; color: #1e293b; }
.product-count { font-size: 0.85rem; color: #6c757d; }

/* Grille produits */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.product-card {
  background: white;
  border-radius: 14px;
  overflow: hidden;
  transition: all 0.3s;
  border: 1px solid #e2e8f0;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 28px rgba(255,107,53,0.14);
  border-color: #ff6b35;
}

.product-image { position: relative; height: 170px; overflow: hidden; }
.product-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.35s; }
.product-card:hover .product-image img { transform: scale(1.06); }

.product-badges { position: absolute; top: 8px; left: 8px; display: flex; gap: 5px; }
.badge { padding: 2px 7px; border-radius: 14px; font-size: 9px; font-weight: 700; }
.badge.hot      { background: #ef4444; color: white; }
.badge.new      { background: #10b981; color: white; }
.badge.discount { background: #ff6b35; color: white; }

.product-info { padding: 10px 12px 12px; }
.product-title { font-size: 0.85rem; font-weight: 600; color: #1e293b; margin-bottom: 5px; }
.product-description { font-size: 0.75rem; color: #6c757d; margin-bottom: 8px; line-height: 1.4; }

.product-price { display: flex; align-items: baseline; gap: 6px; margin-bottom: 10px; }
.current-price { font-size: 1.05rem; font-weight: 800; color: #ff6b35; }
.old-price     { font-size: 0.7rem; color: #94a3b8; text-decoration: line-through; }

/* Bouton panier orange */
.add-to-cart {
  width: 100%; padding: 8px;
  background: #fff3ee;
  color: #ff6b35;
  border: 1.5px solid #ffddcc;
  border-radius: 10px;
  font-weight: 700; font-size: 0.8rem;
  cursor: pointer; transition: all 0.2s;
}
.add-to-cart:hover { background: #ff6b35; color: white; border-color: #ff6b35; }

/* États */
.loading { text-align: center; padding: 80px 20px; }
.spinner {
  width: 46px; height: 46px;
  border: 4px solid #ffddcc;
  border-top-color: #ff6b35;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;
  margin: 0 auto 16px;
}
@keyframes spin { to { transform: rotate(360deg); } }

.empty-state { text-align: center; padding: 60px 20px; color: #6c757d; }
.empty-state i { font-size: 4rem; margin-bottom: 16px; color: #ffddcc; }

@media (max-width: 768px) {
  .hero { padding: 18px 0 14px 0; }
  .hero-spacer { height: 150px; }
  .hero-title { font-size: 1.4rem; }
  .products-grid { grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 12px; }
  .product-image { height: 140px; }
}
ENDOFFILE
echo "✔ src/app/components/client/accueil/accueil.component.css"

# ─────────────────────────────────────────────────────────────────────────────
# 13. Vendeur Boutiques — CSS orange
# ─────────────────────────────────────────────────────────────────────────────
cat > src/app/components/vendeur/vendeur-boutiques/vendeur-boutiques.component.css << 'ENDOFFILE'
.vendeur-content { padding: 20px; }

.boutique-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}
.boutique-card:hover { transform: translateY(-4px); box-shadow: 0 10px 28px rgba(255,107,53,0.14); }

/* Header boutique orange */
.boutique-header {
  background: linear-gradient(135deg, #e8541f, #ff6b35);
  padding: 20px;
  display: flex; justify-content: space-between; align-items: center;
}
.boutique-icon { font-size: 3rem; }
.boutique-body { padding: 20px; }
.boutique-body h4 { margin-bottom: 10px; font-weight: 700; }
.boutique-body p { margin-bottom: 8px; font-size: 0.9rem; }
.boutique-body p i { width: 25px; color: #ff6b35; }

.empty-state { text-align: center; padding: 60px; background: white; border-radius: 16px; }

.modal {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  display: flex; align-items: center; justify-content: center; z-index: 1050;
}
.modal-dialog { max-width: 500px; width: 90%; }
.modal-content { border-radius: 18px; overflow: hidden; }

.btn-primary { background: #ff6b35 !important; border-color: #ff6b35 !important; }
.btn-primary:hover { background: #e8541f !important; }
.btn-outline-primary { color: #ff6b35 !important; border-color: #ff6b35 !important; }
.btn-outline-primary:hover { background: #ff6b35 !important; color: white !important; }
ENDOFFILE
echo "✔ src/app/components/vendeur/vendeur-boutiques/vendeur-boutiques.component.css"

# ─────────────────────────────────────────────────────────────────────────────
# 14. Vendeur Produits — CSS orange
# ─────────────────────────────────────────────────────────────────────────────
cat > src/app/components/vendeur/vendeur-produits/vendeur-produits.component.css << 'ENDOFFILE'
.vendeur-content { padding: 20px; }

.product-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}
.product-card:hover { transform: translateY(-4px); box-shadow: 0 10px 24px rgba(255,107,53,0.14); }

.product-image { position: relative; height: 200px; overflow: hidden; }
.product-image img { width: 100%; height: 100%; object-fit: cover; }

.product-badges { position: absolute; top: 10px; left: 10px; display: flex; gap: 5px; }

.product-info { padding: 15px; }

.price { display: flex; gap: 10px; align-items: baseline; }
.current { font-size: 1.3rem; font-weight: 800; color: #ff6b35; }
.old { text-decoration: line-through; color: #999; font-size: 0.9rem; }

.stock { font-size: 0.85rem; margin-top: 5px; }

.empty-state { text-align: center; padding: 60px; background: white; border-radius: 16px; }

/* Upload */
.image-upload-area {
  border: 2px dashed #ffddcc;
  border-radius: 12px; padding: 20px;
  text-align: center; cursor: pointer; transition: all 0.3s; background: #fff9f7;
}
.image-upload-area:hover { border-color: #ff6b35; background: #fff3ee; }

.upload-placeholder { color: #64748b; }
.upload-placeholder i { font-size: 48px; margin-bottom: 10px; color: #ff6b35; }

.image-preview { position: relative; display: inline-block; }
.image-preview img { max-width: 100%; max-height: 200px; border-radius: 8px; object-fit: cover; }

.btn-remove {
  position: absolute; top: -10px; right: -10px;
  background: #ef4444; color: white; border: none;
  border-radius: 50%; width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s;
}
.btn-remove:hover { background: #dc2626; transform: scale(1.1); }

.boutique-selector {
  background: white; padding: 12px 16px;
  border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
.boutique-selector select { min-width: 200px; }

.btn-primary { background: #ff6b35 !important; border-color: #ff6b35 !important; }
.btn-primary:hover { background: #e8541f !important; }
.btn-outline-primary { color: #ff6b35 !important; border-color: #ff6b35 !important; }
.btn-outline-primary:hover { background: #ff6b35 !important; color: white !important; }
ENDOFFILE
echo "✔ src/app/components/vendeur/vendeur-produits/vendeur-produits.component.css"

# ─────────────────────────────────────────────────────────────────────────────
# 15. Vendeur Clients — CSS orange
# ─────────────────────────────────────────────────────────────────────────────
cat > src/app/components/vendeur/vendeur-clients/vendeur-clients.component.css << 'ENDOFFILE'
.vendeur-content { padding: 20px; }

.client-card {
  background: white;
  border-radius: 16px; padding: 20px;
  display: flex; gap: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  border-left: 4px solid transparent;
}
.client-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 22px rgba(255,107,53,0.12);
  border-left-color: #ff6b35;
}

/* Avatar orange */
.client-avatar {
  width: 60px; height: 60px;
  background: linear-gradient(135deg, #ff6b35, #e8541f);
  color: white;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; font-weight: 700;
}

.client-info { flex: 1; }
.client-info p { margin-bottom: 5px; font-size: 0.9rem; color: #666; }
.client-info p i { width: 20px; color: #ff6b35; }
.client-stats { margin-top: 10px; }

.empty-state { text-align: center; padding: 60px; background: white; border-radius: 16px; }

.btn-primary { background: #ff6b35 !important; border-color: #ff6b35 !important; }
.btn-primary:hover { background: #e8541f !important; }
ENDOFFILE
echo "✔ src/app/components/vendeur/vendeur-clients/vendeur-clients.component.css"

# ─────────────────────────────────────────────────────────────────────────────
# 16. Vendeur Commandes — CSS orange
# ─────────────────────────────────────────────────────────────────────────────
cat > src/app/components/vendeur/vendeur-commandes/vendeur-commandes.component.css << 'ENDOFFILE'
.vendeur-content { padding: 20px; }
.stats-mini { display: flex; gap: 10px; }

.commande-card {
  background: white;
  border-radius: 14px;
  margin-bottom: 20px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-left: 4px solid #ff6b35;
  transition: box-shadow 0.2s;
}
.commande-card:hover { box-shadow: 0 8px 24px rgba(255,107,53,0.12); }

.commande-header { background: #f8fafc; padding: 15px 20px; border-bottom: 1px solid #e2e8f0; }
.commande-body   { padding: 20px; }
.commande-footer { padding: 15px 20px; background: #f8fafc; border-top: 1px solid #e2e8f0; }

.produits-list { margin-top: 15px; }
.table { margin-bottom: 0; }
.empty-state { text-align: center; padding: 60px; background: white; border-radius: 16px; }

.btn-group { display: flex; gap: 10px; flex-wrap: wrap; }

/* Boutons statut */
.btn-success { background: #10b981 !important; border-color: #10b981 !important; }
.btn-primary { background: #ff6b35 !important; border-color: #ff6b35 !important; }
.btn-info    { background: #3b82f6 !important; border-color: #3b82f6 !important; }
ENDOFFILE
echo "✔ src/app/components/vendeur/vendeur-commandes/vendeur-commandes.component.css"

# ─────────────────────────────────────────────────────────────────────────────
# 17. Footer — CSS orange
# ─────────────────────────────────────────────────────────────────────────────
cat > src/app/components/footer/footer.component.css << 'ENDOFFILE'
.footer { background: #1e293b; color: #94a3b8; padding: 40px 0 20px 0; margin-top: 60px; }

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px; margin-bottom: 40px;
}

.footer-section h3, .footer-section h4 { color: white; margin-bottom: 15px; }
.footer-section ul { list-style: none; padding: 0; }
.footer-section ul li { margin-bottom: 10px; }
.footer-section ul li a { color: #94a3b8; text-decoration: none; transition: color 0.2s; }

/* Liens footer orange au hover */
.footer-section ul li a:hover { color: #ff6b35; }
.footer-section ul li i { margin-right: 10px; color: #ff6b35; }

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #334155;
}

@media (max-width: 768px) {
  .footer-content { grid-template-columns: 1fr; text-align: center; }
}
ENDOFFILE
echo "✔ src/app/components/footer/footer.component.css"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅  Thème orange appliqué sur 17 fichiers CSS uniquement."
echo "    Aucune logique TypeScript ou HTML modifiée."
echo ""
echo "📁 Fichiers mis à jour :"
echo "   src/styles.css"
echo "   src/app/app.component.css"
echo "   src/app/components/login/login.component.css"
echo "   src/app/components/register/register.component.css"
echo "   src/app/components/admin/admin-layout/admin-layout.component.css"
echo "   src/app/components/admin/dashboard/dashboard.component.css"
echo "   src/app/components/admin/boutiques-admin/boutiques-admin.component.css"
echo "   src/app/components/admin/vendeurs-admin/vendeurs-admin.component.css"
echo "   src/app/components/admin/abonnements-admin/abonnements-admin.component.css"
echo "   src/app/components/vendeur/vendeur-layout/vendeur-layout.component.css"
echo "   src/app/components/vendeur/vendeur-dashboard/vendeur-dashboard.component.css"
echo "   src/app/components/vendeur/vendeur-boutiques/vendeur-boutiques.component.css"
echo "   src/app/components/vendeur/vendeur-produits/vendeur-produits.component.css"
echo "   src/app/components/vendeur/vendeur-clients/vendeur-clients.component.css"
echo "   src/app/components/vendeur/vendeur-commandes/vendeur-commandes.component.css"
echo "   src/app/components/client/accueil/accueil.component.css"
echo "   src/app/components/footer/footer.component.css"
echo ""
echo "💡 Relancer : lsof -ti:4200 | xargs kill -9 && ng serve"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
