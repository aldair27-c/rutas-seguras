
// ============================================
// IMPORTAR EL WEB COMPONENT
// ============================================
import './route-card.js';

// ============================================
// 1. ESTADO GLOBAL (donde guardamos los datos)
// ============================================
let rutas = [];

// ============================================
// 2. CARGAR DATOS GUARDADOS
// ============================================
function cargarDatos() {
    const datosGuardados = localStorage.getItem('rutas');
    
    if (datosGuardados) {
        rutas = JSON.parse(datosGuardados);
    } else {
        // DATOS DE EJEMPLO
        rutas = [
            {
                id: '1',
                nombre: 'Ruta Norte',
                conductor: 'Juan Pérez',
                hora: '07:00',
                ciudad: 'Bogotá',
                estudiantes: [
                    { id: 's1', nombre: 'María Gómez', edad: 8 },
                    { id: 's2', nombre: 'Carlos López', edad: 10 }
                ]
            },
            {
                id: '2',
                nombre: 'Ruta Sur',
                conductor: 'Ana Martínez',
                hora: '07:30',
                ciudad: 'Medellín',
                estudiantes: [
                    { id: 's3', nombre: 'Laura Torres', edad: 7 }
                ]
            }
        ];
        guardarDatos();
    }
}

// ============================================
// 3. GUARDAR DATOS
// ============================================
function guardarDatos() {
    localStorage.setItem('rutas', JSON.stringify(rutas));
}

// ============================================
// 4. FUNCIONES CRUD (CREAR, LEER, ACTUALIZAR, ELIMINAR)
// ============================================

// CREAR RUTA
function crearRuta(datos) {
    const nuevaRuta = {
        id: Date.now().toString(),
        nombre: datos.nombre,
        conductor: datos.conductor,
        hora: datos.hora,
        ciudad: datos.ciudad,
        estudiantes: []
    };
    
    rutas.push(nuevaRuta);
    guardarDatos();
    renderizarRutas();
}

// ELIMINAR RUTA
function eliminarRuta(id) {
    const index = rutas.findIndex(r => r.id === id);
    if (index !== -1) {
        rutas.splice(index, 1);
        guardarDatos();
        renderizarRutas();
    }
}

// BUSCAR RUTA POR ID
function buscarRuta(id) {
    return rutas.find(r => r.id === id);
}

// AGREGAR ESTUDIANTE
function agregarEstudiante(idRuta, datos) {
    const ruta = buscarRuta(idRuta);
    if (!ruta) return;
    
    const nuevoEstudiante = {
        id: Date.now().toString(),
        nombre: datos.nombre,
        edad: parseInt(datos.edad)
    };
    
    ruta.estudiantes.push(nuevoEstudiante);
    guardarDatos();
    renderizarDetalleRuta(idRuta);
}

// ELIMINAR ESTUDIANTE
function eliminarEstudiante(idRuta, idEstudiante) {
    const ruta = buscarRuta(idRuta);
    if (!ruta) return;
    
    const index = ruta.estudiantes.findIndex(e => e.id === idEstudiante);
    if (index !== -1) {
        ruta.estudiantes.splice(index, 1);
        guardarDatos();
        renderizarDetalleRuta(idRuta);
    }
}

// ============================================
// 5. VALIDACIÓN DE FORMULARIOS
// ============================================
function validarRuta(datos) {
    if (!datos.nombre || datos.nombre.trim().length < 3) {
        return 'El nombre debe tener al menos 3 caracteres';
    }
    if (!datos.conductor || datos.conductor.trim().length < 3) {
        return 'El nombre del conductor debe tener al menos 3 caracteres';
    }
    if (!datos.hora) {
        return 'La hora es obligatoria';
    }
    if (!datos.ciudad || datos.ciudad.trim().length < 2) {
        return 'La ciudad es obligatoria';
    }
    return null; // Sin errores
}

function validarEstudiante(datos) {
    if (!datos.nombre || datos.nombre.trim().length < 2) {
        return 'El nombre debe tener al menos 2 caracteres';
    }
    if (!datos.edad || datos.edad < 3 || datos.edad > 18) {
        return 'La edad debe estar entre 3 y 18 años';
    }
    return null; // Sin errores
}

// ============================================
// 6. RENDERIZAR (MOSTRAR EN PANTALLA)
// ============================================

// RENDERIZAR TODAS LAS RUTAS
function renderizarRutas() {
    const contenedor = document.getElementById('routes-container');
    if (!contenedor) return;
    
    // Limpiar contenedor
    contenedor.innerHTML = '';
    
    if (rutas.length === 0) {
        contenedor.innerHTML = `
            <p style="text-align:center; color:#6b7280; padding:40px;">
                No hay rutas registradas
            </p>
        `;
        return;
    }
    
    // Crear cada tarjeta con el Web Component
    rutas.forEach(ruta => {
        const tarjeta = document.createElement('route-card');
        tarjeta.setAttribute('nombre', ruta.nombre);
        tarjeta.setAttribute('conductor', ruta.conductor);
        tarjeta.setAttribute('hora', ruta.hora);
        tarjeta.setAttribute('ciudad', ruta.ciudad);
        tarjeta.setAttribute('id-ruta', ruta.id);
        
        contenedor.appendChild(tarjeta);
    });
}

