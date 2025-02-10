import { EdgeData } from "../types";

class PriorityQueue<T> {
    private heap: T[];
    private compare: (a: T, b: T) => number;

    constructor(compare: (a: T, b: T) => number) {
        this.heap = [];
        this.compare = compare;
    }

    push(element: T): void {
        this.heap.push(element);
        this.heap = this.heap.sort(this.compare)
    }

    pop(): T | undefined {
        if (this.heap.length === 0) return undefined;
        return this.heap.shift()
    }
    isEmpty(): boolean {
        return this.heap.length === 0;
    }
}

export const dijkstra = (
    nodes: number[],
    edges: EdgeData[],
    startNode: number,
    endNode: number
): { distance: number; path: number[] } => {
    const adjacencyList: Record<number, Array<{ to: number; weight: number }>> = {};

    // Initialize adjacency list for all nodes
    nodes.forEach(node => {
        adjacencyList[node] = [];
    });

    // Populate adjacency list with edges
    edges.forEach(edge => {
        adjacencyList[edge.from].push({ to: edge.to, weight: edge.weight || 0 });
        if (!edge.orientation) {
            adjacencyList[edge.to].push({ to: edge.from, weight: edge.weight || 0 });
        }
    });

    // Initialize distances with Infinity
    const distances: Record<number, number> = {};
    nodes.forEach(node => {
        distances[node] = Infinity;
    });
    distances[startNode] = 0;

    // Initialize predecessors to keep track of the path
    const predecessors: Record<number, number | null> = {};
    nodes.forEach(node => {
        predecessors[node] = null;
    });

    // Create priority queue (min-heap) sorted by distance
    const priorityQueue = new PriorityQueue<{ distance: number; node: number }>(
        (a, b) => a.distance - b.distance
    );
    priorityQueue.push({ distance: 0, node: startNode });

    const processed = new Set<number>();

    while (!priorityQueue.isEmpty()) {
        const current = priorityQueue.pop()!;

        if (processed.has(current.node)) continue;
        processed.add(current.node);

        // If we reach the end node, we can stop early
        if (current.node === endNode) break;

        for (const neighbor of adjacencyList[current.node]) {
            const newDistance = current.distance + neighbor.weight;
            if (newDistance < distances[neighbor.to]) {
                distances[neighbor.to] = newDistance;
                predecessors[neighbor.to] = current.node; // Update predecessor
                priorityQueue.push({ distance: newDistance, node: neighbor.to });
            }
        }
    }

    // Reconstruct the path from endNode to startNode using predecessors
    const path: number[] = [];
    let currentNode: number | null = endNode;
    while (currentNode !== null) {
        path.unshift(currentNode); // Add to the beginning of the path
        currentNode = predecessors[currentNode];
    }

    // If no path exists (startNode and endNode are disconnected), return an empty path
    if (path.length === 0 || path[0] !== startNode) {
        return { distance: 0, path: [] };
    }

    return { distance: distances[endNode], path };
};