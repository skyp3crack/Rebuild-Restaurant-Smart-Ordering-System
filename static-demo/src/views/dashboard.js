// resources/views/dashboard.blade.php
import { appLayout, pageTitle } from '../ui.js';

const tile = (href, title, text) => `
    <a href="${href}" class="block rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:border-indigo-400 transition">
        <div class="font-semibold">${title}</div>
        <div class="mt-1 text-sm text-gray-500 dark:text-gray-400">${text}</div>
    </a>`;

export const dashboardView = (ctx) => {
    ctx.title = 'Dashboard';
    return appLayout({
        user: ctx.user,
        path: ctx.path,
        header: pageTitle('Dashboard'),
        body: `
            <div class="py-12">
                <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div class="p-6 text-gray-900 dark:text-gray-100">
                            <p>You're logged in!</p>
                            <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                ${tile('/menu', 'Manage menu items', 'Create, edit and delete dishes')}
                                ${tile('/categories', 'Manage categories', 'Starters, mains, desserts...')}
                                ${tile('/kitchen', 'Kitchen dashboard', 'Pending orders, oldest first')}
                                ${tile('/table/1', 'Customer menu', 'What a guest sees at table 1')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`,
    });
};
