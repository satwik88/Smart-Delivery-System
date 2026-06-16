/**
 * Sorting Algorithms (Selection, Quick, Merge)
 * Used in the Data Sorting Center module.
 */

function selectionSort(originalArr, key) {
    const steps = [];
    const startTime = performance.now();
    let comparisons = 0;
    let swaps = 0;

    const arr = [...originalArr];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            comparisons++;
            if (arr[j][key] < arr[minIdx][key]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            const temp = arr[i];
            arr[i] = arr[minIdx];
            arr[minIdx] = temp;
            swaps++;
        }
    }

    const timeMs = performance.now() - startTime;
    steps.push(`Selection Sort completed with ${comparisons} comparisons and ${swaps} swaps.`);

    return {
        result: arr,
        steps: steps,
        metrics: { time: timeMs, comparisons: comparisons, swaps: swaps }
    };
}

function quickSort(originalArr, key) {
    const steps = [];
    let comparisons = 0;
    let swaps = 0;
    
    const arr = [...originalArr];

    function sort(low, high) {
        if (low < high) {
            const pivot = arr[high][key];
            let i = low - 1;

            for (let j = low; j < high; j++) {
                comparisons++;
                if (arr[j][key] <= pivot) {
                    i++;
                    const temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                    swaps++;
                }
            }
            const temp2 = arr[i + 1];
            arr[i + 1] = arr[high];
            arr[high] = temp2;
            swaps++;

            const p = i + 1;

            sort(low, p - 1);
            sort(p + 1, high);
        }
    }

    const startTime = performance.now();
    sort(0, arr.length - 1);
    const timeMs = performance.now() - startTime;

    steps.push(`Quick Sort completed with ${comparisons} comparisons and ${swaps} swaps.`);

    return {
        result: arr,
        steps: steps,
        metrics: { time: timeMs, comparisons: comparisons, swaps: swaps }
    };
}

function mergeSort(originalArr, key) {
    const steps = [];
    let comparisons = 0;
    
    function sort(arr) {
        if (arr.length <= 1) return arr;
        
        const mid = Math.floor(arr.length / 2);
        const left = sort(arr.slice(0, mid));
        const right = sort(arr.slice(mid));
        
        return merge(left, right);
    }

    function merge(left, right) {
        const result = [];
        let i = 0;
        let j = 0;

        while (i < left.length && j < right.length) {
            comparisons++;
            if (left[i][key] <= right[j][key]) {
                result.push(left[i]);
                i++;
            } else {
                result.push(right[j]);
                j++;
            }
        }

        while (i < left.length) {
            result.push(left[i]);
            i++;
        }

        while (j < right.length) {
            result.push(right[j]);
            j++;
        }

        return result;
    }

    const startTime = performance.now();
    const resultArr = sort([...originalArr]);
    const timeMs = performance.now() - startTime;

    steps.push(`Merge Sort completed with ${comparisons} comparisons.`);

    return {
        result: resultArr,
        steps: steps,
        metrics: { time: timeMs, comparisons: comparisons, swaps: 0 }
    };
}

module.exports = { selectionSort, quickSort, mergeSort };
