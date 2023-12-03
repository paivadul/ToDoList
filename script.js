document.addEventListener('DOMContentLoaded', function () {
    
    const listaTareas = document.getElementById('listaTareas');
    const formularioTarea = document.getElementById('formularioTarea');
    const limpiarCompletadasBoton = document.getElementById('limpiarCompletadas');

    function renderizarTareas() {
        listaTareas.innerHTML = '';

        const tareas = JSON.parse(localStorage.getItem('tareas')) || [];

        tareas.forEach((tarea, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('tarea');

            const checkTarea = document.createElement('input');
            checkTarea.type = 'checkbox';
            checkTarea.checked = tarea.completada;
            checkTarea.classList.add('check');
            checkTarea.addEventListener('change', () => {
                tarea.completada = !tarea.completada;
                localStorage.setItem('tareas', JSON.stringify(tareas));
                renderizarTareas();
            });

            const detallesTarea = document.createElement('span');
            detallesTarea.textContent = `${tarea.titulo} ${tarea.alarma ? `(${tarea.alarma})` : ''}`;
            detallesTarea.addEventListener('click', () => {
                alert(`Detalles de la tarea:\n${tarea.titulo}\nAlarma: ${tarea.alarma}`);
            });

            const prioridadSelector = document.createElement('select');
            prioridadSelector.classList.add('prioridad-selector', 'vaporwave-select');
            ['baja', 'media', 'alta'].forEach(opcion => {
                prioridadSelector.className = 'prioridad'
                const option = document.createElement('option');
                option.value = opcion.toLowerCase();
                option.text = opcion;
                prioridadSelector.add(option);
            });
            prioridadSelector.value = tarea.prioridad || 'media';
            prioridadSelector.style.borderRadius = '30px';
            prioridadSelector.addEventListener('change', () => {
                tarea.prioridad = prioridadSelector.value;
                localStorage.setItem('tareas', JSON.stringify(tareas));
            });

            listItem.appendChild(checkTarea);
            listItem.appendChild(detallesTarea);
            listItem.appendChild(prioridadSelector);
            listaTareas.appendChild(listItem);

            if (tarea.lista) {
                listItem.classList.add('tarea-lista');
            }
        });
    }

    function limpiarTareasCompletadas() {
        const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
        const tareasActualizadas = tareas.filter(tarea => !tarea.completada);
        localStorage.setItem('tareas', JSON.stringify(tareasActualizadas));
        renderizarTareas();
    }

    function establecerAlarma(horaAlarma, tarea) {
        const ahora = new Date();
        const fechaAlarma = new Date(ahora.toDateString() + ' ' + horaAlarma);
        const tiempoHastaAlarma = fechaAlarma - ahora;

        if (tiempoHastaAlarma > 0) {
            setTimeout(() => {
                alert(`¡Alarma para la tarea ${tarea.titulo}!`);
                mostrarNotificacion('Tarea pendiente', `¡Es hora de realizar la tarea "${tarea.titulo}"!`);
            }, tiempoHastaAlarma);
        }
    }

    function mostrarNotificacion(titulo, mensaje) {
        if ('Notification' in window) {
            Notification.requestPermission().then(function (permiso) {
                if (permiso === 'granted') {
                    new Notification(titulo, { body: mensaje });
                }
            });
        }
    }

    formularioTarea.addEventListener('submit', function (evento) {
        evento.preventDefault();

        const titulo = evento.target.elements.titulo.value;
        const alarma = evento.target.elements.alarma.value;
        const repetirDiariamente = evento.target.elements.repetirDiariamente.checked;
        const prioridad = evento.target.elements.prioridad.value;

        if (titulo) {
            const nuevaTarea = {
                titulo,
                alarma: alarma || null,
                repetirDiariamente,
                completada: false,
                prioridad,
                lista: false
            };

            const tareas = JSON.parse(localStorage.getItem('tareas')) || [];
            tareas.push(nuevaTarea);
            localStorage.setItem('tareas', JSON.stringify(tareas));

            renderizarTareas();

            if (alarma) {
                establecerAlarma(alarma, nuevaTarea);
            }

            evento.target.reset();
        } else {
            alert('Por favor, ingresa el título de la tarea.');
        }
    });

    limpiarCompletadasBoton.addEventListener('click', limpiarTareasCompletadas);

    renderizarTareas();
});