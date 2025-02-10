import { EdgeData } from "../types";

export const bellmanFord = (
    nodes: number[],
    fullEdges: EdgeData[],
    startNode: number,
    endNode: number
): { distance: number; path: number[]; hasNegativeCycle: boolean } => {
    const distances: Record<number, number> = {};
    const predecessors: Record<number, number | null> = {};

    const edges: Array<{ from: number; to: number; weight: number }> = []
    fullEdges.forEach(e => {
        if (!e.orientation) {
            edges.push({ from: e.to, to: e.from, weight: e.weight || 0 })
        }
        edges.push({ from: e.from, to: e.to, weight: e.weight || 0 })
    })

    nodes.forEach(node => {
        distances[node] = Infinity;
        predecessors[node] = null;
    });
    distances[startNode] = 0;

    for (let i = 0; i < nodes.length - 1; i++) {
        for (const edge of edges) {
            if (distances[edge.from] + edge.weight < distances[edge.to]) {
                distances[edge.to] = distances[edge.from] + edge.weight;
                predecessors[edge.to] = edge.from;
            }
        }
    }

    let hasNegativeCycle = false;
    for (const edge of edges) {
        if (distances[edge.from] + edge.weight < distances[edge.to]) {
            hasNegativeCycle = true;
            break;
        }
    }

    const path: number[] = [];
    if (!hasNegativeCycle) {
        let currentNode: number | null = endNode;
        while (currentNode !== null) {
            path.unshift(currentNode);
            currentNode = predecessors[currentNode];
        }

        if (path.length === 0 || path[0] !== startNode) {
            path.splice(0, path.length);
        }
    }

    return { distance: distances[endNode], path, hasNegativeCycle };
};