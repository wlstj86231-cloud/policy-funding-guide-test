// ================================================================
//  정책자금 백과 — Cloudflare Workers SSR + API
//  URL 구조: /소상공인-일반경영안정자금/ (slug 기반)
// ================================================================

const BASE = 'https://policyfundpedia.com';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const CAT_PAGES = {
    '전체-정책자금': {cat:null,title:'정책자금 전체 목록 2026',desc:'소상공인·창업·중소기업·고용·서민금융 등 정부 정책자금 전체 목록입니다.',h1:'정부 정책자금 전체 목록',keywords:'정책자금,정부지원금,소상공인 대출,창업자금,중소기업 대출',intro:'소상공인, 예비창업자, 중소기업, 고용주, 비사업자를 위한 정부 정책자금 전체 목록입니다.',faq:[]},
    '소상공인-정책자금': {
    cat: '소상공인',
    title: '소상공인 정책자금 종류 총정리 2026',
    desc: '소상공인을 위한 정부 정책자금 정보. 일반경영안정자금, 시설개선자금, 청년·여성·장애인 우대자금 등 종류별 한도·금리·신청방법을 확인하세요.',
    h1: '소상공인 정책자금 종류 및 신청 방법',
    keywords: '소상공인 정책자금,소상공인 대출,소진공 대출,소상공인시장진흥공단,소상공인 지원금,경영안정자금,소상공인 저금리 대출',
    intro: '소상공인시장진흥공단(소진공)이 운영하는 소상공인 정책자금은 담보 없이 신청 가능한 저금리 정책 융자입니다. 일반경영안정자금, 시설개선자금, 청년·여성·장애인 우대 자금 등 다양한 종류가 있으며 최대 1억원까지 연 2~3%대 금리로 지원됩니다.',
    faq: [
      ['소상공인 정책자금 신청 자격은?','사업자등록증을 보유한 소상공인이면 신청 가능합니다. 상시근로자 5인 미만(제조·건설·운수업은 10인 미만)이어야 합니다.'],
      ['소상공인 정책자금 금리는 얼마인가요?','분기별로 변동되며 일반적으로 연 2.5~3.5% 수준입니다. 청년·여성·장애인 등 특별자금은 우대 금리가 적용됩니다.'],
      ['소상공인 정책자금 어디서 신청하나요?','소상공인시장진흥공단 홈페이지(semas.or.kr) 온라인 신청 또는 전국 소진공 지역센터 방문 신청이 가능합니다.'],
    ],
  },
  '창업지원금-종류': {
    cat: '창업',
    title: '창업지원금 종류 및 신청방법 총정리 2026',
    desc: '예비창업자·초기창업자를 위한 정부 창업지원금 정보. 예비창업패키지, 청년창업사관학교, 창업도약패키지 등 종류별 지원금액·자격·신청방법 안내.',
    h1: '창업지원금 종류 및 신청 자격 총정리',
    keywords: '창업지원금,예비창업패키지,청년창업사관학교,창업도약패키지,K스타트업,창업 정부지원,창업 보조금',
    intro: 'K-스타트업과 창업진흥원이 운영하는 창업지원금은 예비창업자부터 창업 7년 이내 기업까지 단계별로 지원합니다. 상환 의무 없는 사업화 자금으로 최대 1억원 이상을 지원받을 수 있으며 매년 상·하반기에 모집합니다.',
    faq: [
      ['창업지원금은 상환해야 하나요?','대부분의 창업지원금(사업화 자금)은 지원금 형태로 상환 의무가 없습니다. 단, 창업기업 전용자금 등 융자형은 상환이 필요합니다.'],
      ['예비창업자도 창업지원금을 받을 수 있나요?','네. 예비창업패키지, 청년창업사관학교 등은 사업자등록 전 예비창업자도 신청 가능합니다.'],
      ['창업지원금 어디서 신청하나요?','K-스타트업(k-startup.go.kr)에서 공고를 확인하고 온라인으로 신청할 수 있습니다.'],
    ],
  },
  '중소기업-정책자금': {
    cat: '중소기업',
    title: '중소기업 정책자금 및 보증 지원 총정리 2026',
    desc: '중소기업을 위한 정부 정책자금 정보. 중진공 운전자금, 시설자금, 기보 기술보증, IP담보대출 등 종류별 한도·금리·신청방법을 확인하세요.',
    h1: '중소기업 정책자금 종류 및 신청 방법',
    keywords: '중소기업 정책자금,중진공 대출,기술보증기금,기보 보증,중소기업 지원,IP담보대출,중소기업 저금리 대출',
    intro: '중소벤처기업진흥공단(중진공)과 기술보증기금(기보)이 운영하는 중소기업 정책자금은 운전자금, 시설자금, R&D 자금, IP담보 대출 등 다양한 형태로 지원됩니다. 최대 30억원까지 연 2~3%대 장기 저금리로 이용할 수 있습니다.',
    faq: [
      ['중소기업 정책자금 신청 자격은?','중소기업기본법상 중소기업이면 신청 가능합니다. 업력, 매출액, 종업원 수 등에 따라 지원 자금 종류가 달라집니다.'],
      ['담보 없이 중소기업 대출을 받을 수 있나요?','네. 기술보증기금(기보)이나 신용보증기금(신보)에서 기술력·신용을 평가해 보증서를 발급받으면 담보 없이 금융기관 대출이 가능합니다.'],
      ['중소기업 정책자금 어디서 신청하나요?','중소벤처기업진흥공단(sbc.or.kr) 홈페이지 또는 지역본부를 방문해 신청할 수 있습니다.'],
    ],
  },
  '고용지원금-신청방법': {
    cat: '고용',
    title: '고용지원금 종류 및 신청방법 완벽 가이드 2026',
    desc: '사업주와 근로자를 위한 고용지원금 정보. 청년일자리도약장려금, 고용유지지원금, 육아휴직 지원금 등 종류별 지원금액·자격·신청방법 안내.',
    h1: '고용지원금 종류별 신청 방법 완벽 가이드',
    keywords: '고용지원금,청년일자리도약장려금,고용유지지원금,육아휴직지원금,고용24,사업주 지원금,고용 보조금',
    intro: '고용노동부와 고용24에서 운영하는 고용지원금은 직원을 채용하거나 고용을 유지하는 사업주에게 인건비 일부를 지원하는 제도입니다. 청년일자리도약장려금, 고용유지지원금, 육아휴직 지원금 등 다양한 종류가 있으며 고용24에서 신청할 수 있습니다.',
    faq: [
      ['고용지원금 신청 자격은?','고용보험에 가입된 사업장이면 대부분 신청 가능합니다. 지원금 종류별로 사업장 규모, 고용 형태 등 세부 요건이 다릅니다.'],
      ['고용지원금은 얼마나 받을 수 있나요?','청년일자리도약장려금의 경우 월 최대 80만원 × 최대 24개월을 지원받을 수 있습니다.'],
      ['고용지원금 어디서 신청하나요?','고용24(work24.go.kr)에서 온라인으로 신청하거나 가까운 고용노동부 고용센터를 방문해 신청할 수 있습니다.'],
    ],
  },
  '비사업자-서민금융': {
    cat: '비사업자',
    title: '비사업자 서민금융 대출 종류 총정리 2026',
    desc: '사업자등록이 없는 개인을 위한 서민금융 대출 정보. 햇살론, 청년 햇살론, 바꿔드림론, 소액생계비 대출 등 종류별 한도·금리·신청방법 안내.',
    h1: '비사업자 서민금융 대출 종류 및 신청 방법',
    keywords: '서민금융,햇살론,바꿔드림론,소액생계비대출,비사업자 대출,저신용 대출,청년햇살론,서민금융진흥원',
    intro: '서민금융진흥원이 운영하는 서민금융 대출 상품은 저신용·저소득으로 일반 금융기관 이용이 어려운 개인을 위한 정책 대출입니다. 햇살론, 청년 햇살론, 바꿔드림론, 소액생계비 대출 등 다양한 상품이 있으며 서민금융통합지원센터(1397)에서 상담받을 수 있습니다.',
    faq: [
      ['비사업자도 정부 대출을 받을 수 있나요?','네. 서민금융진흥원의 햇살론, 청년 햇살론, 소액생계비 대출 등은 사업자등록 없이도 신청 가능합니다.'],
      ['신용점수가 낮아도 서민금융 대출을 받을 수 있나요?','신용점수 하위 20% 이하이거나 기초생활수급자라면 미소금융, 소액생계비 대출 등을 이용할 수 있습니다.'],
      ['서민금융 대출 어디서 신청하나요?','서민금융진흥원(kinfa.or.kr) 홈페이지, 서민금융통합지원센터(1397) 전화 상담, 또는 농협·신협 등 제휴 금융기관에서 신청 가능합니다.'],
    ],
  },
};

