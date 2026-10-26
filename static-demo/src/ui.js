// Blade-style building blocks (x-text-input, x-primary-button, layouts...) as plain functions.
// Markup and Tailwind classes are carried over from resources/views/**/*.blade.php.

export const PORTFOLIO_URL = 'https://my-portfolio-khalif-amin.vercel.app/projects';

export const e = (value) =>
    String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const money = (n) => Number(n).toFixed(2);

export const imageSrc = (item) => item.image_path || '';

// ─── Form components ────────────────────────────────────────────────────────────

export const inputLabel = (forId, text, cls = '') =>
    `<label for="${forId}" class="block font-medium text-sm text-gray-700 dark:text-gray-300 ${cls}">${e(text)}</label>`;

export const textInput = ({ id, name = id, type = 'text', value = '', cls = '', attrs = '' }) =>
    `<input id="${id}" name="${name}" type="${type}" value="${e(value)}" ${attrs}
        class="border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm ${cls}">`;

export const inputError = (messages, cls = '') =>
    messages?.length
        ? `<ul class="text-sm text-red-600 dark:text-red-400 space-y-1 ${cls}">${messages.map((m) => `<li>${e(m)}</li>`).join('')}</ul>`
        : '';

export const statusMessage = (status, cls = '') =>
    status ? `<div class="font-medium text-sm text-green-600 dark:text-green-400 ${cls}">${e(status)}</div>` : '';

export const primaryButton = (label, cls = '', attrs = '') =>
    `<button type="submit" ${attrs} class="inline-flex items-center px-4 py-2 bg-gray-800 dark:bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-white dark:text-gray-800 uppercase tracking-widest hover:bg-gray-700 dark:hover:bg-white focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 dark:active:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 ${cls}">${label}</button>`;

export const secondaryButton = (label, cls = '', attrs = '') =>
    `<button type="button" ${attrs} class="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-md font-semibold text-xs text-gray-700 dark:text-gray-300 uppercase tracking-widest shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-25 transition ease-in-out duration-150 ${cls}">${label}</button>`;

export const dangerButton = (label, cls = '', attrs = '', type = 'submit') =>
    `<button type="${type}" ${attrs} class="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150 ${cls}">${label}</button>`;

export const savedNotice = (show) =>
    show ? `<p data-fade-out class="text-sm text-gray-600 dark:text-gray-400">Saved.</p>` : '';

export const modal = (name, body, show = false) => `
    <div data-modal="${name}" class="${show ? '' : 'hidden'} fixed inset-0 overflow-y-auto px-4 py-6 sm:px-0 z-50">
        <div data-close-modal class="fixed inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        <div class="mb-6 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-xl transform sm:w-full sm:max-w-2xl sm:mx-auto relative">
            ${body}
        </div>
    </div>`;

// ─── Layout pieces ──────────────────────────────────────────────────────────────

export const applicationLogo = (cls = '') => `
    <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" class="${cls}" style="fill:none;stroke:currentColor;stroke-width:3.5;stroke-linecap:round;stroke-linejoin:round">
        <circle cx="32" cy="32" r="13" />
        <circle cx="32" cy="32" r="7" />
        <path d="M9 9v13a4 4 0 0 0 8 0V9M13 9v46" />
        <path d="M55 9c-5 3-7 9-7 16v8h7V9zM55 33v22" />
    </svg>`;

/** Slim bar shown on every page so visitors know this is a browser-only demo. */
export const demoBanner = () => `
    <div class="bg-indigo-600 text-white text-xs sm:text-sm">
        <div class="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
            <span>Static demo: data is stored in your browser only, with no server behind it.</span>
            <span class="flex items-center gap-4">
                <button type="button" data-reset-demo class="underline underline-offset-2 hover:text-indigo-100">Reset demo data</button>
                <a href="${PORTFOLIO_URL}" class="underline underline-offset-2 hover:text-indigo-100">Back to portfolio</a>
            </span>
        </div>
    </div>`;

