# Diario de Desarrollo - Proyecto Intermodular
**Autora:** Sonia Carrasco Jimeno
**Tecnologías:** React, Node.js, Express, MySQL.

## Fase 1: Configuración y backend Inicial (Noviembre 2025)

### Entrada 1: Conexión con la Base de Datos
* **Tarea:** Establecer conexión entre Node.js y MySQL local.
* **Dificultad:** Al principio, Node no se conectaba porque el puerto de MySQL en mi XAMPP no era el estándar (3306), sino el 3307.
* **Decisión técnica:** Creé un archivo `.env` para gestionar las credenciales de la base de datos de forma segura y cambié el puerto allí. Usé la librería `mysql2` para la conexión con la base de datos, ya que ofrece soporte para promesas, mejor rendimiento y una mayor compatibilidad con aplicaciones modernas en Node.js.
* **Actualización:** Finalmente, opté por no utilizar XAMPP y trabajar directamente con MySQL mediante MySQL Workbench, lo que simplificó la configuración y evitó problemas con los puertos.

### Entrada 2: Documentación con Swagger
* **Tarea:** Implementar Swagger UI para probar los endpoints.
* **Dificultad:** Configurar los comentarios JSDoc para que Swagger generara correctamente el JSON de la documentación. Los esquemas de los objetos no se visualizaban.
* **Decisión técnica:** Busqué documentación oficial y decidí separar los esquemas en un archivo de configuración aparte para que el `server.js` no quedara demasiado largo y sucio.

## Fase 2: Integración y errores críticos (Abril 2024 - Enero 2026)

### Entrada 3: Problemas de CORS
* **Tarea:** Hacer el primer `fetch` desde React al Backend.
* **Dificultad:** El navegador bloqueaba la petición por política de CORS (Cross-Origin Resource Sharing).
* **Decisión técnica:** Instalé el middleware `cors` en Express. Es la solución estándar y más segura para permitir que el puerto 5173 (React) hable con el puerto 3001 (Node).

### Entrada 4: Error: `ERR_INVALID_PACKAGE_CONFIG` y conflictos de Git
* **Tarea:** Recuperar el servidor tras un error crítico de arranque.
* **Dificultad:** El archivo `package.json` contenía marcas de conflicto (`<<<<<<< HEAD`), lo que lo convertía en un JSON inválido tras un merge mal resuelto. Además, se perdieron las dependencias.
* **Decisión técnica:** Se realizó una reconstrucción manual eliminando `node_modules` y `package-lock.json`. Se reparó el JSON y se reinstalaron incrementalmente las librerías necesarias (`express`, `multer`, `mysql2`, etc.) según los errores del stack.

## Fase 3: UI avanzada y persistencia (Marzo 2026)

### Entrada 5: Ajustes de UI y box model en CSS
* **Tarea:** Alinear el botón de adjuntar archivos con los inputs superiores y mejorar el diseño.
* **Dificultad:** El botón sobresalía por la derecha a pesar de tener `width: 100%` debido a que el padding se sumaba al ancho total.
* **Decisión técnica:** Apliqué `box-sizing: border-box` en el CSS para que el ancho incluyera el padding. Implementé `display: flex` con `gap` para separar correctamente el icono de `react-icons/fi` del texto.

### Entrada 6: Depuración de atributos DOM y JS
* **Tarea:** Corregir errores de consola relacionados con etiquetas de formulario.
* **Dificultad:** El navegador lanzaba un error indicando que `for` es una propiedad inválida en el DOM de React.
* **Decisión técnica:** Cambié el atributo `for` por `htmlFor` en las etiquetas `<label>`. En React/JSX, `for` es una palabra reservada de JavaScript y debe usarse la variante en camelCase para vincular el label con el ID del input.

### Entrada 7: Implementación de subida de archivos (Multer)
* **Tarea:** Permitir que los eventos acepten archivos adjuntos opcionales.
* **Dificultad:** Los archivos no se enviaban correctamente mediante una petición JSON estándar.
* **Decisión técnica:** Modifiqué el envío en el Frontend para usar el objeto `FormData()` en lugar de un objeto plano. En el Backend, configuré el middleware `multer` para procesar peticiones `multipart/form-data` y gestionar el almacenamiento de los archivos.

