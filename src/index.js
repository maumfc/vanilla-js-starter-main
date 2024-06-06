async function getDatos() {
    try {
        const response = await fetch("http://localhost:3000/api/task");
        let datos = await response.json();
        datos.forEach(tarea => {
            let p = document.createElement("p");
            p.textContent = tarea.name;
            document.body.appendChild(p);
        });
    } catch (error) {
        console.log(error);
    }
}

async function agregarTareaAPI(tarea) {
    try {
        const response = await fetch("http://localhost:3000/api/task", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(tarea)
        });
        if (!response.ok) {
            throw new Error("Error al agregar la tarea");
        }
        const nuevaTarea = await response.json();
        return nuevaTarea;
    } catch (error) {
        console.log(error);
    }
}

/* VARIABLES */
const formulario = document.querySelector("#formulario");
const tareas = document.querySelector("#tareas");
const total = document.querySelector("#total");
const completadas = document.querySelector("#completadas");
let task = [];

/* EVENTOS */
(() => {
    formulario.addEventListener('submit', validarFormulario);
    tareas.addEventListener("click", eliminarTarea);
    tareas.addEventListener("click", completarTarea);
    document.addEventListener("DOMContentLoaded", () => {
        let datosLS = JSON.parse(localStorage.getItem("tareas")) || [];
        task = datosLS;
        agregarHTML();
    });
})();

/* FUNCIONES */
async function validarFormulario(e) {
    e.preventDefault();
    //validar los campos
    const tarea = document.querySelector("#tarea").value;
    if (tarea.trim().length === 0) {
        console.log('vacio');
        return;
    }
    //creamos el objeto tarea
    const objTarea = { id: Date.now(), tarea: tarea, estado: false };
    //agregamos al array sin mutar dicho arreglo
    task = [...task, objTarea];

    // Agregar la tarea a la API
    const nuevaTarea = await agregarTareaAPI(objTarea);
    if (nuevaTarea) {
        // Actualizar el array con la tarea devuelta por la API
        task = task.map(t => t.id === objTarea.id ? nuevaTarea : t);
    }

    formulario.reset();
    //agregamos al HTML
    agregarHTML();
}

function agregarHTML() {
    //limpiar el HTML
    while (tareas.firstChild) {
        tareas.removeChild(tareas.firstChild);
    }
    if (task.length > 0) {
        task.forEach(item => {
            const elemento = document.createElement('div');
            elemento.classList.add('item-tarea');
            elemento.innerHTML = `
                <p>${item.estado ? (
                    `<span class='completa'>${item.tarea}</span>`
                ) : (
                    `<span>${item.tarea}</span>`
                )}</p>
                <div class="botones">
                    <button class="eliminar" data-id="${item.id}">x</button>
                    <button class="completada" data-id="${item.id}">?</button>
                </div>
            `;
            tareas.appendChild(elemento);
        });
    } else {
        const mensaje = document.createElement("h5");
        mensaje.textContent = "~SIN TAREAS~";
        tareas.appendChild(mensaje);
    }
    let totalTareas = task.length;
    let tareasCompletas = task.filter(item => item.estado === true).length;
    total.textContent = `Total tareas: ${totalTareas}`;
    completadas.textContent = `Tareas Completadas: ${tareasCompletas}`;
    //persistir los datos con localStorage
    localStorage.setItem("tareas", JSON.stringify(task));
}

function eliminarTarea(e) {
    if (e.target.classList.contains("eliminar")) {
        const tareaID = Number(e.target.getAttribute("data-id"));
        //eliminamos con el array method filter
        const nuevasTareas = task.filter((item) => item.id !== tareaID);
        task = nuevasTareas;
        agregarHTML();
    }
}

function completarTarea(e) {
    if (e.target.classList.contains("completada")) {
        const tareaID = Number(e.target.getAttribute("data-id"));
        const nuevasTareas = task.map(item => {
            if (item.id === tareaID) {
                item.estado = !item.estado;
                return item;
            } else {
                return item;
            }
        });
        //editamos el arreglo
        task = nuevasTareas;
        agregarHTML();
    }
}