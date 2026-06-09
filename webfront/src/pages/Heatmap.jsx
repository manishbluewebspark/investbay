import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
    TrendingUp, TrendingDown, BarChart3, PieChart, Activity,
    Search, Zap, Shield, Droplet, Factory,
    Car, Heart, Building, Cog, DollarSign, Leaf, RefreshCw,
    AlertCircle, Loader2, Eye, ChevronRight, LayoutGrid,
    Table2, Filter, ArrowUp, ArrowDown, ChevronDown, X
} from 'lucide-react';

// ── Finology Fonts ────────────────────────────────────────────────────
const AB = { fontFamily: "'Aileron Black', 'Arial Black', sans-serif" };
const HS = { fontFamily: "'Hind Siliguri', 'Hind', sans-serif" };
const AL = { fontFamily: "'Aileron', 'Arial', sans-serif" };

// ── Helpers ──────────────────────────────────────────────────────────
const getSectorIcon = (name) => {
    const icons = { 
        'Automobile & Ancillaries': Car, 
        'Healthcare': Heart, 
        'Capital Goods': Cog, 
        'Metals & Mining': Shield, 
        'Finance': DollarSign, 
        'Chemicals': Droplet, 
        'Banks': Building, 
        'Software & IT Services': Activity, 
        'Power': Zap, 
        'Infrastructure': Factory, 
        'FMCG': Leaf 
    };
    const Icon = icons[name] || BarChart3;
    return <Icon size={13} strokeWidth={1.8} />;
};

const fmt = (v) => { 
    if (!v) return '—'; 
    if (v >= 100000) return `${(v/100000).toFixed(1)}L Cr`; 
    if (v >= 1000) return `${(v/1000).toFixed(1)}K Cr`; 
    return `${v.toFixed(1)} Cr`; 
};

// ── Color scale ───────────────────────────────────────────────────────
const getColor = (v) => {
    if (v >= 10)  return { bg:'#0a5c1a', text:'#fff' };
    if (v >= 7)   return { bg:'#0d7a22', text:'#fff' };
    if (v >= 5)   return { bg:'#118a2a', text:'#fff' };
    if (v >= 3)   return { bg:'#16a834', text:'#fff' };
    if (v >= 2)   return { bg:'#1db954', text:'#fff' };
    if (v >= 1)   return { bg:'#22c55e', text:'#fff' };
    if (v >= 0.5) return { bg:'#4ade80', text:'#052e16' };
    if (v > 0)    return { bg:'#86efac', text:'#052e16' };
    if (v === 0)  return { bg:'#1e2d3d', text:'#64748b' };
    if (v > -0.5) return { bg:'#fecaca', text:'#450a0a' };
    if (v > -1)   return { bg:'#fca5a5', text:'#450a0a' };
    if (v > -2)   return { bg:'#f87171', text:'#fff' };
    if (v > -3)   return { bg:'#ef4444', text:'#fff' };
    if (v > -5)   return { bg:'#dc2626', text:'#fff' };
    if (v > -7)   return { bg:'#b91c1c', text:'#fff' };
    if (v > -10)  return { bg:'#991b1b', text:'#fff' };
    return          { bg:'#7f1d1d', text:'#fff' };
};

// ── Pure squarify — fills rect completely, no gaps ───────────────────
function squarify(nodes, x0, y0, x1, y1) {
    const W = x1 - x0, H = y1 - y0;
    if (!nodes.length || W <= 0 || H <= 0) return [];
    const total = nodes.reduce((s, n) => s + n.value, 0);
    if (total <= 0) return [];

    const scale = (W * H) / total;
    const scaled = nodes.map(n => ({ ...n, area: n.value * scale }));

    const result = [];
    let remaining = [...scaled];
    let px = x0, py = y0, pw = W, ph = H;

    const worst = (row, side) => {
        const s = row.reduce((a, n) => a + n.area, 0);
        const mn = Math.min(...row.map(n => n.area));
        const mx = Math.max(...row.map(n => n.area));
        return Math.max((side * side * mx) / (s * s), (s * s) / (side * side * mn));
    };

    while (remaining.length > 0) {
        const side = Math.min(pw, ph);
        let row = [remaining[0]];
        let i = 1;
        for (; i < remaining.length; i++) {
            const candidate = [...row, remaining[i]];
            if (worst(candidate, side) <= worst(row, side)) {
                row = candidate;
            } else break;
        }
        remaining = remaining.slice(row.length);

        const rowArea = row.reduce((a, n) => a + n.area, 0);
        const rowSide = rowArea / side;
        const isH = pw >= ph;

        let cur = isH ? py : px;
        row.forEach(n => {
            const len = (n.area / rowArea) * side;
            const rx = isH ? px : cur;
            const ry = isH ? cur : py;
            const rw = isH ? rowSide : len;
            const rh = isH ? len : rowSide;
            result.push({ ...n, x: rx, y: ry, w: rw, h: rh });
            cur += len;
        });

        if (isH) { px += rowSide; pw -= rowSide; }
        else     { py += rowSide; ph -= rowSide; }

        if (pw <= 0.5 || ph <= 0.5) break;
    }
    return result;
}

