import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
    TrendingUp, TrendingDown, BarChart3, PieChart, Activity,
    Search, Zap, Shield, Droplet, Factory,
    Car, Heart, Building, Cog, DollarSign, Leaf, RefreshCw,
    AlertCircle, Loader2, Eye, ChevronRight, LayoutGrid,
    Table2, Filter, ArrowUp, ArrowDown, ChevronDown, X
} from 'lucide-react';

// ── Helpers ──────────────────────────────────────────────────────────
const getSectorIcon = (name) => {
    const icons = { 'Automobile & Ancillaries': Car, 'Healthcare': Heart, 'Capital Goods': Cog, 'Metals & Mining': Shield, 'Finance': DollarSign, 'Chemicals': Droplet, 'Banks': Building, 'Software & IT Services': Activity, 'Power': Zap, 'Infrastructure': Factory, 'FMCG': Leaf };
    const Icon = icons[name] || BarChart3;
    return <Icon size={13} strokeWidth={1.8} />;
};
const formatMarketCap = (v) => {
    if (!v) return '—';
    if (v >= 100000) return `${(v / 100000).toFixed(1)}L Cr`;
    if (v >= 1000) return `${(v / 1000).toFixed(1)}K Cr`;
    return `${v.toFixed(1)} Cr`;
};

// ── Exact MC/TradingView color scale ────────────────────────────────
const getMCColor = (v) => {
    if (v >= 10)  return { bg: '#0a5c1a', text: '#fff', border: '#0d7a22' };
    if (v >= 7)   return { bg: '#0d7a22', text: '#fff', border: '#109a2b' };
    if (v >= 5)   return { bg: '#118a2a', text: '#fff', border: '#16b036' };
    if (v >= 3)   return { bg: '#16a834', text: '#fff', border: '#1dcc3f' };
    if (v >= 2)   return { bg: '#1db954', text: '#fff', border: '#26d460' };
    if (v >= 1)   return { bg: '#22c55e', text: '#fff', border: '#34d474' };
    if (v >= 0.5) return { bg: '#4ade80', text: '#052e16', border: '#6ee7b7' };
    if (v > 0)    return { bg: '#86efac', text: '#052e16', border: '#bbf7d0' };
    if (v === 0)  return { bg: '#2d3748', text: '#9ca3af', border: '#3d4a5c' };
    if (v > -0.5) return { bg: '#fecaca', text: '#450a0a', border: '#fca5a5' };
    if (v > -1)   return { bg: '#fca5a5', text: '#450a0a', border: '#f87171' };
    if (v > -2)   return { bg: '#f87171', text: '#fff', border: '#ef4444' };
    if (v > -3)   return { bg: '#ef4444', text: '#fff', border: '#dc2626' };
    if (v > -5)   return { bg: '#dc2626', text: '#fff', border: '#b91c1c' };
    if (v > -7)   return { bg: '#b91c1c', text: '#fff', border: '#991b1b' };
    if (v > -10)  return { bg: '#991b1b', text: '#fff', border: '#7f1d1d' };
    return          { bg: '#7f1d1d', text: '#fff', border: '#6b1515' };
};

