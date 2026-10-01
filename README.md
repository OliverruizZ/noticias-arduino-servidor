# Servidor de noticias para Arduino y ESP01

Esta es la primera etapa del servidor. Permite comprobar un despliegue nuevo de GitHub a Vercel sin depender todavía de RSS, API keys ni firmware del ESP. Todas las noticias devueltas son datos de prueba y se identifican como tales. No es la integración final de noticias actuales.

## Archivos

| Archivo | Función |
| --- | --- |
| index.html | Página visible de prueba y botón para consultar la API. |
| api/estado.js | Comprueba que las funciones del servidor se ejecutan. |
| api/noticia.js | Devuelve título y descripción de prueba en JSON o texto pequeño. |
| package.json | Selecciona módulos JavaScript y Node.js 22. No hay dependencias externas. |

## Crear el repositorio sin consola

1. Extrae el ZIP en tu computador.
2. En GitHub entra a tu cuenta y pulsa New repository.
3. Nombre sugerido: noticias-arduino-servidor. El nombre debe estar disponible en tu cuenta.
4. Crea el repositorio. Puedes elegir público o privado y agregar un README inicial si deseas.
5. En el repositorio usa Add file → Upload files, o el enlace uploading an existing file si el repositorio está vacío.
6. Arrastra LOS CONTENIDOS de la carpeta extraída: index.html, package.json, README.md y la carpeta api completa. No subas el ZIP. No subas una carpeta externa que deje todo dentro de noticias-servidor/.
7. Confirma la carga con Commit changes.
8. Verifica que index.html y package.json estén en la raíz del repositorio y que api contenga estado.js y noticia.js. Si falta la carpeta api, las rutas no funcionarán. Si el navegador no conserva carpetas al cargar, crea los archivos con Add file → Create new file, escribiendo api/estado.js y api/noticia.js como nombres y copiando su contenido.

## Importar en Vercel

1. Abre https://vercel.com e inicia sesión.
2. Usa Add New → Project e importa el repositorio nuevo de GitHub. Autoriza el acceso al repositorio si se solicita.
3. Framework Preset: Other. Root Directory: raíz del repositorio, sin subcarpetas.
4. No configures un Build Command personalizado ni un Output Directory personalizado. Este proyecto no utiliza un framework ni una compilación del frontend. Si la interfaz muestra Install Command, deja la detección automática.
5. No se necesitan variables de entorno para esta prueba.
6. Pulsa Deploy y espera el resultado. Si falla, abre los registros de construcción y comparte el error.
7. Copia el dominio exacto que Vercel asigne. El nombre del repositorio NO garantiza un dominio concreto; no reutilices el dominio anterior sin comprobarlo.
8. Para que el ESP acceda sin una sesión de navegador, usa un despliegue de producción públicamente accesible. Si Deployment Protection solicita iniciar sesión, revisa la protección de ese despliegue. No compartas tokens ni credenciales.

## Probar en el navegador

Reemplaza TU-DOMINIO por el dominio real del despliegue.

1. https://TU-DOMINIO/ debe mostrar la página de prueba.
2. https://TU-DOMINIO/api/estado debe responder JSON con ok: true.
3. https://TU-DOMINIO/api/noticia debe devolver title, description y modo: prueba.
4. https://TU-DOMINIO/api/noticia?formato=lcd debe mostrar MODO:PRUEBA, TITLE, DESC y END en líneas separadas.
5. Pulsa el botón de la página. Debe informar que la API está disponible y mostrar los datos de prueba.
6. Repite la prueba en una ventana privada sin sesión de Vercel. Si pide autenticación, el ESP tampoco podrá consultar libremente ese despliegue.

## Qué falta

Después de validar el servidor en el navegador, se elegirá una fuente real en español y se añadirá la consulta con timeout, extracción de título y descripción, límites y errores. Después se probará HTTPS desde el ESP y se integrará el LCD. Publicar un servidor correcto no garantiza que el firmware AT 1.2.0.0 sea compatible con sus requisitos TLS.

## Errores frecuentes

- 404 en /api/estado: revisa dominio, raíz del repositorio y ubicación de api/estado.js.
- 500: abre los registros de la función en Vercel.
- DEPLOYMENT_NOT_FOUND: usa el dominio real del despliegue terminado.
- Página de login: revisa la protección del despliegue.
- El ESP muestra CLOSED al abrir SSL: la aplicación todavía no recibió la petición; revisar TLS y alimentación por separado.

## Referencias

- Vercel Node.js Runtime: https://vercel.com/docs/functions/runtimes/node-js
- Configuración del runtime: https://vercel.com/docs/functions/configuring-functions/runtime
- Versiones Node.js: https://vercel.com/docs/functions/runtimes/node-js/node-js-versions
