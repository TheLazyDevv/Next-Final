export function pickImageUrl(item: any, baseURL = 'https://ilkinibadov.com') {
  let u =
    item.image ??
    item.imageUrl ??
    item.thumbnail ??
    item.cover ??
    (Array.isArray(item.images) ? item.images[0] : null) ??
    (Array.isArray(item.pictures) ? item.pictures[0] : null);

  if (u && typeof u === 'object' && u.url) u = u.url;

  if (!u || typeof u !== 'string') return null;

  if (/^https?:\/\//i.test(u)) return u;

  const root = (baseURL || '').replace(/\/+$/, '');
  const path = (u || '').replace(/^\/+/, '');
  
  return root ? `${root}/${path}` : u;
}