export default {
  async fetch(request, env) {
    const url  = new URL(request.url);
    const path = decodeURIComponent(url.pathname).replace(/\/$/, '') || '/';

    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });

    // ── API 라우팅 ──
    if (path === '/sitemap.xml')        return handleSitemap(env);
    if (path.startsWith('/api/search')) return handleSearch(url, env);
    if (path.startsWith('/api/funds'))  return handleFunds(url, path, env);
    if (path.startsWith('/api/stats'))  return handleStats(env);

    // ── SSR 카테고리 페이지 ──
    const slug = path.replace(/^\//, '');
    if (CAT_PAGES[slug]) return handleCatPage(slug, env, url);

    // ── SSR 개별 상세 페이지 (slug 기반) ──
    // /funds/:id/ 구형 URL → slug 리다이렉트
    const fundsMatch = path.match(/^\/funds\/(\d+)$/);
    if (fundsMatch) {
      const row = await env.DB.prepare('SELECT slug FROM funds WHERE id=?').bind(parseInt(fundsMatch[1])).first();
      if (row?.slug) {
        return Response.redirect(`${BASE}/${row.slug}/`, 301);
      }
    }

    // slug URL로 직접 접근
    if (slug && !slug.includes('/')) {
      const row = await env.DB.prepare('SELECT * FROM funds WHERE slug=?').bind(slug).first();
      if (row) return handleDetailPage(parseRow(row), env);
    }

    // ── 지역별 페이지 (region_pages DB) ──
    if (slug && !slug.includes('/')) {
      const regionRow = await env.DB.prepare('SELECT * FROM region_pages WHERE slug=?').bind(slug).first();
      if (regionRow) return handleRegionPage(regionRow, env);
    }

    // ── 나머지는 Pages 패스스루 ──
    return fetch(request);
  }
};