const navLink = (href, label, active) => {
    const base = 'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 focus:outline-none transition duration-150 ease-in-out';
    const cls = active
        ? 'border-indigo-400 dark:border-indigo-600 text-gray-900 dark:text-gray-100 focus:border-indigo-700'
        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700';
    return `<a href="${href}" class="${base} ${cls}">${label}</a>`;
};

const responsiveNavLink = (href, label, active) => {
    const base = 'block w-full ps-3 pe-4 py-2 border-l-4 text-start text-base font-medium focus:outline-none transition duration-150 ease-in-out';
    const cls = active
        ? 'border-indigo-400 dark:border-indigo-600 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/50'
        : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600';
    return `<a href="${href}" class="${base} ${cls}">${label}</a>`;
};

const NAV = [
    ['/dashboard', 'Dashboard'],
    ['/menu', 'Menu'],
    ['/categories', 'Categories'],
    ['/kitchen', 'Kitchen'],
];

const isActive = (path, href) => (href === '/dashboard' ? path === href : path === href || path.startsWith(`${href}/`));

const navigation = (user, path) => `
    <nav class="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex">
                    <div class="shrink-0 flex items-center">
                        <a href="/dashboard">${applicationLogo('block h-9 w-auto fill-current text-gray-800 dark:text-gray-200')}</a>
                    </div>
                    <div class="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                        ${NAV.map(([href, label]) => navLink(href, label, isActive(path, href))).join('')}
                    </div>
                </div>

                <div class="hidden sm:flex sm:items-center sm:ms-6">
                    <div class="relative" data-dropdown>
                        <button type="button" data-dropdown-toggle class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150">
                            <div>${e(user.name)}</div>
                            <div class="ms-1">
                                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                                </svg>
                            </div>
                        </button>
                        <div data-dropdown-panel class="hidden absolute z-50 mt-2 w-48 rounded-md shadow-lg origin-top-right end-0">
                            <div class="rounded-md ring-1 ring-black ring-opacity-5 py-1 bg-white dark:bg-gray-700">
                                <a href="/profile" class="block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition duration-150 ease-in-out">Profile</a>
                                <form data-action="auth.logout">
                                    <button type="submit" class="block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none transition duration-150 ease-in-out">Log Out</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="-me-2 flex items-center sm:hidden">
                    <button type="button" data-nav-toggle class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none transition duration-150 ease-in-out" aria-label="Toggle navigation">
                        <svg class="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>

        <div data-nav-panel class="hidden sm:hidden">
            <div class="pt-2 pb-3 space-y-1">
                ${NAV.map(([href, label]) => responsiveNavLink(href, label, isActive(path, href))).join('')}
            </div>
            <div class="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                <div class="px-4">
                    <div class="font-medium text-base text-gray-800 dark:text-gray-200">${e(user.name)}</div>
                    <div class="font-medium text-sm text-gray-500">${e(user.email)}</div>
                </div>
                <div class="mt-3 space-y-1">
                    ${responsiveNavLink('/profile', 'Profile', false)}
                    <form data-action="auth.logout">
                        <button type="submit" class="block w-full ps-3 pe-4 py-2 border-l-4 border-transparent text-start text-base font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none transition duration-150 ease-in-out">Log Out</button>
                    </form>
                </div>
            </div>
        </div>
    </nav>`;

/** resources/views/layouts/app.blade.php */
export const appLayout = ({ user, path, header = '', body }) => `
    ${demoBanner()}
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
        ${navigation(user, path)}
        ${header ? `<header class="bg-white dark:bg-gray-800 shadow"><div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">${header}</div></header>` : ''}
        <main>${body}</main>
    </div>`;

/** resources/views/layouts/guest.blade.php */
export const guestLayout = (body) => `
    ${demoBanner()}
    <div class="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900 text-gray-900">
        <div>
            <a href="/">${applicationLogo('w-20 h-20 fill-current text-gray-500')}</a>
        </div>
        <div class="w-full sm:max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
            ${body}
        </div>
    </div>`;

export const pageTitle = (text) =>
    `<h2 class="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">${e(text)}</h2>`;

export const successFlash = (message) =>
    message
        ? `<div class="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">${e(message)}</div>`
        : '';
