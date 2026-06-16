/**
 * Fractional Knapsack (Greedy)
 * Allocates divisible resources to maximize value.
 */

function fractionalKnapsack(items, capacity) {
    const steps = [];
    const startTime = performance.now();
    let comparisons = 0;

    // Deep copy and compute ratios
    const list = items.map(item => ({
        ...item,
        ratio: item.value / item.weight
    }));

    // Sort items by ratio descending
    list.sort((a, b) => {
        comparisons++;
        return b.ratio - a.ratio;
    });

    steps.push(`Sorted ${list.length} resources by value/weight ratio in descending order.`);

    let totalValue = 0;
    let remaining = capacity;
    const allocation = [];

    for (const item of list) {
        if (remaining <= 0) break;

        const take = Math.min(item.weight, remaining);
        const fraction = take / item.weight;
        
        totalValue += item.value * fraction;
        allocation.push({
            item: item,
            take: take,
            fraction: fraction
        });

        remaining -= take;

        if (fraction === 1) {
            steps.push(`Took all of ${item.name} (${take} units). Remaining capacity: ${remaining}.`);
        } else {
            steps.push(`Took fractional amount of ${item.name} (${(fraction * 100).toFixed(1)}%, ${take} units). Capacity is full.`);
        }
    }

    const timeMs = performance.now() - startTime;

    return {
        result: {
            allocation: allocation,
            totalValue: totalValue
        },
        steps: steps,
        metrics: {
            time: timeMs,
            comparisons: comparisons,
            swaps: 0
        }
    };
}

module.exports = { fractionalKnapsack };
