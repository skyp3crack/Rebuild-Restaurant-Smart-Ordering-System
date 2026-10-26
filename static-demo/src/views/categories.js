// resources/views/categories/*.blade.php
import * as db from '../db.js';
import { e, appLayout, pageTitle, inputError, successFlash } from '../ui.js';

const field = 'w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm';

export const categoriesIndexView = (ctx) => {
    ctx.title = 'Manage Categories';
    const list = db.categories.all();
    const count = (c) => db.menuItems.all().filter((m) => m.category_id === c.id).length;

    return appLayout({
        user: ctx.user,
        path: ctx.path,
        header: `
            <div class="flex justify-between items-center">
                ${pageTitle('Manage Categories')}
                <a href="/categories/create" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">+ Add New Category</a>
            </div>`,
        body: `
            <div class="py-12">
                <div class="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    ${successFlash(ctx.flash.success)}
                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        ${list.length
                            ? `<div class="space-y-4">${list
                                  .map(
                                      (c) => `
                                <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <div>
                                        <h3 class="font-semibold text-lg text-gray-900">${e(c.name)}</h3>
                                        <p class="text-sm text-gray-500">${count(c)} menu item${count(c) === 1 ? '' : 's'}</p>
                                    </div>
                                    <div class="flex space-x-2">
                                        <a href="/categories/${c.id}/edit" class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">Edit</a>
                                        <form data-action="categories.destroy" data-param="${c.id}" data-confirm="Delete this category? Its menu items will be deleted too.">
                                            <button type="submit" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Delete</button>
                                        </form>
                                    </div>
                                </div>`,
                                  )
                                  .join('')}</div>`
                            : '<p class="text-gray-500 dark:text-gray-400">No categories found.</p>'}
                    </div>
                </div>
            </div>`,
    });
};

const categoryForm = (ctx, { action, param = '', title, value = '', submit }) =>
    appLayout({
        user: ctx.user,
        path: ctx.path,
        header: pageTitle(title),
        body: `
            <div class="py-12">
                <div class="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div class="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form data-action="${action}" data-param="${param}">
                            <div class="mb-4">
                                <label class="block text-gray-700 dark:text-gray-300 font-bold mb-2">Category Name</label>
                                <input type="text" name="name" value="${e(ctx.old('name', value))}" required class="${field}">
                                ${inputError(ctx.err('name'), 'mt-2')}
                            </div>
                            <div class="flex justify-end">
                                <a href="/categories" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mr-2">Cancel</a>
                                <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">${submit}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>`,
    });

export const categoriesCreateView = (ctx) => {
    ctx.title = 'Add New Category';
    return categoryForm(ctx, { action: 'categories.store', title: 'Add New Category', submit: 'Save Category' });
};

export const categoriesEditView = (ctx) => {
    const category = db.categories.find(ctx.params.id);
    if (!category) return null;
    ctx.title = `Edit ${category.name}`;
    return categoryForm(ctx, {
        action: 'categories.update',
        param: category.id,
        title: `Edit Category: ${category.name}`,
        value: category.name,
        submit: 'Update Category',
    });
};
