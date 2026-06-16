/**
 * Dijkstra's Algorithm
 * Computes single-source shortest path.
 */

function dijkstra(nodes, edges, sourceId, destId) {
    const steps = [];
    const startTime = performance.now();
    let comparisons = 0;

    const dist = {};
    const prev = {};
    const adj = {};

    nodes.forEach(n => {
        dist[n.id] = Infinity;
        prev[n.id] = null;
        adj[n.id] = [];
    });

    dist[sourceId] = 0;

    edges.forEach(e => {
        adj[e.from].push({ to: e.to, weight: e.weight });
        adj[e.to].push({ to: e.from, weight: e.weight }); // assuming undirected for this problem
    });

    const unvisited = new Set(nodes.map(n => n.id));

    steps.push(`Starting Dijkstra from source node ${sourceId} to destination ${destId}.`);

    while (unvisited.size > 0) {
        // Extract min
        let u = null;
        let minDist = Infinity;
        for (const nodeId of unvisited) {
            comparisons++;
            if (dist[nodeId] < minDist) {
                minDist = dist[nodeId];
                u = nodeId;
            }
        }

        if (u === null || minDist === Infinity) {
            steps.push(`Remaining nodes are unreachable.`);
            break;
        }

        if (u === destId) {
            steps.push(`Reached destination node ${destId} with distance ${dist[destId]}.`);
            break;
        }

        unvisited.delete(u);
        steps.push(`Extracted node ${u} with current shortest distance ${dist[u]}.`);

        for (const neighbor of adj[u]) {
            const v = neighbor.to;
            const weight = neighbor.weight;

            if (weight < 0) {
                throw new Error('Dijkstra requires non-negative weights.');
            }

            if (unvisited.has(v)) {
                const alt = dist[u] + weight;
                comparisons++;
                if (alt < dist[v]) {
                    dist[v] = alt;
                    prev[v] = u;
                    steps.push(`Relaxed edge (${u} - ${v}): new shortest distance to ${v} is ${alt}.`);
                }
            }
        }
    }

    // Reconstruct path
    const path = [];
    let curr = destId;
    if (prev[curr] !== null || curr === sourceId) {
        while (curr !== null) {
            path.unshift(curr);
            curr = prev[curr];
        }
    }

    const timeMs = performance.now() - startTime;

    return {
        result: {
            path: path,
            distance: dist[destId]
        },
        steps: steps,
        metrics: {
            time: timeMs,
            comparisons: comparisons,
            swaps: 0
        }
    };
}

module.exports = { dijkstra };
