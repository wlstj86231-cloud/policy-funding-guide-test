export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname.replace(/\/$/, '');


  const ssrPaths = [
    '/소상공인-정책자금',
    '/창업지원금-종류',
    '/중소기업-정책자금',
    '/고용지원금-신청방법',
    '/비사업자-서민금융',
  ];


  const isSsr = ssrPaths.includes(path)
    || path.startsWith('/funds/')
    || path.startsWith('/api/')
    || path === '/sitemap.xml';


  if (isSsr) {
    return context.env.worker.fetch(context.request);
  }


  return context.next();
}