// ─────────────────────────────────────
//  카테고리 SSR 페이지
// ─────────────────────────────────────
async function handleCatPage(slug, env, url) {
  const meta  = CAT_PAGES[slug];
    const q=(url.searchParams?.get('q')||'').trim();const like='%'+q+'%';const funds=q?(meta.cat?await env.DB.prepare('SELECT * FROM funds WHERE cat=? AND (title LIKE ? OR excerpt LIKE ?) ORDER BY id').bind(meta.cat,like,like).all():await env.DB.prepare('SELECT * FROM funds WHERE (title LIKE ? OR excerpt LIKE ?) ORDER BY id').bind(like,like).all()):(meta.cat?await env.DB.prepare('SELECT * FROM funds WHERE cat=? ORDER BY id').bind(meta.cat).all():await env.DB.prepare('SELECT * FROM funds ORDER BY id').all());const regionRows=q&&!meta.cat?(await env.DB.prepare('SELECT slug,region,type_name,title,description FROM region_pages WHERE (region LIKE ? OR title LIKE ? OR type_name LIKE ?) ORDER BY region,type LIMIT 20').bind(like,like,like).all()).results||[]:[];
  const items = (funds.results || []).map(parseRow);

  const faqSchema = meta.faq.map(([q,a]) =>
    `{"@type":"Question","name":"${esc(q)}","acceptedAnswer":{"@type":"Answer","text":"${esc(a)}"}}`
  ).join(',');

  const faqHtml = meta.faq.map(([q,a]) =>
    `<div class="faq-item"><div class="faq-q">Q. ${q}</div><div class="faq-a">A. ${a}</div></div>`
  ).join('');

  const cardsHtml = items.map(f =>
    `<a href="/${f.slug}/" class="fcard-link">
      <div class="fcard">
        <div class="fc-tags">${(f.tags||[]).map(t=>`<span class="tag ${t.c}">${t.t}</span>`).join('')}<span class="tag torg">${f.org}</span></div>
        <div class="fc-title">${f.title}</div>
        <div class="fc-desc">${f.excerpt}</div>
        <div class="fc-meta">
          <span class="fm">한도 <b>${f.lim}</b></span>
          <span class="fm">금리 <b>${f.rate}</b></span>
          <span class="fm-more">자세히 보기 →</span>
        </div>
      </div>
    </a>`
  ).join('');

  const otherLinks = Object.entries(CAT_PAGES).filter(([s])=>s!==slug)
    .map(([s,m])=>`<a href="/${s}/" class="rel-link">${m.cat}</a>`).join('');

  return html(pageShell({
    title: `${meta.title} | 정책자금 백과`,
    desc: meta.desc, keywords: meta.keywords,
    canonical: `${BASE}/${slug}/`, faqSchema,
    breadcrumb: [['홈',`${BASE}/`],[meta.cat,`${BASE}/${slug}/`]],
    body: `
      <div class="cat-hero">
        <div class="cat-badge">${meta.cat||'전체'} 정책자금</div>
        <h1>${meta.h1}</h1>
        <p class="cat-intro">${meta.intro}</p>
      </div>
      <div class="fund-list">
        <div class="sec-head"><span class="sec-name">${q?`"${esc(q)}" 검색 결과`:`${meta.cat||'전체'} 지원 정보`}</span><span class="sec-cnt">${items.length}건</span></div>
                ${regionRows.length?`<div class="sec-head" style="margin-top:24px"><span class="sec-name">지역별 정책자금</span><span class="sec-cnt">${regionRows.length}건</span></div>${regionRows.map(r=>`<a href="/${esc(r.slug)}/" class="fcard-link"><div class="fcard"><div class="fc-tags"><span class="tag tb">${esc(r.region)}</span><span class="tag tk">${esc(r.type_name)}</span></div><div class="fc-title">${esc(r.title)}</div><div class="fc-desc">${esc(r.description||'')}</div></div><span class="fcard-arr">자세히 보기 →</span></a>`).join('')}`:''}

        
      </div>
      <div class="faq-section"><h2>자주 묻는 질문</h2>${faqHtml}</div>
      <div class="rel-cats">
        <div class="rel-title">다른 정책자금 정보</div>
        <div class="rel-links"><a href="/" class="rel-link">전체 보기</a>${otherLinks}</div>
      </div>`
  }));
}

// ─────────────────────────────────────
//  개별 상세 SSR 페이지 (slug 기반)
// ─────────────────────────────────────
async function handleDetailPage(f, env) {
  const catSlug = Object.entries(CAT_PAGES).find(([,m])=>m.cat===f.cat)?.[0]||'';

  const related = await env.DB.prepare(
    'SELECT id,title,org,tags,slug FROM funds WHERE cat=? AND id!=? LIMIT 4'
  ).bind(f.cat, f.id).all();

  const stepsHtml = (f.steps||[]).map((s,i)=>
    `<div class="step-item"><span class="step-n">${i+1}</span><span class="step-t">${s}</span></div>`
  ).join('');

  const relatedHtml = (related.results||[]).map(r=>{
    const tags = tryParse(r.tags,[]);
    return `<a href="/${r.slug}/" class="rel-card">
      <span class="tag ${tags[0]?.c||'tb'}">${tags[0]?.t||''}</span>
      <span class="rel-card-title">${r.title}</span>
    </a>`;
  }).join('');

  const faqSchema = `{"@type":"Question","name":"${esc(f.title)} 신청 방법은?","acceptedAnswer":{"@type":"Answer","text":"${esc(f.target_desc)}. 필요서류: ${esc(f.docs)}"}}`;

  return html(pageShell({
    title: `${f.title} | 정책자금 백과`,
    desc: `${f.excerpt} 지원 대상: ${f.target_desc}. 한도: ${f.lim}. 금리: ${f.rate}.`,
    keywords: `${f.title},${f.cat} 정책자금,${f.org},${(f.tags||[]).map(t=>t.t).join(',')}`,
    canonical: `${BASE}/${f.slug}/`, faqSchema,
    breadcrumb: [['홈',`${BASE}/`],[f.cat,`${BASE}/${catSlug}/`],[f.title.split('—')[0].trim(),`${BASE}/${f.slug}/`]],
    body: `
      <div class="d-card">
        <div class="d-top">
          <div class="breadcrumb-nav">
            <a href="/">홈</a> › <a href="/${catSlug}/">${f.cat}</a> › <span>${f.title.split('—')[0].trim()}</span>
          </div>
          <div class="d-tags">${(f.tags||[]).map(t=>`<span class="tag ${t.c}">${t.t}</span>`).join('')}</div>
          <h1 class="d-title">${f.title}</h1>
          <p class="d-desc">${f.detail}</p>
        </div>
        <div class="d-summary">
          <div class="d-si"><div class="d-sl">지원 한도</div><div class="d-sv">${f.lim}</div></div>
          <div class="d-si"><div class="d-sl">금리 / 지원</div><div class="d-sv">${f.rate}</div></div>
          <div class="d-si"><div class="d-sl">담당 기관</div><div class="d-sv ink">${f.org}</div></div>
        </div>
        <div class="d-body">
          <div class="d-stitle">지원 내용</div>
          <div class="info-rows">
            <div class="info-row"><span class="info-k">지원 대상</span><span class="info-v">${f.target_desc}</span></div>
            <div class="info-row"><span class="info-k">지원 금액</span><span class="info-v">${f.amount_desc}</span></div>
            <div class="info-row"><span class="info-k">금리·지원</span><span class="info-v">${f.rate_desc}</span></div>
            <div class="info-row"><span class="info-k">지원 기간</span><span class="info-v">${f.period_desc}</span></div>
            <div class="info-row"><span class="info-k">필요 서류</span><span class="info-v">${f.docs}</span></div>
          </div>
          <div class="d-stitle">신청 절차</div>
          <div class="step-list">${stepsHtml}</div>
          <a class="official-btn" href="${f.agency}" target="_blank" rel="noopener">
            <div class="ob-text">
              <strong>${f.agency_name} 공식 사이트에서 신청하기 ↗</strong>
              <span>${f.agency_note}</span>
            </div>
          </a>
        </div>
        ${relatedHtml?`<div class="related-sec"><div class="related-title">같은 카테고리 다른 정보</div><div class="rel-cards">${relatedHtml}</div></div>`:''}
      </div>`
  }));
}

