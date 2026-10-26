// resources/views/auth/*.blade.php
import { e, guestLayout, inputLabel, textInput, inputError, statusMessage, primaryButton } from '../ui.js';

const linkCls = 'underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800';
const blurb = (text) => `<div class="mb-4 text-sm text-gray-600 dark:text-gray-400">${text}</div>`;

export const loginView = (ctx) => {
    ctx.title = 'Log in';
    return guestLayout(`
        ${statusMessage(ctx.flash.status, 'mb-4')}
        <form data-action="auth.login">
            <div>
                ${inputLabel('email', 'Email')}
                ${textInput({ id: 'email', type: 'email', value: ctx.old('email'), cls: 'block mt-1 w-full', attrs: 'required autofocus autocomplete="username"' })}
                ${inputError(ctx.err('email'), 'mt-2')}
            </div>

            <div class="mt-4">
                ${inputLabel('password', 'Password')}
                ${textInput({ id: 'password', type: 'password', cls: 'block mt-1 w-full', attrs: 'required autocomplete="current-password"' })}
                ${inputError(ctx.err('password'), 'mt-2')}
            </div>

            <div class="block mt-4">
                <label for="remember_me" class="inline-flex items-center">
                    <input id="remember_me" type="checkbox" name="remember" class="rounded dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:focus:ring-offset-gray-800">
                    <span class="ms-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
            </div>

            <div class="flex items-center justify-end mt-4">
                <a class="${linkCls}" href="/forgot-password">Forgot your password?</a>
                ${primaryButton('Log in', 'ms-3')}
            </div>
        </form>

        <div class="mt-6 rounded-md bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800 p-3 text-sm text-indigo-900 dark:text-indigo-200">
            <p class="font-medium">Demo account</p>
            <p class="mt-1">Email <code>test@example.com</code> / password <code>password</code></p>
            <button type="button" data-fill-demo class="mt-2 underline underline-offset-2 font-medium">Fill in the demo credentials</button>
        </div>
    `);
};

export const registerView = (ctx) => {
    ctx.title = 'Register';
    return guestLayout(`
        <form data-action="auth.register">
            <div>
                ${inputLabel('name', 'Name')}
                ${textInput({ id: 'name', value: ctx.old('name'), cls: 'block mt-1 w-full', attrs: 'required autofocus autocomplete="name"' })}
                ${inputError(ctx.err('name'), 'mt-2')}
            </div>
            <div class="mt-4">
                ${inputLabel('email', 'Email')}
                ${textInput({ id: 'email', type: 'email', value: ctx.old('email'), cls: 'block mt-1 w-full', attrs: 'required autocomplete="username"' })}
                ${inputError(ctx.err('email'), 'mt-2')}
            </div>
            <div class="mt-4">
                ${inputLabel('password', 'Password')}
                ${textInput({ id: 'password', type: 'password', cls: 'block mt-1 w-full', attrs: 'required autocomplete="new-password"' })}
                ${inputError(ctx.err('password'), 'mt-2')}
            </div>
            <div class="mt-4">
                ${inputLabel('password_confirmation', 'Confirm Password')}
                ${textInput({ id: 'password_confirmation', type: 'password', cls: 'block mt-1 w-full', attrs: 'required autocomplete="new-password"' })}
                ${inputError(ctx.err('password_confirmation'), 'mt-2')}
            </div>
            <div class="flex items-center justify-end mt-4">
                <a class="${linkCls}" href="/login">Already registered?</a>
                ${primaryButton('Register', 'ms-4')}
            </div>
        </form>
    `);
};

export const forgotPasswordView = (ctx) => {
    ctx.title = 'Forgot password';
    const demoLink = ctx.flash.resetLink
        ? `<div class="mb-4 rounded-md bg-indigo-50 dark:bg-indigo-900/40 border border-indigo-100 dark:border-indigo-800 p-3 text-sm text-indigo-900 dark:text-indigo-200">
               A demo cannot send email, so here is the link it would contain:
               <a class="underline font-medium" href="${e(ctx.flash.resetLink)}">Choose a new password</a>
           </div>`
        : '';
    return guestLayout(`
        ${blurb('Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.')}
        ${statusMessage(ctx.flash.status, 'mb-4')}
        ${demoLink}
        <form data-action="auth.forgot">
            <div>
                ${inputLabel('email', 'Email')}
                ${textInput({ id: 'email', type: 'email', value: ctx.old('email'), cls: 'block mt-1 w-full', attrs: 'required autofocus' })}
                ${inputError(ctx.err('email'), 'mt-2')}
            </div>
            <div class="flex items-center justify-end mt-4">
                ${primaryButton('Email Password Reset Link')}
            </div>
        </form>
    `);
};

export const resetPasswordView = (ctx) => {
    ctx.title = 'Reset password';
    return guestLayout(`
        <form data-action="auth.reset" data-param="${e(ctx.params.token)}">
            <div>
                ${inputLabel('email', 'Email')}
                ${textInput({ id: 'email', type: 'email', value: ctx.old('email', ctx.query.email ?? ''), cls: 'block mt-1 w-full', attrs: 'required autofocus autocomplete="username"' })}
                ${inputError(ctx.err('email'), 'mt-2')}
            </div>
            <div class="mt-4">
                ${inputLabel('password', 'Password')}
                ${textInput({ id: 'password', type: 'password', cls: 'block mt-1 w-full', attrs: 'required autocomplete="new-password"' })}
                ${inputError(ctx.err('password'), 'mt-2')}
            </div>
            <div class="mt-4">
                ${inputLabel('password_confirmation', 'Confirm Password')}
                ${textInput({ id: 'password_confirmation', type: 'password', cls: 'block mt-1 w-full', attrs: 'required autocomplete="new-password"' })}
                ${inputError(ctx.err('password_confirmation'), 'mt-2')}
            </div>
            <div class="flex items-center justify-end mt-4">
                ${primaryButton('Reset Password')}
            </div>
        </form>
    `);
};

export const confirmPasswordView = (ctx) => {
    ctx.title = 'Confirm password';
    return guestLayout(`
        ${blurb('This is a secure area of the application. Please confirm your password before continuing.')}
        <form data-action="auth.confirm">
            <div>
                ${inputLabel('password', 'Password')}
                ${textInput({ id: 'password', type: 'password', cls: 'block mt-1 w-full', attrs: 'required autocomplete="current-password"' })}
                ${inputError(ctx.err('password'), 'mt-2')}
            </div>
            <div class="flex justify-end mt-4">
                ${primaryButton('Confirm')}
            </div>
        </form>
    `);
};

export const verifyEmailView = (ctx) => {
    ctx.title = 'Verify email';
    return guestLayout(`
        ${blurb("Thanks for signing up! Before getting started, could you verify your email address by clicking on the link we just emailed to you? If you didn't receive the email, we will gladly send you another.")}
        ${ctx.flash.status === 'verification-link-sent'
            ? '<div class="mb-4 font-medium text-sm text-green-600 dark:text-green-400">A new verification link has been sent to the email address you provided during registration.</div>'
            : ''}
        <div class="mt-4 flex items-center justify-between">
            <form data-action="auth.verify"><div>${primaryButton('Resend Verification Email')}</div></form>
            <form data-action="auth.logout"><button type="submit" class="${linkCls}">Log Out</button></form>
        </div>
    `);
};
