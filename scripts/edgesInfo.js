function createEdgeInfo(network) {
    const container = document.getElementById('network_row');
    
    const edgeInfoDiv = document.createElement('div');
    edgeInfoDiv.className = 'edgeInfo';

    for(let edge of network) {
        const currentEdge = document.createElement('p');
        const flowValue = edge[2] - edge[3]
        const flowValueInfo = document.createElement('b');
        flowValueInfo.textContent = `${flowValue}`

        if (flowValue === 0) {
            flowValueInfo.style.color = 'red';
        }

        currentEdge.textContent = `${edge[0]}${edge[1]}:`;
        currentEdge.appendChild(flowValueInfo)
        edgeInfoDiv.appendChild(currentEdge);
    }
    edgeInfoDiv.appendChild(document.createElement('br'));
    edgeInfoDiv.appendChild(document.createElement('br'));

    const existingEdgeInfo = Array.from(container.querySelectorAll('.edgeInfo')).find(div => {
        return div.textContent === edgeInfoDiv.textContent;
    });

    if (!existingEdgeInfo) {
        container.appendChild(edgeInfoDiv);
    }
}

function MessageCantBuildIncreasingPath(message) {
    const container = document.getElementById('network_row');
    const increasingPathDiv = document.createElement('h3') 
    increasingPathDiv.textContent = `${message}`;
    container.appendChild(increasingPathDiv);
    container.appendChild(document.createElement('hr'));
}

function addIncreasingPathInfo(path, flowValue) {
    const container = document.getElementById('network_row');
    const increasingPathDiv = document.createElement('div');
    increasingPathDiv.className = 'increasingPath';
    increasingPathDiv.className = 'edgeInfo'
    const pathInfo = document.createElement('p');
    pathInfo.textContent = `${path.join("")}:${flowValue}`;
    
    increasingPathDiv.appendChild(pathInfo);
    container.appendChild(increasingPathDiv);
    container.appendChild(document.createElement('hr'));
}