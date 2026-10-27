import request from 'supertest';
import sharp from 'sharp';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { BlogPost, Redirect, Service } from '../models/content.js';
import { clearDb, loginAs, makeUser, startTestApp, stopTestApp } from './helpers.js';
import { resolveRoute, buildSitemap, renderHead } from '../services/seoService.js';

let app: Awaited<ReturnType<typeof startTestApp>>;
beforeAll(async () => { app = await startTestApp(); });
afterAll(stopTestApp);
beforeEach(clearDb);

const post = (over: Record<string, unknown> = {}) => ({ slug: 'hello-world', title: 'Hello world', excerpt: 'An excerpt', bodyHtml: '<p>Body</p>', status: 'draft', ...over });

describe('blog publishing & sanitising', () => {
  it('strips scripts, event handlers and javascript: links from article HTML', async () => {
    await makeUser('admin');
    const s = await loginAs(app, 'admin@example.com');
    const res = await s.post('/api/admin/blog-posts', post({
      bodyHtml: '<p onclick="x()">Hi</p><script>alert(1)</script><a href="javascript:alert(1)">bad</a><img src=x onerror=alert(1)><a href="https://ok.example">ok</a>',
    }));
    expect(res.status).toBe(201);
    expect(res.body.bodyHtml).not.toMatch(/script|onclick|onerror|javascript:/i);
    expect(res.body.bodyHtml).toContain('https://ok.example');
    expect(res.body.bodyHtml).toMatch(/rel="noopener noreferrer nofollow"/);
  });

  it('drafts are not public; published posts are, with reading time', async () => {
    await makeUser('admin');
    const s = await loginAs(app, 'admin@example.com');
    const created = await s.post('/api/admin/blog-posts', post());
    expect((await request(app).get('/api/public/posts/hello-world')).status).toBe(404);
    expect((await request(app).get('/api/public/posts')).body.total).toBe(0);

    await s.patch(`/api/admin/blog-posts/${created.body._id}`, { status: 'published' });
    const pub = await request(app).get('/api/public/posts/hello-world');
    expect(pub.status).toBe(200);
    expect(pub.body.post.readingMinutes).toBeGreaterThanOrEqual(1);
    expect((await request(app).get('/api/public/posts?q=hello')).body.total).toBe(1);
  });

  it('future-dated posts stay hidden until their publish time', async () => {
    await makeUser('admin');
    const s = await loginAs(app, 'admin@example.com');
    await s.post('/api/admin/blog-posts', post({ status: 'published', publishedAt: new Date(Date.now() + 86_400_000).toISOString() }));
    expect((await request(app).get('/api/public/posts/hello-world')).status).toBe(404);
    expect((await resolveRoute('/blog/hello-world')).status).toBe(404);
  });

  it('rejects duplicate slugs and invalid slugs', async () => {
    await makeUser('admin');
    const s = await loginAs(app, 'admin@example.com');
    await s.post('/api/admin/blog-posts', post());
    expect((await s.post('/api/admin/blog-posts', post())).status).toBe(409);
    expect((await s.post('/api/admin/blog-posts', post({ slug: 'Bad Slug!' }))).status).toBe(400);
  });
});