### Entrada 8: Fix de persistencia en la edición de eventos
* **Tarea:** Lograr que los cambios realizados en el modal de edición se guarden en la base de datos.
* **Dificultad:** Al editar un evento, los cambios no se visualizaban al cerrar el modal, aunque la API respondía correctamente.
* **Diagnóstico:** Se detectó que la función `prepararEdicionEvento` no estaba actualizando el estado `idEnEdicion`, provocando que el `PUT` se enviara a una URL inválida.
* **Decisión técnica:** Corregí la captura del ID al abrir el modal y añadí una actualización de estado local inmediata tras el éxito del `fetch` para asegurar que la interfaz refleje los cambios sin esperas.

> **Lección aprendida:** La gestión de estados de edición requiere una sincronización perfecta entre el ID del elemento seleccionado y la URL del endpoint para evitar fallos de persistencia.

## Fecha: [01/04/2026] - Sesión de optimización de UX y navegación

### Tareas realizadas:
* **Navegación entre páginas** Implementación de navegación mediante `useNavigate` y `location.state` para permitir la edición de eventos desde el Dashboard directamente en la página de Gestión Académica.
* **Depuración de estados:** Resolución de bucle infinito en la apertura de modales mediante la limpieza del estado de la ruta con `window.history.replaceState`.
* **Nuevo componente de calendario:** Creación de `CalendarioEventos.js` con lógica de puntos de colores (Heatmap) según el tipo de evento (Examen, Tarea, Videoconferencia).
* **Optimización para móviles:** Ajuste de estilos CSS para modales en dispositivos móviles, eliminando scroll innecesario y mejorando la alineación de iconos/botones con Flexbox.

### Problemas encontrados y soluciones:
1. **Error "No routes matched":** El path en el `Maps` no coincidía con el definido en `App.js`. Se corrigió la ruta.
2. **Modal persistente:** Al recargar la lista de eventos, el modal se reabría solo. Se solucionó "quemando" el mensaje del estado de navegación una vez leído.
3. **Desbordamiento en móvil:** Los botones y la "X" de cierre se perdían en pantallas pequeñas. Apliqué Media Queries para compactar el padding y los márgenes.

## Fecha: [10/04/2026] - Gestión de autenticación y persistencia

### Entrada 9: Implementación de “Recordar credenciales” y depuración de sesión
* **Tarea:** Implementar la funcionalidad de recordar credenciales en el formulario de login y asegurar su correcto funcionamiento tras cerrar sesión.
* **Dificultad:** Tras marcar la casilla de “Recordar credenciales”, el email no aparecía al volver al login después de hacer logout. Además, el campo `apellidos` aparecía como `undefined` en el frontend a pesar de existir en la base de datos.
* **Diagnóstico:** Se detectaron varios problemas:
  - El `logout` eliminaba el objeto `user` de `localStorage`, impidiendo recuperar el email.
  - Existían datos antiguos en `localStorage` que no incluían el campo `apellidos`.
  - El `useEffect` solo leía de `localStorage` y no contemplaba `sessionStorage`.
* **Decisión técnica:** 
  - Modifiqué el `logout` para eliminar únicamente el `token`, manteniendo los datos necesarios para recordar el email.
  - Limpié manualmente el `localStorage` para eliminar datos obsoletos.
  - Ajusté el `useEffect` para recuperar correctamente la información almacenada al cargar el componente.
  - Separé claramente el uso de `localStorage` (persistencia de credenciales) y `sessionStorage` (sesión temporal).
* **Resultado:** El email se mantiene correctamente tras cerrar sesión cuando la opción está activada, y los datos del usuario se gestionan de forma coherente entre frontend y backend.

> **Lección aprendida:** Es clave diferenciar entre almacenamiento persistente y de sesión. Guardar solo la información necesaria (como el email) evita inconsistencias y mejora la seguridad de la aplicación.

## Fecha: [10/04/2026]  Integración del calendario y modal de eventos

