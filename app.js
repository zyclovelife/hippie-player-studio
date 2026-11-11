(function () {
  "use strict";
  var S = window.SITE, P = S.profile;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var LB = {}; // lightbox sets by id
  function roman(n) { n = +n; var r = "", m = [[10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]]; m.forEach(function (p) { while (n >= p[0]) { r += p[1]; n -= p[0]; } }); return r || "0"; }
  var SPK = function (c) { return '<i class="spk ' + c + '" aria-hidden="true"></i>'; };
  var RULE = '<div class="h-rule" aria-hidden="true"><i></i><b></b><i></i></div>';
  var EMBLEM = '<svg class="emblem" viewBox="0 0 120 144" aria-hidden="true">' +
    '<path d="M60 4 L110 18 V68 C110 104 88 126 60 140 C32 126 10 104 10 68 V18 Z" fill="#182918" stroke="#9db79b" stroke-width="1.6"/>' +
    '<path d="M60 11 L103 23 V68 C103 99 84 119 60 132 C36 119 17 99 17 68 V23 Z" fill="none" stroke="#c8b661" stroke-width=".8" stroke-opacity=".8"/>' +
    '<g fill="#9db79b" fill-opacity=".35"><path d="M28 40 l7 7 -7 7 -7 -7z"/><path d="M92 40 l7 7 -7 7 -7 -7z"/><path d="M28 86 l7 7 -7 7 -7 -7z"/><path d="M92 86 l7 7 -7 7 -7 -7z"/></g>' +
    '<g fill="none" stroke="#cfd1d0" stroke-width=".8" stroke-opacity=".55"><path d="M60 22 l6 6 -6 6 -6 -6z"/></g>' +
    '<path d="M82 40 C70 30 44 34 46 50 C48 64 76 62 76 80 C76 96 52 100 40 92" fill="none" stroke="#070807" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="M82 40 C70 30 44 34 46 50 C48 64 76 62 76 80 C76 96 52 100 40 92" fill="none" stroke="#6b8c68" stroke-width="4.4" stroke-linecap="round"/>' +
    '<path d="M82 40 C70 30 44 34 46 50 C48 64 76 62 76 80 C76 96 52 100 40 92" fill="none" stroke="#cfd1d0" stroke-width=".8" stroke-dasharray="1.2 2.6"/>' +
    '<path d="M80 36 c6 -6 15 -3 16 2 c-2 5 -11 7 -16 2z" fill="#6b8c68" stroke="#070807" stroke-width="1.6"/><circle cx="89" cy="37" r="1.1" fill="#e9da7f"/><path d="M96 39 l6 0 m-6 0 l5 3" stroke="#a88eb0" stroke-width="1" stroke-linecap="round"/>' +
    '<text x="61" y="119" text-anchor="middle" font-family="Cinzel,serif" font-weight="700" font-size="14" letter-spacing="2" fill="#e2e0d0">LZ</text>' +
    '<path d="M60 132 C60.6 129 61.4 128.4 64 128 C61.4 127.6 60.6 127 60 124 C59.4 127 58.6 127.6 56 128 C58.6 128.4 59.4 129 60 132Z" fill="#e9da7f"/></svg>';
  function band(words, cls) { var t = words.map(function (w) { return "<span>" + w + "</span><i>✦</i>"; }).join(""); return '<div class="band ' + (cls || "") + '" aria-hidden="true"><div class="band-in"><div class="band-tx">' + t + t + t + "</div></div></div>"; }

  function tags(t) { return t && t.length ? '<div class="tags">' + t.map(function (x) { return '<span class="chip">' + esc(x) + "</span>"; }).join("") + "</div>" : ""; }
  function pstats(st) { return st && st.length ? '<div class="pstats">' + st.map(function (s) { return "<div><b>" + esc(s.n) + "</b><span>" + esc(s.l) + "</span></div>"; }).join("") + "</div>" : ""; }
  function meta(p) {
    var a = [];
    if (p.period) a.push("<b>" + esc(p.period) + "</b>");
    if (p.role) a.push(esc(p.role));
    return a.length ? '<div class="meta">' + a.join("") + "</div>" : "";
  }

  function slides(setId, items, show) {
    var set = LB[setId] = LB[setId] || [];
    var lim = show || items.length;
    var h = '<div class="slides">';
    items.forEach(function (it, k) {
      var idx = set.length; set.push(it);
      h += '<figure class="slide' + (k >= lim ? " hide" : "") + '"><button type="button" class="gi sl" data-set="' + setId + '" data-i="' + idx + '" aria-label="' + esc(it.cap || "查看大图") + '">' +
        '<img loading="lazy" decoding="async" src="' + esc(it.thumb) + '" srcset="' + esc(it.thumb) + " " + (it.tw || 1280) + "w, " + esc(it.src) + " " + it.w + 'w" sizes="(max-width: 1240px) 100vw, 1200px" width="' + it.w + '" height="' + it.h + '" alt="' + esc(it.cap) + '" onload="this.classList.add(\'ok\')">' +
        '<span class="zoom-hint">⤢ 查看大图</span></button>' + (it.cap ? "<figcaption>" + esc(it.cap) + "</figcaption>" : "") + "</figure>";
    });
    h += "</div>";
    if (lim < items.length) h += '<button type="button" class="more">展开全部 ' + items.length + " 页 ↓</button>";
    return h;
  }

  function gallery(setId, items, show, layout) {
    if (!items || !items.length) return "";
    if (layout === "slides") return slides(setId, items, show);
    var set = LB[setId] = LB[setId] || [];
    var ar = items.reduce(function (s, i) { return s + (i.w || 4) / (i.h || 3); }, 0) / items.length;
    var wide = ar > 1.45 && items.length > 1;
    var single = items.length === 1;
    var lim = show || items.length;
    var h = '<div class="gal' + (wide || single ? " wide" : "") + '"' + (single ? ' style="columns:1;max-width:' + Math.min(items[0].w || 1200, ar > 1.2 ? 1400 : 560) + 'px"' : "") + ">";
    items.forEach(function (it, k) {
      var idx = set.length; set.push(it);
      var cls = "gi" + (k >= lim ? " hide" : "");
      var media = it.thumb || it.src || it.poster;
      var inner = media
        ? '<img loading="lazy" decoding="async" src="' + esc(media) + '" width="' + (it.w || 800) + '" height="' + (it.h || 600) + '" alt="' + esc(it.cap) + '" onload="this.classList.add(\'ok\')">'
        : '<div style="padding:30px;color:#aaa">' + esc(it.cap || "查看") + "</div>";
      if (it.link) h += '<a class="' + cls + '" href="' + esc(it.link) + '" target="_blank" rel="noopener">' + inner + "</a>";
      else h += '<button type="button" class="' + cls + '" data-set="' + setId + '" data-i="' + idx + '" aria-label="' + esc(it.cap || "查看大图") + '">' + inner + "</button>";
    });
    h += "</div>";
    if (lim < items.length) h += '<button type="button" class="more">展开全部 ' + items.length + " 张 ↓</button>";
    return h;
  }

  function project(p) {
    var h = '<article class="proj rv" id="p-' + esc(p.id) + '"><div class="proj-h"><div><h3>' + esc(p.title) + "</h3>" + meta(p) + tags(p.tags) + "</div>" + pstats(p.stats) + "</div>";
    h += body(p);
    return h + "</article>";
  }

  function body(p) {
    var h = "";
    if (p.points) h += '<ul class="points">' + p.points.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>";
    if (p.desc) h += '<p class="desc">' + esc(p.desc) + "</p>";
    if (p.brief) h += '<dl class="brief">' + p.brief.map(function (b) { return "<div><dt>" + esc(b.k) + "</dt><dd>" + esc(b.v) + "</dd></div>"; }).join("") + "</dl>";
    if (p.quote) h += '<blockquote class="quote">' + esc(p.quote.text) + "<cite>—— " + esc(p.quote.by) + "</cite></blockquote>";
    if (p.cast) h += '<div class="cast">' + p.cast.map(function (c) { return '<div class="cast-i"><b>' + esc(c.n) + "</b><span>" + esc(c.c) + "</span><p>" + esc(c.t) + "</p></div>"; }).join("") + "</div>";
    (p.groups || []).forEach(function (g) {
      if (!g.gallery || !g.gallery.length) return;
      var unit = g.layout === "slides" ? " 页" : " 张";
      h += '<div class="grp">' + (g.title ? "<h4>" + esc(g.title) + (g.en ? ' <em>' + esc(g.en) + "</em>" : "") + " <small>" + g.gallery.length + unit + "</small></h4>" : "") + (g.bio ? '<p class="grp-bio">' + esc(g.bio) + "</p>" : "") + gallery(p.id, g.gallery, g.show, g.layout) + "</div>";
    });
    return h;
  }

  function socials() {
    var L = P.socials || [];
    return L.length ? '<div class="soc" aria-label="我的自媒体主页"><em>工作室自媒体 · 点击直达</em><div class="soc-g">' + L.map(function (x) {
      return '<a class="soc-c" href="' + esc(x.url) + '" target="_blank" rel="noopener" style="--sc:' + esc(x.c || "var(--acc)") + '"><i>' + esc(x.p) + '</i><b>' + esc(x.n) + '</b><span>' + esc(x.d) + '</span><u aria-hidden="true">↗</u></a>';
    }).join("") + "</div></div>" : "";
  }
  function hero() {
    var img = P.heroImage && P.heroImage[0];
    return '<section class="hero" id="top">' +
      (img ? '<div class="hero-bg"><img src="' + esc(img.src) + '" alt="" fetchpriority="high"></div>' : "") + '<div class="hero-fx" aria-hidden="true"><i class="fx-arch"></i><i class="fx-ht"></i></div>' +
      '<div class="wrap"><div class="hero-top"><div class="hero-main"><div class="eyebrow">HIPPIE PLAYER STUDIO · ' + esc(P.city) + '</div>' +
      "<h1><span class=\"h1-cn\">" + esc(P.name) + '</span><span class="h1-en">' + esc(P.nameEn) + "</span></h1>" + RULE +
      '<div class="biz"><em>业务方向</em><div class="headline">' + P.headline.map(function (x) { return "<span>" + esc(x) + "</span>"; }).join("") + "</div></div>" +
      '<p class="intro st-intro">' + esc(P.intro) + "</p>" +
      '<ol class="st-track" aria-label="工作室履历">' + P.track.map(function (t) { return '<li><span class="tt">' + esc(t.t) + '</span><b>' + esc(t.h) + '</b><p>' + esc(t.d) + '</p></li>'; }).join("") + '</ol>' +
      '<p class="st-founder">' + esc(P.founder) + '</p>' +
      '<div class="hc-row" aria-label="联系方式"><a class="hc" href="tel:' + esc(P.phone) + '" title="点击拨打"><i>TEL</i><b>' + esc(P.phone) + '</b></a><a class="hc" href="mailto:' + esc(P.email) + '" title="发邮件"><i>MAIL</i><b>' + esc(P.email) + '</b></a><button type="button" class="hc" data-copy="' + esc(P.wechat) + '" title="点击复制微信号"><i>WECHAT</i><b>' + esc(P.wechat) + '</b><small>点击复制</small></button><span class="hc hc-city"><i>CITY</i><b>' + esc(P.city) + '</b></span></div>' +
      '<div class="hero-cta"><a class="btn" href="#chouma">看 AI 项目 →</a><a class="btn btn-ghost" href="#contact">联系我们</a></div></div>' +
      (P.photo ? '<figure class="st-mark"><img src="' + esc(P.photo.src) + '" alt="' + esc(P.photo.alt) + '"></figure>' : "") +
      '</div>' + socials() +
      "</div></section>";
  }

  function head(kicker, title, intro, years, num) {
    return '<div class="sec-head rv">' + (years ? '<div class="yrline"><span class="num" title="' + esc(num) + '">' + roman(num) + '</span><span class="yr">' + esc(years) + "</span></div>" : "") +
      '<div class="kicker">' + esc(kicker) + "</div><h2><span class=\"t\">" + esc(title) + "</span></h2>" + (intro ? "<p>" + esc(intro) + "</p>" : "") + "</div>";
  }
  function pendCard(p) {
    var hasG = p.gallery && p.gallery.length;
    return '<article class="nwc rv' + (p.pending ? " pending" : "") + '" id="p-' + esc(p.id) + '">' +
      (p.pending ? '<div class="badge">素材待补充</div>' : "") + (p.confirm ? '<div class="badge cf">归属待确认</div>' : "") +
      "<h3>" + esc(p.title) + "</h3>" + meta(p) + tags(p.tags) + pstats(p.stats) +
      (p.desc ? '<p class="desc" style="margin-top:12px">' + esc(p.desc) + "</p>" : "") +
      (hasG ? gallery(p.id, p.gallery, 6, p.layout) : (p.count ? '<div class="ph ph-n">' + Array.apply(null, Array(p.count)).map(function (_, i) { return "<span><b>" + ("0" + (i + 1)) + "</b>项目待补充</span>"; }).join("") + "</div>" : (p.pending ? '<div class="ph"><span>IMAGE</span><span>VIDEO</span><span>DATA</span></div>' : ""))) +
      (p.pending && p.todo ? '<div class="todo"><p>待补充</p><ul>' + p.todo.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>" : "") +
      "</article>";
  }
  function ipCase(ip, key) {
    var h = '<div class="case ipc">';
    h += '<div class="ipc-top"><p class="ipc-intro">' + esc(ip.intro) + '</p>' + (ip.slogans ? '<div class="ipc-slog">' + ip.slogans.map(function (x) { return '<span>“' + esc(x) + '”</span>'; }).join("") + '</div>' : "") + '</div>';
    if (ip.method) h += '<div class="case-block"><div class="case-lab">自动化运营方法</div><div class="ipc-method">' + ip.method.map(function (m, i) { return '<div class="ipc-m"><i>' + ("0" + (i + 1)) + '</i><b>' + esc(m.k) + '</b><p>' + esc(m.v) + '</p></div>'; }).join("") + '</div></div>';
    if (ip.videos && ip.videos.length) {
      h += '<div class="case-block"><div class="case-lab">运营视频 · ' + ip.videos.length + ' 条 · 点击播放</div><div class="vgrid">' + ip.videos.map(function (v) {
        return '<figure class="vcell"><video controls playsinline preload="none" poster="' + esc(v.poster || v.posterJpg) + '" width="' + (v.w || 480) + '" height="' + (v.h || 854) + '"><source src="' + esc(v.video) + '" type="video/mp4"></video><figcaption><b>' + esc(v.t) + '</b><span>' + esc(v.lab) + ' · ' + esc(v.dur) + '</span></figcaption></figure>';
      }).join("") + '</div></div>';
    }
    if (ip.dance) h += '<div class="case-block ipc-dance"><div class="case-lab">' + esc(ip.dance.title) + '</div><p>' + esc(ip.dance.lead) + '</p><ol class="ipc-steps">' + ip.dance.steps.map(function (st) { return '<li><b>' + esc(st.k) + '</b><span>' + esc(st.v) + '</span></li>'; }).join("") + '</ol></div>';
    (ip.groups || []).forEach(function (g, gi) {
      h += '<div class="case-block ipc-g' + (g.cols ? ' c' + g.cols : '') + '"><div class="case-lab">' + esc(g.title) + (g.en ? ' · ' + esc(g.en) : '') + ' · ' + g.gallery.length + ' 张</div>' + (g.bio ? '<p class="ipc-bio">' + esc(g.bio) + '</p>' : '') + gallery(key + '-g' + gi, g.gallery, g.show) + '</div>';
    });
    return h + '</div>';
  }
  function company(s, num) {
    var a = s.automation;
    return '<section class="sec co" id="' + esc(s.id) + '"><div class="wrap"><div class="co-box">' + head(s.kicker, s.title, "", s.years, num) +
      '<div class="co-top rv"><div><div class="co-org">' + esc(s.org) + '</div><div class="co-role">' + esc(s.role) + '</div><p class="co-intro">' + esc(s.intro) + "</p>" +
      (s.arc ? '<p class="co-arc"><b>成长路径</b> ' + esc(s.arc) + "</p>" : "") +
      (s.note ? '<p class="co-note">' + esc(s.note) + "</p>" : "") +
      "</div>" + pstats(s.stats) + "</div>" +
      (s.products && s.products.length ? '<div class="prods rv">' + s.products.map(function (pr) {
        var c = pr.case, pid = pr.name.split('·')[0].trim().toLowerCase().replace(/\s+/g, '-'), h = '<article class="prod' + (c || pr.ip ? ' prod-case' : '') + (pr.ip ? ' prod-ip' : '') + '" id="p-' + esc(pid) + '"><div class="prod-h"><b>' + esc(pr.name) + '</b><span>' + esc(pr.period) + '</span></div><div class="prod-tag">' + esc(pr.tag) + '</div><p>' + esc(pr.d) + '</p>' + (pr.link ? '<a class="prod-link" href="' + esc(pr.link) + '" target="_blank" rel="noopener">' + esc(pr.link.replace(/^https?:\/\//,'')) + ' ↗</a>' : '');
        if (c) {
          var setBase = 'snapme-' + (pr.name || 'case').replace(/\W+/g, '').slice(0, 12);
          h += '<div class="case"><h4>' + esc(c.title) + '</h4>';
          if (c.themes && c.themes.gallery && c.themes.gallery.length) {
            h += '<div class="case-block"><div class="case-lab">' + esc(c.themes.title) + ' · ' + c.themes.gallery.length + ' 张</div>' + gallery(setBase + '-th', c.themes.gallery, 8) + '</div>';
          }
          if (c.tech && c.tech.gallery && c.tech.gallery.length) {
            h += '<div class="case-block"><div class="case-lab">' + esc(c.tech.title) + '</div><div class="tech-row">';
            var set = LB[setBase + '-tech'] = LB[setBase + '-tech'] || [];
            c.tech.gallery.forEach(function (it, k) {
              var idx = set.length; set.push(it);
              h += '<button type="button" class="gi tech" data-set="' + setBase + '-tech" data-i="' + idx + '" aria-label="' + esc(it.cap) + '">' +
                '<img loading="lazy" decoding="async" src="' + esc(it.thumb) + '" width="' + it.w + '" height="' + it.h + '" alt="' + esc(it.cap) + '" onload="this.classList.add(\'ok\')">' +
                '<span class="tech-lab">' + esc(it.label || it.cap) + '</span></button>';
            });
            h += '</div></div>';
          }
          if (c.card) {
            var ex = c.card.example || {};
            h += '<div class="case-block"><div class="case-lab">' + esc(c.card.title) + '</div>';
            h += '<div class="ccard"><div class="ccard-fields">' + (c.card.fields || []).map(function (f) { return '<span>' + esc(f) + '</span>'; }).join('') + '</div>';
            h += '<div class="ccard-body"><div class="ccard-name">' + esc(ex.name || '') + '<i>' + esc(ex.role || '') + '</i></div>';
            h += '<div class="ccard-slogan">「' + esc(ex.slogan || '') + '」</div>';
            h += '<div class="ccard-sec"><b>Opening Scene</b><p>' + esc(ex.opening || '') + '</p></div>';
            h += '<div class="ccard-sec"><b>Life Story</b><p>' + esc(ex.life || '') + '</p></div>';
            h += '<div class="ccard-note">模板字段均为中英双语 · 示例节选</div></div></div></div>';
          }
          h += '</div>';
        }
        if (pr.ip) h += ipCase(pr.ip, 'ip-' + pid);
        return h + '</article>';
      }).join("") + "</div>" : "") +
      '<ol class="track rv">' + s.track.map(function (t) { return '<li><span class="tt">' + esc(t.t) + "</span><b>" + esc(t.h) + "</b><p>" + esc(t.d) + "</p></li>"; }).join("") + "</ol>" +
      '<div class="auto rv"><div><div class="kicker">AUTOMATION</div><h3>' + esc(a.title) + "</h3><p>" + esc(a.desc) + '</p><div class="tags">' + a.tools.map(function (x) { return '<span class="chip chip-acc">' + esc(x) + "</span>"; }).join("") + "</div></div>" +
      '<div class="flow">' + a.covers.map(function (x) { return "<span>" + esc(x) + "</span>"; }).join('<i>→</i>') + "</div></div>" +
      "</div></div></section>";
  }

  function workflow(s, num) {
    return '<section class="sec wf" id="' + esc(s.id) + '"><div class="wrap">' + head(s.kicker, s.title, s.intro, s.years, num) +
      '<div class="sys rv">' + s.systems.map(function (x) { return '<div class="sys-i"><b>' + esc(x.n) + "</b><p>" + esc(x.d) + "</p></div>"; }).join("") + "</div>" +
      '<div class="pipe rv" aria-label="多 Agent 自动化工作流">' + s.steps.map(function (st, i) {
        return '<div class="pipe-cell">' +
          (i ? '<div class="pipe-arr" aria-hidden="true">→</div>' : '<div class="pipe-arr spacer" aria-hidden="true"></div>') +
          '<div class="pipe-step' + (st.auto ? " auto" : "") + '"><div class="ps-top"><span class="ps-n">' + ("0" + (i + 1)).slice(-2) + "</span>" +
          (st.auto ? '<span class="ps-auto">AUTO</span>' : '<span class="ps-hand">手工</span>') + '</div><b class="ps-title">' + esc(st.t) + "</b><p>" + esc(st.d) + "</p>" +
          '<div class="ps-tools">' + st.tools.map(function (t) { return "<span>" + esc(t) + "</span>"; }).join("") + "</div></div></div>";
      }).join("") + "</div>" +
      (s.skills ? '<div class="wf-skills rv">' + s.skills.map(function (k) { return '<div class="sk"><b>' + esc(k.k) + '</b><p>' + esc(k.v) + '</p></div>'; }).join("") + '</div>' : "") + '<div class="glue rv"><span class="kicker">GLUE</span><b>' + esc(s.glue) + '</b><div class="tags">' + s.stack.map(function (t) { return '<span class="chip">' + esc(t) + "</span>"; }).join("") + "</div></div>" +
      "</div></section>";
  }

  function dramaflow(s, num) {
    var li = function (a) { return a.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join(""); };
    var h = '<section class="sec df" id="' + esc(s.id) + '"><div class="wrap">' + head(s.kicker, s.title, s.intro, s.years, num);
    h += '<div class="df-stats rv">' + s.stats.map(function (x) { return "<div><b>" + esc(x.n) + "</b><span>" + esc(x.l) + "</span></div>"; }).join("") + "</div>";
    h += '<div class="df-roles rv"><em>' + esc(s.rolesTitle || "角色") + '</em>' + s.roles.map(function (r) { return '<div class="df-role"><b>' + esc(r.k) + "</b><span>" + esc(r.v) + "</span></div>"; }).join("") + "</div>";
    if (s.demo || s.keyframes) {
      h += '<div class="qk-show rv' + (s.demo ? '' : ' nodemo') + '">';
      if (s.demo) h += '<figure class="qk-demo"><div class="case-lab">实际出片</div><video controls playsinline preload="none" poster="' + esc(s.demo.poster) + '" width="' + s.demo.w + '" height="' + s.demo.h + '"><source src="' + esc(s.demo.video) + '" type="video/mp4"></video><figcaption>' + esc(s.demo.cap) + '</figcaption></figure>';
      if (s.keyframes) h += '<div class="qk-kf"><div class="case-lab">' + esc(s.keyframes.title) + '</div>' + gallery("qk-kf", s.keyframes.gallery, s.keyframes.show) + '</div>';
      h += '</div>';
    }
    if (s.plan) {
      var tot = s.plan.segs.reduce(function (a, x) { return a + (x.n || 0); }, 0);
      h += '<div class="qk-plan rv"><div class="case-lab">' + esc(s.plan.title) + '</div><ol class="qk-segs">' + s.plan.segs.map(function (x) {
        return '<li class="' + (x.off ? "off" : "") + '" style="--n:' + (x.n || 3) + '"><span class="qp">' + esc(x.p) + '</span><b>' + esc(x.t) + '</b><span class="qn">' + (x.off ? "暂缓" : x.n + " 镜") + '</span><i class="qbar" aria-hidden="true"></i></li>';
      }).join("") + '</ol><p class="qk-note">合计 ' + tot + ' 镜 · ' + esc(s.plan.note) + '</p></div>';
    }
    // flowchart
    h += '<div class="df-flow rv" role="img" aria-label="三次迭代工作流程图">';
    s.stages.forEach(function (st, i) {
      if (i) { var t = s.triggers[i - 1]; h += '<div class="df-trig"><div class="df-trig-line" aria-hidden="true"></div><div class="df-trig-box"><i>触发</i><b>' + esc(t.why) + "</b><span>→ " + esc(t.then) + '</span></div><div class="df-trig-arr" aria-hidden="true"></div></div>'; }
      h += '<a class="df-node df-n' + (i + 1) + '" href="#df-' + esc(st.v) + '"><div class="df-nh"><span class="df-v">' + esc(st.v) + "</span><b>" + esc(st.name) + "</b></div><p>" + esc(st.sub) + '</p><ol class="df-chain">' +
        st.chain.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + '</ol><div class="df-key"><b>' + esc(st.key.n) + "</b><span>" + esc(st.key.l) + "</span></div></a>";
    });
    h += "</div>";
    // iteration cards
    s.stages.forEach(function (st, i) {
      if (i) { var t = s.triggers[i - 1]; h += '<div class="df-bridge rv"><i>' + esc(s.stages[i - 1].v) + " → " + esc(st.v) + "</i><b>「" + esc(t.why) + "」</b><span>" + esc(t.then) + "</span></div>"; }
      h += '<article class="df-card rv df-c' + (i + 1) + '" id="df-' + esc(st.v) + '"><div class="df-ch"><span class="df-v">' + esc(st.v) + "</span><div><h3>" + esc(st.name) + "</h3><p>" + esc(st.sub) + '</p></div><div class="df-key"><b>' + esc(st.key.n) + "</b><span>" + esc(st.key.l) + "</span></div></div>" +
        '<div class="df-cols"><div class="df-q"><h4>当时的问题</h4><p>' + esc(st.problem) + '</p></div><div class="df-d"><h4>关键决策</h4><ul class="points">' + li(st.decisions) + '</ul></div><div class="df-r"><h4>结果</h4><p>' + esc(st.result) + "</p></div></div>";
      if (st.skills) h += '<div class="df-sub"><h4>专项 skill 分工 <small>由两个主 skill 统一调度</small></h4><div class="df-skills">' + st.skills.map(function (k) { return "<div><code>" + esc(k.k) + "</code><span>" + esc(k.v) + "</span></div>"; }).join("") + "</div></div>";
      if (st.trace) h += '<div class="df-sub"><h4>逐镜追溯链 <small>每个镜号贯穿全程</small></h4><ol class="df-trace">' + st.trace.map(function (k) { return "<li>" + esc(k) + "</li>"; }).join("") + "</ol></div>";
      if (st.gallery && st.gallery.length) h += '<div class="df-sub df-gal"><h4>过程截图 <small>' + st.gallery.length + " 张 · 点击放大</small></h4>" + gallery("df-" + st.v, st.gallery) + "</div>";
      h += "</article>";
    });
    h += '<div class="df-ab rv"><div class="kicker">WHAT THIS PROVES</div><h3>这条工作流证明的四件事</h3><div class="df-abg">' + s.abilities.map(function (a, k) { return '<div class="df-abi"><span>' + ("0" + (k + 1)) + "</span><b>" + esc(a.k) + "</b><p>" + esc(a.v) + "</p></div>"; }).join("") + "</div></div>";
    return h + "</div></section>";
  }

  function about() {
    var A = S.about;
    return '<section class="sec" id="about"><div class="wrap">' + head("ABOUT ME", "关于我") +
      '<p class="about-lead rv">' + esc(A.lead) + "</p>" +
      '<div class="stats rv">' + A.stats.map(function (s) { return '<div class="stat"><b>' + esc(s.n) + "</b><span>" + esc(s.l) + "</span></div>"; }).join("") + "</div>" +
      '<div class="cols"><div class="rv"><h3>经历</h3><div class="tl">' +
      A.timeline.map(function (t) { return '<div class="tl-i"><div class="tl-t">' + esc(t.t) + '</div><div class="tl-o">' + esc(t.org) + "<span>" + esc(t.role) + '</span></div><div class="tl-d">' + esc(t.d) + "</div></div>"; }).join("") +
      '</div></div><div class="rv"><h3>技能</h3><div class="skills">' +
      A.skills.map(function (s) { return '<div class="sk"><b>' + esc(s.k) + "</b><p>" + esc(s.v) + "</p></div>"; }).join("") +
      "</div></div></div></div></section>";
  }

  function mediaCard(p) {
    var setId = "media-" + p.id;
    var h = '<article class="nwc media rv" id="p-' + esc(p.id) + '"><h3>' + esc(p.title) + "</h3>" + meta(p) + tags(p.tags) +
      (p.desc ? '<p class="desc" style="margin-top:12px">' + esc(p.desc) + "</p>" : "");
    if (p.highlight) h += '<div class="media-hi"><b>' + esc(p.highlight.n) + "</b><span>" + esc(p.highlight.l) + "</span></div>";
    if (p.accounts) h += '<div class="accs">' + p.accounts.map(function (a) {
      return (a.url ? '<a class="acc acc-l" href="' + esc(a.url) + '" target="_blank" rel="noopener">' : '<div class="acc">') + '<i>' + esc(a.p) + "</i>" + (a.handle ? '<em>@' + esc(a.handle) + "</em>" : "") + "<b>" + esc(a.n) + "</b>" + (a.d ? "<p>" + esc(a.d) + "</p>" : "") + (a.url ? '<span class="acc-go">打开主页 ↗</span></a>' : "</div>");
    }).join("") + "</div>";
    if (p.gallery && p.gallery.length) {
      h += '<div class="case-lab" style="margin-top:18px">数据截图 · 点击放大</div><div class="phone-row">';
      var set = LB[setId] = LB[setId] || [];
      p.gallery.forEach(function (it) {
        var idx = set.length; set.push(it);
        h += '<button type="button" class="gi phone" data-set="' + setId + '" data-i="' + idx + '" aria-label="' + esc(it.cap) + '">' +
          '<img loading="lazy" decoding="async" src="' + esc(it.thumb) + '" width="' + it.w + '" height="' + it.h + '" alt="' + esc(it.cap) + '" onload="this.classList.add(\'ok\')">' +
          '<span class="phone-cap">' + esc(it.cap) + "</span></button>";
      });
      h += "</div>";
    }
    return h + "</article>";
  }
  function gameCase(p) {
    if (!p.story) return "";
    var h = '<div class="gc">';
    h += '<div class="gc-top"><div class="gc-story"><div class="case-lab">故事</div>' + p.story.map(function (x) { return "<p>" + esc(x) + "</p>"; }).join("") + "</div>";
    if (p.teaser) h += '<figure class="gc-teaser"><video controls playsinline preload="metadata" poster="' + esc(p.teaser.posterJpg || p.teaser.poster) + '"><source src="' + esc(p.teaser.video) + '" type="video/mp4"></video><figcaption>' + esc(p.teaser.cap) + "</figcaption></figure>";
    h += "</div>";
    if (p.views) h += '<div class="gc-views"><div class="case-lab">' + esc(p.views.lead) + '</div><div class="gc-vg">' + p.views.items.map(function (v, i) { return '<div class="gc-v gc-v' + (i + 1) + '"><b>' + esc(v.k) + '</b><i aria-hidden="true">→</i><span>' + esc(v.v) + "</span></div>"; }).join("") + "</div>" + (p.views.tail ? '<p class="gc-tail">' + esc(p.views.tail) + "</p>" : "") + "</div>";
    if (p.play) h += '<div class="gc-play"><div class="case-lab">类型玩法</div><div class="gc-pt">' + p.play.map(function (x) { return "<span>" + esc(x) + "</span>"; }).join("") + "</div>" + (p.genre ? '<p class="gc-genre"><b>类型定位</b>' + esc(p.genre) + "</p>" : "") + "</div>";
    if (p.roster) { var nR = p.roster.reduce(function (s, f) { return s + f.items.length; }, 0); h += '<details class="gc-cast" open><summary><span class="case-lab">角色表</span><small>' + nR + ' 个角色 · 按阵营 · 标「有图集」的角色见下方角色画廊</small><i aria-hidden="true"></i></summary><div class="gc-fg">' + p.roster.map(function (f) { return '<div class="gc-f"><h5>' + esc(f.f) + ' <small>' + f.items.length + '</small></h5><ul>' + f.items.map(function (c) { return '<li' + (c.g ? ' class="has-g"' : '') + '><b>' + esc(c.n) + '</b>' + (c.g ? '<sup class="gc-g">有图集</sup>' : '') + (c.a ? '<em>' + esc(c.a) + '</em>' : '') + '<span class="gc-r">' + esc(c.r) + '</span><p>' + esc(c.d) + '</p></li>'; }).join("") + '</ul></div>'; }).join("") + '</div></details>'; }
    if (p.relations) {
      var setId = "gc-rel-" + p.id;
      var set = LB[setId] = LB[setId] || [];
      var r = p.relations;
      var idx = set.length; set.push({ src: r.src, thumb: r.thumb || r.src, w: r.w, h: r.h, cap: r.cap });
      h += '<figure class="gc-rel"><div class="case-lab">人物关系图</div><button type="button" class="gi gc-rel-btn" data-set="' + setId + '" data-i="' + idx + '" aria-label="' + esc(r.cap || "人物关系图") + '">' +
        '<img loading="lazy" decoding="async" src="' + esc(r.thumb || r.src) + '" width="' + (r.w || 1600) + '" height="' + (r.h || 1173) + '" alt="' + esc(r.cap || "人物关系图") + '" onload="this.classList.add(\'ok\')">' +
        '</button><figcaption>' + esc(r.cap || "人物关系图") + ' · 点击放大</figcaption></figure>';
    }
    if (p.mine) h += '<p class="gc-mine"><b>工作室负责</b>' + esc(p.mine) + "</p>";
    return h + "</div>";
  }
  function featCard(p) {
    return '<article class="proj feat rv' + (p.pending ? " pending-feat" : "") + '" id="p-' + esc(p.id) + '"><div class="proj-h"><div><div class="newtag">' + esc(p.newtag || "NEW") + '</div><h3>' + esc(p.title) + "</h3>" + (p.en ? '<div class="en">' + esc(p.en) + "</div>" : "") + meta(p) + tags(p.tags) + "</div>" + pstats(p.stats) + "</div>" +
      gameCase(p) + (p.story ? '<div class="ch-gal">' + body(p) + "</div>" : body(p)) +
      (p.pending ? '<div class="ph"><span>IMAGE</span><span>VIDEO</span><span>DATA</span></div>' + (p.todo ? '<div class="todo"><p>待补充</p><ul>' + p.todo.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>" : "") : "") +
      "</article>";
  }
  function works(s, num) {
    var media = s.items.filter(function (p) { return p.type === "media"; });
    var feats = s.items.filter(function (p) { return p.feature && !p.pending; });
    var pending = s.items.filter(function (p) { return p.type !== "media" && (p.pending || !p.feature); });
    return '<section class="sec" id="' + esc(s.id) + '"><div class="wrap">' + head(s.kicker, s.title, s.intro, s.years, num) +
      feats.map(featCard).join("") +
      (media.length ? '<div class="nw media-row" id="selfmedia">' + media.map(mediaCard).join("") + "</div>" : "") +
      (pending.length ? '<h3 class="nw-sub rv">整理中 · 素材陆续补充</h3><div class="nw' + (pending.length === 1 ? ' one' : '') + '">' + pending.map(function (p) { return p.feature ? featCard(p) : pendCard(p); }).join("") + "</div>" : "") +
      "</div></section>";
  }

  function section(s, num) {
    var h = '<section class="sec" id="' + esc(s.id) + '"><div class="wrap">' + head(s.kicker, s.title, s.intro, s.years, num) + (s.projects || []).map(project).join("");
    if (s.credits) {
      h += '<div class="credits rv"><h3>影视履历 · ' + s.credits.length + ' 部</h3><div class="cr">' + s.credits.map(function (c) {
        return '<div class="cr-i"><span class="y">' + esc(c.y) + '</span><span class="t">《' + esc(c.t) + "》" + (c.note ? "<small>" + esc(c.note) + "</small>" : "") + '</span><span class="r">' + esc(c.r) + "</span></div>";
      }).join("") + "</div></div>";
    }
    return h + "</div></section>";
  }

  function footer() {
    return '<footer class="foot" id="contact"><div class="wrap"><div class="foot-em" aria-hidden="true"><img class="foot-logo" src="' + esc(P.photo.src) + '" alt=""></div><div class="kicker">CONTACT · 嬉皮玩家工作室</div><h2 class="rv"><span>期待与您</span><em>合作。</em></h2><div class="foot-sign" aria-hidden="true">Stay Wild · Keep Creating</div>' +
      '<div class="cards"><a class="cc" href="tel:' + esc(P.phone) + '"><i>电话</i><b>' + esc(P.phone) + '</b><small>点击拨打</small></a>' +
      '<a class="cc" href="mailto:' + esc(P.email) + '"><i>邮箱</i><b>' + esc(P.email) + '</b><small>点击发邮件</small></a>' +
      '<button type="button" class="cc" data-copy="' + esc(P.wechat) + '"><i>微信</i><b>' + esc(P.wechat) + "</b><small>点击复制</small></button></div>" +
      '<p class="foot-city">工作室地点：' + esc(P.city) + ' · 联系人：LEO（张一驰）</p>' +
      '<p class="copy">© ' + new Date().getFullYear() + " 嬉皮玩家工作室 Hippie Player Studio · 作品版权归工作室及合作方所有</p></div></footer>";
  }

  // ---- render ----
  document.title = S.meta.title;

  var BANDS = [["Ride Hard", "Create Wild", "AI Interactive Drama", "Hangzhou", "The Creator"], ["Born in Chaos", "Raised by Pixels", "Serpent Mind", "Stay Wild"], ["Full Throttle", "Prompt · Render · Cut", "Night Rider", "Rock On"]];
  $("#app").innerHTML = hero() + band(BANDS[0], "b-a") + S.sections.map(function (s, i) {
    var num = ("0" + (i + 1)).slice(-2);
    return (i === 3 ? band(BANDS[1], "b-b") : i === 6 ? band(BANDS[2], "b-c") : "") + (s.type === "company" ? company(s, num) : s.type === "workflow" ? workflow(s, num) : s.type === "dramaflow" ? dramaflow(s, num) : s.type === "works" ? works(s, num) : section(s, num));
  }).join("") + footer();
  $("#navLinks").innerHTML = S.nav.map(function (n) { return '<a href="#' + n.id + '">' + esc(n.label) + (n.yr ? "<small>" + esc(n.yr) + "</small>" : "") + "</a>"; }).join("");
  

  // expand buttons
  document.addEventListener("click", function (e) {
    var m = e.target.closest(".more");
    if (m) { var g = m.previousElementSibling; g.querySelectorAll(".hide").forEach(function (x) { x.classList.remove("hide"); }); m.remove(); return; }
    var c = e.target.closest("[data-copy]");
    if (c) { copy(c.getAttribute("data-copy")); return; }
    var gi = e.target.closest(".gi[data-set]");
    if (gi) { openLB(gi.getAttribute("data-set"), +gi.getAttribute("data-i")); }
  });

  function toast(t) {
    var el = $(".toast") || document.body.appendChild(Object.assign(document.createElement("div"), { className: "toast" }));
    el.textContent = t; el.classList.add("on"); clearTimeout(el._t); el._t = setTimeout(function () { el.classList.remove("on"); }, 1800);
  }
  function copy(t) {
    var ok = function () { toast("已复制微信号：" + t); };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(t).then(ok, fb); else fb();
    function fb() { var a = document.createElement("textarea"); a.value = t; a.style.position = "fixed"; a.style.opacity = "0"; document.body.appendChild(a); a.select(); try { document.execCommand("copy"); ok(); } catch (e) { toast("微信号：" + t); } a.remove(); }
  }

  // ---- lightbox ----
  var lb = $("#lb"), lbM = $("#lbMedia"), lbC = $("#lbCap"), cur = null, ci = 0;
  function show() {
    var set = LB[cur], it = set[ci];
    lb.classList.remove("zoomed");
    lbM.innerHTML = it.video ? '<video src="' + esc(it.video) + '" poster="' + esc(it.poster || "") + '" controls playsinline autoplay></video>' : '<img src="' + esc(it.src) + '" alt="' + esc(it.cap) + '">';
    lbC.textContent = (it.cap ? it.cap + "　" : "") + (ci + 1) + " / " + set.length + (it.slide ? "　· 点击图片放大" : "");
    [ci - 1, ci + 1].forEach(function (k) { var n = set[(k + set.length) % set.length]; if (n && n.src) { var i = new Image(); i.src = n.src; } });
  }
  function openLB(set, i) { cur = set; ci = i; show(); lb.classList.add("on"); lb.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
  function close() { lb.classList.remove("on"); lb.setAttribute("aria-hidden", "true"); lbM.innerHTML = ""; document.body.style.overflow = ""; }
  function step(d) { var n = LB[cur].length; ci = (ci + d + n) % n; show(); }
  $(".lb-x").onclick = close; $(".lb-prev").onclick = function () { step(-1); }; $(".lb-next").onclick = function () { step(1); };
  lb.addEventListener("click", function (e) {
    if (e.target.tagName === "IMG" && e.target.parentNode === lbM) {
      var img = e.target, r = img.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height;
      var z = lb.classList.toggle("zoomed");
      if (z) requestAnimationFrame(function () { lbM.scrollLeft = fx * lbM.scrollWidth - lbM.clientWidth / 2; lbM.scrollTop = fy * lbM.scrollHeight - lbM.clientHeight / 2; });
      return;
    }
    if (e.target === lb || e.target.classList.contains("lb-fig")) close();
  });
  document.addEventListener("keydown", function (e) { if (!lb.classList.contains("on")) return; if (e.key === "Escape") close(); if (e.key === "ArrowLeft") step(-1); if (e.key === "ArrowRight") step(1); });
  var sx = 0, sy = 0;
  lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  lb.addEventListener("touchend", function (e) { if (lb.classList.contains("zoomed")) return; var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) step(dx < 0 ? 1 : -1); else if (dy > 90) close(); });

  // ---- reveal + nav highlight ----
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".rv").forEach(function (el) { io.observe(el); });
    var links = {}; document.querySelectorAll("#navLinks a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var so = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting && links[e.target.id]) { Object.keys(links).forEach(function (k) { links[k].classList.remove("on"); }); links[e.target.id].classList.add("on"); var a = links[e.target.id]; var nv = a.parentNode; if (nv.scrollWidth > nv.clientWidth + 2) { var ar = a.getBoundingClientRect(), nr2 = nv.getBoundingClientRect(); nv.scrollBy({ left: (ar.left - nr2.left) - (nr2.width - ar.width) / 2, behavior: "smooth" }); } } });
    }, { rootMargin: "-45% 0px -50% 0px" });
    S.nav.forEach(function (n) { var el = document.getElementById(n.id); if (el) so.observe(el); });
  } else document.querySelectorAll(".rv").forEach(function (el) { el.classList.add("in"); });
})();
