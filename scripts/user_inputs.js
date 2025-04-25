function addEdgeInput() {
    const container = document.getElementById('edges-container');
    const edgeDiv = document.createElement('div');
    edgeDiv.style.marginBottom = '10px';
    
    const inputsGroup = document.createElement('div');
    inputsGroup.className = 'edgeInputsGroup';

    const input1 = document.createElement('input');
    input1.className = 'edgeInput'
    input1.maxLength = '1'
    input1.type = 'text';

    const input2 = document.createElement('input');
    input2.className = 'edgeInput'
    input2.maxLength = '1'
    input2.type = 'text';

    const capability = document.createElement('input');
    capability.className = 'edgeInput'
    capability.type = 'number';
    capability.min = '0'
    capability.value = '0'


    inputsGroup.appendChild(input1);
    inputsGroup.appendChild(input2);
    inputsGroup.appendChild(document.createTextNode(' = '));
    inputsGroup.appendChild(capability);

    edgeDiv.appendChild(inputsGroup);
    container.appendChild(edgeDiv);
}

function validateAllInputs() {
    // TODO: validar que no se repitan los mismos lados en el input.
    // TODO: siempre debe existir el lado s y el lado t.
    return
}

function getNetworkByInput() {
    edgeGroups = document.querySelectorAll('.edgeInputsGroup');
    network = [];
    edgeGroups.forEach((group, index) => {
        inputs = group.querySelectorAll('input');
        from = inputs[0].value.trim();
        to = inputs[1].value.trim();
        capability = inputs[2].value;
        if (!(from === '' && to === '')) {
            network.push([from, to, capability, 0])
        }
    });
    return network;
}

function drawGraphButton() {
    var boton = document.getElementById("drawGraphButton");
    boton.disabled = true;
    network = getNetworkByInput()
    const container = document.getElementById('network_row');
    const originalGraph = document.createElement('div');
    originalGraph.id='grafo_original'
    const titleOriginalGraph = document.createElement('h2');
    titleOriginalGraph.textContent = `Grafo original:`
    originalGraph.appendChild(titleOriginalGraph)
    container.appendChild(originalGraph)
    createEdgeInfo(network)
    drawGraph()
    container.appendChild(document.createElement('br'))
    container.appendChild(document.createElement('hr'))
}

function runDinicButton() {
    var boton = document.getElementById("runDinicButton");
    boton.disabled = true;
    const container = document.getElementById('network_row');
    const dinicSolution = document.createElement('div');
    dinicSolution.id='dinic_solution'
    const titleDinicSolution = document.createElement('h2');
    titleDinicSolution.textContent = `Resolución con Dinic:`
    dinicSolution.appendChild(titleDinicSolution)
    container.appendChild(dinicSolution)
    network = getNetworkByInput()
    createEdgeInfo(network)
    runDinic()
    container.appendChild(document.createElement('br'))
    container.appendChild(document.createElement('hr'))
}

function loadEdgeFromFile (jsonData) {

    const container = document.getElementById('edges-container');
    container.innerHTML = '';
    jsonData.forEach(edge => {
        const edgeDiv = document.createElement('div');
        edgeDiv.style.marginBottom = '10px';
        
        const inputsGroup = document.createElement('div');
        inputsGroup.className = 'edgeInputsGroup';

        const input1 = document.createElement('input');
        input1.className = 'edgeInput'
        input1.maxLength = '1'
        input1.type = 'text';
        input1.value = edge[0];

        const input2 = document.createElement('input');
        input2.className = 'edgeInput'
        input2.maxLength = '1'
        input2.type = 'text';
        input2.value = edge[1];

        const capability = document.createElement('input');
        capability.className = 'edgeInput'
        capability.type = 'number';
        capability.min = '0'
        capability.value = edge[2]

        inputsGroup.appendChild(input1);
        inputsGroup.appendChild(input2);
        inputsGroup.appendChild(document.createTextNode(' = '));
        inputsGroup.appendChild(capability);

        edgeDiv.appendChild(inputsGroup);
        container.appendChild(edgeDiv);
    });

}

function loadGraphButton () {
    const input = document.getElementById('importJSONGraph');
    const file = input.files[0];
    if (!file) {
      alert('Por favor selecciona un archivo JSON');
      return;
    }
    const reader = new FileReader();
    let jsonData = null;
    reader.onload = function(e) {
        try {
          jsonData = JSON.parse(e.target.result);
          console.log(jsonData);
          loadEdgeFromFile(jsonData);
        } catch (err) {
          alert('El archivo no contiene un JSON válido');
          console.error('Error al parsear JSON:', err);
        }
      };
      reader.readAsText(file);
}