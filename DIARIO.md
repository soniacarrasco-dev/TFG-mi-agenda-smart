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

## Fecha: [13/04/2026] - Refactorización de UI y normalización de estados de calificación

### Entrada 12: Sincronización visual de componentes y lógica de estados nulos
* **Tarea:** Unificar el diseño de las tarjetas de historial con las de tareas pendientes y corregir la representación visual de las calificaciones.
* **Dificultad:** - Las etiquetas de "Asignatura" y "Tipo" en el historial no seguían la línea estética del resto de la app.
    - El borde lateral de las tarjetas se marcaba en rojo (suspenso) por defecto cuando una tarea aún no tenía nota asignada.
* **Diagnóstico:** - Se detectó una falta de coherencia en las clases CSS entre `CardTareasHist` y `CardTareasPtes`.
    - La lógica booleana en JavaScript evaluaba la ausencia de nota (`null` o `undefined`) como un valor no aprobado, disparando visualmente el estado de "suspenso".
* **Decisión técnica:** - **UI:** Repliqué la estructura de niveles y las clases dinámicas (`.badge-tipo-color`) del componente de pendientes. Implementé una función de normalización de strings (`toLowerCase().replace(/\s+/g, '')`) para asegurar que tipos con espacios (ej. "Video conferencia") vinculen correctamente con el CSS.
    - **Lógica de negocio:** Ajusté el cálculo de `estadoClase` para que solo devuelva "aprobado" o "suspenso" si existe un valor numérico. El borde por defecto ahora utiliza el color (`#ccc`), cambiando a verde o rojo únicamente tras la entrada de una calificación válida.
* **Resultado:** La interfaz es ahora consistente en toda la plataforma. El historial distingue claramente entre una tarea "pendiente de calificar" y una "suspendida", mejorando la claridad cognitiva para el usuario.

> **Lección aprendida:** La consistencia visual no es solo estética, es funcional. Unificar componentes reutilizando la misma lógica de CSS dinámico reduce la deuda técnica y evita que el usuario reciba feedback erróneo (como un borde rojo innecesario).

## Fecha: [17/04/2026] - Implementación de sistema de notificaciones por email con cron


### Entrada 13: Automatización de avisos de eventos y depuración completa del flujo backend
* **Tarea:** Implementar un sistema automático de notificaciones por email que avise al usuario antes del vencimiento de eventos académicos.
* **Dificultad:** La integración implicó múltiples problemas encadenados:
- Errores de rutas (MODULE_NOT_FOUND) al organizar nuevos archivos (cron, services).
- Confusión entre db.query y pool.query debido a la estructura de exportación del archivo de conexión.
- Duplicidad de transporter (Mailtrap vs Gmail), generando conflictos de variables.
- Fallos de autenticación con Gmail (Invalid login 535) por uso incorrecto de credenciales.
- Problemas conceptuales al mezclar responsabilidades entre controllers, rutas y servicios.
* **Diagnóstico:** Se identificó que los errores no provenían de una única causa, sino de la falta de coherencia en la arquitectura del backend:
- Imports incorrectos y rutas mal referenciadas.
- Uso inconsistente del pool de conexión a la base de datos.
- Configuración duplicada del envío de correos.
* **Decisión técnica:**
- Implementé un sistema de tareas programadas usando node-cron, configurado inicialmente para ejecutarse cada minuto en entorno de desarrollo.
- Centralicé la configuración de base de datos y envío de emails en un único archivo (db.js), exportando pool y transporter.
- Eliminé el archivo mailer.js para evitar duplicidades y conflictos.
- Adapté todas las consultas a pool.query() para trabajar correctamente con mysql2/promise.
- Configuré Gmail con App Password para permitir el envío real de correos desde la aplicación.
- Separé claramente responsabilidades:
  - cron/ → ejecución automática
  - services/ → lógica de negocio
  - controllers/ → gestión de peticiones
* **Resultado:** El sistema detecta automáticamente eventos próximos a su vencimiento y envía notificaciones por email de forma correcta. En modo desarrollo, se ejecuta cada minuto, permitiendo validar el flujo completo en tiempo real. Los emails se envían correctamente a cuentas reales y los eventos se actualizan en base de datos para evitar envíos duplicados.

> **Lección aprendida:** La implementación de funcionalidades transversales (como tareas automáticas y envío de emails) requiere una arquitectura clara y coherente. Centralizar configuraciones críticas (como la conexión a base de datos o el servicio de correo) evita errores difíciles de depurar y mejora la mantenibilidad del sistema.

