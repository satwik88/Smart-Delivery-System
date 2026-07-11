const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { performance } = require('perf_hooks');

const { selectionSort, quickSort, mergeSort } = require('../algorithms/sorts');
const { dijkstra } = require('../algorithms/dijkstra');
const { floydWarshall } = require('../algorithms/floydWarshall');
const { knapsack01 } = require('../algorithms/knapsack01');
const { subsetSum } = require('../algorithms/subsetSum');
const { warshall } = require('../algorithms/warshall');
const { prim } = require('../algorithms/prim');
const { kruskal } = require('../algorithms/kruskal');

async function runBenchmarks() {
    console.log('Starting algorithm benchmarks...');
    
    // Get the first company ID to associate benchmarks with
    const company = await prisma.companies.findFirst({ where: { name: 'Metro Grocers' } });
    const companyId = company ? company.id : 1;

    // Clear old benchmarks for this company to avoid duplicates piling up on reruns
    await prisma.benchmark_results.deleteMany({
        where: { company_id: companyId }
    });

    const sizes = [10, 50, 100, 200, 500];

    for (const N of sizes) {
        console.log(`\n--- Benchmarking size N=${N} ---`);
        
        // 1. Sorting Arrays
        const arr = Array.from({ length: N }, () => ({ val: Math.random() * 1000 }));
        
        const algos = [
            { name: 'selectionSort', fn: selectionSort },
            { name: 'quickSort', fn: quickSort },
            { name: 'mergeSort', fn: mergeSort }
        ];

        for (const algo of algos) {
            const { metrics } = algo.fn(arr, 'val');
            await saveResult(companyId, algo.name, N, metrics);
        }

        // 2. Graphs (Dijkstra, Floyd-Warshall, Warshall, Prim, Kruskal)
        if (N <= 200) {
            const nodes = Array.from({ length: N }, (_, i) => ({ id: i + 1, name: `Node${i}` }));
            const nodeIds = nodes.map(n => n.id);
            const edges = [];
            const adjMatrix = Array.from({ length: N }, () => Array(N).fill(Infinity));
            const boolMatrix = Array.from({ length: N }, () => Array(N).fill(false));
            
            for (let i = 0; i < N; i++) {
                adjMatrix[i][i] = 0;
                boolMatrix[i][i] = true;
                // Add ~3 edges per node
                for (let j = 0; j < 3; j++) {
                    const target = Math.floor(Math.random() * N);
                    const weight = Math.floor(Math.random() * 100) + 1;
                    if (target !== i) {
                        edges.push({ from: i + 1, to: target + 1, weight });
                        adjMatrix[i][target] = weight;
                        adjMatrix[target][i] = weight; // undirected
                        boolMatrix[i][target] = true;
                        boolMatrix[target][i] = true;
                    }
                }
            }

            // Dijkstra
            const dRes = dijkstra(nodes, edges, 1, N);
            await saveResult(companyId, 'dijkstra', N, dRes.metrics);

            // Floyd-Warshall
            if (N <= 100) {
                const fwRes = floydWarshall(adjMatrix, nodeIds);
                await saveResult(companyId, 'floydWarshall', N, fwRes.metrics);
                
                const wRes = warshall(boolMatrix, nodeIds);
                await saveResult(companyId, 'warshall', N, wRes.metrics);
            }

            // Prim
            const pRes = prim(nodes, edges, 1);
            await saveResult(companyId, 'prim', N, pRes.metrics);

            // Kruskal
            const kRes = kruskal(nodes, edges);
            await saveResult(companyId, 'kruskal', N, kRes.metrics);
        }

        // 3. Knapsack / Subset Sum
        if (N <= 50) {
            const items = Array.from({ length: N }, () => ({
                id: Math.random(),
                weight: Math.floor(Math.random() * 20) + 1,
                value: Math.floor(Math.random() * 100) + 1
            }));
            const capacity = N * 10;
            const knRes = knapsack01(items, capacity);
            await saveResult(companyId, 'knapsack01', N, knRes.metrics);

            const arrSum = Array.from({ length: N }, () => Math.floor(Math.random() * 50) + 1);
            const targetSum = N * 25;
            const ssRes = subsetSum(arrSum, targetSum);
            await saveResult(companyId, 'subsetSum', N, ssRes.metrics);
        }
    }
    
    console.log('Benchmarks completed!');
}

async function saveResult(companyId, algoName, size, metrics) {
    if (!metrics) return;
    await prisma.benchmark_results.create({
        data: {
            company_id: companyId,
            algorithm_name: algoName,
            dataset_size: size,
            comparisons: metrics.comparisons || 0,
            swaps: metrics.swaps || 0,
            time_ms: metrics.time || 0
        }
    });
    console.log(`Saved ${algoName} (N=${size}): ${metrics.time.toFixed(2)}ms`);
}

runBenchmarks()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });
