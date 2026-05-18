# MATCH PRO - Sports Matchmaking App

Prototipo funcional de frontend para la aplicación **MATCH PRO**.

## Estructura del Proyecto

- `index.html`: Punto de entrada que redirige al Splash/Welcome screen.
- `/pantallas`: Contiene todas las vistas (HTML) de la aplicación.
- `/js`: Contiene toda la lógica de estado global, autenticación (Supabase) y controladores de vistas.
- `/assets`: Contiene imágenes u otros recursos estáticos.

## Despliegue en Vercel

Este proyecto está optimizado para su despliegue en **Vercel**:
- Utiliza la configuración `vercel.json` para soportar **Clean URLs** (URLs sin extensión `.html`).
- Las reglas de reescritura (`rewrites`) apuntan automáticamente la raíz a `index.html` y las rutas limpias a la carpeta `/pantallas/`.

### Pasos para Desplegar:
1. Sube este repositorio a tu cuenta de GitHub.
2. Inicia sesión en [Vercel](https://vercel.com).
3. Importa tu repositorio.
4. Vercel detectará automáticamente la configuración y la carpeta raíz.
5. Haz clic en **Deploy**.
