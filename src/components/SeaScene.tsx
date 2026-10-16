import { useEffect, useRef } from "react";
import { createSeaScene } from "./seaScene";
export type SeaTheme = { id: string; name?: string; bg: string; mask: string; sky?: [number, number, number]; sun?: [number, number, number]; foam?: number };
export type SeaShip = { id: string; src: string; x: number; y: number; width?: number; waterline?: number; visible?: boolean };
export type SeaParams = { amp?: number; spd?: number; ref?: number; sun?: number; foam?: number; rip?: number; paused?: boolean };
type Props = { theme: SeaTheme; ships: SeaShip[]; params?: SeaParams; className?: string; style?: React.CSSProperties };
export default function SeaScene({ theme, ships, params, className, style }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const eng = useRef<any>(null);
  useEffect(() => { eng.current = createSeaScene(ref.current!, { params }); return () => eng.current.destroy(); }, []);
  useEffect(() => { eng.current?.setScene(theme); }, [theme.id, theme.bg, theme.mask]);
  useEffect(() => { eng.current?.setShips(ships); }, [JSON.stringify(ships)]);
  useEffect(() => { eng.current?.setParams(params || {}); }, [JSON.stringify(params || {})]);
  return <canvas ref={ref} className={className} style={{ width: "100%", aspectRatio: "1080 / 1935", display: "block", ...style }} />;
}
