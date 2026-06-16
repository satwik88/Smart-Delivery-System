/**
 * Topological Sort (Kahn's Algorithm)
 * Generates a valid task execution order from a DAG.
 */

function topoSort(tasks, edges) {
    const steps = [];
    const startTime = performance.now();
    let comparisons = 0;

    const indegree = {};
    const adj = {};

    tasks.forEach(t => {
        indegree[t.id] = 0;
        adj[t.id] = [];
    });

    edges.forEach(e => {
        indegree[e.to]++;
        adj[e.from].push(e.to);
    });

    const queue = [];
    tasks.forEach(t => {
        if (indegree[t.id] === 0) {
            queue.push(t.id);
        }
    });

    steps.push(`Initialized indegrees. Initial queue of independent tasks: [${queue.join(', ')}].`);

    const order = [];

    while (queue.length > 0) {
        const u = queue.shift();
        order.push(u);
        steps.push(`Processed task ${u}.`);

        for (const v of adj[u]) {
            indegree[v]--;
            comparisons++;
            if (indegree[v] === 0) {
                queue.push(v);
                steps.push(`Task ${v} has no more dependencies. Added to queue.`);
            }
        }
    }

    const hasCycle = order.length !== tasks.length;
    
    if (hasCycle) {
        steps.push(`Cycle detected! Processed ${order.length} tasks out of ${tasks.length}.`);
    } else {
        steps.push(`Topological sort completed successfully.`);
    }

    const timeMs = performance.now() - startTime;

    return {
        result: {
            order: order,
            hasCycle: hasCycle
        },
        steps: steps,
        metrics: {
            time: timeMs,
            comparisons: comparisons,
            swaps: 0
        }
    };
}

module.exports = { topoSort };
