async function getDatos() {
    try {
      const response = await fetch("http://localhost:3000/api/task");
      let datos = await response.json();
      return datos;
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
      location.reload();
      if (!response.ok) {
        throw new Error("Error al agregar la tarea");
      }
      const nuevaTarea = await response.json();
      return nuevaTarea;
    } catch (error) {
      console.log(error);
    }
  }
  
  const formulario = document.querySelector("#formulario");
  const tareas = document.querySelector("#tareas");
  const total = document.querySelector("#total");
  const completadas = document.querySelector("#completadas");
  let task = [];
  
  formulario.addEventListener('submit', validarFormulario);
  tareas.addEventListener("click", (e) => {
    if (e.target.classList.contains("eliminar")) {
      eliminarTarea(e);
    } else if (e.target.classList.contains("completada")) {
      completarTarea(e);
    }
  });
  
  document.addEventListener("DOMContentLoaded", async () => {
    const tareas = await getDatos();
    console.log(tareas);
    if (tareas) {
      task = tareas;
    }
    agregarHTML();
  });
  
  async function validarFormulario(e) {
    e.preventDefault();
    const tareaTexto = document.querySelector("#tarea").value;
    if (tareaTexto.trim().length === 0) {
      console.log('vacio');
      return;
    }
    const tarea = {
      id: Date.now(),
      tarea: tareaTexto,
      estado: false
    };
    const nuevaTarea = await agregarTareaAPI(tarea);
    if (nuevaTarea) {
      task = [...task, nuevaTarea];
      agregarHTML();
    }
    formulario.reset();
  }
  
  async function agregarHTML() {
    while (tareas.firstChild) {
      tareas.removeChild(tareas.firstChild);
    }
    if (task.length > 0) {
      task.forEach(item => {
        const elemento = document.createElement('div');
        elemento.classList.add('item-tarea');
        elemento.innerHTML = `
          <p>${item.estado? (
            `<span class='completa'>${item.tarea}</span>`
          ) : (
            `<span>${item.tarea}</span>`
          )}</p>
          <div class="botones">
            <button class="eliminar" data-id="${item.id}">x</button>
            <button class="completada" data-id="${item.id}">✓</button>
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
    
    // Verificar que los contadores se estén actualizando correctamente
    if (totalTareas === 0 || tareasCompletas === 0) {
      console.log("Contadores actualizados correctamente");
    } else {
      console.log("Error al actualizar contadores");
    }
    
    // Verificar que los botones se estén creando correctamente
    const botones = tareas.querySelectorAll("button");
    if (botones.length > 0) {
      console.log("Botones creados correctamente");
    } else {
      console.log("Error al crear botones");
    }
  }
  
  async function eliminarTarea(e) {
    const tareaID = e.target.getAttribute("data-id");
    const tarea = task.find(item => item.id === tareaID);
    if (tarea) {
      await deleteTarea(tareaID);
      task = task.filter(item => item.id!== tareaID);
      agregarHTML();
    }
  }
  
  async function completarTarea(e) {
    const tareaID = e.target.getAttribute("data-id");
    const tarea = task.find(item => item.id === tareaID);
    if (tarea) {
      tarea.estado =!tarea.estado;
      await updateTarea(tareaID, tarea);
      agregarHTML();
    }
  }
  
  async function deleteTarea(id) {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/task/${id}`, {
        method: "DELETE"
      });
      if (!respuesta.ok) {
        throw new Error("Error al eliminar la tarea");
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function updateTarea(id, tarea) {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/task/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(tarea)
      });
      if (!respuesta.ok) {
        throw new Error("Error al actualizar la tarea");
      }
    } catch (error) {
      console.log(error);
    }
  }