import { EdgeData } from "../types";

export const dijkstraValidator = (edges: EdgeData[], start: number, end: number) => {
    if (start === end) {
        return { success: false, error: 'You can not find path from same node' }
    }

    const isWeight = edges.filter(e => !e.weight)
    if (isWeight.length) {
        return { success: false, error: 'To use Dijkstra algorithm all edged should have weight' }
    }

    const negative = edges.filter(e => e.weight && e.weight < 1)
    if (negative.length) {
        return { success: false, error: 'To use Dijkstra algorithm all edge weights should be positive' }
    }

    return { success: true, error: '' }
}

export const bellmanFordValidator = (edges: EdgeData[], start: number, end: number) => {
    if (start === end) {
        return { success: false, error: 'You can not find path from same node' }
    }

    const isWeight = edges.filter(e => !e.weight)
    if (isWeight.length) {
        return { success: false, error: 'To use Bellman-Ford algorithm all edged should have weight' }
    }

    return { success: true, error: '' }
}

export const floydWarshallValidator = (edges: EdgeData[], start: number, end: number) => {
    if (start === end) {
        return { success: false, error: 'You can not find path from same node' }
    }

    const isWeight = edges.filter(e => !e.weight)
    if (isWeight.length) {
        return { success: false, error: 'To use Floyd-Warshall algorithm all edged should have weight' }
    }

    return { success: true, error: '' }
}