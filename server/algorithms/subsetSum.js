/**
 * Subset Sum (Dynamic Programming)
 * Finds product price combinations matching a target budget.
 */

function subsetSum(prices, target) {
    const steps = [];
    const startTime = performance.now();
    let operations = 0;

    const n = prices.length;
    
    // dp[i][s] = boolean indicating if sum 's' is possible with first 'i' items
    const dp = Array.from({ length: n + 1 }, () => Array(target + 1).fill(false));
    
    for (let i = 0; i <= n; i++) {
        dp[i][0] = true; // sum 0 is always possible
    }

    steps.push(`Initialized DP table of size ${n + 1} x ${target + 1}.`);

    for (let i = 1; i <= n; i++) {
        const p = Math.floor(prices[i - 1]); // Assume integer prices/budgets for array indexing
        
        for (let s = 1; s <= target; s++) {
            operations++;
            dp[i][s] = dp[i - 1][s];
            if (s >= p && dp[i - 1][s - p]) {
                dp[i][s] = true;
            }
        }
    }

    steps.push(`Filled DP table. Exact sum achievable: ${dp[n][target]}`);

    // If exact target not possible, find largest achievable <= target
    let actualSum = target;
    if (!dp[n][target]) {
        while (actualSum >= 0 && !dp[n][actualSum]) {
            actualSum--;
        }
        steps.push(`Exact target not possible. Finding closest sum <= target: ${actualSum}`);
    }

    const subsets = [];

    // Backtrack to find all subsets summing to actualSum
    function backtrack(i, currentSum, currentSubset) {
        if (i === 0 || currentSum === 0) {
            if (currentSum === 0) {
                subsets.push([...currentSubset]);
            }
            return;
        }

        // We can exclude the item if sum is achievable without it
        if (dp[i - 1][currentSum]) {
            backtrack(i - 1, currentSum, currentSubset);
        }

        // We can include the item if its price <= currentSum and remaining is achievable
        const p = Math.floor(prices[i - 1]);
        if (currentSum >= p && dp[i - 1][currentSum - p]) {
            currentSubset.push(prices[i - 1]);
            backtrack(i - 1, currentSum - p, currentSubset);
            currentSubset.pop();
        }
    }

    if (actualSum > 0) {
        backtrack(n, actualSum, []);
        steps.push(`Reconstructed ${subsets.length} combinations.`);
    } else {
        steps.push(`No combinations found.`);
    }

    const timeMs = performance.now() - startTime;

    return {
        result: {
            subsets: subsets,
            actualSum: actualSum,
            exactMatch: dp[n][target]
        },
        steps: steps,
        metrics: {
            time: timeMs,
            comparisons: operations,
            swaps: 0
        }
    };
}

module.exports = { subsetSum };
