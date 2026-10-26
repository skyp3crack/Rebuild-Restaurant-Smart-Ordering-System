import './style.css';
import * as db from './db.js';
import { actions } from './actions.js';
import { render, route, navigate, rerender, setMount, setNotFound } from './router.js';

import { welcomeView, notFoundView } from './views/welcome.js';
import { loginView, registerView, forgotPasswordView, resetPasswordView, confirmPasswordView, verifyEmailView } from './views/auth.js';
import { dashboardView } from './views/dashboard.js';
import { profileView } from './views/profile.js';
import { menuIndexView, menuCreateView, menuEditView } from './views/menu.js';
import { categoriesIndexView, categoriesCreateView, categoriesEditView } from './views/categories.js';
import { kitchenView } from './views/kitchen.js';
import { customerMenuView } from './views/customer.js';

// ─── Routes (routes/web.php + routes/auth.php) ──────────────────────────────────
route('/', welcomeView);
route('/login', loginView, 'guest');
route('/register', registerView, 'guest');
route('/forgot-password', forgotPasswordView, 'guest');
route('/reset-password/:token', resetPasswordView, 'guest');
route('/verify-email', verifyEmailView, true);
route('/confirm-password', confirmPasswordView, true);
route('/dashboard', dashboardView, true);
route('/profile', profileView, true);
route('/menu', menuIndexView, true);
route('/menu/create', menuCreateView, true);
route('/menu/:id/edit', menuEditView, true);
route('/categories', categoriesIndexView, true);
route('/categories/create', categoriesCreateView, true);
route('/categories/:id/edit', categoriesEditView, true);
route('/kitchen', kitchenView, true);
route('/table/:table', customerMenuView);
setNotFound(notFoundView);

// ─── Behaviour that Alpine handled in the Blade version ─────────────────────────
const app = document.getElementById('app');
setMount(app);

const closeDropdowns = () => app.querySelectorAll('[data-dropdown-panel]').forEach((p) => p.classList.add('hidden'));
const setModal = (name, open) => app.querySelector(`[data-modal="${name}"]`)?.classList.toggle('hidden', !open);

document.addEventListener('click', async (ev) => {
    const target = ev.target;

    const link = target.closest('a[href]');
    if (link && !ev.defaultPrevented && ev.button === 0 && !ev.metaKey && !ev.ctrlKey && !ev.shiftKey && !link.target) {
        const url = new URL(link.href, location.href);
        if (url.origin === location.origin) {
            ev.preventDefault();
            return navigate(url.pathname + url.search);
        }
    }

    const toggle = target.closest('[data-dropdown-toggle]');
    if (toggle) {
        const panel = toggle.parentElement.querySelector('[data-dropdown-panel]');
        const wasHidden = panel.classList.contains('hidden');
        closeDropdowns();
        panel.classList.toggle('hidden', !wasHidden);
        return;
    }
    if (!target.closest('[data-dropdown-panel]')) closeDropdowns();

    if (target.closest('[data-nav-toggle]')) return app.querySelector('[data-nav-panel]').classList.toggle('hidden');

    const opener = target.closest('[data-open-modal]');
    if (opener) {
        setModal(opener.dataset.openModal, true);
        return app.querySelector(`[data-modal="${opener.dataset.openModal}"] input`)?.focus();
    }
    if (target.closest('[data-close-modal]')) return app.querySelectorAll('[data-modal]').forEach((m) => m.classList.add('hidden'));

    if (target.closest('[data-refresh]')) return rerender();

    if (target.closest('[data-fill-demo]')) {
        app.querySelector('#email').value = 'test@example.com';
        app.querySelector('#password').value = 'password';
        return;
    }

    if (target.closest('[data-reset-demo]')) {
        if (!confirm('Reset all demo data (menu, orders and accounts) back to the defaults?')) return;
        await db.resetDemo();
        return navigate('/');
    }
});

document.addEventListener('submit', async (ev) => {
    const form = ev.target.closest('form[data-action]');
    if (!form) return;
    ev.preventDefault();
    if (form.dataset.confirm && !confirm(form.dataset.confirm)) return;

    const handler = actions[form.dataset.action];
    if (!handler) return;
    const formData = new FormData(form);
    const data = Object.fromEntries([...formData].filter(([, v]) => typeof v === 'string'));
    await handler({ data, formData, param: form.dataset.param, user: db.currentUser() });
});

document.addEventListener('input', (ev) => {
    const counter = ev.target.dataset?.counter;
    if (counter) document.getElementById(counter).textContent = ev.target.value.length;
});

// After every render: initialise the notes counter and fade out "Saved." notices.
document.addEventListener('rendered', () => {
    app.querySelectorAll('[data-counter]').forEach((el) => {
        document.getElementById(el.dataset.counter).textContent = el.value.length;
    });
    app.querySelectorAll('[data-fade-out]').forEach((el) => setTimeout(() => el.remove(), 2000));
});

window.addEventListener('popstate', render);

// The kitchen board, menu list and customer menu follow changes made in other tabs.
window.addEventListener('storage', (ev) => {
    if (ev.key !== db.DB_STORAGE_KEY) return;
    db.reload();
    if (['/kitchen', '/menu'].includes(location.pathname) || location.pathname.startsWith('/table/')) rerender();
});

db.init().then(render);
