/**
 * Kruskal's Algorithm
 * Computes the Minimum Spanning Tree of a graph.
 */

function kruskal(nodes, edges) {
    const steps = [];
    const startTime = performance.now();
    let comparisons = 0;

    // Sort edges by weight ascending
    edges.sort((a, b) => {
        comparisons++;
        return a.weight - b.weight;
    });
    
    steps.push(`Sorted ${edges.length} edges by weight.`);

    // Initialize Union-Find
    const parent = {};
    const rank = {};

    nodes.forEach(node => {
        parent[node.id] = node.id;
        rank[node.id] = 0;
    });

    function find(i) {
        if (parent[i] === i) return i;
        // Path compression
        parent[i] = find(parent[i]);
        return parent[i];
    }

    function union(i, j) {
        const rootI = find(i);
        const rootJ = find(j);

        if (rootI !== rootJ) {
            if (rank[rootI] < rank[rootJ]) {
                parent[rootI] = rootJ;
            } else if (rank[rootI] > rank[rootJ]) {
                parent[rootJ] = rootI;
            } else {
                parent[rootJ] = rootI;
                rank[rootI]++;
            }
        }
    }

    const mst = [];
    let totalCost = 0;

    for (const edge of edges) {
        const u = edge.from;
        const v = edge.to;
        const w = edge.weight;

        const rootU = find(u);
        const rootV = find(v);

        comparisons++;
        if (rootU !== rootV) {
            union(u, v);
            mst.push(edge);
            totalCost += w;
            steps.push(`Picked edge (${u} - ${v}) with weight ${w}. No cycle formed.`);
        } else {
            steps.push(`Rejected edge (${u} - ${v}) with weight ${w} (would form cycle).`);
        }

        if (mst.length === nodes.length - 1) {
            steps.push(`MST complete with ${mst.length} edges.`);
            break;
        }
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

module.exports = { kruskal };
