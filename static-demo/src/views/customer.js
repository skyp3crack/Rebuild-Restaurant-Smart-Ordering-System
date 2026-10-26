// resources/views/customer/menu.blade.php (public QR-code menu with a session cart)
import * as db from '../db.js';
import { e, money, imageSrc, demoBanner } from '../ui.js';

export const customerMenuView = (ctx) => {
    const table = ctx.params.table;
    ctx.title = `Menu - Table ${table}`;
    const cart = db.cart.get(table);
    const lines = Object.entries(cart);
    const total = lines.reduce((sum, [, d]) => sum + d.price * d.quantity, 0);

    const sections = db.menuItems
        .grouped()
        .filter((c) => c.menuItems.length > 0)
        .map(
            (category) => `
        <h2 class="text-xl font-bold mt-6 mb-4 border-b-2 border-gray-200 pb-2">${e(category.name)}</h2>
        <div class="space-y-4">
            ${category.menuItems
                .map(
                    (item) => `
            <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div>
                    ${item.image_path
                        ? `<img src="${imageSrc(item)}" alt="${e(item.name)}" class="w-20 h-20 object-cover rounded-md mr-4 shadow-sm">`
                        : '<div class="w-20 h-20 bg-gray-200 rounded-md mr-4 flex items-center justify-center text-gray-400">No Image</div>'}
                    <h3 class="font-semibold text-lg">${e(item.name)}</h3>
                    <p class="text-sm text-gray-500">${e(item.description ?? '')}</p>
                    <p class="font-bold text-blue-600 mt-1">$${money(item.price)}</p>
                </div>
                <form data-action="customer.add" data-param="${e(table)}">
                    <input type="hidden" name="menu_item_id" value="${item.id}">
                    <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow">Add</button>
                </form>
            </div>`,
                )
                .join('')}
        </div>`,
        )
        .join('');

    const cartPanel = lines.length
        ? `
        <div class="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg p-4">
            <div class="max-w-md mx-auto">
                <h3 class="font-bold text-lg mb-2">Your Cart</h3>
                <div class="max-h-32 overflow-y-auto mb-2 text-sm">
                    ${lines
                        .map(
                            ([id, d]) => `
                    <div class="flex justify-between items-center mb-2 border-b border-gray-100 pb-2">
                        <div class="flex items-center space-x-2">
                            <form data-action="customer.remove" data-param="${e(table)}">
                                <input type="hidden" name="menu_item_id" value="${id}">
                                <button type="submit" aria-label="Remove one ${e(d.name)}" class="bg-red-500 hover:bg-red-600 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-sm">-</button>
                            </form>
                            <span class="font-bold w-4 text-center">${d.quantity}</span>
                            <form data-action="customer.add" data-param="${e(table)}">
                                <input type="hidden" name="menu_item_id" value="${id}">
                                <button type="submit" aria-label="Add one ${e(d.name)}" class="bg-blue-500 hover:bg-blue-600 text-white font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-sm">+</button>
                            </form>
                            <span class="ml-2 text-gray-800">${e(d.name)}</span>
                        </div>
                        <span class="font-bold text-gray-700">$${money(d.price * d.quantity)}</span>
                    </div>`,
                        )
                        .join('')}
                </div>
                <div class="border-t pt-3 mt-2">
                    <form data-action="customer.checkout" data-param="${e(table)}">
                        <label for="order-notes" class="block text-sm font-semibold text-gray-700 mb-1">📝 Special Instructions</label>
                        <textarea id="order-notes" name="notes" rows="2" maxlength="500" data-counter="char-count"
                            placeholder="e.g. No onions, extra spicy, allergies…"
                            class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 resize-none">${e(ctx.old('notes'))}</textarea>
                        <p class="text-xs text-gray-400 text-right mt-1"><span id="char-count">0</span> / 500</p>
                        <div class="flex justify-between items-center mt-3">
                            <span class="font-bold text-xl">Total: $${money(total)}</span>
                            <button type="submit" class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow">Checkout</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="pb-40"></div>`
        : '';

    return `
        ${demoBanner()}
        <div class="bg-gray-100 text-gray-900 min-h-screen p-4">
            <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                ${ctx.flash.success
                    ? `<div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative m-4" role="alert">
                           <strong class="font-bold">Yay!</strong>
                           <span class="block sm:inline">${e(ctx.flash.success)}</span>
                       </div>`
                    : ''}
                ${ctx.flash.error
                    ? `<div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert">${e(ctx.flash.error)}</div>`
                    : ''}
                <div class="p-6 bg-blue-600 text-white text-center">
                    <h1 class="text-2xl font-bold">Our Menu</h1>
                    <p class="text-sm">Ordering for Table ${e(table)}</p>
                </div>
                <div class="p-4">${sections || '<p class="text-center text-gray-500 py-8">No items are available right now.</p>'}</div>
            </div>
            ${cartPanel}
        </div>`;
};