// ─────────────────────────────────────
//  API
// ─────────────────────────────────────
async function handleFunds(url, path, env) {
  const parts = path.split('/').filter(Boolean);
  if (parts.length === 3) {
    const id  = parseInt(parts[2]);
    if (isNaN(id)) return json({error:'Invalid id'},400);
    const row = await env.DB.prepare('SELECT * FROM funds WHERE id=?').bind(id).first();
    if (!row) return json({error:'Not found'},404);
    return json(parseRow(row));
  }
  const cat   = url.searchParams.get('cat')||'';
  const limit = parseInt(url.searchParams.get('limit')||'100');
  let q = 'SELECT * FROM funds'; const params=[];
  if (cat) { q+=' WHERE cat=?'; params.push(cat); }
  q+=' ORDER BY cat,id LIMIT ?';
  const rows  = await env.DB.prepare(q).bind(...params,limit).all();
  const total = await env.DB.prepare(cat?'SELECT COUNT(*) as cnt FROM funds WHERE cat=?':'SELECT COUNT(*) as cnt FROM funds').bind(...(cat?[cat]:[])).first();
  return json({total:total?.cnt||0, items:(rows.results||[]).map(parseRow)});
}

async function handleSearch(url, env) {
  const q=(url.searchParams.get('q')||'').trim();
  if (!q) return json({items:[]});
  const like=`%${q}%`;
  const rows=await env.DB.prepare('SELECT * FROM funds WHERE title LIKE ? OR excerpt LIKE ? OR org LIKE ? OR cat LIKE ? OR detail LIKE ? LIMIT 30').bind(like,like,like,like,like).all();
  return json({q, total:rows.results?.length||0, items:(rows.results||[]).map(parseRow)});
}

async function handleStats(env) {
  const rows=await env.DB.prepare('SELECT cat,COUNT(*) as cnt FROM funds GROUP BY cat').all();
  const total=await env.DB.prepare('SELECT COUNT(*) as cnt FROM funds').first();
  return json({total:total?.cnt||0, cats:rows.results||[]});
}

