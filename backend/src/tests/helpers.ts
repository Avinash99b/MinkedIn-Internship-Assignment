export async function measureRequest<T>(
    fn: () => Promise<T>,
    metrics: { name: string; times: number[] }
) {
    const start = performance.now();
    const result = await fn();
    const end = performance.now();
    const latency = end - start;
    metrics.times.push(latency);
    console.log(`[${metrics.name}] Latency: ${latency.toFixed(2)} ms`);
    return result;
}

export function printMetrics(metricsList: { name: string; times: number[] }[]) {
    console.log('\n--- Test Latency Summary ---');
    metricsList.forEach(({ name, times }) => {
        const avg = times.reduce((a, b) => a + b, 0) / times.length;
        console.log(`${name}: avg ${avg.toFixed(2)} ms over ${times.length} request(s)`);
    });
}
