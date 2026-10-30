# Agenda VD Gestantes con Google Sheets: puesta en marcha

Son dos archivos:
- **`index.html`**: la app. Va en GitHub Pages.
- **`Codigo.gs`**: el conector. Va dentro de tu Google Sheet y deja que la app lea la hoja y escriba las fechas de visita.

## 1. Pasar el Excel a Google Sheets

1. Sube el Excel a Google Drive.
2. Ábrelo y elige **Archivo → Guardar como Hojas de cálculo de Google**.
3. A partir de ahora trabaja siempre en esa versión de Google. El .xlsx viejo ya no se actualiza.

## 2. Poner el conector

1. En la hoja de Google, entra a **Extensiones → Apps Script**.
2. Borra lo que aparece, pega todo el contenido de `Codigo.gs` y cambia `const PIN = '1234';` por tu propio PIN.
3. Guarda con el ícono del disquete.
4. Pulsa **Implementar → Nueva implementación**. En el engranaje, elige **Aplicación web**.
   - **Ejecutar como:** Yo
   - **Quién tiene acceso:** Cualquier persona
5. Pulsa **Implementar** y autoriza con tu cuenta de Google. Si aparece "Google no verificó esta app", entra a **Configuración avanzada → Ir a … (no seguro)**. El script es tuyo, así que es seguro.
6. Copia la **URL de la aplicación web**. Termina en `/exec`.

## 3. Subir la app a GitHub

1. Sube **todo el contenido** de la carpeta, con esta misma estructura:
   ```
   index.html
   manifest.webmanifest
   sw.js
   icon-192.png
   icon-512.png
   icon-maskable-512.png
   apple-touch-icon.png
   favicon-32.png
   ```
   Todos en la misma carpeta (la raíz del repositorio), sin subcarpetas.
   `Codigo.gs` y `GUIA.md` no hacen falta en GitHub.
2. Activa **Settings → Pages → main / root**.
3. Opcional: pega la URL `/exec` en `CONFIG.url`, al inicio del script de `index.html`, antes de subirlo. Así solo se pide el PIN.

## 4. Entrar e instalar

1. Abre la dirección de GitHub Pages en el celular.
2. Escribe el PIN (y la URL `/exec`, si no la dejaste fija) y pulsa **Entrar**. La sesión queda guardada en ese celular; no vuelve a pedir el PIN.
3. Para instalarla:
   - **Android (Chrome):** ⚙ Configuración → **Instalar app**. Si no aparece el botón, usa el menú ⋮ → "Instalar app".
   - **iPhone (Safari):** Compartir → **Agregar a inicio**.
4. Si se instala sin el ícono (como acceso directo), entra a ⚙ Configuración → **Revisar instalación**: muestra qué archivo falta o qué hay que cambiar.
5. Para salir o cambiar el PIN, entra a ⚙ Configuración → Conexión. Si cambias el PIN en el script, la app pedirá el nuevo en el siguiente uso.

## Cómo guarda las visitas

- **Visita hecha** abre una ventana con la fecha de la visita (hoy por defecto; se puede elegir un día anterior), el celular y la dirección. **Guardar visita** escribe la fecha en la columna que corresponde: VD, 2 PLAN P, 3 PLAN P, VD2, 1 VD PUERPERIO o 2VD DE PUERPERIO.
- Si en campo te dan otro celular u otra dirección, corrígelo en esa misma ventana y se actualiza en la hoja. Si la persona aparece en varias hojas, se actualiza en todas.
- Para cambiar solo el celular o la dirección, sin registrar una visita, usa **Editar datos**, en la tarjeta de la visita o en la pestaña Gestantes.
- **Registrar parto** escribe la fecha que elijas en la columna PARTO.
- Las fechas de visita solo se escriben en celdas vacías, nunca encima de otra fecha. El celular y la dirección sí reemplazan el dato anterior.
- **Visitadas hoy:** debajo de las visitas del día aparece la lista de las ya registradas, con un botón **Eliminar** (hay que tocarlo dos veces). Al eliminar, se borra la fecha de la hoja y la visita vuelve a la lista de pendientes. Solo se borra si la fecha de la hoja coincide con la de esa visita.
- En la pestaña **Mes**, los días con visitas hechas muestran ✓ y la cantidad. Al tocar un día pasado se ve su lista de visitadas, también con Eliminar.
- Si no hay internet, el cambio queda pendiente en **Alertas**, con el botón "Reintentar guardar".
- La app vuelve a leer la hoja cada vez que la abres (si pasaron más de 2 minutos) o cuando pulsas **Actualizar**.

## Traslado a PUERPERAS

