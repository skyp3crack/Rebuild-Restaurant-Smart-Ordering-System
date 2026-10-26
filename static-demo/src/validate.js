// Small subset of Laravel's validator, with the same default messages.

const label = (field) => field.replace(/_/g, ' ');
const blank = (v) => v === undefined || v === null || String(v).trim() === '';

export const rules = {
    required: (f, v) => (blank(v) ? `The ${label(f)} field is required.` : null),
    max: (n) => (f, v) => (!blank(v) && String(v).length > n ? `The ${label(f)} field must not be greater than ${n} characters.` : null),
    min: (n) => (f, v) => (!blank(v) && String(v).length < n ? `The ${label(f)} field must be at least ${n} characters.` : null),
    email: (f, v) => (!blank(v) && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) ? `The ${label(f)} field must be a valid email address.` : null),
    numeric: (f, v) => (!blank(v) && Number.isNaN(Number(v)) ? `The ${label(f)} field must be a number.` : null),
    minValue: (n) => (f, v) => (!blank(v) && Number(v) < n ? `The ${label(f)} field must be at least ${n}.` : null),
    confirmed: (f, v, data) => (v !== data[`${f}_confirmation`] ? `The ${label(f)} field confirmation does not match.` : null),
    // custom(fn, message): fails when fn(value, data) is false for a non-empty value
    check: (fn, message) => (f, v, data) => (!blank(v) && !fn(v, data) ? message.replace(':attribute', label(f)) : null),
};

/** spec = { field: [rule, ...] } -> { field: [message] } (first failing rule per field). */
export function validate(data, spec) {
    const errors = {};
    for (const [field, list] of Object.entries(spec)) {
        for (const rule of list) {
            const message = rule(field, data[field], data);
            if (message) {
                errors[field] = [message];
                break;
            }
        }
    }
    return errors;
}

export const failed = (errors) => Object.keys(errors).length > 0;
