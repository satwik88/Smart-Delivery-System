/**
 * Prim's Algorithm
 * Computes the Minimum Spanning Tree of a graph starting from a specific node.
 */

function prim(nodes, edges, startNodeId) {
    const steps = [];
    const startTime = performance.now();
    let comparisons = 0;

    const mst = [];
    let totalCost = 0;
    const visited = new Set();
    visited.add(startNodeId);

    // Adjacency list
    const adj = {};
    nodes.forEach(n => { adj[n.id] = []; });
    edges.forEach(e => {
        adj[e.from].push({ to: e.to, weight: e.weight, edge: e });
        adj[e.to].push({ to: e.from, weight: e.weight, edge: e });
    });

    steps.push(`Started Prim's algorithm at node ${startNodeId}.`);

    while (visited.size < nodes.length) {
        let minEdge = null;
        let minWeight = Infinity;
        let chosenFrom = null;

        // Find the minimum weight edge from visited to unvisited nodes
        for (const u of visited) {
            for (const neighbor of adj[u]) {
                const v = neighbor.to;
                comparisons++;
                if (!visited.has(v) && neighbor.weight < minWeight) {
                    minWeight = neighbor.weight;
                    minEdge = neighbor.edge;
                    chosenFrom = u;
                }
            }
        }

        if (minEdge === null) {
            steps.push(`Graph is disconnected. MST cannot reach all nodes.`);
            break;
        }

        const addedNode = minEdge.from === chosenFrom ? minEdge.to : minEdge.from;
        
        mst.push(minEdge);
        totalCost += minWeight;
        visited.add(addedNode);

        steps.push(`Picked edge (${minEdge.from} - ${minEdge.to}) with weight ${minWeight}. Added node ${addedNode}.`);
    }

    const timeMs = performance.now() - startTime;

    return {
        result: {
            mstEdges: mst,
            totalCost: totalCost
        },
        steps: steps,
        metrics: {
            time: timeMs,
            comparisons: comparisons,
            swaps: 0
        }
    };
}

module.exports = { prim };
