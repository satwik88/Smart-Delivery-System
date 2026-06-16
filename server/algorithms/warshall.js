/**
 * Warshall's Algorithm
 * Computes the transitive closure (reachability matrix) of a network.
 */

function warshall(adjMatrix, nodeIds) {
    const steps = [];
    const startTime = performance.now();
    let operations = 0;

    const n = adjMatrix.length;
    // Deep copy adjacency matrix to closure matrix
    const closure = adjMatrix.map(row => [...row]);

    steps.push(`Initialized closure matrix with base adjacency.`);

    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                operations++;
                // closure[i][j] = closure[i][j] OR (closure[i][k] AND closure[k][j])
                if (!closure[i][j]) {
                    if (closure[i][k] && closure[k][j]) {
                        closure[i][j] = true;
                        steps.push(`Node ${nodeIds[i]} can reach ${nodeIds[j]} via intermediate node ${nodeIds[k]}.`);
                    }
                }
            }
        }
    }

    const timeMs = performance.now() - startTime;

    return {
        result: {
            closureMatrix: closure,
            nodeIds: nodeIds
        },
        steps: steps,
        metrics: {
            time: timeMs,
            comparisons: operations, // treated as boolean operations for benchmark
            swaps: 0
        }
    };
}

module.exports = { warshall };
