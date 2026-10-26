// Browser-side stand-in for the Laravel backend: a tiny "database" in localStorage
// (categories, menu_items, orders, order_items, users) plus session-style auth and carts.

const DB_KEY = 'rsos-demo-db-v1';
const AUTH_KEY = 'rsos-demo-auth';
const cartKey = (table) => `cart_${table}`;

let db;

// ─── Storage helpers (every access is guarded: storage can be blocked) ──────────

const safe = (fn, fallback = null) => {
    try {
        return fn();
    } catch {
        return fallback;
    }
};

const persist = () => safe(() => localStorage.setItem(DB_KEY, JSON.stringify(db)));

export async function hashPassword(password) {
    if (globalThis.crypto?.subtle) {
        const bytes = new TextEncoder().encode(`rsos:${password}`);
        const digest = await crypto.subtle.digest('SHA-256', bytes);
        return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
    }
    return `plain:${password}`;
}

// ─── Seed data ──────────────────────────────────────────────────────────────────

const art = (emoji, from, to) =>
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>` +
            `<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='${from}'/>` +
            `<stop offset='1' stop-color='${to}'/></linearGradient></defs>` +
            `<rect width='120' height='120' fill='url(#g)'/>` +
            `<text x='60' y='78' font-size='56' text-anchor='middle'>${emoji}</text></svg>`,
    );

async function seed() {
    const now = Date.now();
    const ago = (minutes) => new Date(now - minutes * 60000).toISOString();

    const categories = ['Starters', 'Main Course', 'Desserts', 'Drinks'].map((name, i) => ({ id: i + 1, name }));

    // [category_id, name, description, price, emoji, from, to, is_available]
    const menu = [
        [1, 'Spring Rolls', 'Crispy vegetable rolls with sweet chilli dip', 5.5, '🥟', '#fde68a', '#fb923c', true],
        [1, 'Garlic Bread', 'Toasted baguette with garlic butter and herbs', 4.0, '🥖', '#fef3c7', '#f59e0b', true],
        [1, 'Chicken Satay', 'Six charcoal-grilled skewers with peanut sauce', 7.5, '🍢', '#fecaca', '#f97316', true],
        [2, 'Nasi Lemak', 'Coconut rice, sambal, fried anchovies, egg and peanuts', 8.9, '🍛', '#bbf7d0', '#facc15', true],
        [2, 'Chicken Burger', 'Grilled chicken, lettuce, tomato and cheese in a brioche bun', 11.5, '🍔', '#fed7aa', '#ef4444', true],
        [2, 'Spaghetti Carbonara', 'Creamy egg sauce, beef bacon and parmesan', 12.9, '🍝', '#fef9c3', '#f97316', true],
        [2, 'Margherita Pizza', 'Tomato, fresh mozzarella and basil', 13.5, '🍕', '#fecaca', '#dc2626', true],
        [2, 'Grilled Salmon', 'Lemon butter salmon with seasonal vegetables', 18.0, '🐟', '#bae6fd', '#38bdf8', false],
        [3, 'Chocolate Lava Cake', 'Warm cake with a molten centre and vanilla ice cream', 6.5, '🍰', '#e9d5ff', '#78350f', true],
        [3, 'Mango Sticky Rice', 'Sweet coconut sticky rice with fresh mango', 5.9, '🥭', '#fef08a', '#f59e0b', true],
        [4, 'Iced Lemon Tea', 'Fresh brewed black tea with lemon', 3.5, '🍋', '#fef9c3', '#a3e635', true],
        [4, 'Teh Tarik', 'Pulled milk tea, hot or iced', 3.0, '☕', '#fde68a', '#b45309', true],
        [4, 'Fresh Orange Juice', 'Squeezed to order, no added sugar', 4.5, '🍊', '#fed7aa', '#fb923c', true],
    ];
    const menu_items = menu.map(([category_id, name, description, price, emoji, from, to, is_available], i) => ({
        id: i + 1,
        category_id,
        name,
        description,
        price,
        image_path: art(emoji, from, to),
        is_available,
    }));

    const orderSeeds = [
        { table_number: '7', status: 'pending', minutes: 14, notes: 'No peanuts please - allergy.', lines: [[3, 1], [4, 2], [11, 2]] },
        { table_number: '3', status: 'pending', minutes: 9, notes: null, lines: [[7, 1], [13, 1]] },
        { table_number: '12', status: 'pending', minutes: 3, notes: 'Extra spicy sambal, and the burger without onions.', lines: [[5, 1], [4, 1], [12, 2]] },
        { table_number: '5', status: 'completed', minutes: 40, notes: null, lines: [[9, 2], [12, 2]] },
    ];
    const orders = [];
    const order_items = [];
    orderSeeds.forEach((s, i) => {
        const id = i + 1;
        let total = 0;
        s.lines.forEach(([menu_item_id, quantity]) => {
            total += menu_items[menu_item_id - 1].price * quantity;
            order_items.push({ id: order_items.length + 1, order_id: id, menu_item_id, quantity });
        });
        orders.push({
            id,
            table_number: s.table_number,
            status: s.status,
            total_price: Math.round(total * 100) / 100,
            notes: s.notes,
            created_at: ago(s.minutes),
        });
    });

    return {
        categories,
        menu_items,
        orders,
        order_items,
        users: [
            { id: 1, name: 'Test User', email: 'test@example.com', password: await hashPassword('password') },
        ],
        resetTokens: {},
        seq: {
            categories: categories.length,
            menu_items: menu_items.length,
            orders: orders.length,
            order_items: order_items.length,
            users: 1,
        },
    };
}

export async function init() {
    db = safe(() => JSON.parse(localStorage.getItem(DB_KEY)));
    if (!db?.seq) {
        db = await seed();
        persist();
    }
}

/** Re-read the shared state after another tab changed it. */
export function reload() {
    const fresh = safe(() => JSON.parse(localStorage.getItem(DB_KEY)));
    if (fresh?.seq) db = fresh;
}

export async function resetDemo() {
    safe(() => localStorage.removeItem(DB_KEY));
    safe(() => localStorage.removeItem(AUTH_KEY));
    safe(() => sessionStorage.clear());
    db = await seed();
    persist();
}

const nextId = (table) => {
    db.seq[table] += 1;
    return db.seq[table];
};

// ─── Auth (session = sessionStorage, "remember me" = localStorage) ──────────────

export const currentUser = () => {
    const id = safe(() => sessionStorage.getItem(AUTH_KEY) ?? localStorage.getItem(AUTH_KEY));
    return db.users.find((u) => String(u.id) === id) ?? null;
};

export function login(user, remember = false) {
    safe(() => sessionStorage.setItem(AUTH_KEY, String(user.id)));
    if (remember) safe(() => localStorage.setItem(AUTH_KEY, String(user.id)));
}

export function logout() {
    safe(() => sessionStorage.removeItem(AUTH_KEY));
    safe(() => localStorage.removeItem(AUTH_KEY));
}

export const users = {
    findByEmail: (email) => db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase()) ?? null,
    create({ name, email, password }) {
        const user = { id: nextId('users'), name, email, password };
        db.users.push(user);
        persist();
        return user;
    },
    update(user, fields) {
        Object.assign(user, fields);
        persist();
    },
    remove(user) {
        db.users = db.users.filter((u) => u.id !== user.id);
        persist();
    },
    createResetToken(email) {
        const token = Math.random().toString(36).slice(2, 12);
        db.resetTokens[email.toLowerCase()] = token;
        persist();
        return token;
    },
    consumeResetToken(email, token) {
        const key = String(email).toLowerCase();
        const valid = db.resetTokens[key] && db.resetTokens[key] === token;
        if (valid) {
            delete db.resetTokens[key];
            persist();
        }
        return valid;
    },
};

// ─── Categories ─────────────────────────────────────────────────────────────────

export const categories = {
    all: () => db.categories,
    find: (id) => db.categories.find((c) => String(c.id) === String(id)) ?? null,
    nameTaken: (name, exceptId = null) =>
        db.categories.some((c) => c.name.toLowerCase() === name.toLowerCase() && String(c.id) !== String(exceptId)),
    create(name) {
        const category = { id: nextId('categories'), name };
        db.categories.push(category);
        persist();
        return category;
    },
    update(category, name) {
        category.name = name;
        persist();
    },
    // Mirrors cascadeOnDelete: a category takes its menu items (and their order lines) with it.
    remove(category) {
        const itemIds = db.menu_items.filter((m) => m.category_id === category.id).map((m) => m.id);
        db.order_items = db.order_items.filter((oi) => !itemIds.includes(oi.menu_item_id));
        db.menu_items = db.menu_items.filter((m) => m.category_id !== category.id);
        db.categories = db.categories.filter((c) => c.id !== category.id);
        persist();
    },
};

// ─── Menu items ─────────────────────────────────────────────────────────────────

export const menuItems = {
    all: () => db.menu_items,
    find: (id) => db.menu_items.find((m) => String(m.id) === String(id)) ?? null,
    create(fields) {
        const item = { id: nextId('menu_items'), image_path: null, is_available: true, description: null, ...fields };
        db.menu_items.push(item);
        persist();
        return item;
    },
    update(item, fields) {
        Object.assign(item, fields);
        persist();
    },
    remove(item) {
        db.order_items = db.order_items.filter((oi) => oi.menu_item_id !== item.id);
        db.menu_items = db.menu_items.filter((m) => m.id !== item.id);
        persist();
    },
    /** Categories with their available items, as the customer menu shows them. */
    grouped: () =>
        db.categories.map((category) => ({
            ...category,
            menuItems: db.menu_items.filter((m) => m.category_id === category.id && m.is_available),
        })),
};

// ─── Orders ─────────────────────────────────────────────────────────────────────

export const orders = {
    find: (id) => db.orders.find((o) => String(o.id) === String(id)) ?? null,
    pending: () =>
        db.orders
            .filter((o) => o.status === 'pending')
            .sort((a, b) => a.created_at.localeCompare(b.created_at))
            .map((o) => ({
                ...o,
                orderItems: db.order_items
                    .filter((oi) => oi.order_id === o.id)
                    .map((oi) => ({ ...oi, menuItem: menuItems.find(oi.menu_item_id) })),
            })),
    create(table_number, cart, notes) {
        const total = Object.values(cart).reduce((sum, line) => sum + line.price * line.quantity, 0);
        const order = {
            id: nextId('orders'),
            table_number: String(table_number),
            status: 'pending',
            total_price: Math.round(total * 100) / 100,
            notes: notes || null,
            created_at: new Date().toISOString(),
        };
        db.orders.push(order);
        for (const [menu_item_id, line] of Object.entries(cart)) {
            db.order_items.push({
                id: nextId('order_items'),
                order_id: order.id,
                menu_item_id: Number(menu_item_id),
                quantity: line.quantity,
            });
        }
        persist();
        return order;
    },
    complete(order) {
        order.status = 'completed';
        persist();
    },
};

// ─── Session cart (one per table, like session("cart_{table}")) ─────────────────

export const cart = {
    get: (table) => safe(() => JSON.parse(sessionStorage.getItem(cartKey(table))), null) ?? {},
    save: (table, value) => safe(() => sessionStorage.setItem(cartKey(table), JSON.stringify(value))),
    clear: (table) => safe(() => sessionStorage.removeItem(cartKey(table))),
};

export const DB_STORAGE_KEY = DB_KEY;
