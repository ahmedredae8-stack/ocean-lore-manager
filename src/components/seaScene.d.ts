export function createSeaScene(canvas: HTMLCanvasElement, opt?: { params?: Record<string, unknown> | object }): {
  setScene(t: unknown): void; setShips(s: unknown): void; setParams(p: unknown): void; destroy(): void;
};