### Entrada 14: Contenerización del sistema y automatización del entorno
* **Tarea:** Dockerizar el backend y la base de datos MySQL para permitir la ejecución completa del proyecto en un entorno aislado y reproducible.
* **Dificultad:** Durante el proceso surgieron varios problemas:
- Errores de conexión entre backend y base de datos al usar localhost en lugar del nombre del servicio.
- Diferencias entre PowerShell y CMD en Windows al ejecutar comandos de importación/exportación (<, >).
- Base de datos vacía al levantar el contenedor, provocando errores 500 en la aplicación.
- Desajuste entre el nombre de la base de datos configurado en Docker (mi_agenda) y el nombre real (mi_agenda_smart).
* **Diagnóstico:** Se identificó que los errores no estaban relacionados con Docker en sí, sino con:
- Configuración incorrecta de variables de entorno.
- Falta de sincronización entre la base de datos real y el archivo .sql.
- Uso incorrecto de rutas y comandos en entorno Windows.
* **Decisión técnica:**
- Implementé un Dockerfile para contenerizar el backend Node.js.
- Configuré docker-compose.yml para orquestar dos servicios: backend y MySQL.
- Ajusté la conexión a base de datos utilizando DB_HOST=mysql para comunicación interna entre contenedores.
- Exporté la base de datos actual desde el contenedor mediante mysqldump para asegurar un estado actualizado.
- Automatizé la importación inicial utilizando el directorio /docker-entrypoint-initdb.d, eliminando la necesidad de comandos manuales.
- Sincronicé el nombre de la base de datos en todas las capas del proyecto (Docker, backend y SQL).
* **Resultado:** El sistema completo se ejecuta correctamente mediante un único comando (docker-compose up). El backend se conecta a la base de datos sin errores, el login funciona correctamente y los datos se mantienen persistentes gracias al uso de volúmenes. Además, la base de datos se inicializa automáticamente con datos reales, facilitando la puesta en marcha del proyecto por terceros.

> **Lección aprendida:** Docker no solo simplifica el despliegue, sino que obliga a mantener una configuración coherente entre todos los componentes del sistema. La correcta gestión de variables de entorno, nombres de servicios y datos iniciales es clave para evitar errores difíciles de depurar.

## Fecha: [20/04/2026] - Implementación de testing automático (Jest + Cypress)
* **Entrada 15:** Implementación de pruebas unitarias y E2E con mocks y depuración de errores
* **Tarea:** Implementar pruebas automáticas en el proyecto utilizando Jest para el backend y Cypress para pruebas End-to-End del frontend, cumpliendo los requisitos del proyecto de DAW.
* **Dificultad:** La implementación presentó múltiples problemas encadenados:
- Configuración inicial de Jest inexistente (Error: no test specified).
- Fallos en el test de login con errores 500 debido a dependencias no controladas (bcrypt, JWT).
- Conflictos entre librerías (bcrypt vs bcryptjs).
- Variables de entorno (JWT_SECRET) no disponibles en el entorno de testing.
- Problemas de integridad en E2E al usar datos mockeados que no existían en la base de datos (errores de clave foránea).
- Inconsistencias entre los datos mockeados y los datos reales esperados por los componentes React, provocando errores como toLowerCase of undefined.
- Problemas de sincronización en Cypress al esperar peticiones que no siempre se ejecutaban.
* **Diagnóstico:**
- Se identificó que los errores no provenían de una única causa, sino de varios factores típicos en testing:
- Dependencias externas no mockeadas correctamente.
- Diferencias entre entorno real y entorno de test.
- Datos mock incompletos o inconsistentes.
- Mal uso de interceptores en Cypress.
* **Decisión técnica:**
- Jest (backend):
  - Se configuró correctamente el script "test": "jest" en package.json.
  - Se mockearon dependencias externas:
- Base de datos (pool.execute)
  - Librería bcryptjs
  - Se añadió manualmente la variable de entorno JWT_SECRET en los tests.
  - Se adaptaron los datos mock para que coincidieran exactamente con la estructura real (usuario.password).
- Cypress (E2E):
  - Se implementaron interceptores (cy.intercept) para simular respuestas del backend.
  - Se creó un sistema de mocks dinámicos para eventos, permitiendo simular un backend real sin depender de la base de datos.
  - Se corrigieron errores de integridad referencial evitando llamadas reales a MySQL.
  - Se ajustaron los mocks para incluir todos los campos necesarios y evitar errores en el renderizado de React.
  - Se optimizó la sincronización de tests utilizando cy.wait() sobre peticiones clave (POST) en lugar de GET innecesarios.
