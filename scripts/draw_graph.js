function loadGraph(network) {
    const nodeIds = new Map()
    let countNodes = 0
    const nodesVis = []
    const edgesVis = []
    for (let index = 0; index < network.length; index++) {
        const edge = network[index]
        if (getCurrentCapability(edge[0], edge[1], network) > 0) {
            if (!nodeIds.has(edge[0])) {
                valueID = countNodes
                nodeIds.set(edge[0], valueID)
                countNodes += 1
                nodesVis.push({id: nodeIds.get(edge[0]), label: edge[0]})
            } 
            if (!nodeIds.has(edge[1])) {
                valueID = countNodes
                nodeIds.set(edge[1], valueID)
                countNodes += 1
                nodesVis.push({id: nodeIds.get(edge[1]), label: edge[1]})
            }
            edgesVis.push({from: nodeIds.get(edge[0]), to: nodeIds.get(edge[1])})
        }
    }
    const nodes = new vis.DataSet(nodesVis);
    const edges = new vis.DataSet(edgesVis);
    return {nodes, edges}
}

function strikeEdge(edge, network) {
    for (let i = 0; i < network.length; i++) {
        if (network[i][0] === edge[0] && network[i][1] === edge[1]) {
            network[i][3] += 1;
            break;
        }
    }
}

function drawGraph(network, nodes_for_levels=false) {
    const container = document.getElementById('network_row');
    const grafoDiv = document.createElement('div');
    grafoDiv.id = 'grafo'
    if (network === undefined) {
        network = getNetworkByInput()
    }
    const data = loadGraph(network);

    const options = {
        interaction: {
            zoomView: false,
            dragNodes: false,
            dragView: false
        },
        physics: {
            enabled: false
        },
        edges: {
            arrows: {
                to: true,
                from: false
            },
            color: 'gray',
            font: { align: 'top' }
        },
        nodes: {
            shape: 'circle',
            size: 20,
            font: {
                color: 'black',
                size: 14
            },
            fixed: {
                x: true,
                y: true 
            }
        },
        layout: {
            hierarchical: {
                enabled: nodes_for_levels,
                direction: 'LR',
                sortMethod: 'directed'
            }
        }
    };
    container.appendChild(grafoDiv);
    new vis.Network(grafoDiv, data, options);
}
