/**
 * 0/1 Knapsack Algorithm (Dynamic Programming)
 * Optimizes vehicle cargo selection given a weight limit.
 */

function knapsack01(items, capacity) {
    const steps = [];
    const startTime = performance.now();
    let operations = 0;

    const n = items.length;
    // dp[i][w] = max value for first i items and capacity w
    const dp = Array.from({ length: n + 1 }, () => Array(capacity + 1).fill(0));

    steps.push(`Initialized DP table of size ${n + 1} x ${capacity + 1}.`);

    // We assume capacity and item weights are integers.
    // If they are floats, we must scale them or use Fractional Knapsack.
    const intCapacity = Math.floor(capacity);

    for (let i = 1; i <= n; i++) {
        const item = items[i - 1];
        const weight = Math.floor(item.weight);
        const value = item.value;

        for (let w = 0; w <= intCapacity; w++) {
            operations++;
            if (weight <= w) {
                dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weight] + value);
            } else {
                dp[i][w] = dp[i - 1][w];
            }
        }
    }

    steps.push(`Filled DP table.`);

    // Backtrack to find selected items
    const selected = [];
    let w = intCapacity;
    for (let i = n; i > 0; i--) {
        operations++;
        if (dp[i][w] !== dp[i - 1][w]) {
            selected.push(items[i - 1]);
            w -= Math.floor(items[i - 1].weight);
            steps.push(`Item '${items[i-1].name}' (weight: ${items[i-1].weight}, value: ${items[i-1].value}) was selected.`);
        }
    }

    const timeMs = performance.now() - startTime;

    return {
        result: {
            selected: selected,
            totalValue: dp[n][intCapacity],
            dpTable: dp // Can be sent to frontend for visualization
        },
        steps: steps,
        metrics: {
            time: timeMs,
            comparisons: operations,
            swaps: 0
        }
    };
}

module.exports = { knapsack01 };
