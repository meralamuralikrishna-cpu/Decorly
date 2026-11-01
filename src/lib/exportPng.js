import { toPng } from 'html-to-image';
/** Export a DOM node (the design canvas) as a PNG download. */
export async function exportNodeAsPng(node, filename) {
    const dataUrl = await toPng(node, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: '#F3EEE6',
        // Skip interactive chrome that may linger on selected items
        filter: (el) => {
            if (!(el instanceof HTMLElement))
                return true;
            if (el.dataset.exportHide === 'true')
                return false;
            return true;
        },
    });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
}
/** Wait one paint so React can clear selection chrome before capture. */
export function nextPaint() {
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => resolve());
        });
    });
}
