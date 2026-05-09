const BASE_URL = 'https://apis.data.go.kr/1421000/mssBizService_v2/getbizList_v2';

const REGION_KEYWORDS = {
  '서울': ['서울시','서울특별시','서울신용보증재단','서울창업허브','서울경제진흥원','서울테크노파크','SBA'],
  '부산': ['부산시','부산광역시','부산신용보증재단','부산창업','부산테크노파크','부산경제진흥원'],
  '대구': ['대구시','대구광역시','대구신용보증재단','대구창업','대구테크노파크','대구경제진흥원'],
  '인천': ['인천시','인천광역시','인천신용보증재단','인천창업','인천테크노파크','인천경제자유구역'],
  '광주': ['광주시','광주광역시','광주신용보증재단','광주창업','광주테크노파크','광주경제고용진흥원'],
  '대전': ['대전시','대전광역시','대전신용보증재단','대전창업','대전테크노파크','대전경제통상진흥원'],
  '울산': ['울산시','울산광역시','울산신용보증재단','울산창업','울산테크노파크','울산경제진흥원'],
  '세종': ['세종시','세종특별자치시','세종창업','세종경제'],
  '경기': ['경기도','경기신용보증재단','경기창업','경기테크노파크','경기경제과학진흥원'],
  '강원': ['강원도','강원특별자치도','강원창업','강원테크노파크','강원경제진흥원'],
  '충북': ['충청북도','충북창업','충북테크노파크','충북경제진흥원','충북신용보증재단'],
  '충남': ['충청남도','충남창업','충남테크노파크','충남경제진흥원','충남신용보증재단'],
  '전북': ['전북특별자치도','전라북도','전북창업','전북테크노파크','전북경제통상진흥원','전북신용보증재단'],
  '전남': ['전라남도','전남창업','전남테크노파크','전남경제진흥원','전남신용보증재단'],
  '경북': ['경상북도','경북창업','경북테크노파크','경북경제진흥원','경북신용보증재단'],
  '경남': ['경상남도','경남창업','경남테크노파크','경남경제진흥원','경남신용보증재단'],
  '제주': ['제주도','제주특별자치도','제주창업','제주테크노파크','제주경제통상진흥원'],
};

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url       = new URL(request.url);
    const numOfRows = url.searchParams.get('numOfRows') || '15';
    const pageNo    = url.searchParams.get('pageNo')    || '1';
    const cate      = url.searchParams.get('cate')      || '';
    const region    = url.searchParams.get('region')    || '';
    const apiKey    = env.BIZINFO_API_KEY || env.API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({
        error: 'BIZINFO_API_KEY environment variable is required.'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS }
      });
    }

    const cacheKey = request.url;

    try {
      if (env.DB) {
        const { results } = await env.DB.prepare('SELECT data, updated_at FROM policy_cache WHERE cache_key = ?').bind(cacheKey).all();
        if (results && results.length > 0) {
          const lastUpdate = new Date(results[0].updated_at + "Z").getTime(); // Append Z to ensure UTC parsing
          const now = new Date().getTime();
          // Cache valid for 12 hours (12 * 60 * 60 * 1000 = 43200000 ms)
          if (now - lastUpdate < 43200000) {
            return new Response(results[0].data, {
              headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS }
            });
          }
        }
      }

      const fetchRows = region ? '100' : numOfRows;

      const apiUrl = BASE_URL
        + '?serviceKey=' + encodeURIComponent(apiKey)
        + '&numOfRows='  + fetchRows
        + '&pageNo='     + pageNo
        + (cate ? '&cate=' + encodeURIComponent(cate) : '');

      const resp = await fetch(apiUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': '*/*' },
      });

      const xml = await resp.text();

      const cleanText = (str) => str
        .replace(/&amp;/g,  '&').replace(/&lt;/g,  '<')
        .replace(/&gt;/g,   '>').replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"').replace(/\s+/g,   ' ')
        .trim();

      const getVal = (str, tag) => {
        const m = str.match(new RegExp(
          `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([^<]*)<\\/${tag}>`
        ));
        return m ? (m[1] !== undefined ? m[1] : m[2] || '') : '';
      };

      const totalCount = parseInt(getVal(xml, 'totalCount')) || 0;
      const blocks     = xml.split('<item>').slice(1);

      const items = blocks.map(block => {
        const title     = cleanText(getVal(block, 'title'));
        const summary   = cleanText(getVal(block, 'dataContents'));
        const viewUrl   = getVal(block, 'viewUrl').trim();
        const startDate = getVal(block, 'applicationStartDate');
        const endDate   = getVal(block, 'applicationEndDate');
        const org       = getVal(block, 'writerName');
        const category  = getVal(block, 'cate');
        if (!title) return null;
        return { title, url: viewUrl, summary, startDate, endDate, org, category };
      }).filter(Boolean);

      let finalJson = '';

      if (region && REGION_KEYWORDS[region]) {
        const keywords = REGION_KEYWORDS[region];

        let filtered = items.filter(item =>
          keywords.some(kw =>
            item.title.includes(kw) ||
            item.org.includes(kw)   ||
            item.summary.includes(kw)
          )
        );

        if (filtered.length < 3) {
          filtered = items.filter(item =>
            item.title.includes(region)   ||
            item.summary.includes(region) ||
            item.org.includes(region)
          );
        }

        const sliced = filtered.slice(0, parseInt(numOfRows));
        finalJson = JSON.stringify({
          success: true,
          totalCount: filtered.length,
          items: sliced,
          region,
        });
      } else {
        finalJson = JSON.stringify({ success: true, totalCount, items });
      }

      if (env.DB) {
        await env.DB.prepare('INSERT OR REPLACE INTO policy_cache (cache_key, data, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)').bind(cacheKey, finalJson).run();
      }

      return new Response(finalJson, {
        headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS_HEADERS }
      });

    } catch (err) {
      return new Response(JSON.stringify({ success: false, error: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS }
      });
    }
  }
};