// RENDERIZAR DETALLE DE UNA RUTA
function renderizarDetalleRuta(idRuta) {
    const ruta = buscarRuta(idRuta);
    if (!ruta) {
        window.location.href = 'rutas.html';
        return;
    }
    
    // Mostrar información de la ruta
    const detalles = document.getElementById('route-details');
    if (detalles) {
        detalles.innerHTML = `
            <div style="background:white; padding:20px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                <h2 style="color:#2563eb;">${ruta.nombre}</h2>
                <p>👨‍✈️ Conductor: ${ruta.conductor}</p>
                <p>⏰ Hora: ${ruta.hora}</p>
                <p>📍 Ciudad: ${ruta.ciudad}</p>
                <p>👨‍🎓 Estudiantes: ${ruta.estudiantes.length}</p>
                <button onclick="window.location.href='rutas.html'" 
                        style="margin-top:15px; padding:10px 20px; background:#6b7280; color:white; border:none; border-radius:6px; cursor:pointer;">
                    ⬅ Volver
                </button>
            </div>
        `;
    }
    
    // Mostrar estudiantes
    const contenedorEstudiantes = document.getElementById('students-container');
    if (contenedorEstudiantes) {
        contenedorEstudiantes.innerHTML = '';
        
        if (ruta.estudiantes.length === 0) {
            contenedorEstudiantes.innerHTML = `
                <p style="text-align:center; color:#6b7280; padding:20px;">
                    No hay estudiantes asignados
                </p>
            `;
            return;
        }
        
        ruta.estudiantes.forEach(estudiante => {
            const div = document.createElement('div');
            div.style.cssText = `
                background: white;
                padding: 15px;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            `;
            
            div.innerHTML = `
                <span><strong>${estudiante.nombre}</strong> - Edad: ${estudiante.edad} años</span>
                <button class="btn-eliminar-estudiante" 
                        data-id="${estudiante.id}"
                        style="background:#ef4444; color:white; border:none; padding:6px 14px; border-radius:6px; cursor:pointer;">
                    🗑️ Eliminar
                </button>
            `;
            
            contenedorEstudiantes.appendChild(div);
        });
        
        // Eventos para eliminar estudiantes
        document.querySelectorAll('.btn-eliminar-estudiante').forEach(btn => {
            btn.addEventListener('click', function() {
                const idEstudiante = this.getAttribute('data-id');
                if (confirm('¿Eliminar este estudiante?')) {
                    eliminarEstudiante(idRuta, idEstudiante);
                }
            });
        });
    }
}

// ============================================
// 7. NOTIFICACIONES
// ============================================
function mostrarMensaje(texto, tipo = 'info') {
    const colores = {
        exito: '#22c55e',
        error: '#ef4444',
        info: '#2563eb'
    };
    
    const div = document.createElement('div');
    div.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colores[tipo] || colores.info};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    div.textContent = texto;
    
    document.body.appendChild(div);
    
    setTimeout(() => {
        div.remove();
    }, 3000);
}

// ============================================
// 8. INICIALIZAR LA APLICACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    
    // Cargar datos
    cargarDatos();
    
    // Verificar en qué página estamos
    const path = window.location.pathname;
    
    if (path.includes('rutas.html')) {
        iniciarPaginaRutas();
    } else if (path.includes('ruta.html')) {
        iniciarPaginaDetalle();
    }
});

// ============================================
// 9. PÁGINA DE RUTAS
// ============================================
function iniciarPaginaRutas() {
    // Renderizar rutas
    renderizarRutas();
    
    // Formulario para crear ruta
    const formulario = document.getElementById('route-form');
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const datos = {
                nombre: document.getElementById('route-name').value,
                conductor: document.getElementById('driver-name').value,
                hora: document.getElementById('departure-time').value,
                ciudad: document.getElementById('city').value
            };
            
            // Validar
            const error = validarRuta(datos);
            if (error) {
                mostrarMensaje('❌ ' + error, 'error');
                return;
            }
            
            // Crear ruta
            crearRuta(datos);
            formulario.reset();
            mostrarMensaje('✅ Ruta creada exitosamente', 'exito');
        });
    }
    
    // ESCUCHAR EVENTO PERSONALIZADO 'eliminar-ruta'
    document.addEventListener('eliminar-ruta', function(e) {
        const { id, nombre } = e.detail;
        if (confirm(`¿Eliminar la ruta "${nombre}"?`)) {
            eliminarRuta(id);
            mostrarMensaje(`✅ Ruta "${nombre}" eliminada`, 'exito');
        }
    });
}

// ============================================
// 10. PÁGINA DE DETALLE
// ============================================
function iniciarPaginaDetalle() {
    // Obtener ID de la URL
    const params = new URLSearchParams(window.location.search);
    const idRuta = params.get('id');
    
    if (!idRuta) {
        window.location.href = 'rutas.html';
        return;
    }
    
    // Renderizar detalle
    renderizarDetalleRuta(idRuta);
    
    // Formulario para agregar estudiante
    const formulario = document.getElementById('student-form');
    if (formulario) {
        formulario.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const datos = {
                nombre: document.getElementById('student-name').value,
                edad: document.getElementById('student-age').value
            };
            
            // Validar
            const error = validarEstudiante(datos);
            if (error) {
                mostrarMensaje('❌ ' + error, 'error');
                return;
            }
            
            // Agregar estudiante
            agregarEstudiante(idRuta, datos);
            formulario.reset();
            mostrarMensaje('✅ Estudiante agregado', 'exito');
        });
    }
}

// ============================================
// 11. AGREGAR ESTILOS PARA NOTIFICACIONES
// ============================================
const estilos = document.createElement('style');
estilos.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
`;
document.head.appendChild(estilos);

// ============================================
// 12. EXPORTAR PARA DEBUG (OPCIONAL)
// ============================================
console.log('🚌 Rutas Seguras Kids iniciado');
console.log('📊 Rutas:', rutas);