// resources/views/kitchen/index.blade.php
import * as db from '../db.js';
import { e, appLayout, pageTitle, successFlash } from '../ui.js';

export const kitchenView = (ctx) => {
    ctx.title = 'Kitchen Dashboard';
    const orders = db.orders.pending();

    const cards = orders.length
        ? orders
              .map(
                  (order) => `
        <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg border-l-4 border-yellow-500">
            <div class="p-6 text-gray-900 dark:text-gray-100">
                <div class="flex justify-between items-center border-b dark:border-gray-700 pb-3 mb-3">
                    <h3 class="font-bold text-lg">Table ${e(order.table_number)}</h3>
                    <span class="text-sm text-gray-500">Order #${order.id}</span>
                </div>
                <ul class="mb-4 space-y-2">
                    ${order.orderItems
                        .map(
                            (line) => `
                    <li class="flex justify-between">
                        <span class="font-semibold">${line.quantity}x</span>
                        <span class="flex-1 ml-2">${e(line.menuItem?.name ?? 'Deleted Item')}</span>
                    </li>`,
                        )
                        .join('')}
                </ul>
                ${order.notes
                    ? `<div class="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                           <p class="text-xs font-bold text-yellow-800 dark:text-yellow-300 uppercase tracking-wide mb-1">📝 Special Instructions</p>
                           <p class="text-sm text-yellow-900 dark:text-yellow-100">${e(order.notes)}</p>
                       </div>`
                    : ''}
                <form data-action="kitchen.complete" data-param="${order.id}">
                    <button type="submit" class="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Mark as Completed</button>
                </form>
            </div>
        </div>`,
              )
              .join('')
        : `<div class="col-span-full p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-center text-gray-500 dark:text-gray-400">No pending orders! The kitchen is clear.</div>`;

    return appLayout({
        user: ctx.user,
        path: ctx.path,
        header: `
            <div class="flex justify-between items-center">
                ${pageTitle('Kitchen Dashboard (Pending Orders)')}
                <button type="button" data-refresh class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Refresh Page</button>
            </div>`,
        body: `
            <div class="py-12">
                <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    ${successFlash(ctx.flash.success)}
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${cards}</div>
                </div>
            </div>`,
    });
};
