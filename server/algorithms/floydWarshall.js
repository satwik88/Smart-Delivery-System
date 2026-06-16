/**
 * Floyd-Warshall's Algorithm
 * Computes all-pairs shortest paths.
 */

function floydWarshall(distMatrix, nodeIds) {
    const steps = [];
    const startTime = performance.now();
    let operations = 0;

    const n = distMatrix.length;
    // Deep copy matrix
    const dist = distMatrix.map(row => [...row]);

    steps.push(`Initialized distance matrix with direct edge costs.`);

    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                operations++;
                if (dist[i][k] !== Infinity && dist[k][j] !== Infinity) {
                    if (dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                        steps.push(`Shortest path from ${nodeIds[i]} to ${nodeIds[j]} updated to ${dist[i][j]} via ${nodeIds[k]}.`);
                    }
                }
            }
        }
    }

    const timeMs = performance.now() - startTime;

    return {
        result: {
            distMatrix: dist,
            nodeIds: nodeIds
        },
        steps: steps,
        metrics: {
            time: timeMs,
            comparisons: operations,
            swaps: 0
        }
    };
}

module.exports = { floydWarshall };
