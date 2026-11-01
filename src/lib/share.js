import { v4 as uuid } from 'uuid';
import { loadJSON, saveJSON, StorageKeys } from '@/lib/storage';
function loadAll() {
    return loadJSON(StorageKeys.shares, []);
}
function saveAll(shares) {
    saveJSON(StorageKeys.shares, shares);
}
export function getSharedDesign(id) {
    return loadAll().find((s) => s.id === id) ?? null;
}
export function createSharedDesign(input) {
    const share = {
        id: uuid(),
        designId: input.designId,
        name: input.name,
        elements: input.elements,
        settings: input.settings,
        venuePlan: input.venuePlan,
        estimatedBudget: input.estimatedBudget,
        createdAt: new Date().toISOString(),
        status: 'pending',
        comments: [],
    };
    const all = loadAll();
    all.unshift(share);
    saveAll(all.slice(0, 40));
    return share;
}
export function updateSharedDesign(share) {
    const all = loadAll();
    const idx = all.findIndex((s) => s.id === share.id);
    if (idx >= 0) {
        all[idx] = share;
        saveAll(all);
    }
}
export function addShareComment(shareId, author, body) {
    const share = getSharedDesign(shareId);
    if (!share)
        return null;
    const comment = {
        id: uuid(),
        author: author.trim() || 'Guest',
        body: body.trim(),
        createdAt: new Date().toISOString(),
    };
    share.comments = [...share.comments, comment];
    updateSharedDesign(share);
    return share;
}
export function setShareStatus(shareId, status, approvedBy) {
    const share = getSharedDesign(shareId);
    if (!share)
        return null;
    share.status = status;
    if (status === 'approved') {
        share.approvedAt = new Date().toISOString();
        share.approvedBy = approvedBy?.trim() || 'Family guest';
    }
    updateSharedDesign(share);
    return share;
}
export function shareUrl(shareId) {
    return `${window.location.origin}/share/${shareId}`;
}
export function DEFAULT_VENUE_PLAN() {
    return {
        enabled: false,
        imageDataUrl: null,
        widthFt: 40,
        depthFt: 28,
        showGrid: true,
    };
}
