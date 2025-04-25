function runDinic(){
    network = getNetworkByInput()
    auxiliarNetwork = getEdgesInNA(network, network)
    while (auxiliarNetwork.length > 0) {
        createEdgeInfo(network)
        block_path = buildBlockingFlow(auxiliarNetwork, network)
        while (block_path.length > 0) {
            drawGraph(auxiliarNetwork, true)
            min_value = getMinFlowToSend(block_path, network)
            addIncreasingPathInfo(block_path, min_value)
            auxiliarNetwork = updateFlowValues(auxiliarNetwork, block_path, min_value, network)
            network = updateFlowValues(network, block_path, min_value, network)
            createEdgeInfo(network)
            block_path = buildBlockingFlow(auxiliarNetwork, network)
        }
        MessageCantBuildIncreasingPath("No puedo llegar a t desde s.")
        auxiliarNetwork = getEdgesInNA(network, network)
    }
    calculateFlowValue(network)
    calculateMinimumCut(network)
}

function calculateFlowValue(network) {
    let flowValue = 0;
    for (let edge of network) {
        if (edge[0] === 's') {
            flowValue += edge[3];
        }
    }
    const container = document.getElementById('network_row');
    const flowValueDiv = document.createElement('h3') 
    flowValueDiv.textContent = `El flujo máximo es: ${flowValue}`;
    flowValueDiv.style.color = 'red';
    container.appendChild(flowValueDiv);
    container.appendChild(document.createElement('hr'));
}


function calculateMinimumCut(network) {
    let visited = new Set();
    let queue = ['s'];
    visited.add('s');

    while (queue.length > 0) {
        let node = queue.shift();
        for (let edge of network) {
            if (edge[0] === node && !visited.has(edge[1]) && (edge[2] - edge[3]) > 0) {
                queue.push(edge[1]);
                visited.add(edge[1]);
            }
            else if (edge[1] === node && !visited.has(edge[0]) && edge[3] > 0) {
                if (!visited.has(edge[0])) {
                    queue.push(edge[0]);
                    visited.add(edge[0]);
                }
            }
        }
    }

    const container = document.getElementById('network_row');
    const minCutDiv = document.createElement('h3') 
    minCutDiv.textContent = `El corte mínimo es: ${Array.from(visited).join(", ")}`;
    minCutDiv.style.color = 'blue';
    container.appendChild(minCutDiv);

    let cutValue = getValueOfCut(visited, network)
    const cutValueDiv = document.createElement('h3')
    cutValueDiv.textContent = `El valor del corte mínimo es: ${cutValue}`;
    cutValueDiv.style.color = 'blue';
    container.appendChild(cutValueDiv);
    return Array.from(visited)
}

function getValueOfCut(cutArray, network) {
    let cutValue = 0;
    for (let node of cutArray) {
        let neighbors = network.filter(edge => edge[0] === node).map(edge => edge[1]);
        console.log(node, neighbors)
        for (let neighbor of neighbors) {
            if (!Array.from(cutArray).includes(neighbor)) {
                // console.log(node, neighbor)
                cutValue += getCurrentFlow(node, neighbor, network);
            }
        }
    }
    console.log(cutValue)
    return cutValue;
}


function getUniquesNodes(network) {
    let nodes = new Set()
    for (let edge of network) {
        nodes.add(edge[0])
        nodes.add(edge[1])
    }
    return nodes
}

function getNodesByLevels(network) {
    let levels = []
    let visited = new Set();
    let queue = ['s'];

    levels[0] = ['s'];
    visited.add('s');
    
    let currentLevel = 0;
    let foundT = false;

    while (queue.length > 0 && !foundT) {
        let nextQueue = [];
        let levelNodes = [];

        for (let node of queue) {
            for (let edge of network) {
                if (edge[0] === node && !visited.has(edge[1]) && (edge[2] - edge[3]) > 0 ) {
                    levelNodes.push(edge[1]);
                    nextQueue.push(edge[1]);
                    visited.add(edge[1]);
                    if (edge[1] === 't') {
                        foundT = true;
                    }
                }
                else if (edge[1] === node && !visited.has(edge[0]) && edge[3] > 0) {
                    // backward edge: ensure it's not revisiting a previous level
                    if (!visited.has(edge[0])) {
                        levelNodes.push(edge[0]);
                        nextQueue.push(edge[0]);
                        visited.add(edge[0]);
                        if (edge[0] === 't') {
                            foundT = true;
                        }
                    }
                }
            }
        }
        currentLevel++;
        if (levelNodes.length > 0) {
            levels[currentLevel] = levelNodes;
        }
        queue = nextQueue;
    }

    if (levels[levels.length - 1].includes('t')) {
        levels[levels.length - 1] = ['t']
    }
    return levels;
}