### Entrada 10: Navegación entre componentes, apertura de modal y depuración de eventos
* **Tarea:** Permitir editar eventos desde distintos componentes (Home y Calendario), reutilizando el modal existente en Gestión Académica y asegurando coherencia en la visualización de los eventos.
* **Dificultad:** Al pulsar eventos desde el calendario, la aplicación redirigía a una pantalla en blanco. Además, los estilos de urgencia dejaron de aplicarse y se mostraban eventos pasados en la sección de “Próximos vencimientos”.
* **Diagnóstico:** Se detectaron varios problemas:
- La ruta de navegación no coincidía (/gestion-academica vs /gestionacademica), lo que impedía que React Router encontrara la página.
- Existía un desajuste entre clases CSS (lejano) y clases aplicadas en JSX (futuro).
- El fallback en el filtrado (slice(0,3)) incluía eventos pasados, rompiendo la lógica de “próximos”.
- Las fechas no estaban normalizadas, lo que generaba errores en las comparaciones por incluir horas.
- Se estaban utilizando funciones no definidas en algunos componentes (handleEdit, prepararEdicionEvento).
* **Decisión técnica:**
- Unifiqué las rutas de navegación en todos los componentes.
- Ajusté las clases dinámicas para que coincidieran con el CSS existente (urgente / lejano).
- Reescribí la lógica de filtrado para trabajar únicamente con eventos futuros antes de aplicar límites.
- Normalicé las fechas utilizando setHours(0,0,0,0) para evitar errores en comparaciones.
- Mantuve la apertura del modal mediante location.state y un useEffect en Gestión Académica para reutilizar la lógica existente.
* **Resultado:** La navegación funciona correctamente desde Home y Calendario, el modal se abre con el evento seleccionado, los estilos de urgencia se aplican correctamente y solo se muestran eventos relevantes.

> **Lección aprendida:** En aplicaciones React, pequeños desajustes entre rutas, nombres de clases o manejo de fechas pueden provocar errores en cadena. Mantener consistencia y revisar la integración entre componentes es clave para evitar fallos difíciles de detectar.

## Fecha: [11/04/2026]  Refactorización de validación de notas y persistencia de sesión

### Entrada 11: Validación lógica de calificaciones y corrección de persistencia (F5)
* **Tarea:** Implementar un sistema de validación para las notas en el historial y asegurar que la sesión del usuario no se cierre al recargar la página.
* **Dificultad:** Las notas permitían valores fuera de rango ($0$-$10$) y caracteres no numéricos.
- Al borrar una nota (dejarla vacía), el backend no procesaba correctamente el null y mantenía el valor anterior en la base de datos.
- Al pulsar F5, el estado de React se reiniciaba y redirigía al login debido a una inconsistencia de nombres en el localStorage.
* **Diagnóstico:** La lógica del if en el frontend usaba isNaN() de forma incorrecta, bloqueando números válidos.
- El backend usaba el operador || 0 en los parámetros de la consulta SQL, lo que convertía cualquier intento de guardar null en un 0.
- Existía un conflicto entre la clave 'user' y 'usuario' al intentar recuperar la sesión en App.js.
* **Decisión técnica:**
 -Frontend: Implementé una expresión regular en onChange para permitir solo números y comas, y una condición !isNaN(num) && num >= 0 && num <= 10 en el onBlur para validar el rango académico.
 -Backend: Creé una variable notaParaSQL que normaliza los valores recibidos, convirtiendo explícitamente strings vacíos o "null" en un valor NULL real para MySQL.
- Persistencia: Unifiqué el uso de la clave 'usuario' en todo el proyecto y añadí una inicialización funcional en el useState de App.js para rescatar la sesión del localStorage antes del primer renderizado.
* **Resultado:** El sistema ahora permite calificar tareas con precisión, calcula la media ignorando celdas vacías y permite recargar la página sin perder la sesión ni los cambios realizados en las notas.

> **Lección aprendida:** Lección aprendida: El manejo de valores nulos entre JavaScript (Frontend) y MySQL (Backend) requiere una normalización estricta. Un simple operador || puede alterar la integridad de los datos si no se diferencia entre un "valor vacío" y un "cero real".