* **Resultado:**
- Se logró implementar un sistema completo de testing automático:
- Pruebas unitarias del backend funcionando correctamente con Jest.
- Pruebas E2E del flujo completo de usuario (login + creación de evento) con Cypress.
- Tests estables, independientes de la base de datos y reproducibles.
- Eliminación de errores críticos y mejora de la robustez del sistema.

> * **Lección aprendida:**
El testing no consiste solo en comprobar funcionalidades, sino en aislar correctamente cada capa del sistema. Mockear dependencias externas (base de datos, autenticación, APIs) y replicar fielmente la estructura de datos real es clave para evitar errores y garantizar pruebas fiables.

### Fecha: [26/04/2026] - Corrección de solapamiento en lógica de notificaciones (DATEDIFF)
* **Entrada 16:**Resolución de duplicidad de emails en eventos con vencimiento inmediato
* **Tarea:** Corregir el error que provocaba el envío simultáneo de dos correos electrónicos ("Aviso 7 días" y "Aviso día actual") cuando un evento vencía el mismo día de su creación o verificación.
* **Dificultad:** La lógica de selección de tareas próximas (earlyTasks) utilizaba un rango inclusivo que capturaba eventos con 0 días de margen.
- El solapamiento de condiciones SQL generaba una redundancia de notificaciones que saturaba la bandeja de entrada del usuario para un mismo evento.
* **Diagnóstico:** Se identificó que la consulta SQL para earlyTasks usaba BETWEEN 0 AND 7.
* **Decisión técnica:**
- Se modificó exclusivamente la consulta SQL en notificacion.service.js.
- Se cambió el límite inferior del operador BETWEEN de 0 a 1.
- Con este cambio, earlyTasks solo selecciona eventos cuyo vencimiento sea entre mañana y los próximos 7 días, dejando el valor 0 exclusivamente para la lógica de lastDayTasks.
* **Resultado:**
- Segmentación correcta de las notificaciones: los eventos que vencen hoy ya no disparan el aviso de "próximo a vencer".
- El flujo de correos ahora es atómico y excluyente según la urgencia de la fecha.
- Se mantiene la integridad de los flags notifica_7_dias y notifica_ultimo_dia sin interferencias entre ellos.

> * **Lección aprendida:**
La precisión en los operadores de rango (BETWEEN) es crítica cuando se manejan estados temporales. Un desplazamiento de una sola unidad en el límite inferior es la diferencia entre un sistema que funciona correctamente y uno que genera ruido innecesario por duplicidad de procesos.

### [28/04/2026] - Implementación de analítica académica y feedback de tutoría
* **Entrada 17:** Sistema de medias ponderadas y filtrado avanzado de calificaciones
* **Tarea:** Atender al feedback de la tutoría final para diferenciar visualmente los exámenes y permitir el cálculo de la nota media ponderada de la asignatura.
* **Dificultad:** 
- La lógica de cálculo original no distinguía entre tipos de eventos, mezclando tareas y exámenes en un promedio simple.
- Riesgo de romper la integridad de los datos si el sistema trataba los valores null (pendiente de calificar) como un 0 (suspenso).
- Necesidad de reflejar la normativa académica donde los exámenes tienen un peso diferente (30%) frente a las tareas (70%).
* **Diagnóstico:** Se determinó que crear una sección nueva desde cero era inviable por tiempo. La solución óptima pasaba por transformar la vista de historial en un panel interactivo mediante estados de React.
* **Decisión técnica:** 
- Lógica de Negocio: Implementé la función calcularMediaPonderada utilizando filtrado por tipos. El algoritmo descarta valores no numéricos mediante e.nota !== null para asegurar que solo las tareas calificadas influyan en el promedio.
- UI/UX: Introduje un componente de filtrado dinámico mediante un select personalizado que permite conmutar entre la media de tareas, la de exámenes o la nota final proyectada.
- Normalización Gramatical: Utilicé un objeto mapeador (nombresPlurales) para corregir errores de pluralización y tildes en la interfaz (ej. "Exámenes" vs "Tareaes"), mejorando la calidad del acabado visual.
- Accesibilidad: Decidí mantener los bordes de foco (outline) nativos del navegador tras evaluar que eliminarlos sin una alternativa sólida perjudicaba la navegación mediante teclado.
* **Resultado:** El usuario ahora dispone de una herramienta de análisis en tiempo real que aplica los porcentajes oficiales (70/30), permitiéndole visualizar su progreso académico de forma precisa y filtrada por tipología de evento.

> * **Lección aprendida:** El feedback de última hora no siempre requiere rehacer el proyecto. A menudo, una capa de lógica bien aplicada sobre la estructura existente (en este caso, un filtro inteligente con pesos matemáticos) añade más valor que una funcionalidad nueva pero inacabada.