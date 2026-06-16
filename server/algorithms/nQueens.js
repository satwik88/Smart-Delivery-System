/**
 * N-Queens (Backtracking)
 * Solves the N-Queens placement problem on an NxN grid.
 */

function nQueens(n) {
    const steps = [];
    const startTime = performance.now();
    let operations = 0;

    const solutions = [];
    const board = Array(n).fill(-1); // board[row] = col

    // Only collect up to a certain limit of solutions if N is large to prevent memory crash
    const MAX_SOLUTIONS = 500;

    function isSafe(r, c) {
        for (let i = 0; i < r; i++) {
            operations++;
            const placedCol = board[i];
            if (placedCol === c) return false; // same column
            if (Math.abs(placedCol - c) === Math.abs(i - r)) return false; // same diagonal
        }
        return true;
    }

    function place(row) {
        if (solutions.length >= MAX_SOLUTIONS) return;

        if (row === n) {
            solutions.push([...board]);
            steps.push(`Found solution #${solutions.length}`);
            return;
        }

        for (let col = 0; col < n; col++) {
            operations++;
            if (isSafe(row, col)) {
                board[row] = col;
                place(row + 1);
                // Backtrack implicitly occurs when the loop continues
            }
        }
    }

    steps.push(`Starting N-Queens for N=${n}. limit: ${MAX_SOLUTIONS} solutions.`);
    
    if (n > 0) {
        place(0);
    }

    const timeMs = performance.now() - startTime;
    steps.push(`Finished. Found ${solutions.length} solutions in ${operations} placement attempts.`);

    return {
        result: {
            solutions: solutions,
            count: solutions.length
        },
        steps: steps,
        metrics: {
            time: timeMs,
            comparisons: operations,
            swaps: 0
        }
    };
}

module.exports = { nQueens };
