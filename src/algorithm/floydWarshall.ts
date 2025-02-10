import { EdgeData } from "../types";

export const floydWarshall = (
    nodes: number[],
    fullEdges: EdgeData[],
    startNode: number,
    endNode: number
): {
    distance: number;
    path: number[];
    hasNegativeCycle: boolean
} => {
    const nodeToIndex = new Map<number, number>();
    nodes.forEach((node, idx) => nodeToIndex.set(node, idx));
    const n = nodes.length;
    const INF = Number.MAX_SAFE_INTEGER;

    const edges: Array<{ from: number; to: number; weight: number }> = []
    fullEdges.forEach(e => {
        if (!e.orientation) {
            edges.push({ from: e.to, to: e.from, weight: e.weight || 0 })
        }
        edges.push({ from: e.from, to: e.to, weight: e.weight || 0 })
    })

    const dist: number[][] = Array.from({ length: n }, () => Array(n).fill(INF));
    const next: (number | undefined)[][] = Array.from({ length: n }, () => Array(n).fill(undefined));

    for (let i = 0; i < n; i++) {
        dist[i][i] = 0;
        next[i][i] = i;
    }

    edges.forEach(edge => {
        const u = nodeToIndex.get(edge.from);
        const v = nodeToIndex.get(edge.to);
        if (u === undefined || v === undefined) return;
        if (edge.weight < dist[u][v]) {
            dist[u][v] = edge.weight;
            next[u][v] = v;
        }
    });

    for (let k = 0; k < n; k++) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (dist[i][k] + dist[k][j] < dist[i][j] && dist[i][k] !== INF && dist[k][j] !== INF) {
                    dist[i][j] = dist[i][k] + dist[k][j];
                    next[i][j] = next[i][k];
                }
            }
        }
    }

    const hasNegativeCycle = nodes.some((_, i) => dist[i][i] < 0);

    let path: number[] = [];
    const startIdx = nodeToIndex.get(startNode);
    const endIdx = nodeToIndex.get(endNode);

    if (!hasNegativeCycle && startIdx !== undefined && endIdx !== undefined) {
        const pathIndices: number[] = [];
        let current: number | undefined = startIdx;
        const visited = new Set<number>();

        while (current !== undefined && current !== endIdx && !visited.has(current)) {
            visited.add(current);
            pathIndices.push(current);
            current = next[current][endIdx];
        }

        if (current === endIdx) {
            pathIndices.push(endIdx);
            path = pathIndices.map(idx => nodes[idx]);
            if (path[0] !== startNode || path[path.length - 1] !== endNode) path = [];
        }
    }

    const distanceResult: Record<number, Record<number, number>> = {};
    nodes.forEach((node, i) => {
        distanceResult[node] = {};
        nodes.forEach((innerNode, j) => {
            distanceResult[node][innerNode] = dist[i][j];
        });
    });

    return {
        distance: distanceResult[startNode][endNode],
        path,
        hasNegativeCycle
    };
};