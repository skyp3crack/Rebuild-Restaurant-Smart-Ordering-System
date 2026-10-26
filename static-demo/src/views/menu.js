// resources/views/menu/*.blade.php (admin menu CRUD)
import * as db from '../db.js';
import { e, money, imageSrc, appLayout, pageTitle, inputError, successFlash } from '../ui.js';

const field = 'w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm';
const label = (text) => `<label class="block text-gray-700 dark:text-gray-300 font-bold mb-2">${text}</label>`;

export const menuIndexView = (ctx) => {
    ctx.title = 'Manage Menu Items';
    const items = db.menuItems.all();
    const rows = items.length
        ? items
              .map(
                  (item) => `
            <tr>
                <td class="border-b dark:border-gray-700 p-3">${e(item.name)}</td>
                <td class="border-b dark:border-gray-700 p-3">$${money(item.price)}</td>
                <td class="border-b dark:border-gray-700 p-3">${item.is_available ? 'Available' : 'Sold Out'}</td>
                <td class="border-b dark:border-gray-700 p-3 flex space-x-2">
                    <a href="/menu/${item.id}/edit" class="text-blue-500 hover:text-blue-700 font-bold">Edit</a>
                    <span class="text-gray-500">|</span>
                    <form data-action="menu.destroy" data-param="${item.id}" data-confirm="Are you sure you want to delete this item?">
                        <button type="submit" class="text-red-500 hover:text-red-700 font-bold">Delete</button>
                    </form>
                </td>
            </tr>`,
              )
              .join('')
        : '<tr><td colspan="4" class="p-3 text-center text-gray-500">No menu items found.</td></tr>';

    return appLayout({
        user: ctx.user,
        path: ctx.path,
        header: `
            <div class="flex flex-wrap gap-3 justify-between items-center">
                ${pageTitle('Manage Menu Items')}
                <a href="/categories" class="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">Manage Categories</a>
                <a href="/menu/create" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">+ Add New Item</a>
            </div>`,
        body: `
            <div class="py-12">
                <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    ${successFlash(ctx.flash.success)}
                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div class="p-6 text-gray-900 dark:text-gray-100 overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th class="border-b dark:border-gray-600 p-3">Name</th>
                                        <th class="border-b dark:border-gray-600 p-3">Price</th>
                                        <th class="border-b dark:border-gray-600 p-3">Status</th>
                                        <th class="border-b dark:border-gray-600 p-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>${rows}</tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>`,
    });
};

const errorSummary = (ctx) => {
    const messages = Object.values(ctx.flash.errors?.default ?? {}).flat();
    if (!messages.length) return '';
    return `
        <div class="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong class="font-bold">Oops! There were some problems:</strong>
            <ul class="mt-2 list-disc list-inside text-sm">${messages.map((m) => `<li>${e(m)}</li>`).join('')}</ul>
        </div>`;
};

const categoryOptions = (selected) =>
    db.categories
        .all()
        .map((c) => `<option value="${c.id}" ${String(selected) === String(c.id) ? 'selected' : ''}>${e(c.name)}</option>`)
        .join('');

const formShell = (ctx, title, inner) =>
    appLayout({
        user: ctx.user,
        path: ctx.path,
        header: pageTitle(title),
        body: `
            <div class="py-12">
                <div class="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">${inner}</div>
                </div>
            </div>`,
    });

export const menuCreateView = (ctx) => {
    ctx.title = 'Add New Menu Item';
    // A menu item needs a category, so make sure at least one exists.
    if (db.categories.all().length === 0) db.categories.create('Main Course');

    return formShell(
        ctx,
        'Add New Menu Item',
        `
        ${errorSummary(ctx)}
        <form data-action="menu.store">
            <div class="mb-4">
                ${label('Item Name')}
                <input type="text" name="name" value="${e(ctx.old('name'))}" required class="${field}">
            </div>
            <div class="mb-4">
                ${label('Price ($)')}
                <input type="number" step="0.01" name="price" value="${e(ctx.old('price'))}" required class="${field}">
            </div>
            <div class="mb-4">
                ${label('Category')}
                <select name="category_id" required class="${field}">${categoryOptions(ctx.old('category_id'))}</select>
            </div>
            <div class="mb-6">
                ${label('Description')}
                <textarea name="description" rows="3" class="${field}">${e(ctx.old('description'))}</textarea>
            </div>
            <div class="mb-4">
                ${label('Upload Image')}
                <input type="file" name="image" accept="image/*" class="${field}">
            </div>
            <div class="flex justify-end">
                <a href="/menu" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">Cancel</a>
                <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save Item</button>
            </div>
        </form>`,
    );
};

export const menuEditView = (ctx) => {
    const item = db.menuItems.find(ctx.params.id);
    if (!item) return null;
    ctx.title = `Edit ${item.name}`;
    const available = ctx.flash.old ? ctx.flash.old.is_available === 'on' : item.is_available;

    return formShell(
        ctx,
        `Edit Menu Item: ${item.name}`,
        `
        ${errorSummary(ctx)}
        <form data-action="menu.update" data-param="${item.id}">
            <div class="mb-4">
                ${label('Item Name')}
                <input type="text" name="name" value="${e(ctx.old('name', item.name))}" required class="${field}">
            </div>
            <div class="mb-4">
                ${label('Price ($)')}
                <input type="number" step="0.01" name="price" value="${e(ctx.old('price', item.price))}" required class="${field}">
            </div>
            <div class="mb-4">
                ${label('Category')}
                <select name="category_id" required class="${field}">${categoryOptions(ctx.old('category_id', item.category_id))}</select>
            </div>
            <div class="mb-6">
                ${label('Description')}
                <textarea name="description" rows="3" class="${field}">${e(ctx.old('description', item.description ?? ''))}</textarea>
            </div>
            <div class="mb-6">
                <label class="inline-flex items-center">
                    <input type="checkbox" name="is_available" ${available ? 'checked' : ''} class="rounded dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500">
                    <span class="ms-2 text-gray-700 dark:text-gray-300 font-bold">Available (untick to mark as sold out)</span>
                </label>
            </div>
            <div class="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                ${label('Current Image')}
                ${item.image_path
                    ? `<div class="mb-4"><img src="${imageSrc(item)}" alt="${e(item.name)}" class="w-32 h-32 object-cover rounded-md shadow-sm border border-gray-300 dark:border-gray-500"></div>`
                    : '<p class="text-sm text-gray-500 dark:text-gray-400 mb-4 italic">No image currently uploaded.</p>'}
                ${label(item.image_path ? 'Upload New Image to Replace' : 'Upload Image')}
                <input type="file" name="image" accept="image/*" class="w-full text-gray-700 dark:text-gray-300">
            </div>
            <div class="flex justify-end">
                <a href="/menu" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">Cancel</a>
                <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Update Item</button>
            </div>
        </form>`,
    );
};
