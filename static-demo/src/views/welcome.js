// resources/views/welcome.blade.php, reworked as a landing page for the demo.
import { e, demoBanner, applicationLogo } from '../ui.js';

const card = (href, title, text) => `
    <a href="${href}" class="block rounded-lg bg-white dark:bg-gray-800 p-5 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-indigo-400 transition">
        <h3 class="font-semibold text-gray-900 dark:text-gray-100">${title}</h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">${text}</p>
    </a>`;

export const welcomeView = (ctx) => {
    ctx.title = 'Welcome';
    const authed = Boolean(ctx.user);
    const pill = 'inline-block px-5 py-1.5 rounded-sm text-sm leading-normal border';
    return `
        ${demoBanner()}
        <div class="min-h-screen bg-[#FDFDFC] dark:bg-[#0a0a0a] text-[#1b1b18] dark:text-[#EDEDEC] flex flex-col items-center p-6 lg:p-8">
            <header class="w-full max-w-4xl text-sm mb-6">
                <nav class="flex items-center justify-end gap-4">
                    ${authed
                        ? `<a href="/dashboard" class="${pill} border-[#19140035] hover:border-[#1915014a] dark:border-[#3E3E3A]">Dashboard</a>`
                        : `<a href="/login" class="${pill} border-transparent hover:border-[#19140035] dark:hover:border-[#3E3E3A]">Log in</a>
                           <a href="/register" class="${pill} border-[#19140035] hover:border-[#1915014a] dark:border-[#3E3E3A]">Register</a>`}
                </nav>
            </header>

            <main class="w-full max-w-4xl">
                <div class="flex items-center gap-4">
                    ${applicationLogo('w-14 h-14 text-gray-700 dark:text-gray-300')}
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-semibold">Smart Restaurant Ordering System</h1>
                        <p class="text-sm text-[#706f6c] dark:text-[#A1A09A]">Contactless QR ordering, a live kitchen board and menu management.</p>
                    </div>
                </div>

                <p class="mt-6 text-sm text-[#706f6c] dark:text-[#A1A09A] max-w-2xl">
                    This is the static demo of the Laravel project. It has the same screens and flows as the real app, but everything runs in your browser:
                    orders, menu edits and accounts are saved in local storage on this device, so nothing is shared and nothing leaves your machine.
                </p>

                <div class="mt-8 grid gap-4 sm:grid-cols-3">
                    <div class="rounded-lg bg-white dark:bg-gray-800 p-5 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
                        <h3 class="font-semibold">1. Order as a customer</h3>
                        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Open the menu a guest sees after scanning the QR code on their table.</p>
                        <form data-action="welcome.table" class="mt-3 flex gap-2">
                            <input name="table" value="5" aria-label="Table number" inputmode="numeric" class="w-20 border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm text-sm">
                            <button type="submit" class="px-3 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium">Open table menu</button>
                        </form>
                    </div>
                    ${card('/kitchen', '2. Run the kitchen', 'See pending orders oldest first and mark them completed (log in required).')}
                    ${card('/menu', '3. Manage the menu', 'Add, edit and delete items and categories (log in required).')}
                </div>

                <p class="mt-8 text-xs text-[#706f6c] dark:text-[#A1A09A]">
                    Demo login: <code>${e('test@example.com')}</code> / <code>password</code>.
                    Tip: place an order in one tab and keep <a class="underline" href="/kitchen">/kitchen</a> open in another, as it updates by itself.
                </p>
            </main>
        </div>`;
};

export const notFoundView = (ctx) => {
    ctx.title = 'Not found';
    return `
        ${demoBanner()}
        <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400">
            <div class="flex items-center text-lg tracking-wider"><span class="px-4 border-r border-gray-400">404</span><span class="px-4 uppercase">Not Found</span></div>
            <a href="/" class="mt-6 underline text-sm">Back to the home page</a>
        </div>`;
};