// ── Stock Logo ────────────────────────────────────────────────────────
const Logo = ({ name, boxW, boxH }) => {
    const s = Math.min(boxW * 0.3, boxH * 0.28, 36);
    if (s < 14) return null;
    const initials = (name || '').replace(/[^A-Za-z0-9]/g,'').slice(0,2).toUpperCase() || '??';
    let hash = 0;
    for (let i = 0; i < (name||'').length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const hue = ((Math.abs(hash) % 30) * 12 + 10);
    const palettes = [
        `hsl(${hue},70%,38%)`,`hsl(${(hue+60)%360},65%,40%)`,`hsl(${(hue+120)%360},68%,36%)`,
        `hsl(${(hue+180)%360},72%,42%)`,`hsl(${(hue+240)%360},60%,44%)`,
    ];
    const bg = palettes[Math.abs(hash) % palettes.length];
    return (
        <div style={{ width:s, height:s, borderRadius:'50%', background:bg, display:'flex', alignItems:'center', justifyContent:'center', border:'1.5px solid rgba(255,255,255,0.35)', boxShadow:'0 2px 8px rgba(0,0,0,0.4)', flexShrink:0 }}>
            <span style={{ fontSize:Math.max(s*0.38,7), fontWeight:800, color:'#fff', lineHeight:1, fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}>{initials}</span>
        </div>
    );
};

// ── TILE RENDERER ─────────────────────────────────────────────────────
const Tile = ({ tile, tileKey, onHover, onLeave, onMove, onClick, hovered }) => {
    const { x, y, w, h, name, change, ltp, label } = tile;
    if (w < 2 || h < 2) return null;

    const clr = getColor(change ?? 0);
    const GAP = 1.5;
    const ix = x + GAP, iy = y + GAP, iw = w - GAP*2, ih = h - GAP*2;

    const showName  = iw > 24 && ih > 18;
    const showPct   = iw > 28 && ih > 30;
    const showLtp   = iw > 40 && ih > 48;
    const showLogo  = iw > 52 && ih > 52;
    const fs  = Math.max(Math.min(iw/7, ih/4.5, 13), 7);
    const fps = Math.max(fs - 1, 6.5);

    const displayName = (name||'').length > Math.floor(iw/(fs*0.6)) ? (name||'').slice(0, Math.floor(iw/(fs*0.6))-1)+'…' : name;

    return (
        <g
            onMouseEnter={e => { onHover(tileKey); onMove(e, tile); }}
            onMouseMove={e => onMove(e, tile)}
            onMouseLeave={onLeave}
            onClick={() => onClick && onClick(tile)}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            <rect x={x} y={y} width={w} height={h} fill={clr.bg} rx={2}
                stroke={hovered ? 'rgba(255,255,255,0.85)' : 'rgba(0,0,0,0.35)'}
                strokeWidth={hovered ? 1.5 : 0.6}
            />
            {hovered && <rect x={x} y={y} width={w} height={h} fill="rgba(255,255,255,0.06)" rx={2} pointerEvents="none"/>}
            {showName && (
                <foreignObject x={ix} y={iy} width={Math.max(iw,1)} height={Math.max(ih,1)}>
                    <div xmlns="http://www.w3.org/1999/xhtml" style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:2, overflow:'hidden', padding:'1px' }}>
                        {showLogo && <Logo name={name} boxW={iw} boxH={ih}/>}
                        <span style={{ fontSize:fs, fontWeight:700, color:clr.text, textAlign:'center', lineHeight:1.15, wordBreak:'break-word', maxWidth:'100%', fontFamily: "'Hind Siliguri', 'Hind', sans-serif" }}>{displayName}</span>
                        {showPct && <span style={{ fontSize:fps, fontWeight:800, color:clr.text, opacity:0.9, fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}>{(change??0)>=0?'+':''}{(change??0).toFixed(2)}%</span>}
                        {showLtp && ltp != null && <span style={{ fontSize:Math.max(fps-1.5,6), color:clr.text, opacity:0.65, fontFamily: "'Aileron', 'Arial', sans-serif" }}>₹{ltp>=1000?ltp.toFixed(0):ltp.toFixed(2)}</span>}
                    </div>
                </foreignObject>
            )}
        </g>
    );
};

// ── TREEMAP COMPONENT ─────────────────────────────────────────────────
const Treemap = ({ sectors, allStocks, period }) => {
    const ref = useRef(null);
    const [dim, setDim]         = useState({ w:1200, h:640 });
    const [hovered, setHovered] = useState(null);
    const [tooltip, setTooltip] = useState(null);
    const [drill, setDrill]     = useState(null);
    const [visibleSectors, setVisibleSectors] = useState([]);

    const HDR = 26; // Increased sector header height for better visibility
    const PAD = 2;

    useEffect(() => {
        const ro = new ResizeObserver(([e]) => {
            const w = Math.max(e.contentRect.width, 400);
            setDim({ w, h: Math.max(Math.round(w * 0.54), 480) });
        });
        if (ref.current) ro.observe(ref.current);
        return () => ro.disconnect();
    }, []);

    const bySector = useMemo(() => {
        const m = {};
        allStocks.forEach(s => { const k = s.sectorName||'Other'; if(!m[k]) m[k]=[]; m[k].push(s); });
        return m;
    }, [allStocks]);

    // Update visible sectors for scroll tracking
    useEffect(() => {
        if (!drill && sectors.length) {
            setVisibleSectors(sectors.map(s => s.name));
        }
    }, [sectors, drill]);

    const layout = useMemo(() => {
        const { w, h } = dim;
        if (!sectors.length) return null;

        if (drill) {
            const stocks = (bySector[drill]||[]).map(s=>({ id:s.scId||s.name, name:s.name, value:Math.max(parseFloat(s.marketCap)||10,1), change:s.changePercent, ltp:s.ltp, sector:s.sectorName })).sort((a,b)=>b.value-a.value);
            return { type:'drill', tiles: squarify(stocks, PAD, PAD, w-PAD, h-PAD) };
        }

        const secNodes = sectors.map(sec => {
            const stocks = bySector[sec.name]||[];
            const cap = stocks.reduce((a,s)=>a+Math.max(parseFloat(s.marketCap)||10,1),0);
            return { id:sec.id, name:sec.name, value:Math.max(cap,10), change:sec.value, totalStocks:sec.totalStocks };
        }).sort((a,b)=>b.value-a.value);

        const secTiles = squarify(secNodes, PAD, PAD, w-PAD, h-PAD);

        const result = secTiles.map(st => {
            const stocks = (bySector[st.name]||[]).map(s=>({ id:s.scId||s.name, name:s.name, value:Math.max(parseFloat(s.marketCap)||10,1), change:s.changePercent, ltp:s.ltp, sector:s.sectorName })).sort((a,b)=>b.value-a.value);
            const innerY = st.y + HDR;
            const innerH = st.h - HDR;
            const stockTiles = (innerH > 8) ? squarify(stocks, st.x+PAD, innerY, st.x+st.w-PAD, innerY+innerH-PAD) : [];
            return { ...st, stockTiles };
        });

        return { type:'full', sectors: result };
    }, [dim, sectors, bySector, drill, HDR]);

    const handleTileHover = useCallback((key) => setHovered(key), []);
    const handleTileLeave = useCallback(() => { setHovered(null); setTooltip(null); }, []);
    const handleTileMove  = useCallback((e, tile) => setTooltip({ x:e.clientX, y:e.clientY, tile }), []);

    const drillData = drill ? sectors.find(s=>s.name===drill) : null;

    // Scroll to sector function
    const scrollToSector = (sectorName) => {
        const element = document.getElementById(`sector-${sectorName.replace(/[^a-zA-Z0-9]/g, '-')}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.style.transition = 'box-shadow 0.3s';
            element.style.boxShadow = '0 0 0 2px #34d399';
            setTimeout(() => { element.style.boxShadow = ''; }, 1500);
        }
    };

    return (
        <div style={{ background:'#0a0d13', borderRadius:16, border:'1px solid rgba(255,255,255,0.07)', overflow:'hidden' }}>

            {/* Toolbar */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 16px', borderBottom:'1px solid rgba(255,255,255,0.06)', gap:8, flexWrap:'wrap' }}>
                <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    {drill ? (
                        <>
                            <button onClick={()=>setDrill(null)} style={{ display:'flex',alignItems:'center',gap:6, padding:'6px 14px', background:'rgba(52,211,153,0.12)', border:'1px solid rgba(52,211,153,0.3)', borderRadius:10, color:'#34d399', fontSize:12, fontWeight:700, cursor:'pointer', fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}>← All Sectors</button>
                            <span style={{ color:'#f1f5f9', fontSize:14, fontWeight:700, display:'flex', alignItems:'center', gap:8, fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}>{getSectorIcon(drill)}{drill}</span>
                            {drillData && (() => { const c=getColor(drillData.value); return <span style={{ background:c.bg,color:c.text, padding:'3px 12px', borderRadius:24, fontSize:12, fontWeight:700, fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}>{drillData.value>0?'+':''}{drillData.value?.toFixed(2)}%</span>; })()}
                        </>
                    ) : (
                        <span style={{ color:'#e2e8f0', fontSize:13, fontWeight:700, display:'flex', alignItems:'center', gap:8, fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}>
                            <LayoutGrid size={14} style={{color:'#34d399'}}/>Market Heatmap
                            <span style={{ color:'#475569', fontSize:10, fontWeight:400, fontFamily: "'Hind Siliguri', 'Hind', sans-serif" }}>· {period} · tile size = market cap · click sector header/pill to drill in</span>
                        </span>
                    )}
                </div>
                {/* Legend */}
                <div style={{ display:'flex', alignItems:'center', gap:3, fontSize:10, color:'#475569', fontFamily: "'Hind Siliguri', 'Hind', sans-serif" }}>
                    <span>−10%</span>
                    {['#7f1d1d','#b91c1c','#ef4444','#f87171','#fecaca','#1e2d3d','#86efac','#22c55e','#16a834','#0d7a22','#0a5c1a'].map((c,i)=>(
                        <div key={i} style={{width:14,height:10,background:c,borderRadius:2}}/>
                    ))}
                    <span>+10%</span>
                </div>
            </div>

            {/* Sector Pills Row - Horizontal Scroll with better visibility */}
            {!drill && sectors.length > 0 && (
                <div style={{ 
                    display: 'flex', 
                    gap: 8, 
                    padding: '12px 16px', 
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    overflowX: 'auto', 
                    overflowY: 'hidden',
                    whiteSpace: 'nowrap',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#34d399 #1e2d3d',
                    background: 'linear-gradient(90deg, rgba(52,211,153,0.03) 0%, transparent 100%)'
                }}>
                    <button 
                        onClick={()=>setDrill(null)}
                        style={{ 
                            display:'inline-flex', alignItems:'center', gap:6, padding:'6px 14px',
                            borderRadius:24, background: !drill ? '#34d399' : 'rgba(52,211,153,0.12)',
                            border: `1px solid ${!drill ? '#34d399' : 'rgba(52,211,153,0.25)'}`,
                            color: !drill ? '#000' : '#34d399',
                            fontSize:11, fontWeight:700, cursor:'pointer', flexShrink:0,
                            transition:'all 0.2s', fontFamily: "'Aileron Black', 'Arial Black', sans-serif"
                        }}
                    >
                        🔥 All
                    </button>
                    {sectors.map(s => {
                        const c = getColor(s.value);
                        return (
                            <button key={s.id} onClick={()=>setDrill(s.name)}
                                style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'6px 13px', borderRadius:24,
                                    background: c.bg + '20', border: `1px solid ${c.bg}60`,
                                    color: c.text === '#fff' ? '#e2e8f0' : '#1a3322',
                                    fontSize:11, fontWeight:600, cursor:'pointer', flexShrink:0,
                                    transition:'all 0.2s', fontFamily: "'Hind Siliguri', 'Hind', sans-serif"
                                }}
                                onMouseEnter={e=>e.currentTarget.style.transform='scale(1.03)'}
                                onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}
                            >
                                {getSectorIcon(s.name)}
                                <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</span>
                                <span style={{ background:c.bg, color:c.text, padding:'2px 8px', borderRadius:16, fontSize:10, fontWeight:800, marginLeft:2 }}>
                                    {s.value>0?'+':''}{s.value?.toFixed(1)}%
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}

            {/* SVG Canvas */}
            <div ref={ref} style={{ width:'100%', minHeight:dim.h, position:'relative' }}>
                <svg width={dim.w} height={dim.h} style={{ display:'block', background:'#0a0d13' }}>
                    <defs>
                        <clipPath id="canvas-clip">
                            <rect x={0} y={0} width={dim.w} height={dim.h}/>
                        </clipPath>
                    </defs>
                    <g clipPath="url(#canvas-clip)">

                    {/* Full market view */}
                    {layout?.type === 'full' && layout.sectors.map(sec => {
                        const sc = getColor(sec.change ?? 0);
                        const showHdr = sec.w > 45 && sec.h > HDR + 8;
                        return (
                            <g key={sec.id} id={`sector-${sec.name.replace(/[^a-zA-Z0-9]/g, '-')}`}>
                                {/* Sector background */}
                                <rect x={sec.x} y={sec.y} width={sec.w} height={sec.h} fill="rgba(0,0,0,0.2)" rx={2} stroke="rgba(255,255,255,0.08)" strokeWidth={1.5}/>

                                {/* Sector header bar - Enhanced visibility */}
                                {showHdr && (
                                    <>
                                        <rect x={sec.x} y={sec.y} width={sec.w} height={HDR} fill={sc.bg + 'dd'} rx={2} onClick={() => setDrill(sec.name)} style={{ cursor: 'pointer' }}/>
                                        <rect x={sec.x} y={sec.y + HDR - 1} width={sec.w} height={2} fill="rgba(255,255,255,0.15)" />
                                        
                                        {/* Sector name with icon */}
                                        {sec.w > 55 && (
                                            <text 
                                                x={sec.x + 8} y={sec.y + 18} 
                                                fill={sc.text === '#fff' ? '#ffffff' : '#072010'}
                                                fontSize={Math.min(sec.w/14, 11)} 
                                                fontWeight={800} 
                                                style={{ userSelect:'none', cursor:'pointer', fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
                                                onClick={() => setDrill(sec.name)}
                                            >
                                                {getSectorIcon(sec.name)} {sec.name.length > Math.floor(sec.w/9) ? sec.name.slice(0,Math.floor(sec.w/9)-2)+'…' : sec.name}
                                            </text>
                                        )}
                                        
                                        {/* Sector performance */}
                                        {sec.w > 100 && (
                                            <text 
                                                x={sec.x + sec.w - 8} y={sec.y + 18} 
                                                fill={sc.text === '#fff' ? '#ffffff' : '#072010'}
                                                fontSize={10.5} fontWeight={800} textAnchor="end" 
                                                style={{ userSelect:'none', cursor:'pointer', fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}
                                                onClick={() => setDrill(sec.name)}
                                            >
                                                {(sec.change??0)>0?'+':''}{(sec.change??0).toFixed(2)}%
                                            </text>
                                        )}
                                        
                                        {/* Stock count badge */}
                                        {sec.w > 80 && sec.totalStocks && (
                                            <text 
                                                x={sec.x + sec.w/2} y={sec.y + 18} 
                                                fill={sc.text === '#fff' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.6)'}
                                                fontSize={9} fontWeight={500} textAnchor="middle" 
                                                style={{ userSelect:'none' }}
                                            >
                                                {sec.totalStocks} stocks
                                            </text>
                                        )}
                                    </>
                                )}

                                {/* Stock tiles */}
                                {sec.stockTiles.map((tile, i) => (
                                    <Tile key={`${sec.id}-${i}`} tile={tile} tileKey={`${sec.id}-${i}`}
                                        onHover={handleTileHover} onLeave={handleTileLeave} onMove={handleTileMove}
                                        onClick={()=>setDrill(sec.name)}
                                        hovered={hovered===`${sec.id}-${i}`}/>
                                ))}

                                {/* Sector border */}
                                <rect x={sec.x} y={sec.y} width={sec.w} height={sec.h} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1.5} rx={2}/>
                            </g>
                        );
                    })}

                    {/* Drilled sector view */}
                    {layout?.type === 'drill' && layout.tiles.map((tile, i) => (
                        <Tile key={`d-${i}`} tile={tile} tileKey={`d-${i}`}
                            onHover={handleTileHover} onLeave={handleTileLeave} onMove={handleTileMove}
                            hovered={hovered===`d-${i}`}/>
                    ))}

                    {!layout && <text x={dim.w/2} y={dim.h/2} textAnchor="middle" fill="#475569" fontSize={13}>No data</text>}
                    </g>
                </svg>

                {/* Tooltip */}
                {tooltip && (
                    <div style={{ position:'fixed', left:tooltip.x+14, top:tooltip.y-10, zIndex:9999, pointerEvents:'none',
                        background:'rgba(6,9,14,0.98)', border:'1px solid rgba(52,211,153,0.3)', borderRadius:12,
                        padding:'10px 16px', minWidth:170, backdropFilter:'blur(16px)', boxShadow:'0 8px 28px rgba(0,0,0,0.8)' }}>
                        <div style={{ fontWeight:800, color:'#f1f5f9', fontSize:13, marginBottom:4, fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}>{tooltip.tile.name}</div>
                        {tooltip.tile.sector && <div style={{ color:'#475569', fontSize:9, marginBottom:7, fontFamily: "'Hind Siliguri', 'Hind', sans-serif" }}>{tooltip.tile.sector}</div>}
                        <div style={{ display:'flex', gap:18, alignItems:'flex-end' }}>
                            <div>
                                <div style={{ color:'#475569', fontSize:8, textTransform:'uppercase', marginBottom:2, fontFamily: "'Aileron', 'Arial', sans-serif" }}>Change</div>
                                <div style={{ color:(tooltip.tile.change??0)>=0?'#34d399':'#f87171', fontWeight:800, fontSize:16, fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}>
                                    {(tooltip.tile.change??0)>=0?'+':''}{(tooltip.tile.change??0).toFixed(2)}%
                                </div>
                            </div>
                            {tooltip.tile.ltp != null && <div>
                                <div style={{ color:'#475569', fontSize:8, textTransform:'uppercase', marginBottom:2, fontFamily: "'Aileron', 'Arial', sans-serif" }}>LTP</div>
                                <div style={{ color:'#e2e8f0', fontWeight:600, fontSize:14, fontFamily: "'Aileron Black', 'Arial Black', sans-serif" }}>₹{tooltip.tile.ltp?.toFixed(2)}</div>
                            </div>}
                            {tooltip.tile.value > 1 && <div>
                                <div style={{ color:'#475569', fontSize:8, textTransform:'uppercase', marginBottom:2, fontFamily: "'Aileron', 'Arial', sans-serif" }}>Mkt Cap</div>
                                <div style={{ color:'#94a3b8', fontWeight:500, fontSize:11, fontFamily: "'Hind Siliguri', 'Hind', sans-serif" }}>{fmt(tooltip.tile.value)}</div>
                            </div>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// ── API ───────────────────────────────────────────────────────────────
const API_URLS = {
    '1D':'https://api.moneycontrol.com/mcapi/v1/indices/ad-ratio/full-view?period=1D&sector=&type=MM&sectorSelected=false',
    '5D':'https://api.moneycontrol.com/mcapi/v1/indices/ad-ratio/full-view?period=5D&sector=&type=MM&sectorSelected=false',
    '1M':'https://api.moneycontrol.com/mcapi/v1/indices/ad-ratio/full-view?period=1M&sector=&type=MM&sectorSelected=false',
    '3M':'https://api.moneycontrol.com/mcapi/v1/indices/ad-ratio/full-view?period=3M&sector=&type=MM&sectorSelected=false',
    '6M':'https://api.moneycontrol.com/mcapi/v1/indices/ad-ratio/full-view?period=6M&sector=&type=MM&sectorSelected=false',
    '1Y':'https://api.moneycontrol.com/mcapi/v1/indices/ad-ratio/full-view?period=1Y&sector=&type=MM&sectorSelected=false',
};
const PERIODS = ['1D','5D','1M','3M','6M','1Y'];

const parse = (raw) => {
    if (!raw?.data || raw.success!==1) return { sectors:[], allStocks:[], topGainers:[], topLosers:[], asOnDate:'' };
    const cd = raw.data.chartData || [];
    const sectors = cd.filter(s=>s.sortColumn!==undefined&&s.name&&!s.ltp).map(s=>({ id:s.id,name:s.name,totalStocks:s.totalStocks||0,value:s.sortColumn })).sort((a,b)=>b.value-a.value);
    const allStocks = cd.filter(s=>s.ltp&&s.name).map(s=>({ ...s, changePercent:parseFloat(s.changeP)||0, marketCap:s.mrkCap, sectorName:s.sector||s.name, ltp:parseFloat(s.ltp)||0 }));
    const g = [...allStocks].sort((a,b)=>b.changePercent-a.changePercent);
    return { sectors, allStocks, topGainers:g.slice(0,8), topLosers:[...allStocks].sort((a,b)=>a.changePercent-b.changePercent).slice(0,8), asOnDate:raw.data.asOnDate||'' };
};

// ── MAIN HEATMAP COMPONENT ────────────────────────────────────────────
export default function HeatMap() {
    const [loading,   setLoading]   = useState(true);
    const [error,     setError]     = useState(null);
    const [fetched,   setFetched]   = useState(null);
    const [period,    setPeriod]    = useState('1D');
    const [tab,       setTab]       = useState('treemap');
    const [search,    setSearch]    = useState('');
    const [sector,    setSector]    = useState(null);
    const [showAll,   setShowAll]   = useState(false);
    const [sort,      setSort]      = useState({ key:'changePercent', dir:'desc' });
    const [ddOpen,    setDdOpen]    = useState(false);
    const [data,      setData]      = useState({ sectors:[], allStocks:[], topGainers:[], topLosers:[], asOnDate:'' });

    const load = useCallback(async (p=period) => {
        setLoading(true); setError(null);
        try { const r=await fetch(API_URLS[p]||API_URLS['1D']); if(!r.ok) throw new Error(`HTTP ${r.status}`); setData(parse(await r.json())); setFetched(new Date()); }
        catch(e){ setError(e.message); }
        finally{ setLoading(false); }
    },[period]);

    useEffect(()=>{ load(period); },[period]);
    useEffect(()=>{ const id=setInterval(()=>load(period),60000); return()=>clearInterval(id); },[period]);
    useEffect(()=>{ setShowAll(false); },[sector,search]);

    const { sectors, allStocks, topGainers, topLosers, asOnDate } = data;

    const filtered = useMemo(()=>{
        let s = allStocks;
        if(search) s=s.filter(x=>x.name?.toLowerCase().includes(search.toLowerCase()));
        if(sector) s=s.filter(x=>x.sectorName===sector);
        return s;
    },[allStocks,search,sector]);

    const sorted = useMemo(()=>{
        const a=[...filtered];
        a.sort((x,y)=>{ if(sort.key==='name') return sort.dir==='asc'?x.name.localeCompare(y.name):y.name.localeCompare(x.name); if(sort.key==='ltp') return sort.dir==='asc'?x.ltp-y.ltp:y.ltp-x.ltp; return sort.dir==='asc'?x.changePercent-y.changePercent:y.changePercent-x.changePercent; });
        return a;
    },[filtered,sort]);

    const displayed = useMemo(()=>showAll?sorted:sorted.slice(0,20),[sorted,showAll]);
    const avg = allStocks.length?(allStocks.reduce((s,x)=>s+x.changePercent,0)/allStocks.length).toFixed(2):'0.00';
    const gaining = allStocks.filter(s=>s.changePercent>0).length;

    if(loading&&!fetched) return (
        <div className="min-h-screen bg-[#060b10] flex items-center justify-center">
            <div className="text-center"><div className="relative inline-flex mb-5"><div className="w-14 h-14 rounded-full border-2 border-white/[0.05]"/><div className="absolute inset-0 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin"/></div><p className="text-slate-400 text-sm" style={HS}>Loading market data…</p></div>
        </div>
    );
    if(error&&!fetched) return (
        <div className="min-h-screen bg-[#060b10] flex items-center justify-center">
            <div className="text-center"><AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3"/><p className="text-red-400 text-sm mb-4" style={HS}>{error}</p><button onClick={()=>load(period)} className="px-5 py-2 bg-emerald-500 text-black font-semibold rounded-xl flex items-center gap-2 mx-auto" style={AB}><RefreshCw size={14}/> Retry</button></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#060b10] text-slate-200 p-3 md:p-5">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute inset-0 opacity-[0.01]" style={{backgroundImage:`linear-gradient(rgba(0,200,100,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(0,200,100,0.4) 1px,transparent 1px)`,backgroundSize:'48px 48px'}}/>
            </div>
            <div className="relative z-10 max-w-[1800px] mx-auto">

                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center"><Activity className="w-4 h-4 text-emerald-400"/></div>
                        <div>
                            <h1 className="text-xl font-extrabold text-white tracking-tight" style={AB}>Stock Heatmap <span className="text-emerald-400 text-sm font-semibold" style={AB}>360°</span></h1>
                            <p className="text-slate-500 text-xs" style={HS}>All Indian companies · {asOnDate||'Live'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="flex items-center bg-white/[0.04] border border-white/[0.07] rounded-lg p-0.5">
                            {PERIODS.map(p=>(<button key={p} onClick={()=>{setPeriod(p);setShowAll(false);}} className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all ${period===p?'bg-white/[0.12] text-white':'text-slate-500 hover:text-slate-300'}`} style={AB}>{p}</button>))}
                        </div>
                        <button onClick={()=>load(period)} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.04] border border-white/[0.07] rounded-lg text-slate-400 text-xs hover:text-white transition disabled:opacity-40" style={HS}><RefreshCw size={12} className={loading?'animate-spin':''}/> Refresh</button>
                    </div>
                </div>

                {/* KPI row */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 mb-4">
                    {[
                        {label:'Sectors',val:sectors.length,color:'#a78bfa',I:PieChart},
                        {label:'Stocks',val:allStocks.length,color:'#38bdf8',I:BarChart3},
                        {label:'Gaining',val:gaining,color:'#34d399',I:TrendingUp},
                        {label:'Losing',val:allStocks.length-gaining,color:'#f87171',I:TrendingDown},
                        {label:`Avg ${period}`,val:`${parseFloat(avg)>0?'+':''}${avg}%`,color:parseFloat(avg)>=0?'#34d399':'#f87171',I:Activity},
                    ].map((k,i)=>(
                        <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-4 py-3 flex justify-between items-center">
                            <div className="flex items-center gap-1.5"><k.I size={12} style={{color:k.color}}/><span className="text-xs text-slate-500 font-medium" style={HS}>{k.label}</span></div>
                            <span className="text-lg font-extrabold" style={{color:k.color, ...AB}}>{k.val}</span>
                        </div>
                    ))}
                </div>

                {/* Tab bar */}
                <div className="flex items-center bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 mb-4 w-fit gap-1">
                    {[['treemap','Treemap',<LayoutGrid size={13}/>],['stocks','Stocks',<Table2 size={13}/>]].map(([v,l,icon])=>(
                        <button key={v} onClick={()=>{setTab(v);if(v==='treemap'){setSearch('');setSector(null);}}} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${tab===v?'bg-emerald-500 text-black shadow-sm':'text-slate-400 hover:text-slate-200'}`} style={AB}>{icon}{l}</button>
                    ))}
                </div>

                {/* Treemap */}
                {tab==='treemap' && <Treemap sectors={sectors} allStocks={allStocks} period={period}/>}

                {/* Stocks table */}
                {tab==='stocks' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                        <div className="space-y-4">
                            {[{t:'Top Gainers',d:topGainers,pos:true},{t:'Top Losers',d:topLosers,pos:false}].map(({t,d,pos})=>(
                                <div key={t} className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
                                    <h3 className="font-bold flex items-center gap-2 text-sm mb-3" style={{color:pos?'#34d399':'#f87171', ...AB}}>
                                        {pos?<TrendingUp size={14}/>:<TrendingDown size={14}/>}{t}
                                        <span className="text-xs text-slate-600 ml-auto font-normal" style={HS}>({period})</span>
                                    </h3>
                                    <div className="space-y-1.5">
                                        {d.slice(0,6).map((s,i)=>{ const c=getColor(s.changePercent); return (
                                            <div key={i} className="flex justify-between items-center p-2.5 rounded-lg" style={{background:'rgba(255,255,255,0.022)',border:'1px solid rgba(255,255,255,0.04)'}}>
                                                <div><p className="font-semibold text-slate-200 text-xs" style={AB}>{s.name}</p><p className="text-xs text-slate-600" style={HS}>₹{s.ltp?.toFixed(2)}</p></div>
                                                <span className="text-xs font-bold px-2 py-0.5 rounded" style={{background:c.bg,color:c.text, ...AB}}>{s.changePercent>=0?'+':''}{s.changePercent.toFixed(2)}%</span>
                                            </div>
                                        );})}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-2 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex flex-col">
                            <div className="p-4 border-b border-white/[0.05]">
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14}/><input type="text" placeholder="Search stocks…" value={search} onChange={e=>setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/30" style={HS}/></div>
                                    <div className="relative">
                                        <button onClick={()=>setDdOpen(!ddOpen)} className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-slate-300 hover:bg-white/[0.07] transition" style={HS}>
                                            <Filter size={13} className="text-emerald-400"/>{sector||'All Sectors'}<ChevronDown size={13} className={`transition-transform ${ddOpen?'rotate-180':''}`}/>
                                        </button>
                                        {ddOpen && (
                                            <div className="absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto bg-[#0d1117] border border-white/[0.1] rounded-xl shadow-2xl z-30">
                                                <button onClick={()=>{setSector(null);setDdOpen(false);}} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/[0.05] transition ${!sector?'text-emerald-400':'text-slate-300'}`} style={HS}>All Sectors</button>
                                                {sectors.map(s=>(<button key={s.id} onClick={()=>{setSector(s.name);setDdOpen(false);}} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/[0.05] transition flex items-center gap-2 ${sector===s.name?'text-emerald-400 bg-white/[0.03]':'text-slate-300'}`} style={HS}>{getSectorIcon(s.name)}<span className="flex-1 truncate">{s.name}</span><span className={`text-xs font-semibold ${s.value>=0?'text-emerald-400':'text-red-400'}`} style={AB}>{s.value>0?'+':''}{s.value?.toFixed(1)}%</span></button>))}
                                            </div>
                                        )}
                                    </div>
                                    {sector && (<div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 rounded-xl text-xs"><span className="text-emerald-300" style={HS}>{sector}</span><button onClick={()=>setSector(null)} className="text-emerald-400"><X size={11}/></button></div>)}
                                </div>
                                <div className="mt-2.5 text-xs text-slate-500 flex justify-between" style={HS}><span>{displayed.length}/{sorted.length} stocks</span><span>{period}</span></div>
                            </div>
                            <div className="overflow-x-auto flex-1">
                                <table className="w-full text-sm">
                                    <thead><tr className="border-b border-white/[0.05] text-xs text-slate-500">
                                        {[['name','Stock'],['ltp','LTP'],['changePercent',`Change (${period})`]].map(([k,l])=>(
                                            <th key={k} className="px-4 py-3 text-left cursor-pointer hover:text-slate-300 select-none" onClick={()=>setSort(p=>({key:k,dir:p.key===k&&p.dir==='asc'?'desc':'asc'}))} style={HS}>
                                                <div className="flex items-center gap-1">{l}{sort.key===k&&(sort.dir==='asc'?<ArrowUp className="w-3 h-3"/>:<ArrowDown className="w-3 h-3"/>)}</div>
                                            </th>
                                        ))}
                                        <th className="px-4 py-3 text-left hidden md:table-cell text-xs text-slate-500" style={HS}>Mkt Cap</th>
                                        <th className="px-4 py-3 text-left hidden lg:table-cell text-xs text-slate-500" style={HS}>Sector</th>
                                    </tr></thead>
                                    <tbody>
                                        {displayed.length===0 && <tr><td colSpan={5} className="text-center py-10 text-slate-600 text-sm" style={HS}>No stocks found</td></tr>}
                                        {displayed.map(s=>{ const c=getColor(s.changePercent); return (
                                            <tr key={s.scId||s.name} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                                                <td className="px-4 py-3"><p className="font-semibold text-slate-200 text-sm" style={AB}>{s.name}</p></td>
                                                <td className="px-4 py-3 font-mono text-slate-300 text-sm" style={AL}>₹{s.ltp?.toFixed(2)||'—'}</td>
                                                <td className="px-4 py-3"><span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold" style={{background:c.bg,color:c.text, ...AB}}>{s.changePercent>=0?<ArrowUp size={10}/>:<ArrowDown size={10}/>}{s.changePercent>=0?'+':''}{s.changePercent.toFixed(2)}%</span></td>
                                                <td className="px-4 py-3 hidden md:table-cell text-slate-500 text-xs" style={HS}>{fmt(s.marketCap)}</td>
                                                <td className="px-4 py-3 hidden lg:table-cell"><span className="flex items-center gap-1 text-xs text-slate-500" style={HS}>{getSectorIcon(s.sectorName)}{(s.sectorName||'').length>20?(s.sectorName||'').slice(0,18)+'…':s.sectorName}</span></td>
                                            </tr>
                                        );})}
                                    </tbody>
                                </table>
                            </div>
                            {sorted.length>20 && (<div className="p-3 border-t border-white/[0.05] flex justify-center"><button onClick={()=>setShowAll(v=>!v)} className="flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.07] rounded-xl text-emerald-400 text-sm font-medium hover:bg-white/[0.05] transition" style={AB}>{showAll?'Show Less':<><Eye size={13}/> View All ({sorted.length-20} more) <ChevronRight size={13}/></>}</button></div>)}
                        </div>
                    </div>
                )}

                <div className="mt-6 flex justify-between text-xs text-slate-700 border-t border-white/[0.04] pt-4">
                    <span className="flex items-center gap-2" style={HS}><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"/>Live · Auto-refresh 60s · {period} momentum · click sector header/pill to drill down</span>
                    {fetched && <span style={HS}>Updated {fetched.toLocaleTimeString()}</span>}
                </div>
            </div>
            {loading&&fetched && (<div className="fixed bottom-4 right-4 bg-emerald-500 text-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-xs font-bold z-50" style={AB}><Loader2 size={12} className="animate-spin"/> Updating…</div>)}
        </div>
    );
}