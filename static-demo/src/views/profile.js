// resources/views/profile/*.blade.php
import { e, appLayout, pageTitle, inputLabel, textInput, inputError, primaryButton, secondaryButton, dangerButton, savedNotice, modal } from '../ui.js';

const section = (inner) => `
    <div class="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"><div class="max-w-xl">${inner}</div></div>`;

const heading = (title, text) => `
    <header>
        <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">${title}</h2>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">${text}</p>
    </header>`;

const passwordField = (id, name, text, bag, ctx, autocomplete) => `
    <div>
        ${inputLabel(id, text)}
        ${textInput({ id, name, type: 'password', cls: 'mt-1 block w-full', attrs: `autocomplete="${autocomplete}"` })}
        ${inputError(ctx.err(name, bag), 'mt-2')}
    </div>`;

export const profileView = (ctx) => {
    ctx.title = 'Profile';
    const { user } = ctx;
    const informationForm = `
        ${heading('Profile Information', "Update your account's profile information and email address.")}
        <form data-action="profile.update" class="mt-6 space-y-6">
            <div>
                ${inputLabel('name', 'Name')}
                ${textInput({ id: 'name', value: ctx.old('name', user.name), cls: 'mt-1 block w-full', attrs: 'required autofocus autocomplete="name"' })}
                ${inputError(ctx.err('name'), 'mt-2')}
            </div>
            <div>
                ${inputLabel('email', 'Email')}
                ${textInput({ id: 'email', type: 'email', value: ctx.old('email', user.email), cls: 'mt-1 block w-full', attrs: 'required autocomplete="username"' })}
                ${inputError(ctx.err('email'), 'mt-2')}
            </div>
            <div class="flex items-center gap-4">
                ${primaryButton('Save')}
                ${savedNotice(ctx.flash.status === 'profile-updated')}
            </div>
        </form>`;

    const passwordForm = `
        ${heading('Update Password', 'Ensure your account is using a long, random password to stay secure.')}
        <form data-action="profile.password" class="mt-6 space-y-6">
            ${passwordField('update_password_current_password', 'current_password', 'Current Password', 'updatePassword', ctx, 'current-password')}
            ${passwordField('update_password_password', 'password', 'New Password', 'updatePassword', ctx, 'new-password')}
            ${passwordField('update_password_password_confirmation', 'password_confirmation', 'Confirm Password', 'updatePassword', ctx, 'new-password')}
            <div class="flex items-center gap-4">
                ${primaryButton('Save')}
                ${savedNotice(ctx.flash.status === 'password-updated')}
            </div>
        </form>`;

    const deleteForm = `
        <section class="space-y-6">
            ${heading('Delete Account', 'Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.')}
            ${dangerButton('Delete Account', '', 'data-open-modal="confirm-user-deletion"', 'button')}
            ${modal('confirm-user-deletion', `
                <form data-action="profile.destroy" class="p-6">
                    <h2 class="text-lg font-medium text-gray-900 dark:text-gray-100">Are you sure you want to delete your account?</h2>
                    <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.</p>
                    <div class="mt-6">
                        ${inputLabel('delete_password', 'Password', 'sr-only')}
                        ${textInput({ id: 'delete_password', name: 'password', type: 'password', cls: 'mt-1 block w-3/4', attrs: 'placeholder="Password"' })}
                        ${inputError(ctx.err('password', 'userDeletion'), 'mt-2')}
                    </div>
                    <div class="mt-6 flex justify-end">
                        ${secondaryButton('Cancel', '', 'data-close-modal')}
                        ${dangerButton('Delete Account', 'ms-3')}
                    </div>
                </form>`, ctx.hasErrors('userDeletion'))}
        </section>`;

    return appLayout({
        user,
        path: ctx.path,
        header: pageTitle('Profile'),
        body: `
            <div class="py-12">
                <div class="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    ${section(`<section>${informationForm}</section>`)}
                    ${section(`<section>${passwordForm}</section>`)}
                    ${section(deleteForm)}
                </div>
            </div>`,
    });
};