- La app solo lee la hoja de gestantes (hoy: NOMINAL DE GESTANTES SEC 38B). PUERPERAS no se usa para programar visitas.
- Cuando una fila de la hoja de gestantes tiene en **2VD DE PUERPERIO** una fecha de hace 3 días o más (`DIAS_ESPERA` en `Codigo.gs`), el conector la **traslada** a PUERPERAS: la agrega al final, con cada dato bajo su mismo encabezado, y la borra de la hoja de gestantes.
- Los datos que no tienen columna en PUERPERAS (VD DE SFE, VD3) se anotan en OBSERVACIONES. EDAD y EG ACTUAL quedan con su fórmula.
- Si esa persona ya existía en PUERPERAS (mismo DNI), no se duplica: solo se completan sus celdas vacías.
- Esos 3 días de espera sirven para poder eliminar la 2ª VD si se marcó por error. Pasado ese tiempo, la corrección se hace a mano en PUERPERAS.
- El traslado se revisa cada vez que la app lee o guarda en la hoja. Así se trasladan también las que anotes a mano en la hoja.
- En la hoja de Google hay un menú **Agenda VD → Trasladar puérperas** para hacerlo en el momento.
- Si cambias el nombre de la hoja de gestantes o de PUERPERAS, cámbialo también al inicio de `Codigo.gs` (`HOJA_GESTANTES`, `HOJA_PUERPERAS`). No importan mayúsculas, tildes ni espacios dobles. Si no lo cambias, el script igual busca una hoja con "GESTANTE" o "NOMINAL" en el nombre.

## Adolescentes

- La app lee la hoja **ADOLESCENTES** y programa dos visitas, en los mismos días GC/APS y con el mismo máximo por día que las gestantes:
  - **1ª visita:** un mes después de la 1ª atención (columna O; si está vacía, CRED 1 ATENC en la columna P). Tolerancia de 15 días.
  - **2ª visita:** entre el día 80 y el 90 desde la 1ª atención (la misma fecha base que la 1ª visita). Se programa para todos, también donde la hoja dice NA. El día 80 y la ventana de 10 días se pueden cambiar en Configuración → Reglas de visita.
- **Visita hecha** escribe la fecha en la columna **L** (1ª visita) o **M** (2ª visita).
- No se programan las que dicen "CUMPLIÓ AÑOS / NO INGRESA", migró o viajó.
- En Configuración → Adolescentes puedes elegir: todos, solo los que tienen tu nombre en RESPONSABLE (columna K), o ninguno.
- **Importante:** en esa hoja los títulos de la fila 2 no coinciden con los datos (los datos están corridos 1 a 2 columnas). Por eso la app usa las letras de columna que están en `CONFIG.adol`, al inicio de `index.html`. Si insertas o mueves columnas en ADOLESCENTES, cambia esas letras (y `ADOL_COL_DNI` / `ADOL_COL_NOMBRE` en `Codigo.gs`).

## Ver el horario de otra persona

En la pestaña **Mes**, el selector **Ver horario de** muestra el calendario de turnos de cualquier persona de la hoja HORARIO (solo lectura). Al tocar un día, aparece **Personal de turno este día**, agrupado por turno (GC, APS, M, T…).

## Partos del mes e inicio del embarazo

- **Partos del mes:** gestantes con FPP en el mes (con flechas para ver otros meses). Indica si ya dieron a luz, si siguen pendientes o si la FPP pasó sin parto anotado.
- **≤14 sem:** gestantes que están en las primeras 14 semanas según la FUR, con su FUR, FPP, 1ª APN, si ya tienen la 1ª VD y su próxima visita. El límite de semanas se cambia en `CONFIG.semanasInicio`.

## Seguridad

- La hoja tiene datos de pacientes. No pongas el PIN en GitHub; cada persona lo escribe en su celular.
- Para quitarle el acceso a alguien, cambia el PIN en el script y crea una nueva versión: **Implementar → Gestionar implementaciones → editar → Versión: nueva → Implementar**. La URL no cambia.

## Si cambias el script

Después de editar `Codigo.gs`, haz siempre **Implementar → Gestionar implementaciones → editar → Nueva versión**. Si no, la app sigue usando la versión anterior.

## Cada mes: cambiar el horario

La app saca los días de visita solo de la hoja HORARIO. Si el mes actual no está, la app muestra un aviso y no programa visitas para esos días.

**Puedes reemplazar octubre por noviembre en la misma hoja.** Para que no haya problemas:
1. **Hazlo el último día de turno del mes o el día 1.** Si borras octubre antes de que termine, los días que faltan de octubre se quedan sin horario y sus visitas pasan a noviembre.
2. **Cambia TODOS los títulos del mes.** La hoja HORARIO tiene el título `OCTUBRE - DEL 2026` dos veces: arriba y en el segundo bloque (alrededor de la fila 96). Si cambias solo uno, la mitad del personal queda leída como octubre.
3. **Deja el formato igual:** fila con `NOMBRES Y APELLIDOS`, debajo la fila con los números de día 1…30, el N° en la columna A y los nombres escritos igual que antes (por ejemplo `ROSSANA D. RAVINES COBIAN`).
4. **Si queda la columna del día 31 de octubre**, no pasa nada: la app ignora los días que no existen en el mes. Igual conviene vaciarla.
5. **Las visitas ya hechas no se pierden.** Están en la hoja de gestantes, no en HORARIO.

Otra forma más segura: pega noviembre **debajo** de octubre (con su propio título) unos días antes de fin de mes y borra octubre después. Así las visitas de noviembre se programan desde antes.

Cómo comprobarlo: toca **Actualizar** en la app. El aviso de arriba debe decir "Horario cargado de la hoja HORARIO: noviembre 2026".
