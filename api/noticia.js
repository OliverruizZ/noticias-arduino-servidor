// ETAPA INICIAL: datos de prueba. Todavia NO consulta noticias de Internet.
// Primero se valida esta ruta; luego se conectara una fuente real.
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'METODO_NO_PERMITIDO' });
  }

  const noticia = {
    ok: true,
    modo: 'prueba',
    noticiaReal: false,
    title: 'Servidor de noticias funcionando',
    description: 'Este texto es una prueba. La fuente de noticias reales se agregara en la siguiente etapa.',
    source: 'Datos de prueba'
  };

  const formato = new URL(req.url, 'http://localhost').searchParams.get('formato');

  if (formato === 'lcd') {
    // ASCII y pocas lineas para la futura recepcion en el Uno.
    const cuerpo =
      'MODO:PRUEBA\n' +
      'TITLE:' + noticia.title + '\n' +
      'DESC:' + noticia.description + '\n' +
      'END\n';
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send(cuerpo);
  }

  if (formato !== null && formato !== 'json') {
    return res.status(400).json({ ok: false, error: 'FORMATO_NO_VALIDO' });
  }
  return res.status(200).json(noticia);
}
