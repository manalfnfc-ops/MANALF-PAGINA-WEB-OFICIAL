# MANALF Landing

Landing page con video introductorio y contenido principal sobre el frame final.

## Estructura

```
/
├── index.html          # Pagina principal
├── video/
│   ├── intro.mp4       # Video H.264 (Chrome, Safari, Edge)
│   └── intro.webm      # Video VP9 (Firefox, Chrome)
├── images/
│   └── final-frame.jpg # Frame final del video como fondo estatico
└── README.md
```

## Como desplegar en Vercel (gratis)

### Opcion A: Desde GitHub (recomendado)

1. Crea un repositorio en GitHub (ej: `manalf-landing`)
2. Sube estos archivos al repo:
   ```bash
   git init
   git add .
   git commit -m "Landing MANALF v1"
   git remote add origin https://github.com/TU_USUARIO/manalf-landing.git
   git push -u origin main
   ```
3. Ve a [vercel.com](https://vercel.com), inicia sesion con tu cuenta de GitHub
4. Click en "Add New Project", selecciona el repositorio
5. En "Framework Preset" selecciona **"Other"**
6. Click en **Deploy**
7. Listo. Te daran una URL tipo `https://manalf-landing.vercel.app`

### Opcion B: Drag & Drop (sin GitHub)

1. Comprime esta carpeta en un `.zip`
2. Ve a [vercel.com](https://vercel.com)
3. En el dashboard arrastra el `.zip` al area de upload
4. Listo

## Flujo de la pagina

1. **Pantalla negra con blur** + boton de cristal
2. Al hacer click: el blur desaparece, inicia el video
3. Al terminar el video: crossfade al frame final como fondo estatico
4. Aparece el contenido principal con animaciones scroll
5. Si el video falla: fallback automatico a los 6 segundos

## Optimizaciones aplicadas al video

- **H.264 + faststart**: permite reproduccion progresiva sin descargar todo
- **WebM VP9**: formato alternativo para mejor compatibilidad
- **Frame final extraido**: imagen JPEG como capa de respaldo
- **Preload**: el video se carga en segundo plano antes de mostrar el boton
- **Fallback de 6s**: si el video se congela, el contenido aparece igual
