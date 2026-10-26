// Stand-in for Laravel's image upload: validates the file like the controller does,
// then shrinks it into a data URL that fits comfortably in browser storage.

const MAX_KB = 5120;
const MAX_SIDE = 480;

export async function processImage(file, { allowWebp = false } = {}) {
    if (!file || !file.size) return { skipped: true };

    const allowed = ['image/jpeg', 'image/png', 'image/gif', ...(allowWebp ? ['image/webp'] : [])];
    if (!file.type.startsWith('image/')) return { error: 'The image field must be an image.' };
    if (!allowed.includes(file.type)) {
        return { error: `The image field must be a file of type: jpeg, png, jpg, gif${allowWebp ? ', webp' : ''}.` };
    }
    if (file.size > MAX_KB * 1024) return { error: `The image field must not be greater than ${MAX_KB} kilobytes.` };

    try {
        const url = URL.createObjectURL(file);
        const img = await new Promise((resolve, reject) => {
            const el = new Image();
            el.onload = () => resolve(el);
            el.onerror = reject;
            el.src = url;
        });
        const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        return { dataUrl: canvas.toDataURL('image/jpeg', 0.82) };
    } catch {
        return { error: 'The image failed to upload.' };
    }
}