describe('services, testimonials & public data exposure', () => {
  it('unpublished services are not public', async () => {
    await makeUser('admin');
    await Service.create({ slug: 'hidden', title: 'Hidden', summary: 'Hidden service summary', published: false });
    await Service.create({ slug: 'shown', title: 'Shown', summary: 'Shown service summary', published: true });
    const list = await request(app).get('/api/public/services');
    expect(list.body.items.map((i: any) => i.slug)).toEqual(['shown']);
    expect((await request(app).get('/api/public/services/hidden')).status).toBe(404);
  });

  it('testimonials need verification and a consent reference before they can be published', async () => {
    await makeUser('admin');
    const s = await loginAs(app, 'admin@example.com');
    const base = { authorName: 'A Client', quote: 'Great work and communication throughout.' };
    expect((await s.post('/api/admin/testimonials', { ...base, published: true })).status).toBe(400);
    expect((await s.post('/api/admin/testimonials', { ...base, published: true, verified: true })).status).toBe(400);
    const ok = await s.post('/api/admin/testimonials', { ...base, published: true, verified: true, consentReference: 'Email approval 2026-01-05' });
    expect(ok.status).toBe(201);
    expect((await request(app).get('/api/public/testimonials')).body.items).toHaveLength(1);
  });

  it('strict schemas reject unknown fields on admin writes', async () => {
    await makeUser('admin');
    const s = await loginAs(app, 'admin@example.com');
    const res = await s.post('/api/admin/faqs', { question: 'Q here?', answer: 'Answer here', _id: '507f1f77bcf86cd799439011', $set: { x: 1 } });
    expect(res.status).toBe(400);
  });
});

describe('SEO administration', () => {
  it('rejects redirect loops, self-redirects and off-site destinations', async () => {
    await makeUser('admin');
    const s = await loginAs(app, 'admin@example.com');
    expect((await s.post('/api/admin/redirects', { from: '/a', to: '/b' })).status).toBe(201);
    expect((await s.post('/api/admin/redirects', { from: '/b', to: '/a' })).status).toBe(400); // loop
    expect((await s.post('/api/admin/redirects', { from: '/c', to: '/c' })).status).toBe(400); // self
    expect((await s.post('/api/admin/redirects', { from: '/d', to: 'https://evil.example/phish' })).status).toBe(400); // open redirect
    expect((await s.post('/api/admin/redirects', { from: '/e', to: '//evil.example' })).status).toBe(400); // protocol-relative
    expect((await s.post('/api/admin/redirects', { from: '/f', to: 'javascript:alert(1)' })).status).toBe(400);
    expect((await s.post('/api/admin/redirects', { from: '/g', to: 'https://rsstack.test/ok' })).status).toBe(201); // same host
    expect(await Redirect.countDocuments()).toBe(2 + 0);
  });

  it('refuses markup in SEO fields and off-site canonical URLs', async () => {
    await makeUser('admin');
    const s = await loginAs(app, 'admin@example.com');
    expect((await s.post('/api/admin/page-seo', { path: '/about', title: '<script>x</script>' })).status).toBe(400);
    expect((await s.post('/api/admin/page-seo', { path: '/about', canonical: 'https://evil.example/about' })).status).toBe(400);
    expect((await s.post('/api/admin/page-seo', { path: '/about', title: 'About us', canonical: 'https://rsstack.test/about' })).status).toBe(201);
  });

  it('applies overrides to page metadata and returns correct status codes', async () => {
    await makeUser('admin');
    const s = await loginAs(app, 'admin@example.com');
    await s.post('/api/admin/page-seo', { path: '/about', title: 'Custom About Title', noindex: true });
    const about = await resolveRoute('/about');
    expect(about.status).toBe(200);
    expect(about.title).toBe('Custom About Title');
    expect(about.noindex).toBe(true);
    expect((await resolveRoute('/services/does-not-exist')).status).toBe(404);
    expect((await resolveRoute('/totally/unknown')).status).toBe(404);
    expect((await resolveRoute('/admin/leads')).noindex).toBe(true);
  });

  it('escapes metadata when rendering the document head', async () => {
    const head = renderHead({ status: 200, title: 'A "quoted" <b>title</b>', description: 'x', canonical: 'https://rsstack.test/', noindex: false, ogType: 'website', jsonLd: [{ a: '</script><script>alert(1)' }] });
    expect(head).not.toContain('<b>');
    expect(head).not.toMatch(/<\/script><script>/);
  });

  it('sitemap lists only public, indexable pages', async () => {
    await BlogPost.create({ slug: 'live', title: 'Live', status: 'published', publishedAt: new Date(Date.now() - 1000) });
    await BlogPost.create({ slug: 'draft', title: 'Draft', status: 'draft' });
    await Service.create({ slug: 'svc', title: 'S', summary: 'Service summary text', published: true });
    const xml = await buildSitemap();
    expect(xml).toContain('https://rsstack.test/blog/live');
    expect(xml).toContain('https://rsstack.test/services/svc');
    expect(xml).not.toContain('/blog/draft');
    expect(xml).not.toContain('/admin');
    const robots = await request(app).get('/robots.txt');
    expect(robots.text).toContain('Disallow: /admin');
    expect(robots.text).toContain('Sitemap: https://rsstack.test/sitemap.xml');
  });
});

