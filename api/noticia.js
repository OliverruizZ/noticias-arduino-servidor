import Parser from 'rss-parser';

const RSS =
  'https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/ultimas-noticias/portada';

const parser = new Parser({ timeout: 8000 });

let cache = [];
let actualizado = 0;

// Convierte el texto a caracteres compatibles con la LCD.
function limpiar(texto, limite) {
  return String(texto ?? '')
    .replace(/<[^>]*>/g, ' ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/…/g, '...')
    .replace(/[^\x20-\x7E]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, limite);
}

async function obtenerNoticias() {
  const ahora = Date.now();

  // Reutiliza el RSS durante cinco minutos cuando
  // la misma instancia del servidor sigue activa.
  if (cache.length && ahora - actualizado < 300000) {
    return cache;
  }

  const feed = await parser.parseURL(RSS);

  const noticias = feed.items
    .map(item => ({
      ...item,
      fecha: Date.parse(item.isoDate || item.pubDate)
    }))
    .filter(item =>
      item.title &&
      Number.isFinite(item.fecha) &&
      item.fecha <= ahora + 300000 &&
      ahora - item.fecha < 72 * 3600000
    )
    .sort((a, b) => b.fecha - a.fecha)
    .slice(0, 10);

  if (!noticias.length) {
    throw new Error('RSS sin noticias recientes');
  }

  cache = noticias;
  actualizado = ahora;

  return cache;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');

    return res.status(405).json({
      ok: false,
      error: 'METODO_NO_PERMITIDO'
    });
  }

  const formato = new URL(
    req.url,
    'http://localhost'
  ).searchParams.get('formato');

  if (
    formato !== null &&
    formato !== 'json' &&
    formato !== 'lcd'
  ) {
    return res.status(400).json({
      ok: false,
      error: 'FORMATO_NO_VALIDO'
    });
  }

  try {
    const noticias = await obtenerNoticias();

    // Alterna entre las noticias según el minuto actual.
    const indice =
      Math.floor(Date.now() / 60000) % noticias.length;

    const item = noticias[indice];

    const resumen = limpiar(
      item.contentSnippet || item.summary || '',
      220
    );

    const noticia = {
      ok: true,
      modo: 'real',
      noticiaReal: true,
      title: limpiar(item.title, 160),
      description: limpiar(
        'EL PAIS: ' +
          (resumen || 'Sin descripcion en el RSS.'),
        240
      ),
      source: 'EL PAIS',
      url: item.link || '',
      publishedAt: new Date(item.fecha).toISOString()
    };

    if (formato === 'lcd') {
      res.setHeader(
        'Content-Type',
        'text/plain; charset=utf-8'
      );

      return res.status(200).send(
        `MODO:REAL\n` +
        `TITLE:${noticia.title}\n` +
        `DESC:${noticia.description}\n` +
        `END\n`
      );
    }

    return res.status(200).json(noticia);
  } catch (error) {
    console.error(
      'Error al consultar RSS:',
      error.message
    );

    if (formato === 'lcd') {
      res.setHeader(
        'Content-Type',
        'text/plain; charset=utf-8'
      );

      return res.status(502).send(
        'ERROR:No se pudo consultar noticias\nEND\n'
      );
    }

    return res.status(502).json({
      ok: false,
      error: 'FUENTE_NO_DISPONIBLE'
    });
  }
}
