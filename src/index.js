// Inserte el código aquí
async function getDatos() {
    const response = await fetch("https://pokeapi.co/docs/v2#pokemon")
    let datos = response.json()
    datos.forEach(tarea=>{
        let p = document.createElement("p")

    })
}