describe('media uploads', () => {
  const png = () => sharp({ create: { width: 20, height: 20, channels: 3, background: '#795bff' } }).png().toBuffer();

  it('accepts a real image and re-encodes it to WebP', async () => {
    await makeUser('admin');
    const s = await loginAs(app, 'admin@example.com');
    const res = await s.agent.post('/api/admin/media').set('X-CSRF-Token', s.csrf).field('alt', 'A square').attach('file', await png(), { filename: '../../evil.php.png', contentType: 'image/png' });
    expect(res.status).toBe(201);
    expect(res.body.mime).toBe('image/webp');
    expect(res.body.filename).toMatch(/^[a-f0-9-]{36}\.webp$/); // client file name never reaches the filesystem
    const served = await request(app).get(res.body.url);
    expect(served.status).toBe(200);
    expect(served.headers['x-content-type-options']).toBe('nosniff');
  });

  it('rejects files whose content is not an image even if the MIME type says so', async () => {
    await makeUser('admin');
    const s = await loginAs(app, 'admin@example.com');
    const res = await s.agent.post('/api/admin/media').set('X-CSRF-Token', s.csrf).attach('file', Buffer.from('<?php echo 1; ?> not an image at all'), { filename: 'x.png', contentType: 'image/png' });
    expect(res.status).toBe(400);
  });

  it('rejects SVG and other disallowed types', async () => {
    await makeUser('admin');
    const s = await loginAs(app, 'admin@example.com');
    const res = await s.agent.post('/api/admin/media').set('X-CSRF-Token', s.csrf).attach('file', Buffer.from('<svg onload="alert(1)"/>'), { filename: 'x.svg', contentType: 'image/svg+xml' });
    expect(res.status).toBe(400);
  });

  it('marketing managers may upload; sales managers may not', async () => {
    await makeUser('sales_manager');
    const s = await loginAs(app, 'sales_manager@example.com');
    const res = await s.agent.post('/api/admin/media').set('X-CSRF-Token', s.csrf).attach('file', await png(), { filename: 'a.png', contentType: 'image/png' });
    expect(res.status).toBe(403);
  });
});

describe('platform hardening', () => {
  it('sets security headers and hides the framework', async () => {
    const res = await request(app).get('/healthz');
    expect(res.headers['x-powered-by']).toBeUndefined();
    expect(res.headers['content-security-policy']).toContain("default-src 'self'");
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-request-id']).toBeTruthy();
  });

  it('does not leak internals on errors', async () => {
    const res = await request(app).post('/api/admin/auth/login').set('Content-Type', 'application/json').send('{bad json');
    expect(res.status).toBe(400);
    expect(JSON.stringify(res.body)).not.toMatch(/SyntaxError|node_modules|at /);
  });

  it('rejects oversized request bodies', async () => {
    const res = await request(app).post('/api/public/leads').send({ message: 'x'.repeat(300_000) });
    expect(res.status).toBe(413);
  });

  it('CORS only allows approved origins', async () => {
    const ok = await request(app).get('/api/public/services').set('Origin', 'https://rsstack.test');
    expect(ok.headers['access-control-allow-origin']).toBe('https://rsstack.test');
    const bad = await request(app).get('/api/public/services').set('Origin', 'https://evil.example');
    expect(bad.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('unknown API routes return JSON 404', async () => {
    const res = await request(app).get('/api/nope');
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('not_found');
  });
});