function isBackward(nodeA, nodeB, network) {
    for (let edge of network) {
        if (edge[0] === nodeB && edge[1] === nodeA && edge[3] > 0) {
            return true;
        }
    }
    return false;
}

function getNeighbors(node, network, originalNetwork) {
    let neighbors = [];
    for (let edge of network) {
        if (edge[0] === node && (edge[2] - edge[3]) > 0) {
            neighbors.push(edge[1]);
        }        
        else if (edge[0] === node && (edge[2] - edge[3]) <= 0 && isBackward(node, edge[1], originalNetwork)) {
            neighbors.push(edge[1]);
        }
    }
    return neighbors;
}

function getBackwardNeighbors(node, network) {
    let neighborsBackwards = network.filter(
        (edge) => edge[1] === node && edge[3] > 0
    )
    return neighborsBackwards.map(
        (edge) => edge[0]
    )
}

function getCapability(nodeA, nodeB, network) {
    for (let edge of network) {
        if (edge[0] == nodeA && edge[1] == nodeB) {
            return edge[2];
        }
        else if (edge[1] == nodeA && edge[0] == nodeB) {
            return edge[3];
        }
    }
    return 0;
}

function getCurrentCapability(u, v, network) {
    for (let edge of network) {
        if (edge[0] === u && edge[1] === v) {
            return edge[2] - edge[3];
        }
        else if (edge[0] === v && edge[1] === u) {
            return edge[3];
        }
    }
    return 0;
}

function getCurrentFlow(nodeA, nodeB, network) {
    for (let edge of network) {
        if (edge[0] == nodeA && edge[1] == nodeB) {
            return edge[3];
        }
        else if (edge[1] == nodeA && edge[0] == nodeB) {
            return edge[3];
        }
    }
    return 0;
}


function getEdgesInNA(network, originalNetwork) {
    let nodesByLevels = getNodesByLevels(network)
    let auxiliarNetwork = []
    if (nodesByLevels[nodesByLevels.length - 1].includes('t')) {
        for (let level = 0; level < nodesByLevels.length - 1; level++) {
            for (let node of nodesByLevels[level]) {
                let neighbors = getNeighbors(node, network, originalNetwork)
                let neighborsBackwards = getBackwardNeighbors(node, network)
                let allNeighbors = neighbors.concat(neighborsBackwards)
                for (let ng of allNeighbors) {
                    if (nodesByLevels[level + 1].includes(ng)) {
                        auxiliarNetwork.push([
                            node,
                            ng, 
                            getCapability(node, ng, network), 
                            getCurrentFlow(node, ng, network)
                        ])
                    }
                }
            }
        }
    }
    return auxiliarNetwork
}


function getMinFlowToSend(path, network) {
    let minFlow = Infinity;

    for (let i = 0; i < path.length - 1; i++) {
        let u = path[i];
        let v = path[i + 1];

        let edge = network.find(e => e[0] === u && e[1] === v);
        if (edge) {
            let available = edge[2] - edge[3];
            minFlow = Math.min(minFlow, available);
        } 
        else {
            let reverseEdge = network.find(e => e[0] === v && e[1] === u);
            if (reverseEdge) {
                let reversible = reverseEdge[3]; 
                minFlow = Math.min(minFlow, reversible);
            }
        }
    }
    return minFlow;
}

function buildBlockingFlow(network, originalNetwork) {
    let queue = ['s'];
    let visited = new Set(['s']);
    let parent = {};
    while (queue.length > 0) {
        let node = queue.shift();
        if (node === 't') {
            let path = [];
            let curr = 't';
            while (curr !== undefined) {
                path.unshift(curr);
                curr = parent[curr];
            }
            return path;
        }
        
        let neighbors = getNeighbors(node, network, originalNetwork).sort();
        let unvisitedNodes = neighbors.filter(el => !visited.has(el))
        for (let neighbor of unvisitedNodes) {
            if (!visited.has(neighbor) && getCurrentCapability(node, neighbor, originalNetwork) > 0) {
                queue.push(neighbor);
                visited.add(neighbor);
                parent[neighbor] = node;
            }
        }
    }
    return [];
}

function existsEdge(nodeA, nodeB, network) {
    for(let edge of network) {
        if(edge[0] == nodeA && edge[1] == nodeB){
            return true
        }
    }
    return false
}

function updateFlowValues(network, path, targetValue, originalNetwork) {
    for (let i = 0; i < path.length - 1; i++) {
        let nodeA = path[i];
        let nodeB = path[i + 1];
        for (let edge of network) {
            if (edge[0] == nodeA && edge[1] == nodeB && existsEdge(nodeA, nodeB, originalNetwork)) {
                edge[3] += targetValue;
            } else if (edge[0] == nodeB && edge[1] == nodeA && existsEdge(nodeB, nodeA, originalNetwork)) {
                edge[3] -= targetValue;
            }
        }
    }
    return network;
}