async function handleSitemap(env) {
  const today=new Date().toISOString().slice(0,10);
  const funds=await env.DB.prepare('SELECT slug FROM funds WHERE slug IS NOT NULL ORDER BY id').all();
  const regions=await env.DB.prepare('SELECT slug FROM region_pages ORDER BY slug').all();
  const urls=[
    `<url><loc>${BASE}/</loc><lastmod>${today}</lastmod><changefreq>daily</changefreq><priority>1.0</priority></url>`,
    ...Object.keys(CAT_PAGES).map(s=>`<url><loc>${BASE}/${s}/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.9</priority></url>`),
    ...(funds.results||[]).map(f=>`<url><loc>${BASE}/${f.slug}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`),
    ...(regions.results||[]).map(r=>`<url><loc>${BASE}/${r.slug}/</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`),
  ];
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`,
    {headers:{'Content-Type':'application/xml',...CORS}});
}

// ─────────────────────────────────────
//  HTML 쉘
// ─────────────────────────────────────
function pageShell({title,desc,keywords,canonical,faqSchema,breadcrumb,body}) {
  const bcSchema = breadcrumb.map(([name,url],i)=>
    `{"@type":"ListItem","position":${i+1},"name":"${name}","item":"${url}"}`
  ).join(',');

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<meta name="theme-color" content="#0f172a">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="keywords" content="${keywords}">
<meta name="robots" content="index,follow">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="정책자금 백과">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="ko_KR">
<script type="application/ld+json">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[${faqSchema}]}</script>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[${bcSchema}]}</script>
<style>
@font-face{font-family:'A2z';src:url('https://cdn.jsdelivr.net/gh/projectnoonnu/2601-6@1.0/에이투지체-4Regular.woff2') format('woff2');font-weight:400;font-display:swap}
@font-face{font-family:'A2z';src:url('https://cdn.jsdelivr.net/gh/projectnoonnu/2601-6@1.0/에이투지체-7Bold.woff2') format('woff2');font-weight:700;font-display:swap}
:root{--ink:#0f172a;--ink2:#334155;--ink3:#64748b;--ink4:#94a3b8;--sur:#f8f7f5;--sur2:#f1efe9;--white:#fff;--line:rgba(15,23,42,.07);--line2:rgba(15,23,42,.13);--blue:#1a56db;--blue-bg:#eff5ff;--blue-t:#1e429f;--green-bg:#f0fdf4;--green-t:#166534;--amber-bg:#fffbeb;--amber-t:#92400e;--red-bg:#fff1f2;--red-t:#9f1239;--pur-bg:#f5f3ff;--pur-t:#5b21b6;--r:8px;--r2:14px}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'A2z','Noto Sans KR',sans-serif;background:var(--sur);color:var(--ink);line-height:1.75}
a{color:inherit;text-decoration:none}
header{position:sticky;top:0;z-index:100;background:rgba(255,255,255,.92);backdrop-filter:blur(14px);border-bottom:1px solid var(--line)}
.h-top{max-width:1080px;margin:0 auto;padding:0 24px;height:60px;display:flex;align-items:center;gap:16px}
.logo{display:flex;flex-direction:column;cursor:pointer;flex-shrink:0}
.logo-main{font-size:18px;font-weight:700;color:var(--ink);letter-spacing:-.4px}.logo-main span{color:var(--blue)}
.logo-sub{font-size:10px;color:var(--ink4);text-transform:uppercase;letter-spacing:.3px}
.h-nav{display:flex;align-items:center;gap:2px;margin-left:auto}
.h-nav a{font-size:14px;color:var(--ink3);padding:6px 11px;border-radius:6px;transition:all .15s}
.h-nav a:hover{color:var(--ink);background:var(--sur2)}
.page{max-width:1080px;margin:0 auto;padding:28px 24px 80px}
.breadcrumb-nav{font-size:12px;color:var(--ink4);margin-bottom:12px}.breadcrumb-nav a{color:var(--blue)}
.cat-hero{background:var(--white);border:1px solid var(--line);border-radius:var(--r2);padding:28px;margin-bottom:24px}
.cat-badge{display:inline-flex;background:var(--blue-bg);color:var(--blue-t);font-size:12px;font-weight:600;padding:4px 12px;border-radius:12px;margin-bottom:12px}
h1{font-size:24px;font-weight:700;color:var(--ink);line-height:1.4;margin-bottom:12px;letter-spacing:-.4px}
.cat-intro{font-size:14px;color:var(--ink3);line-height:1.8;max-width:680px}
.fund-list{margin-bottom:32px}
.sec-head{display:flex;align-items:baseline;gap:8px;margin-bottom:12px}
.fcard-link{display:flex!important;justify-content:space-between;align-items:center;border:1px solid var(--line);border-radius:8px;padding:20px 24px;margin-bottom:8px;background:var(--white);transition:border-color .13s;color:inherit;text-decoration:none}.fcard-link:hover{border-color:var(--line2)}.fcard-arr{font-size:13px;color:var(--blue);white-space:nowrap;flex-shrink:0;margin-left:20px;font-weight:500}
.fcard-link{display:flex;justify-content:space-between;align-items:center;border:1px solid var(--line);border-radius:8px;padding:20px 24px;margin-bottom:8px;background:var(--white);transition:border-color .13s;text-decoration:none;color:inherit}.fcard-link:hover{border-color:var(--line2)}.fcard-arr{font-size:13px;color:var(--blue);white-space:nowrap;flex-shrink:0;margin-left:20px}
.fcard{background:var(--white);border-radius:var(--r);padding:18px 20px;margin-bottom:2px;border:1px solid transparent;transition:border-color .15s,box-shadow .15s}
.fcard:hover{border-color:var(--line2);box-shadow:0 2px 14px rgba(15,23,42,.07)}
.fc-tags{display:flex;gap:5px;flex-wrap:wrap;margin-bottom:8px}
.tag{display:inline-flex;align-items:center;font-size:12px;font-weight:600;padding:3px 8px;border-radius:4px}
.tb{background:var(--blue-bg);color:var(--blue-t)}.tg{background:var(--green-bg);color:var(--green-t)}.ta{background:var(--amber-bg);color:var(--amber-t)}.tr{background:var(--red-bg);color:var(--red-t)}.tp{background:var(--pur-bg);color:var(--pur-t)}.torg{background:var(--sur2);color:var(--ink3)}
.fc-title{font-size:15px;font-weight:700;color:var(--ink);line-height:1.45;margin-bottom:6px}
.fcard:hover .fc-title{color:var(--blue)}
.fc-desc{font-size:13px;color:var(--ink3);line-height:1.65;margin-bottom:11px}
.fc-meta{display:flex;gap:16px;align-items:center}.fm{font-size:12px;color:var(--ink4)}.fm b{color:var(--ink2);font-weight:500}.fm-more{margin-left:auto;font-size:12px;color:var(--blue);font-weight:600}
.faq-section{background:var(--white);border:1px solid var(--line);border-radius:var(--r2);padding:24px 28px;margin-bottom:24px}
.faq-section h2{font-size:16px;font-weight:700;color:var(--ink);margin-bottom:16px;padding-bottom:12px;border-bottom:2px solid var(--blue)}
.faq-item{border:1px solid var(--line);border-radius:var(--r);padding:16px 20px;margin-bottom:10px}
.faq-q{font-size:14px;font-weight:700;color:var(--ink);margin-bottom:6px}.faq-a{font-size:13px;color:var(--ink3);line-height:1.75}
.rel-cats{background:var(--sur2);border-radius:var(--r2);padding:20px 24px;margin-bottom:24px}
.rel-title{font-size:13px;font-weight:700;color:var(--ink3);margin-bottom:12px}
.rel-links{display:flex;flex-wrap:wrap;gap:8px}
.rel-link{font-size:13px;color:var(--ink2);background:var(--white);border:1.5px solid var(--line2);padding:6px 14px;border-radius:16px;transition:all .15s}
.rel-link:hover{border-color:var(--blue);color:var(--blue)}
.d-card{background:var(--white);border-radius:var(--r2);overflow:hidden;border:1px solid var(--line)}
.d-top{padding:26px 26px 22px;border-bottom:1px solid var(--line)}
.d-tags{display:flex;gap:5px;margin-bottom:10px}
.d-title{font-size:22px;font-weight:700;color:var(--ink);line-height:1.38;margin-bottom:10px;letter-spacing:-.5px}
.d-desc{font-size:14px;color:var(--ink3);line-height:1.75}
.d-summary{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid var(--line)}
.d-si{padding:18px 22px;border-right:1px solid var(--line)}.d-si:last-child{border-right:none}
.d-sl{font-size:11px;color:var(--ink4);letter-spacing:.4px;text-transform:uppercase;margin-bottom:6px}
.d-sv{font-size:19px;font-weight:700;color:var(--blue)}.d-sv.ink{color:var(--ink);font-size:15px}
.d-body{padding:24px 26px}
.d-stitle{font-size:12px;font-weight:700;color:var(--ink4);letter-spacing:.8px;text-transform:uppercase;margin:22px 0 12px;padding-top:22px;border-top:1px solid var(--line)}
.d-stitle:first-child{margin-top:0;padding-top:0;border-top:none}
.info-rows{display:flex;flex-direction:column}
.info-row{display:flex;border-bottom:1px solid var(--line);padding:11px 0}.info-row:last-child{border-bottom:none}
.info-k{width:110px;flex-shrink:0;font-size:13px;color:var(--ink3)}.info-v{flex:1;font-size:13px;color:var(--ink);line-height:1.7}
.step-list{display:flex;flex-direction:column;gap:10px}
.step-item{display:flex;gap:12px;align-items:flex-start}
.step-n{width:22px;height:22px;border-radius:50%;background:var(--blue);color:#fff;font-size:11px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
.step-t{font-size:13px;color:var(--ink2);line-height:1.65}
.official-btn{display:flex;align-items:center;background:var(--blue-bg);border:1px solid rgba(26,86,219,.15);border-radius:var(--r);padding:14px 18px;margin-top:20px;transition:background .15s;width:100%;text-align:left}
.official-btn:hover{background:#dce9fd}
.ob-text strong{display:block;font-size:13px;font-weight:700;color:var(--blue-t)}.ob-text span{font-size:12px;color:var(--ink3)}
.related-sec{padding:20px 26px;background:var(--sur);border-top:1px solid var(--line)}
.related-title{font-size:11px;font-weight:700;color:var(--ink4);letter-spacing:.6px;text-transform:uppercase;margin-bottom:10px}
.rel-cards{display:flex;flex-direction:column;gap:6px}
.rel-card{display:flex;align-items:center;gap:8px;padding:9px 12px;background:var(--white);border:1px solid var(--line);border-radius:var(--r);transition:border-color .15s}.rel-card:hover{border-color:var(--blue)}
.rel-card-title{font-size:13px;color:var(--ink)}
.c-strip{background:#0f172a;color:#fff;height:46px;display:flex;align-items:center}.c-strip-in{max-width:1080px;margin:0 auto;padding:0 24px;width:100%;display:flex;align-items:center;justify-content:space-between;gap:16px}.c-strip-label{font-size:14px;color:rgba(255,255,255,.55);display:flex;align-items:center;gap:9px}.c-strip-label strong{color:rgba(255,255,255,.92);font-weight:700;font-size:14px}.c-dot{width:6px;height:6px;border-radius:50%;background:#4ade80;animation:blink 2s infinite;flex-shrink:0}@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}.btn-strip{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.22);color:rgba(255,255,255,.9);font-size:13px;font-weight:600;padding:6px 16px;border-radius:14px;text-decoration:none;white-space:nowrap;transition:background .15s}.btn-strip:hover{background:rgba(255,255,255,.22)}.ad-label{font-size:10px;color:rgba(255,255,255,.3);letter-spacing:.5px;flex-shrink:0}.pnav{background:var(--white);border-bottom:1px solid var(--line);overflow-x:auto;scrollbar-width:none}.pnav::-webkit-scrollbar{display:none}.pnav-in{max-width:1080px;margin:0 auto;padding:0 24px;display:flex;align-items:center;gap:0}.pnav-back{display:flex;align-items:center;gap:5px;font-size:13px;color:var(--ink3);padding:10px 14px 10px 0;margin-right:8px;border-right:1px solid var(--line);cursor:pointer;white-space:nowrap;text-decoration:none;transition:color .13s;flex-shrink:0}.pnav-back:hover{color:var(--blue)}.pnav-back svg{width:14px;height:14px}
.pnt{font-size:13.5px;color:var(--ink3);padding:11px 14px;white-space:nowrap;border-bottom:2.5px solid transparent;text-decoration:none;flex-shrink:0;font-weight:500;transition:color .13s}.pnt:hover{color:var(--ink)}.pnt.on{color:var(--blue);border-bottom-color:var(--blue);font-weight:700}.pnt-region{color:var(--blue)}footer{background:var(--white);border-top:1px solid var(--line);padding:28px 24px}
.pnav{background:var(--white);border-bottom:1px solid var(--line);overflow-x:auto;scrollbar-width:none;position:sticky;top:57px;z-index:90}.pnav::-webkit-scrollbar{display:none}.pnav-in{max-width:1080px;margin:0 auto;padding:0 20px;display:flex;align-items:center;gap:0}.pnav-back{display:flex;align-items:center;gap:5px;color:var(--ink3);font-size:13px;padding:10px 14px 10px 8px;border-right:1px solid var(--line);margin-right:4px;cursor:pointer;white-space:nowrap;text-decoration:none;flex-shrink:0;transition:color .13s}.pnav-back:hover{color:var(--blue)}.pnav-back svg{width:14px;height:14px;flex-shrink:0}.pnav-tab{font-size:13px;color:var(--ink3);padding:10px 13px;white-space:nowrap;border-bottom:2px solid transparent;cursor:pointer;user-select:none;flex-shrink:0;font-weight:500;text-decoration:none;transition:color .13s;display:block}.pnav-tab:hover{color:var(--ink)}.pnav-tab.cur{color:var(--blue);border-bottom-color:var(--blue);font-weight:700}.foot-in{max-width:1080px;margin:0 auto;display:flex;flex-direction:column;gap:10px}
.foot-links{display:flex;flex-wrap:wrap;gap:6px 20px;justify-content:center}
.foot-links a{font-size:12px;color:var(--ink4)}.foot-links a:hover{color:var(--blue)}
.foot-copy{font-size:12px;color:var(--ink4);text-align:center}
.foot-notice{font-size:11px;color:var(--ink4);text-align:center;line-height:1.7;max-width:680px;margin:0 auto}
@media(max-width:768px){.h-nav{display:none}.h-top{padding:0 14px;height:50px}.logo-main{font-size:16px}.logo-sub{font-size:9px}.c-strip{height:38px;padding:0 12px}.c-strip-in{font-size:12px;gap:6px}.btn-strip{font-size:11px;padding:4px 10px}.pnav-in{padding:0 10px}.pnav-back{font-size:11px;padding:8px 8px 8px 0;margin-right:4px}.pnt{font-size:11px;padding:8px 8px}.page{padding:12px 12px 40px}.cat-hero{padding:14px 14px 12px;margin-bottom:12px}.cat-badge{font-size:10px;margin-bottom:5px}.d-title{font-size:18px;margin-bottom:5px;line-height:1.3}.cat-intro{font-size:12.5px;line-height:1.55}.d-summary{grid-template-columns:repeat(3,1fr)}.d-si{padding:10px 8px}.d-sl{font-size:10px;margin-bottom:2px}.d-sv{font-size:13px}.fund-list{margin-bottom:12px}.fcard-link{padding:11px 12px;margin-bottom:6px}.fcard-arr{font-size:11px;margin-left:6px}.fc-title{font-size:13px;margin-bottom:2px}.fc-desc{font-size:12px;line-height:1.4}.fc-meta{font-size:10.5px;flex-wrap:wrap;gap:4px;margin-top:3px}.fc-tags{gap:3px;margin-bottom:4px}.tag{font-size:9.5px;padding:1px 5px}.ob-table td,.ob-table th{font-size:12px;padding:8px 10px}.ob-text{font-size:12.5px;line-height:1.55;padding:14px}.step-n{width:22px;height:22px;font-size:10px}.step-t{font-size:12px}.faq-item{padding:10px 0}.faq-q{font-size:13px}.faq-a{font-size:12.5px;line-height:1.55}.sec-head{margin-bottom:8px;padding-bottom:6px}.sec-name{font-size:13px}.sec-cnt{font-size:11px}.breadcrumb-nav{font-size:10.5px;padding:6px 0;margin-bottom:10px}.foot-in{padding:16px 12px}.foot-copy{font-size:10.5px}.foot-notice{font-size:10.5px}}</style>
</head>
<body>
<header>
  <div class="h-top">
    <a href="/" class="logo">
      <span class="logo-main">정책자금 <span>백과</span></span>
      <span class="logo-sub">Government Fund Guide</span>
    </a>
    <nav class="h-nav">
      <a href="/">전체</a>
      <a href="/소상공인-정책자금/">소상공인</a>
      <a href="/창업지원금-종류/">창업</a>
      <a href="/중소기업-정책자금/">중소기업</a>
      <a href="/고용지원금-신청방법/">고용</a>
      <a href="/비사업자-서민금융/">서민금융</a>
    </nav>
  </div>
</header>
  <div class="c-strip-in"><span class="c-dot"></span><strong>민간 컨설턴트</strong><span class="c-label">광고</span></div><a href="/전문가-상담/" class="btn-strip">문의하기 →</a></div></div>
<nav class="pnav"><div class="pnav-in"><a href="javascript:history.back()" class="pnav-back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>뒤로</a><a href="/" class="pnav-tab" data-path="/">전체</a><a href="/소상공인-정책자금/" class="pnav-tab" data-path="/소상공인-정책자금/">소상공인</a><a href="/창업지원금-종류/" class="pnav-tab" data-path="/창업지원금-종류/">창업</a><a href="/중소기업-정책자금/" class="pnav-tab" data-path="/중소기업-정책자금/">중소기업</a><a href="/고용지원금-신청방법/" class="pnav-tab" data-path="/고용지원금-신청방법/">고용</a><a href="/비사업자-서민금융/" class="pnav-tab" data-path="/비사업자-서민금융/">서민금융</a></div></nav><script>!function(){var p=location.pathname,tabs=document.querySelectorAll('.pnav-tab');tabs.forEach(function(t){if(p===t.dataset.path||p.startsWith(t.dataset.path.replace(/\/$/,''))&&t.dataset.path!=='/'){t.classList.add('cur');}});}();</script><div class="page">${body}</div>
<footer>
  <div class="foot-in">
    <div class="foot-links">
      <a href="https://www.semas.or.kr" target="_blank">소상공인시장진흥공단</a>
      <a href="https://www.bizinfo.go.kr" target="_blank">기업마당</a>
      <a href="https://www.mss.go.kr" target="_blank">중소벤처기업부</a>
      <a href="https://www.work24.go.kr" target="_blank">고용24</a>
      <a href="https://www.k-startup.go.kr" target="_blank">K-스타트업</a>
      <a href="https://www.kinfa.or.kr" target="_blank">서민금융진흥원</a>
    </div>
    <div class="foot-copy">© 2026 정책자금 백과</div>
    <div class="foot-notice">본 사이트는 정부 정책자금에 관한 정보를 정리·제공하는 정보성 사이트입니다. 실제 지원 조건과 금액은 각 기관의 공식 공고를 반드시 확인하시기 바랍니다.</div>
  </div>
</footer>
</body></html>`;
}

