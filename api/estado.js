// Permite verificar el despliegue sin depender de una fuente de noticias.
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'METODO_NO_PERMITIDO' });
  }
  return res.status(200).json({
    ok: true,
    servicio: 'noticias-arduino-servidor',
    etapa: 'prueba de despliegue',
    version: '1.0.0'
  });
}
