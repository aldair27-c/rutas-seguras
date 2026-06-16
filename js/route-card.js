
// ============================================
// WEB COMPONENT - RouteCard
// ============================================

class RouteCard extends HTMLElement {
    constructor() {
        super();
        
        // 1. Shadow DOM
        this.attachShadow({ mode: 'open' });
        
        // 2. Template
        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                /* Estilos del Shadow DOM */
                .card {
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                    border-left: 4px solid #2563eb;
                    transition: transform 0.3s;
                }
                
                .card:hover {
                    transform: translateY(-5px);
                }
                
                h3 {
                    color: #2563eb;
                    margin: 0 0 10px 0;
                }
                
                p {
                    margin: 8px 0;
                    color: #4b5563;
                }
                
                .weather {
                    background: #f0f7ff;
                    padding: 10px;
                    border-radius: 8px;
                    margin: 10px 0;
                }
                
                .btn-group {
                    display: flex;
                    gap: 10px;
                    margin-top: 15px;
                }
                
                button {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    flex: 1;
                }
                
                .btn-ver {
                    background: #2563eb;
                    color: white;
                }
                
                .btn-ver:hover {
                    background: #1e40af;
                }
                
                .btn-eliminar {
                    background: #ef4444;
                    color: white;
                }
                
                .btn-eliminar:hover {
                    background: #dc2626;
                }
            </style>
            
            <div class="card">
                <h3 id="nombreRuta">Ruta</h3>
                <p>🚌 Conductor: <span id="conductor"></span></p>
                <p>⏰ Hora: <span id="hora"></span></p>
                <p>📍 Ciudad: <span id="ciudad"></span></p>
                <div class="weather" id="climaInfo">
                    🌤️ Cargando clima...
                </div>
                <div class="btn-group">
                    <button class="btn-ver" id="btnVer">👁️ Ver</button>
                    <button class="btn-eliminar" id="btnEliminar">🗑️ Eliminar</button>
                </div>
            </div>
        `;
        
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
    
    // 3. Atributos que vamos a observar
    static get observedAttributes() {
        return ['nombre', 'conductor', 'hora', 'ciudad', 'id-ruta'];
    }
    
    // 4. Cuando cambia un atributo
    attributeChangedCallback(nombre, viejo, nuevo) {
        if (viejo === nuevo) return;
        
        if (nombre === 'nombre') {
            this.shadowRoot.querySelector('#nombreRuta').textContent = nuevo;
        } else if (nombre === 'conductor') {
            this.shadowRoot.querySelector('#conductor').textContent = nuevo;
        } else if (nombre === 'hora') {
            this.shadowRoot.querySelector('#hora').textContent = nuevo;
        } else if (nombre === 'ciudad') {
            this.shadowRoot.querySelector('#ciudad').textContent = nuevo;
            this.obtenerClima(nuevo); // Llamar a la API
        }
    }
    
    // 5. Cuando se conecta al DOM
    connectedCallback() {
        // Botón Ver
        const btnVer = this.shadowRoot.querySelector('#btnVer');
        btnVer.addEventListener('click', () => {
            const id = this.getAttribute('id-ruta');
            // Redirigir a detalle
            window.location.href = `ruta.html?id=${id}`;
        });
        
        // Botón Eliminar
        const btnEliminar = this.shadowRoot.querySelector('#btnEliminar');
        btnEliminar.addEventListener('click', () => {
            const id = this.getAttribute('id-ruta');
            const nombre = this.getAttribute('nombre');
            
            // CREAR EVENTO PERSONALIZADO
            const evento = new CustomEvent('eliminar-ruta', {
                detail: {
                    id: id,
                    nombre: nombre
                },
                bubbles: true,
                composed: true
            });
            
            this.dispatchEvent(evento);
        });
    }
    
    // 6. Función para obtener clima (async/await)
    async obtenerClima(ciudad) {
        const climaDiv = this.shadowRoot.querySelector('#climaInfo');
        
        // MOSTRAR QUE ESTÁ CARGANDO
        climaDiv.innerHTML = '⏳ Cargando clima...';
        
        try {
            // ⚠️ REEMPLAZA CON TU API KEY
            const API_KEY = '7cc3830d63022e0d679d425fd95041bb';
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${API_KEY}&units=metric&lang=es`;
            
            // FETCH CON ASYNC/AWAIT
            const respuesta = await fetch(url);
            
            if (!respuesta.ok) {
                throw new Error('Error al obtener clima');
            }
            
            const datos = await respuesta.json();
            
            // Mostrar clima
            const temp = Math.round(datos.main.temp);
            const descripcion = datos.weather[0].description;
            const icono = this.obtenerEmoji(datos.weather[0].icon);
            
            climaDiv.innerHTML = `
                ${icono} ${descripcion} - ${temp}°C
            `;
            
        } catch (error) {
            console.error('Error:', error);
            climaDiv.innerHTML = '❌ No se pudo cargar el clima';
        }
    }
    
    // 7. Convertir íconos de OpenWeather a emojis
    obtenerEmoji(icono) {
        const emojis = {
            '01d': '☀️', '01n': '🌙',
            '02d': '⛅', '02n': '☁️',
            '03d': '☁️', '03n': '☁️',
            '04d': '☁️', '04n': '☁️',
            '09d': '🌧️', '09n': '🌧️',
            '10d': '🌦️', '10n': '🌧️',
            '11d': '⛈️', '11n': '⛈️',
            '13d': '❄️', '13n': '❄️',
            '50d': '🌫️', '50n': '🌫️'
        };
        return emojis[icono] || '🌤️';
    }
}

// 8. Registrar el Web Component
customElements.define('route-card', RouteCard);