// ── Squarified Treemap (Fixed & Aligned) ─────────────────────────────
function squarify(items, x, y, w, h) {
    if (!items.length || w <= 1 || h <= 1) return [];
    const total = items.reduce((s, d) => s + Math.max(Math.abs(d.value || 1), 0.1), 0);
    if (total === 0) return [];
    const results = [];
    let remaining = [...items];
    let rx = x, ry = y, rw = w, rh = h;

    while (remaining.length > 0) {
        const isWide = rw >= rh;
        let row = [];
        let rowSum = 0;
        let bestAspect = Infinity;

        for (let i = 0; i < remaining.length; i++) {
            row.push(remaining[i]);
            rowSum += Math.max(Math.abs(remaining[i].value || 1), 0.1);
            const area = (rowSum / total) * (rw * rh);
            let maxAspect = -Infinity;
            for (let j = 0; j < row.length; j++) {
                const itemArea = (Math.max(Math.abs(row[j].value), 0.1) / rowSum) * area;
                let ww, hh;
                if (isWide) {
                    ww = area / Math.max(rh, 1);
                    hh = itemArea / Math.max(ww, 0.1);
                } else {
                    hh = area / Math.max(rw, 1);
                    ww = itemArea / Math.max(hh, 0.1);
                }
                const aspect = (ww > 0.01 && hh > 0.01) ? Math.max(ww / hh, hh / ww) : Infinity;
                maxAspect = Math.max(maxAspect, aspect);
            }
            if (maxAspect > bestAspect && i > 0) {
                row.pop();
                rowSum -= Math.max(Math.abs(remaining[i].value || 1), 0.1);
                break;
            }
            bestAspect = maxAspect;
        }

        if (row.length === 0) {
            row = [remaining[0]];
            rowSum = Math.max(Math.abs(remaining[0].value || 1), 0.1);
        }

        const rowRatio = rowSum / total;
        let cx = rx, cy = ry;

        row.forEach(item => {
            const ratio = Math.max(Math.abs(item.value), 0.1) / rowSum;
            let tw, th, tx, ty;
            if (isWide) {
                tw = rw * rowRatio;
                th = rh * ratio;
                tx = cx;
                ty = cy;
                cy += th;
            } else {
                tw = rw * ratio;
                th = rh * rowRatio;
                tx = cx;
                ty = cy;
                cx += tw;
            }
            // Ensure minimum dimensions
            if (tw > 0.5 && th > 0.5) {
                results.push({ ...item, x: tx, y: ty, w: Math.max(tw, 0.5), h: Math.max(th, 0.5) });
            }
        });

        if (isWide) {
            rx += rw * rowRatio;
            rw -= rw * rowRatio;
        } else {
            ry += rh * rowRatio;
            rh -= rh * rowRatio;
        }
        remaining = remaining.slice(row.length);
        
        // Prevent infinite loop
        if (row.length === 0) break;
    }
    return results;
}