// ─────────────────────────────────────
//  헬퍼
// ─────────────────────────────────────
function parseRow(r) {
  return {...r, steps:tryParse(r.steps,[]), tags:tryParse(r.tags,[]), target:tryParse(r.target,[])};
}
function tryParse(s,fb) { try{return typeof s==='string'?JSON.parse(s):s}catch{return fb} }
function esc(s) { return (s||'').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }
function json(data,status=200) {
  return new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json;charset=utf-8',...CORS}});
}
function html(body) {
  return new Response(body,{headers:{'Content-Type':'text/html;charset=utf-8'}});
}

// ─────────────────────────────────────
//  지역별 SSR 페이지
// ─────────────────────────────────────
async function handleRegionPage(p, env) {
  const catMap = {
    base:'소상공인', industry_retail:'소상공인', industry_construction:'중소기업',
    industry_care:'소상공인', situation_youth:'창업', situation_women:'소상공인',
    situation_restart:'소상공인', situation_senior:'소상공인'
  };
  const funds = await env.DB.prepare('SELECT * FROM funds WHERE cat=? ORDER BY id LIMIT 6')
    .bind(catMap[p.type]||'소상공인').all();
  const items = (funds.results||[]).map(parseRow);

  const cardsHtml = items.map(f =>
    `<a href="/${f.slug}/" class="fcard-link">
      <div class="fcard">
        <div class="fc-tags">${(f.tags||[]).map(t=>`<span class="tag ${t.c}">${t.t}</span>`).join('')}<span class="tag torg">${f.org}</span></div>
        <div class="fc-title">${f.title}</div>
        <div class="fc-desc">${f.excerpt}</div>
        <div class="fc-meta">
          <span class="fm">한도 <b>${f.lim}</b></span>
          <span class="fm">금리 <b>${f.rate}</b></span>
          <span class="fm-more">자세히 보기 →</span>
        </div>
      </div>
    </a>`
  ).join('');

  const RA={'서울':[{n:'서울신용보증재단',u:'https://www.seoulshinbo.co.kr/',d:'서울시 중소기업 육성자금 연 2.0~3.3%'},{n:'서울경제진흥원(SBA)',u:'https://www.sba.seoul.kr/',d:'서울 창업지원·판로개척'}],'경기':[{n:'경기신용보증재단',u:'https://www.gcgf.or.kr/',d:'경기도 중소기업 육성자금 연 2~3%'},{n:'경기경제과학진흥원',u:'https://www.gbsa.or.kr/',d:'경기도 창업·R&D 지원'}],'부산':[{n:'부산신용보증재단',u:'https://www.busancredit.or.kr/',d:'부산시 중소기업·소상공인 보증'},{n:'부산경제진흥원',u:'https://www.bepa.kr/',d:'부산 창업·기업지원'}],'대구':[{n:'대구신용보증재단',u:'https://www.daegucredit.or.kr/',d:'대구시 소상공인·중소기업 보증'},{n:'대구경제진흥원',u:'https://www.deipa.or.kr/',d:'대구 창업·투자 지원'}],'인천':[{n:'인천신용보증재단',u:'https://www.icredit.or.kr/',d:'인천시 중소기업·소상공인 보증'},{n:'인천테크노파크',u:'https://www.itp.or.kr/',d:'인천 기업지원·창업 서비스'}],'광주':[{n:'광주신용보증재단',u:'https://www.gjcredit.or.kr/',d:'광주시 소상공인·중소기업 보증'},{n:'광주경제고용진흥원',u:'https://www.gjep.or.kr/',d:'광주 창업·기업 지원'}],'대전':[{n:'대전신용보증재단',u:'https://www.djcredit.or.kr/',d:'대전시 소상공인·중소기업 보증'},{n:'대전경제통상진흥원',u:'https://www.dba.or.kr/',d:'대전 창업·수출 지원'}],'울산':[{n:'울산신용보증재단',u:'https://www.uscredit.or.kr/',d:'울산시 소상공인·중소기업 보증'},{n:'울산경제진흥원',u:'https://www.uepa.or.kr/',d:'울산 기업지원·산업단지'}],'세종':[{n:'세종시 기업지원',u:'https://www.sejong.go.kr/',d:'세종시 중소기업·창업 지원'},{n:'충남신용보증재단',u:'https://www.cncredit.or.kr/',d:'세종·충남 중소기업 보증'}],'강원':[{n:'강원신용보증재단',u:'https://www.gcredit.or.kr/',d:'강원도 소상공인·중소기업 보증'},{n:'강원경제진흥원',u:'https://www.gwep.or.kr/',d:'강원 창업·기업 지원'}],'충북':[{n:'충북신용보증재단',u:'https://www.cbcredit.or.kr/',d:'충북 소상공인·중소기업 보증'},{n:'충북경제진흥원',u:'https://www.cbipa.or.kr/',d:'충북 창업·투자 지원'}],'충남':[{n:'충남신용보증재단',u:'https://www.cncredit.or.kr/',d:'충남 소상공인·중소기업 보증'},{n:'충남경제진흥원',u:'https://www.cepa.or.kr/',d:'충남 창업·기업 지원'}],'전북':[{n:'전북신용보증재단',u:'https://www.jbcredit.or.kr/',d:'전북 소상공인·중소기업 보증'},{n:'전북경제통상진흥원',u:'https://www.jbepa.or.kr/',d:'전북 창업·수출 지원'}],'전남':[{n:'전남신용보증재단',u:'https://www.jncredit.or.kr/',d:'전남 소상공인·중소기업 보증'},{n:'전남경제진흥원',u:'https://www.jnipa.or.kr/',d:'전남 창업·기업 지원'}],'경북':[{n:'경북신용보증재단',u:'https://www.gbcredit.or.kr/',d:'경북 소상공인·중소기업 보증'},{n:'경북경제진흥원',u:'https://www.gbepa.or.kr/',d:'경북 창업·투자 지원'}],'경남':[{n:'경남신용보증재단',u:'https://www.gncredit.or.kr/',d:'경남 소상공인·중소기업 보증'},{n:'경남경제진흥원',u:'https://www.gnipa.or.kr/',d:'경남 창업·기업 지원'}],'제주':[{n:'제주신용보증재단',u:'https://www.jejucredit.or.kr/',d:'제주 소상공인·중소기업 보증'},{n:'제주테크노파크',u:'https://www.jejutp.or.kr/',d:'제주 창업·R&D 지원'}]};
    const ag=RA[p.region]||[];
      const liveHtml=ag.length?`<div class="fund-list" style="margin-top:28px"><div class="sec-head"><span class="sec-name">🏛 ${p.region} 지역 지원기관</span><span class="sec-cnt" style="color:var(--blue)">공식 링크</span></div>${ag.map(a=>`<a href="${a.u}" target="_blank" rel="noopener" class="fcard-link"><div class="fcard" style="display:flex;align-items:center;justify-content:space-between;padding:16px 20px"><div><div class="fc-tags" style="margin-bottom:6px"><span class="tag tb">${p.region}</span><span class="tag torg">공식기관</span></div><div class="fc-title">${a.n}</div><div class="fc-desc" style="margin-top:4px">${a.d}</div></div><span style="font-size:20px;flex-shrink:0;margin-left:12px">↗</span></div></a>`).join('')}</div>`:'';
        const relLinks = Object.entries(CAT_PAGES)
    .map(([s,m])=>`<a href="/${s}/" class="rel-link">${m.cat}</a>`).join('');

  const faqSchema = `{"@type":"Question","name":"${esc(p.h1)} 신청 방법은?","acceptedAnswer":{"@type":"Answer","text":"${esc(p.intro)}"}}`;

  return html(pageShell({
    title: `${p.title} | 정책자금 백과`,
    desc: p.description,
    keywords: p.keywords,
    canonical: `${BASE}/${p.slug}/`,
    faqSchema,
    breadcrumb: [['홈',`${BASE}/`],[p.region,`${BASE}/${p.region}-정책자금/`],[p.type_name,`${BASE}/${p.slug}/`]],
    body: `
      <div class="cat-hero">
        <div class="cat-badge">${p.region} · ${p.type_name}</div>
        <h1>${p.h1}</h1>
        <p class="cat-intro">${p.intro}</p>
      </div>
      <div class="fund-list">
        <div class="sec-head"><span class="sec-name">관련 정책자금</span><span class="sec-cnt">${items.length}건</span></div>
        ${cardsHtml}
      </div>
              ${liveHtml}
              <div class="rel-cats">
        <div class="rel-title">다른 정책자금 정보</div>
        <div class="rel-links"><a href="/" class="rel-link">전체 보기</a>${relLinks}</div>
      </div>`
  }));
}
