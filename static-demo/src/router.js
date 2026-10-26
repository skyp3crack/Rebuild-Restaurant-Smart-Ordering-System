// History-API router with Laravel-ish behaviour: auth guards, "intended" redirects and one-shot flash data.
import * as db from './db.js';

const routes = [];
let flash = {};
let intended = null;
let mount = null;
let notFoundView = () => 'Not found';

export const route = (pattern, view, auth = null) => {
    const keys = [];
    const regex = new RegExp(
        '^' + pattern.replace(/:([a-z_]+)/g, (_, key) => (keys.push(key), '([^/]+)')) + '$',
    );
    routes.push({ regex, keys, view, auth });
};

export const setMount = (el) => (mount = el);
export const setNotFound = (view) => (notFoundView = view);
export const setFlash = (data) => (flash = { ...flash, ...data });
export const takeIntended = () => {
    const url = intended;
    intended = null;
    return url;
};

const normalise = (pathname) => pathname.replace(/\/+$/, '') || '/';

const makeContext = (path, query, params, user, data) => ({
    path,
    query,
    params,
    user,
    flash: data,
    old: (name, fallback = '') => data.old?.[name] ?? fallback,
    err: (name, bag = 'default') => data.errors?.[bag]?.[name] ?? [],
    hasErrors: (bag = 'default') => Object.keys(data.errors?.[bag] ?? {}).length > 0,
});

export async function render() {
    const url = new URL(location.href);
    const path = normalise(url.pathname);

    let match = null;
    let params = {};
    for (const r of routes) {
        const m = path.match(r.regex);
        if (m) {
            match = r;
            params = Object.fromEntries(r.keys.map((k, i) => [k, decodeURIComponent(m[i + 1])]));
            break;
        }
    }

    const user = db.currentUser();
    if (match?.auth === true && !user) {
        intended = path + url.search;
        history.replaceState({}, '', '/login');
        return render();
    }
    if (match?.auth === 'guest' && user) {
        history.replaceState({}, '', '/dashboard');
        return render();
    }

    const data = flash;
    flash = {};
    const ctx = makeContext(path, Object.fromEntries(url.searchParams), params, user, data);
    // A view returns null when the record it needs does not exist (Laravel's findOrFail -> 404).
    mount.innerHTML = (match && match.view(ctx)) ?? notFoundView(ctx);
    document.title = `${ctx.title ?? 'Smart Restaurant'} - Smart Restaurant Ordering System`;
    document.dispatchEvent(new CustomEvent('rendered'));
}

export async function navigate(path, { replace = false, flash: data } = {}) {
    if (data) setFlash(data);
    history[replace ? 'replaceState' : 'pushState']({}, '', path);
    await render();
    window.scrollTo(0, 0);
}

/** Re-render the current page (e.g. after a failed validation or a cart change), keeping the scroll position. */
export async function rerender(data, { keepScroll = true } = {}) {
    if (data) setFlash(data);
    const y = window.scrollY;
    await render();
    if (keepScroll) window.scrollTo(0, y);
}