// ── Stock Logo (colorful circle with initials) ──────────────────────
const StockLogo = ({ name, size, textColor }) => {
    const raw = (name || '').replace(/[^A-Za-z0-9]/g, '');
    const initials = raw.slice(0, 2).toUpperCase() || name?.slice(0, 2).toUpperCase() || '??';
    const s = Math.min(Math.max(size * 0.32, 20), 38);
    const fs = Math.max(s * 0.4, 8);
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const hue = Math.abs(hash) % 360;
    return (
        <div style={{
            width: s, height: s, borderRadius: '50%',
            background: `hsl(${hue}, 55%, 42%)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, border: '1.5px solid rgba(255,255,255,0.3)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        }}>
            <span style={{ fontSize: fs, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{initials}</span>
        </div>
    );
};

// ── TREEMAP COMPONENT (with full sector scroll) ──────────────────────
const TreemapView = ({ sectors, allStocks, selectedPeriod }) => {
    const containerRef = useRef(null);
    const [dims, setDims] = useState({ w: 1100, h: 620 });
    const [hoveredKey, setHoveredKey] = useState(null);
    const [tooltip, setTooltip] = useState(null);
    const [drillSector, setDrillSector] = useState(null);
    const GAP = 1.5;
    const SEC_HDR = 26;

    useEffect(() => {
        const obs = new ResizeObserver(entries => {
            const { width } = entries[0].contentRect;
            setDims({ w: Math.max(width, 400), h: Math.max(Math.round(width * 0.52), 480) });
        });
        if (containerRef.current) obs.observe(containerRef.current);
        return () => obs.disconnect();
    }, []);

    const byParent = useMemo(() => {
        const m = {};
        allStocks.forEach(s => {
            const k = s.sectorName || 'Other';
            if (!m[k]) m[k] = [];
            m[k].push(s);
        });
        return m;
    }, [allStocks]);

    const layout = useMemo(() => {
        const { w, h } = dims;
        if (!sectors.length || w <= 0 || h <= 0) return null;

        if (drillSector) {
            const stocks = (byParent[drillSector] || [])
                .map(s => ({ id: s.scId || s.name, name: s.name, value: Math.max(s.marketCap || 15, 1), change: s.changePercent, ltp: s.ltp, sector: s.sectorName }))
                .sort((a, b) => b.value - a.value);
            const tiles = squarify(stocks, GAP, GAP, w - GAP * 2, h - GAP * 2);
            return { type: 'drill', tiles };
        }

        const secItems = sectors.map(sec => {
            const stocks = byParent[sec.name] || [];
            const capSum = stocks.reduce((a, s) => a + (s.marketCap || 10), 0);
            return { id: sec.id, name: sec.name, value: Math.max(capSum || sec.totalStocks || 10, 10), change: sec.value, totalStocks: sec.totalStocks };
        }).sort((a, b) => b.value - a.value);

        const secTiles = squarify(secItems, 0, 0, w, h);

        return {
            type: 'full',
            sectors: secTiles.map(sec => {
                const stocks = (byParent[sec.name] || [])
                    .map(s => ({ id: s.scId || s.name, name: s.name, value: Math.max(s.marketCap || 15, 1), change: s.changePercent, ltp: s.ltp, sector: s.sectorName }))
                    .sort((a, b) => b.value - a.value);
                const innerX = sec.x + GAP;
                const innerY = sec.y + SEC_HDR;
                const innerW = sec.w - GAP * 2;
                const innerH = sec.h - SEC_HDR - GAP;
                const stockTiles = (innerW > 2 && innerH > 2) ? squarify(stocks, innerX, innerY, innerW, innerH) : [];
                return { ...sec, stockTiles };
            })
        };
    }, [dims, sectors, byParent, drillSector]);

    const renderTile = (tile, key, showLogo = true) => {
        if (!tile || tile.w < 2 || tile.h < 2) return null;
        const clr = getMCColor(tile.change ?? 0);
        const hov = hoveredKey === key;
        const pad = 3;
        const iw = Math.max(tile.w - pad * 2, 1);
        const ih = Math.max(tile.h - pad * 2, 1);
        const showName = iw > 28 && ih > 20;
        const showPct = iw > 35 && ih > 32;
        const showLtp2 = iw > 55 && ih > 48;
        const showLg = showLogo && iw > 50 && ih > 52;
        const nameFontSize = Math.min(Math.max(Math.min(iw / 6.5, ih / 4, 12), 7), 13);
        const pctFontSize = Math.min(Math.max(nameFontSize - 1, 6.5), 11);
        
        let displayName = tile.name || '';
        const maxChars = Math.max(Math.floor(iw / (nameFontSize * 0.55)), 2);
        if (displayName.length > maxChars) {
            displayName = displayName.slice(0, maxChars - 1) + '…';
        }

        return (
            <g key={key}
                onMouseEnter={e => { setHoveredKey(key); setTooltip({ x: e.clientX, y: e.clientY, tile }); }}
                onMouseMove={e => setTooltip(t => t ? { ...t, x: e.clientX, y: e.clientY } : null)}
                onMouseLeave={() => { setHoveredKey(null); setTooltip(null); }}
                style={{ cursor: 'pointer' }}
            >
                <rect
                    x={tile.x} y={tile.y}
                    width={tile.w} height={tile.h}
                    fill={clr.bg} rx={3}
                    stroke={hov ? 'rgba(255,255,255,0.9)' : clr.border}
                    strokeWidth={hov ? 1.5 : 0.6}
                />
                {hov && (
                    <rect x={tile.x} y={tile.y} width={tile.w} height={tile.h}
                        fill="rgba(255,255,255,0.05)" rx={3} pointerEvents="none" />
                )}
                {showName && (
                    <foreignObject x={tile.x + pad} y={tile.y + pad} width={Math.max(iw, 1)} height={Math.max(ih, 1)}>
                        <div xmlns="http://www.w3.org/1999/xhtml" style={{
                            width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', gap: 2, overflow: 'hidden',
                        }}>
                            {showLg && <StockLogo name={tile.name} size={iw} textColor={clr.text} />}
                            <span style={{
                                fontSize: nameFontSize, fontWeight: 700, color: clr.text,
                                textAlign: 'center', lineHeight: 1.15, wordBreak: 'break-word',
                                maxWidth: '100%', padding: '0 2px',
                            }}>{displayName}</span>
                            {showPct && (
                                <span style={{
                                    fontSize: pctFontSize, fontWeight: 700,
                                    color: clr.text, opacity: 0.92,
                                }}>
                                    {(tile.change ?? 0) >= 0 ? '+' : ''}{(tile.change ?? 0).toFixed(2)}%
                                </span>
                            )}
                            {showLtp2 && tile.ltp != null && (
                                <span style={{
                                    fontSize: Math.max(pctFontSize - 1.5, 6.5),
                                    color: clr.text, opacity: 0.7,
                                }}>₹{tile.ltp.toFixed(tile.ltp >= 100 ? 0 : 2)}</span>
                            )}
                        </div>
                    </foreignObject>
                )}
            </g>
        );
    };

    const drillSectorData = drillSector ? sectors.find(s => s.name === drillSector) : null;
    const legendColors = ['#7f1d1d', '#b91c1c', '#ef4444', '#f87171', '#fca5a5', '#2d3748', '#86efac', '#22c55e', '#16a834', '#0d7a22', '#0a5c1a'];

    return (
        <div style={{ background: '#0d1117', borderRadius: 18, border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
            {/* Toolbar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {drillSector ? (
                        <>
                            <button
                                onClick={() => setDrillSector(null)}
                                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 8, color: '#34d399', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                                ← All Sectors
                            </button>
                            <span style={{ color: '#f1f5f9', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                                {getSectorIcon(drillSector)} {drillSector}
                            </span>
                            {drillSectorData && (
                                <span style={{
                                    fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 16,
                                    background: getMCColor(drillSectorData.value).bg,
                                    color: getMCColor(drillSectorData.value).text,
                                }}>
                                    {drillSectorData.value > 0 ? '+' : ''}{drillSectorData.value?.toFixed(2)}%
                                </span>
                            )}
                        </>
                    ) : (
                        <span style={{ color: '#f1f5f9', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <LayoutGrid size={14} style={{ color: '#34d399' }} />
                            Market Heatmap
                            <span style={{ color: '#475569', fontSize: 11, fontWeight: 400 }}>· {selectedPeriod} · size = market cap</span>
                        </span>
                    )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: '#64748b' }}>
                    <span>-10%</span>
                    {legendColors.map((c, i) => <div key={i} style={{ width: 14, height: 12, background: c, borderRadius: 2 }} />)}
                    <span>+10%</span>
                </div>
            </div>

            {/* FULL SECTOR SCROLLABLE BAR - shows ALL sectors */}
            {!drillSector && sectors.length > 0 && (
                <div style={{
                    padding: '10px 16px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    whiteSpace: 'nowrap',
                    scrollbarWidth: 'thin',
                    WebkitOverflowScrolling: 'touch',
                }}>
                    <div style={{ display: 'inline-flex', gap: 8 }}>
                        {sectors.map(s => {
                            const clr = getMCColor(s.value);
                            return (
                                <button
                                    key={s.id}
                                    onClick={() => setDrillSector(s.name)}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 5,
                                        padding: '5px 12px', borderRadius: 20, whiteSpace: 'nowrap',
                                        background: clr.bg + '22', border: `1px solid ${clr.border}55`,
                                        color: clr.text === '#fff' ? '#e2e8f0' : '#1a2e1a',
                                        fontSize: 11, fontWeight: 600, cursor: 'pointer',
                                        transition: 'transform 0.1s, background 0.1s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                                    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    {getSectorIcon(s.name)}
                                    <span>{s.name}</span>
                                    <span style={{
                                        background: clr.bg, color: clr.text,
                                        padding: '0 6px', borderRadius: 12, fontSize: 10,
                                        fontWeight: 700, marginLeft: 3,
                                    }}>
                                        {s.value > 0 ? '+' : ''}{s.value?.toFixed(1)}%
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* SVG Canvas */}
            <div ref={containerRef} style={{ width: '100%', minHeight: dims.h, position: 'relative', overflow: 'auto' }}>
                <svg width={dims.w} height={dims.h} style={{ display: 'block', background: '#0a0e14' }}>
                    {/* Full market view */}
                    {layout?.type === 'full' && layout.sectors.map(sec => {
                        const secClr = getMCColor(sec.change ?? 0);
                        const hasHdr = sec.w > 55 && sec.h > SEC_HDR + 8;
                        return (
                            <g key={sec.id}>
                                {/* Sector background */}
                                <rect x={sec.x} y={sec.y}
                                    width={sec.w} height={sec.h}
                                    fill="rgba(0,0,0,0.35)" rx={5}
                                    stroke="rgba(255,255,255,0.06)" strokeWidth={0.8} />

                                {/* Sector header */}
                                {hasHdr && (
                                    <>
                                        <rect x={sec.x} y={sec.y}
                                            width={sec.w} height={SEC_HDR}
                                            fill={secClr.bg + 'aa'} rx={5} />
                                        <rect x={sec.x} y={sec.y + SEC_HDR - 6}
                                            width={sec.w} height={6} fill={secClr.bg + 'aa'} />
                                        
                                        {sec.w > 65 && (
                                            <text x={sec.x + 7} y={sec.y + 17}
                                                fill={secClr.text === '#fff' ? '#f1f5f9' : '#0a2f1a'}
                                                fontSize={Math.min(sec.w / 14, 10.5)} fontWeight={700}
                                                style={{ userSelect: 'none' }}>
                                                {sec.name.length > Math.floor(sec.w / 7) ? sec.name.slice(0, Math.floor(sec.w / 7) - 2) + '…' : sec.name}
                                            </text>
                                        )}
                                        {sec.w > 120 && (
                                            <text x={sec.x + sec.w - 7} y={sec.y + 17}
                                                fill={secClr.text === '#fff' ? '#f1f5f9' : '#0a2f1a'}
                                                fontSize={9.5} fontWeight={700} textAnchor="end">
                                                {(sec.change ?? 0) > 0 ? '+' : ''}{(sec.change ?? 0).toFixed(2)}%
                                            </text>
                                        )}
                                    </>
                                )}

                                {/* Stock tiles */}
                                {sec.stockTiles.map((tile, i) => renderTile(tile, `${sec.id}-${i}`, true))}
                            </g>
                        );
                    })}

                    {/* Drilled view */}
                    {layout?.type === 'drill' && layout.tiles.map((tile, i) => renderTile(tile, `d-${i}`, true))}

                    {(!layout || (layout.type === 'full' && !layout.sectors?.length)) && (
                        <text x={dims.w / 2} y={dims.h / 2} textAnchor="middle" fill="#475569" fontSize={13}>No data available</text>
                    )}
                </svg>

                {/* Tooltip */}
                {tooltip && (
                    <div style={{
                        position: 'fixed', left: tooltip.x + 14, top: tooltip.y - 10, zIndex: 9999,
                        pointerEvents: 'none', background: 'rgba(8,12,18,0.98)',
                        border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12,
                        padding: '8px 14px', minWidth: 160, backdropFilter: 'blur(16px)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                    }}>
                        <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: 12, marginBottom: 3 }}>{tooltip.tile.name}</div>
                        {tooltip.tile.sector && <div style={{ color: '#64748b', fontSize: 9, marginBottom: 6 }}>{tooltip.tile.sector}</div>}
                        <div style={{ display: 'flex', gap: 16 }}>
                            <div>
                                <div style={{ color: '#475569', fontSize: 8, marginBottom: 2, textTransform: 'uppercase' }}>Change</div>
                                <div style={{ color: (tooltip.tile.change ?? 0) >= 0 ? '#34d399' : '#f87171', fontWeight: 800, fontSize: 15 }}>
                                    {(tooltip.tile.change ?? 0) >= 0 ? '+' : ''}{(tooltip.tile.change ?? 0).toFixed(2)}%
                                </div>
                            </div>
                            {tooltip.tile.ltp != null && (
                                <div>
                                    <div style={{ color: '#475569', fontSize: 8, marginBottom: 2, textTransform: 'uppercase' }}>LTP</div>
                                    <div style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 13 }}>₹{tooltip.tile.ltp?.toFixed(2)}</div>
                                </div>
                            )}
                        </div>
                        {tooltip.tile.value && (
                            <div style={{ marginTop: 5, fontSize: 9, color: '#475569' }}>
                                Cap: {formatMarketCap(tooltip.tile.value)}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

// ── API ───────────────────────────────────────────────────────────────
const API_URLS = {
    '1D': 'https://api.moneycontrol.com/mcapi/v1/indices/ad-ratio/full-view?period=1D&sector=&type=MM&sectorSelected=false',
    '5D': 'https://api.moneycontrol.com/mcapi/v1/indices/ad-ratio/full-view?period=5D&sector=&type=MM&sectorSelected=false',
    '1M': 'https://api.moneycontrol.com/mcapi/v1/indices/ad-ratio/full-view?period=1M&sector=&type=MM&sectorSelected=false',
    '3M': 'https://api.moneycontrol.com/mcapi/v1/indices/ad-ratio/full-view?period=3M&sector=&type=MM&sectorSelected=false',
    '6M': 'https://api.moneycontrol.com/mcapi/v1/indices/ad-ratio/full-view?period=6M&sector=&type=MM&sectorSelected=false',
    '1Y': 'https://api.moneycontrol.com/mcapi/v1/indices/ad-ratio/full-view?period=1Y&sector=&type=MM&sectorSelected=false',
};
const TIME_PERIODS = [{ key: '1D', label: '1D' }, { key: '5D', label: '5D' }, { key: '1M', label: '1M' }, { key: '3M', label: '3M' }, { key: '6M', label: '6M' }, { key: '1Y', label: '1Y' }];

const processApiData = (raw) => {
    if (!raw || raw.success !== 1 || !raw.data) return { sectors: [], allStocks: [], topGainers: [], topLosers: [], asOnDate: '' };
    const cd = raw.data.chartData || [];
    const sectors = cd.filter(s => s.sortColumn !== undefined && s.name && !s.ltp)
        .map(s => ({ id: s.id, name: s.name, totalStocks: s.totalStocks || 0, value: s.sortColumn }))
        .sort((a, b) => b.value - a.value);
    const allStocks = cd.filter(s => s.ltp && s.name)
        .map(s => ({ ...s, changePercent: parseFloat(s.changeP) || 0, marketCap: s.mrkCap, sectorName: s.sector || s.name, ltp: parseFloat(s.ltp) || 0 }));
    const byGain = [...allStocks].sort((a, b) => b.changePercent - a.changePercent);
    return { sectors, allStocks, topGainers: byGain.slice(0, 8), topLosers: [...allStocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 8), asOnDate: raw.data.asOnDate || '' };
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────
export default function HeatMap() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastFetched, setLastFetched] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSector, setSelectedSector] = useState(null);
    const [activeTab, setActiveTab] = useState('treemap');
    const [selectedPeriod, setSelectedPeriod] = useState('1D');
    const [showAllStocks, setShowAllStocks] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'changePercent', direction: 'desc' });
    const [sectorDropdownOpen, setSectorDropdownOpen] = useState(false);
    const [apiData, setApiData] = useState({ sectors: [], allStocks: [], topGainers: [], topLosers: [], asOnDate: '' });

    const fetchData = useCallback(async (period = selectedPeriod) => {
        setLoading(true); setError(null);
        try {
            const res = await fetch(API_URLS[period] || API_URLS['1D']);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            setApiData(processApiData(await res.json()));
            setLastFetched(new Date());
        } catch (e) { setError(e.message); }
        finally { setLoading(false); }
    }, [selectedPeriod]);

    useEffect(() => { fetchData(selectedPeriod); }, [selectedPeriod, fetchData]);
    useEffect(() => { const id = setInterval(() => fetchData(selectedPeriod), 60000); return () => clearInterval(id); }, [selectedPeriod, fetchData]);
    useEffect(() => { setShowAllStocks(false); }, [selectedSector, searchTerm]);

    const { sectors, allStocks, topGainers, topLosers, asOnDate } = apiData;

    const filteredStocks = useMemo(() => {
        let s = allStocks;
        if (searchTerm) s = s.filter(x => x.name?.toLowerCase().includes(searchTerm.toLowerCase()));
        if (selectedSector) s = s.filter(x => x.sectorName === selectedSector);
        return s;
    }, [allStocks, searchTerm, selectedSector]);

    const sortedStocks = useMemo(() => {
        const arr = [...filteredStocks];
        arr.sort((a, b) => {
            if (sortConfig.key === 'name') return sortConfig.direction === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
            if (sortConfig.key === 'ltp') return sortConfig.direction === 'asc' ? a.ltp - b.ltp : b.ltp - a.ltp;
            return sortConfig.direction === 'asc' ? a.changePercent - b.changePercent : b.changePercent - a.changePercent;
        });
        return arr;
    }, [filteredStocks, sortConfig]);

    const displayedStocks = useMemo(() => showAllStocks ? sortedStocks : sortedStocks.slice(0, 20), [sortedStocks, showAllStocks]);
    const avgChange = allStocks.length ? (allStocks.reduce((s, x) => s + x.changePercent, 0) / allStocks.length).toFixed(2) : '0.00';
    const gainingStocks = allStocks.filter(s => s.changePercent > 0).length;
    const losingStocks = allStocks.filter(s => s.changePercent <= 0).length;

    if (loading && !lastFetched) return (
        <div className="min-h-screen bg-[#060b10] flex items-center justify-center">
            <div className="text-center"><div className="relative inline-flex mb-5"><div className="w-14 h-14 rounded-full border-2 border-white/[0.06]" /><div className="absolute inset-0 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin" /></div><p className="text-slate-400 text-sm">Fetching market data…</p></div>
        </div>
    );

    if (error && !lastFetched) return (
        <div className="min-h-screen bg-[#060b10] flex items-center justify-center">
            <div className="text-center"><AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" /><p className="text-red-400 text-sm mb-4">{error}</p><button onClick={() => fetchData(selectedPeriod)} className="px-5 py-2 bg-emerald-500 text-black font-semibold rounded-xl flex items-center gap-2 mx-auto"><RefreshCw size={14} /> Retry</button></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#060b10] text-slate-200 p-3 md:p-5">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: `linear-gradient(rgba(0,200,100,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,100,0.4) 1px,transparent 1px)`, backgroundSize: '48px 48px' }} />
            </div>

            <div className="relative z-10 max-w-[1700px] mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"><Activity className="w-4 h-4 text-emerald-400" /></div>
                        <div><h1 className="text-xl font-extrabold text-white tracking-tight">Stock Heatmap <span className="text-emerald-400 text-sm font-semibold">360°</span></h1><p className="text-slate-500 text-xs">Indian market · {asOnDate || 'Live'}</p></div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center bg-white/[0.04] border border-white/[0.07] rounded-lg p-0.5">
                            {TIME_PERIODS.map(p => (<button key={p.key} onClick={() => { setSelectedPeriod(p.key); setShowAllStocks(false); }} className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${selectedPeriod === p.key ? 'bg-white/[0.12] text-white' : 'text-slate-500 hover:text-slate-300'}`}>{p.label}</button>))}
                        </div>
                        <button onClick={() => fetchData(selectedPeriod)} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded-lg text-slate-400 text-xs hover:text-white transition disabled:opacity-40"><RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh</button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 mb-5">
                    {[
                        { label: 'Sectors', val: sectors.length, color: '#a78bfa', icon: PieChart },
                        { label: 'Stocks', val: allStocks.length, color: '#38bdf8', icon: BarChart3 },
                        { label: 'Gaining', val: gainingStocks, color: '#34d399', icon: TrendingUp },
                        { label: 'Losing', val: losingStocks, color: '#f87171', icon: TrendingDown },
                        { label: `Avg ${selectedPeriod}`, val: `${parseFloat(avgChange) > 0 ? '+' : ''}${avgChange}%`, color: parseFloat(avgChange) >= 0 ? '#34d399' : '#f87171', icon: Activity },
                    ].map((k, i) => (
                        <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 flex justify-between items-center">
                            <div className="flex items-center gap-1.5"><k.icon size={12} style={{ color: k.color }} /><span className="text-xs text-slate-500 font-medium">{k.label}</span></div>
                            <span className="text-lg font-extrabold" style={{ color: k.color }}>{k.val}</span>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex items-center bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 mb-5 w-fit gap-1">
                    {[['treemap', 'Treemap', <LayoutGrid size={13} />], ['stocks', 'Stocks', <Table2 size={13} />]].map(([v, l, icon]) => (
                        <button key={v} onClick={() => { setActiveTab(v); if (v === 'treemap') { setSearchTerm(''); setSelectedSector(null); } }} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === v ? 'bg-emerald-500 text-black shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>{icon}{l}</button>
                    ))}
                </div>

                {/* Treemap View */}
                {activeTab === 'treemap' && (<TreemapView sectors={sectors} allStocks={allStocks} selectedPeriod={selectedPeriod} />)}

                {/* Stocks Table View */}
                {activeTab === 'stocks' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <div className="space-y-5">
                            {[{ title: 'Top Gainers', data: topGainers, icon: <TrendingUp size={14} />, clsTitle: 'text-emerald-400' }, { title: 'Top Losers', data: topLosers, icon: <TrendingDown size={14} />, clsTitle: 'text-red-400' }].map(({ title, data, icon, clsTitle }) => (
                                <div key={title} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
                                    <h3 className={`font-bold flex items-center gap-2 text-sm mb-3 ${clsTitle}`}>{icon} {title} <span className="text-xs text-slate-600 ml-auto font-normal">({selectedPeriod})</span></h3>
                                    <div className="space-y-2">
                                        {data.slice(0, 6).map((s, i) => { const c = getMCColor(s.changePercent); return (
                                            <div key={i} className="flex justify-between items-center p-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.04)' }}>
                                                <div><p className="font-semibold text-slate-200 text-xs">{s.name}</p><p className="text-xs text-slate-600">₹{s.ltp?.toFixed(2)}</p></div>
                                                <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: c.bg, color: c.text }}>{s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%</span>
                                            </div>
                                        );})}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-2 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex flex-col">
                            <div className="p-4 border-b border-white/[0.05]">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} /><input type="text" placeholder="Search stocks…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30" /></div>
                                    <div className="relative"><button onClick={() => setSectorDropdownOpen(!sectorDropdownOpen)} className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-slate-300 hover:bg-white/[0.08] transition"><Filter size={14} className="text-emerald-400" />{selectedSector || 'All Sectors'}<ChevronDown size={14} className={`transition-transform ${sectorDropdownOpen ? 'rotate-180' : ''}`} /></button>
                                        {sectorDropdownOpen && (<div className="absolute top-full left-0 mt-1 w-64 max-h-64 overflow-y-auto bg-[#0d1117] border border-white/[0.1] rounded-xl shadow-xl z-20"><button onClick={() => { setSelectedSector(null); setSectorDropdownOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-white/[0.05] transition ${!selectedSector ? 'text-emerald-400 bg-white/[0.03]' : 'text-slate-300'}`}>All Sectors</button>{sectors.map(s => (<button key={s.id} onClick={() => { setSelectedSector(s.name); setSectorDropdownOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-white/[0.05] transition flex items-center gap-2 ${selectedSector === s.name ? 'text-emerald-400 bg-white/[0.03]' : 'text-slate-300'}`}>{getSectorIcon(s.name)}<span className="flex-1 truncate">{s.name}</span><span className={`text-xs ${s.value >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>{s.value > 0 ? '+' : ''}{s.value?.toFixed(1)}%</span></button>))}</div>)}
                                    </div>
                                    {selectedSector && (<div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl text-xs"><span className="text-emerald-300">{selectedSector}</span><button onClick={() => setSelectedSector(null)} className="text-emerald-400 hover:text-emerald-200"><X size={11} /></button></div>)}
                                </div>
                                <div className="mt-3 text-xs text-slate-500 flex justify-between"><span>Showing {displayedStocks.length} of {sortedStocks.length} stocks</span><span>{selectedPeriod} period</span></div>
                            </div>
                            <div className="overflow-x-auto flex-1">
                                <table className="w-full text-sm">
                                    <thead><tr className="border-b border-white/[0.05] text-xs text-slate-500">
                                        {[['name', 'Stock'], ['ltp', 'LTP'], ['changePercent', `Change (${selectedPeriod})`]].map(([k, l]) => (<th key={k} className="px-4 py-3 text-left cursor-pointer hover:text-slate-300 transition select-none" onClick={() => setSortConfig(p => ({ key: k, direction: p.key === k && p.direction === 'asc' ? 'desc' : 'asc' }))}><div className="flex items-center gap-1">{l}{sortConfig.key === k && (sortConfig.direction === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}</div></th>))}
                                        <th className="px-4 py-3 text-left hidden md:table-cell">Market Cap</th><th className="px-4 py-3 text-left hidden lg:table-cell">Sector</th>
                                    </tr></thead>
                                    <tbody>{displayedStocks.length === 0 && (<tr><td colSpan={5} className="text-center py-12 text-slate-600 text-sm">No stocks found</td></tr>)}
                                    {displayedStocks.map(s => { const c = getMCColor(s.changePercent); return (<tr key={s.scId || s.name} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"><td className="px-4 py-3"><p className="font-semibold text-slate-200 text-sm">{s.name}</p></td><td className="px-4 py-3 font-mono text-slate-300 text-sm">₹{s.ltp?.toFixed(2) || '—'}</td><td className="px-4 py-3"><span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold" style={{ background: c.bg, color: c.text }}>{s.changePercent >= 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}{s.changePercent >= 0 ? '+' : ''}{s.changePercent.toFixed(2)}%</span></td><td className="px-4 py-3 hidden md:table-cell text-slate-500 text-xs">{formatMarketCap(s.marketCap)}</td><td className="px-4 py-3 hidden lg:table-cell"><span className="flex items-center gap-1 text-xs text-slate-400">{getSectorIcon(s.sectorName)}{s.sectorName?.length > 20 ? s.sectorName.slice(0, 18) + '…' : s.sectorName}</span></td></tr>);})}</tbody>
                                </table>
                            </div>
                            {sortedStocks.length > 20 && (<div className="p-3 border-t border-white/[0.05] flex justify-center"><button onClick={() => setShowAllStocks(v => !v)} className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.07] rounded-xl text-emerald-400 text-sm font-medium hover:bg-white/[0.05] transition">{showAllStocks ? 'Show Less' : <><Eye size={13} /> View All ({sortedStocks.length - 20} more) <ChevronRight size={13} /></>}</button></div>)}
                        </div>
                    </div>
                )}

                <div className="mt-6 flex justify-between items-center text-xs text-slate-700 border-t border-white/[0.04] pt-4">
                    <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />Live · Auto-refresh 60s · {selectedPeriod} momentum</span>
                    {lastFetched && <span>Updated {lastFetched.toLocaleTimeString()}</span>}
                </div>
            </div>

            {loading && lastFetched && (<div className="fixed bottom-4 right-4 bg-emerald-500 text-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold z-50"><Loader2 size={12} className="animate-spin" /> Updating…</div>)}
        </div>
    );
}