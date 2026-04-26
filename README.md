# 🔮 Oracle Lens — LOL Tracker

Tracker de estadísticas para jugadores de **League of Legends** en el servidor **LAN**.

Aplicación web construida con **Google Apps Script** que se conecta a una hoja de Google Sheets y muestra splash arts de campeones usando **Data Dragon**.

![League of Legends](https://ddragon.leagueoflegends.com/cdn/img/champion/splash/Lux_0.jpg)

---

## ✨ Características

- 🎴 Tarjetas con **splash art** del campeón con más maestría
- 📊 Dashboard de estadísticas por jugador (Victorias, Derrotas, Winrate, LP)
- 🎠 Carrusel interactivo con **Swiper.js**
- 🎨 Diseño estilo **Hextech** con efectos de resplandor y glassmorphism
- 📱 Diseño responsive

---

## 📁 Estructura del proyecto

```
Oracle Lens/
├── code.gs              → Backend (Google Apps Script)
├── index.html           → Página principal
├── styles.html          → Estilos CSS
├── secret.html          → 🔒 API Key privada (NO está en GitHub)
├── secret.example.html  → Plantilla para crear tu secret.html
├── api.html             → Configuración de Riot API + Data Dragon
├── players.html         → Carga de datos desde Google Sheets
├── cards.html           → Tarjetas del carrusel
├── app.html             → Lógica principal de la app
├── .gitignore           → Archivos excluidos de Git
└── README.md            → Este archivo
```

---

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/oracle-lens.git
```

### 2. Crear tu archivo de API Key
```bash
# Copia la plantilla
cp secret.example.html secret.html
```
Abre `secret.html` y reemplaza `TU_API_KEY_AQUI` con tu clave de [Riot Developer Portal](https://developer.riotgames.com/).

> ⚠️ La clave de desarrollo expira cada **24 horas**.

### 3. Subir a Google Apps Script
1. Ve a [script.google.com](https://script.google.com) → **Nuevo proyecto**
2. Copia el contenido de `code.gs` al archivo principal
3. Crea un archivo HTML por cada `.html` del proyecto (clic en `+` → `HTML`)
   - Los nombres deben ser **exactos** y **sin extensión**: `index`, `styles`, `secret`, `api`, `players`, `cards`, `app`
4. Haz clic en **Implementar** → **Nueva implementación** → **Aplicación web**
5. Configura acceso y despliega

---

## ⚙️ Configuración

### Google Sheets
El proyecto lee datos de una hoja de cálculo con estas columnas:

| Nombre | Tag | Rango | LP | Victorias | Derrotas | Porcentaje Victorias | Campeon Favorito |
|--------|-----|-------|----|-----------|----------|---------------------|-----------------|
| Azzz   | Bou | MASTER I | 223 | 168 | 138 | 54.9% | Graves |

El ID de la hoja se configura en `code.gs`:
```javascript
const SPREADSHEET_ID = '1E3wstrDb5__RYcoN4-BEMg0u7GvOICgyUsfiCo8-wKo';
```

### Data Dragon
Versión actual: `15.8.1` (configurable en `api.html`)

---

## 🛡️ Seguridad

- `secret.html` está en `.gitignore` y **nunca** se sube a GitHub
- `secret.example.html` es la plantilla pública sin datos sensibles

---

## 📝 Licencia

Proyecto personal. Oracle Lens no está respaldado por Riot Games.
