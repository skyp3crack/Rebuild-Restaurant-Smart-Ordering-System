// The controllers: one handler per <form data-action="...">.
// Each receives the submitted data and finishes with a redirect or a re-render, like a Laravel response.
import * as db from './db.js';
import { hashPassword } from './db.js';
import { navigate, rerender, takeIntended } from './router.js';
import { rules as r, validate, failed } from './validate.js';
import { processImage } from './image.js';

const fail = (errors, data, bag = 'default', keep = []) => {
    const old = {};
    for (const [key, value] of Object.entries(data)) {
        if (typeof value === 'string' && !/password/.test(key)) old[key] = value;
        if (keep.includes(key)) old[key] = value;
    }
    return rerender({ errors: { [bag]: errors }, old });
};

const emailRules = (selfId = null) => [
    r.required,
    r.email,
    r.max(255),
    r.check((v) => {
        const other = db.users.findByEmail(v);
        return !other || other.id === selfId;
    }, 'The :attribute has already been taken.'),
];

const passwordRules = [r.required, r.min(8), r.confirmed];

export const actions = {
    // ─── Authentication (routes/auth.php) ───────────────────────────────────────
    async 'auth.login'({ data }) {
        const errors = validate(data, { email: [r.required, r.email], password: [r.required] });
        if (failed(errors)) return fail(errors, data);

        const user = db.users.findByEmail(data.email);
        if (!user || user.password !== (await hashPassword(data.password))) {
            return fail({ email: ['These credentials do not match our records.'] }, data);
        }
        db.login(user, Boolean(data.remember));
        return navigate(takeIntended() ?? '/dashboard');
    },

    async 'auth.register'({ data }) {
        const errors = validate(data, {
            name: [r.required, r.max(255)],
            email: emailRules(),
            password: passwordRules,
        });
        if (failed(errors)) return fail(errors, data);

        const user = db.users.create({
            name: data.name.trim(),
            email: data.email.trim(),
            password: await hashPassword(data.password),
        });
        db.login(user);
        return navigate('/dashboard');
    },

    async 'auth.forgot'({ data }) {
        const errors = validate(data, { email: [r.required, r.email] });
        if (failed(errors)) return fail(errors, data);

        const user = db.users.findByEmail(data.email);
        if (!user) return fail({ email: ["We can't find a user with that email address."] }, data);

        const token = db.users.createResetToken(user.email);
        return rerender({
            status: 'We have emailed your password reset link.',
            resetLink: `/reset-password/${token}?email=${encodeURIComponent(user.email)}`,
        });
    },

    async 'auth.reset'({ data, param }) {
        const errors = validate(data, { email: [r.required, r.email], password: passwordRules });
        if (failed(errors)) return fail(errors, data);

        const user = db.users.findByEmail(data.email);
        if (!user) return fail({ email: ["We can't find a user with that email address."] }, data);
        if (!db.users.consumeResetToken(user.email, param)) {
            return fail({ email: ['This password reset token is invalid.'] }, data);
        }
        db.users.update(user, { password: await hashPassword(data.password) });
        return navigate('/login', { flash: { status: 'Your password has been reset.' } });
    },

    async 'auth.confirm'({ data, user }) {
        const errors = validate(data, { password: [r.required] });
        if (failed(errors)) return fail(errors, data);
        if (user.password !== (await hashPassword(data.password))) {
            return fail({ password: ['The provided password does not match our records.'] }, data);
        }
        return navigate(takeIntended() ?? '/dashboard');
    },

    async 'auth.verify'() {
        return rerender({ status: 'verification-link-sent' });
    },

    async 'auth.logout'() {
        db.logout();
        return navigate('/');
    },

    // ─── Profile (ProfileController + PasswordController) ───────────────────────
    async 'profile.update'({ data, user }) {
        const errors = validate(data, { name: [r.required, r.max(255)], email: emailRules(user.id) });
        if (failed(errors)) return fail(errors, data);

        db.users.update(user, { name: data.name.trim(), email: data.email.trim() });
        return navigate('/profile', { replace: true, flash: { status: 'profile-updated' } });
    },

    async 'profile.password'({ data, user }) {
        const errors = validate(data, { current_password: [r.required], password: passwordRules });
        if (!errors.current_password && user.password !== (await hashPassword(data.current_password))) {
            errors.current_password = ['The password is incorrect.'];
        }
        if (failed(errors)) return fail(errors, data, 'updatePassword');

        db.users.update(user, { password: await hashPassword(data.password) });
        return navigate('/profile', { replace: true, flash: { status: 'password-updated' } });
    },

    async 'profile.destroy'({ data, user }) {
        if (!data.password || user.password !== (await hashPassword(data.password))) {
            return fail({ password: ['The password is incorrect.'] }, data, 'userDeletion');
        }
        db.logout();
        db.users.remove(user);
        return navigate('/');
    },

    // ─── Categories (CategoryController) ────────────────────────────────────────
    async 'categories.store'({ data }) {
        const errors = validate(data, {
            name: [r.required, r.max(255), r.check((v) => !db.categories.nameTaken(v.trim()), 'The :attribute has already been taken.')],
        });
        if (failed(errors)) return fail(errors, data);

        db.categories.create(data.name.trim());
        return navigate('/categories', { flash: { success: 'Category created successfully' } });
    },

    async 'categories.update'({ data, param }) {
        const category = db.categories.find(param);
        if (!category) return navigate('/categories');
        const errors = validate(data, {
            name: [r.required, r.max(255), r.check((v) => !db.categories.nameTaken(v.trim(), category.id), 'The :attribute has already been taken.')],
        });
        if (failed(errors)) return fail(errors, data);

        db.categories.update(category, data.name.trim());
        return navigate('/categories', { flash: { success: 'Category updated successfully' } });
    },

    async 'categories.destroy'({ param }) {
        const category = db.categories.find(param);
        if (category) db.categories.remove(category);
        return navigate('/categories', { flash: { success: 'Category deleted successfully' } });
    },

    // ─── Menu items (MenuItemController) ────────────────────────────────────────
    async 'menu.store'({ data, formData }) {
        const errors = menuRules(data);
        const image = await processImage(formData.get('image'));
        if (image.error) errors.image = [image.error];
        if (failed(errors)) return fail(errors, data);

        db.menuItems.create({
            name: data.name.trim(),
            price: Number(data.price),
            category_id: Number(data.category_id),
            description: data.description?.trim() || null,
            image_path: image.dataUrl ?? null,
        });
        return navigate('/menu', { flash: { success: 'Menu item created successfully!' } });
    },

    async 'menu.update'({ data, formData, param }) {
        const item = db.menuItems.find(param);
        if (!item) return navigate('/menu');
        const errors = menuRules(data);
        const image = await processImage(formData.get('image'), { allowWebp: true });
        if (image.error) errors.image = [image.error];
        if (failed(errors)) return fail(errors, data, 'default', ['is_available']);

        db.menuItems.update(item, {
            name: data.name.trim(),
            price: Number(data.price),
            category_id: Number(data.category_id),
            description: data.description?.trim() || null,
            is_available: data.is_available === 'on',
            ...(image.dataUrl ? { image_path: image.dataUrl } : {}),
        });
        return navigate('/menu', { flash: { success: 'Menu item updated successfully!' } });
    },

    async 'menu.destroy'({ param }) {
        const item = db.menuItems.find(param);
        if (item) db.menuItems.remove(item);
        return navigate('/menu', { flash: { success: 'Menu item deleted.' } });
    },

    // ─── Customer ordering (OrderController) ────────────────────────────────────
    async 'welcome.table'({ data }) {
        const table = String(data.table ?? '').trim() || '1';
        return navigate(`/table/${encodeURIComponent(table)}`);
    },

    async 'customer.add'({ data, param: table }) {
        const item = db.menuItems.find(data.menu_item_id);
        if (!item) return rerender({ error: 'That item is no longer on the menu.' });

        const cart = db.cart.get(table);
        if (cart[item.id]) {
            cart[item.id].quantity += 1;
        } else {
            cart[item.id] = { name: item.name, quantity: 1, price: item.price };
        }
        db.cart.save(table, cart);
        return rerender({ success: `${item.name} added to cart!` });
    },

    async 'customer.remove'({ data, param: table }) {
        const cart = db.cart.get(table);
        const line = cart[data.menu_item_id];
        if (line) {
            line.quantity -= 1;
            if (line.quantity <= 0) delete cart[data.menu_item_id];
            db.cart.save(table, cart);
        }
        return rerender();
    },

    async 'customer.checkout'({ data, param: table }) {
        const errors = validate(data, { notes: [r.max(500)] });
        if (failed(errors)) return fail(errors, data);

        const cart = db.cart.get(table);
        if (Object.keys(cart).length === 0) return rerender();

        db.orders.create(table, cart, data.notes?.trim());
        db.cart.clear(table);
        return navigate(`/table/${encodeURIComponent(table)}`, {
            flash: { success: 'Order placed successfully! The kitchen is preparing your food.' },
        });
    },

    // ─── Kitchen ────────────────────────────────────────────────────────────────
    async 'kitchen.complete'({ param }) {
        const order = db.orders.find(param);
        if (order) db.orders.complete(order);
        return navigate('/kitchen', { flash: { success: `Order #${param} marked as completed!` } });
    },
};

function menuRules(data) {
    return validate(data, {
        name: [r.required, r.max(255)],
        price: [r.required, r.numeric, r.minValue(0)],
        category_id: [r.required, r.check((v) => db.categories.find(v), 'The selected :attribute is invalid.')],
    });
}
