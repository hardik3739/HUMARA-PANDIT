import { useState } from "react";
import { CHAKRAS_INFO } from "../data";

interface InteractiveChakraDiagramProps {
  onSelectChakra: (chakraName: string) => void;
  selectedChakraName: string | null;
}

export default function InteractiveChakraDiagram({
  onSelectChakra,
  selectedChakraName
}: InteractiveChakraDiagramProps) {
  const [hoveredChakra, setHoveredChakra] = useState<typeof CHAKRAS_INFO[0] | null>(null);

  return (
    <div className="w-full relative bg-[#141414] border border-soft shadow-[0_12px_40px_rgba(0,0,0,0.8)] rounded-2xl p-6 flex flex-col justify-center items-center overflow-hidden h-[600px] select-none">
      
      {/* Sacred Geometry Mandala Rotating Background */}
      <div className="absolute inset-0 opacity-10 flex justify-center items-center pointer-events-none">
        <svg className="text-[#C5A059] animate-spin-slow w-[450px] h-[450px]" fill="none" stroke="currentColor" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="48" strokeWidth="0.5"></circle>
          <path d="M50 2 L50 98 M2 50 L98 50 M16 16 L84 84 M16 84 L84 16" strokeWidth="0.5"></path>
          <circle cx="50" cy="50" r="38" strokeDasharray="2 2" strokeWidth="0.5"></circle>
          <circle cx="50" cy="50" r="28" strokeWidth="0.5"></circle>
          <polygon points="50,15 80,67 20,67" strokeWidth="0.3" />
          <polygon points="50,85 80,33 20,33" strokeWidth="0.3" />
        </svg>
      </div>

      {/* Floating 3D Gemstone Accents */}
      {/* Blue Sapphire Left */}
      <div className="absolute left-8 top-[140px] w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-950 rounded-lg rotate-45 gem-3d animate-float-slow opacity-85 z-20 cursor-pointer border border-blue-600/40 flex items-center justify-center shadow-lg"
           style={{ animationDelay: "0.2s" }}
           title="Deep Sapphire Activator">
        <div className="w-4 h-4 bg-white/20 rounded-xs transform rotate-12"></div>
      </div>

      {/* Emerald Green Right */}
      <div className="absolute right-8 bottom-[180px] w-10 h-10 bg-gradient-to-br from-[#8CA685] to-emerald-950 rounded-xs rotate-12 gem-3d animate-float opacity-80 z-20 cursor-pointer border border-emerald-800/40 flex items-center justify-center shadow-md animate-duration-5000"
           style={{ animationDelay: "1.5s" }}
           title="Sacred Emerald Infuser">
        <div className="w-3 h-3 bg-white/30 rounded-xs transform -rotate-12"></div>
      </div>

      {/* Outer subtle frame */}
      <div className="absolute inset-4 border border-soft rounded-xl pointer-events-none"></div>

      {/* Human Silhouette outline overlay inside a beautiful circle */}
      <div className="relative w-[220px] h-[520px] z-10 flex flex-col items-center justify-between py-12">
        <div className="absolute inset-y-0 w-px bg-gradient-to-b from-white/5 via-white/10 to-white/5 left-1/2 -translate-x-1/2"></div>
        <div className="absolute top-10 bottom-10 w-[110px] border-l border-r border-white/5 rounded-full left-1/2 -translate-x-1/2 opacity-60"></div>
        
        {/* Render Chakras from top (Crown) to bottom (Root) */}
        {CHAKRAS_INFO.map((chakra, idx) => {
          const isSelected = selectedChakraName === chakra.name;
          const isHovered = hoveredChakra?.name === chakra.name;
          
          return (
            <div
              key={chakra.name}
              className="relative cursor-pointer w-full flex justify-center py-2 transition-transform duration-200"
              onClick={() => onSelectChakra(chakra.name)}
              onMouseEnter={() => setHoveredChakra(chakra)}
              onMouseLeave={() => setHoveredChakra(null)}
            >
              {/* Chakra glowing orb */}
              <div 
                className="w-7 h-7 rounded-full flex items-center justify-center z-25 relative transition-all duration-300"
                style={{
                  backgroundColor: chakra.color,
                  boxShadow: `0 0 ${isSelected ? "30px" : "15px"} ${chakra.color}`,
                  transform: isSelected ? "scale(1.4)" : isHovered ? "scale(1.2)" : "scale(1)",
                  border: isSelected ? "2.5px solid #0F0F0F" : "1.5px solid #ffffff50"
                }}
              >
                {/* Visual core for the chakra seed */}
                <div className="w-2.5 h-2.5 rounded-full bg-white/80 animate-ping opacity-40"></div>
                <div className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-xs"></div>
              </div>

              {/* Connected line indicator */}
              {(isSelected || isHovered) && (
                <div 
                  className="absolute left-1/2 w-8 h-px bg-dashed z-10 animate-pulse" 
                  style={{ 
                    borderColor: chakra.color,
                    marginLeft: "12px",
                    top: "50%"
                  }}
                />
              )}

              {/* Floating label to the right */}
              <div 
                className={`absolute left-[calc(50%+26px)] top-1/2 -translate-y-1/2 w-[180px] bg-[#0F0F0F] text-[#E0D8D0] p-3 rounded-lg border shadow-xl z-30 transition-all duration-300 pointer-events-none ${
                  isSelected || isHovered 
                    ? "opacity-100 translate-x-1" 
                    : "opacity-0 translate-x-4"
                }`}
                style={{ borderColor: chakra.color }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: chakra.color }}></div>
                  <span className="font-accent text-xs tracking-wider uppercase font-bold">{chakra.sanskrit}</span>
                </div>
                <h4 className="text-xs font-sans text-[#C5A059] mt-1 font-semibold">
                  {chakra.name} Chakra <span className="font-normal text-slate-400">({chakra.mantra})</span>
                </h4>
                <p className="text-[10px] text-slate-300 leading-normal mt-0.5 font-sans line-clamp-2">
                  {chakra.description}
                </p>
                <div className="text-[9px] text-[#C5A059] mt-1 font-mono italic">
                  Gems: {chakra.gems}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Guide label inside absolute container */}
      <div className="absolute bottom-4 left-6 right-6 text-center z-10">
        <p className="text-xs font-sans text-[#E0D8D0]/60 italic tracking-wider">
          {selectedChakraName 
            ? `Selected: ${selectedChakraName} Chakra (${CHAKRAS_INFO.find(c => c.name === selectedChakraName)?.sanskrit})`
            : "✦ Deepen alignment: Click on any colorful Chakra node to bind your focus ✦"
          }
        </p>
      </div>

    </div>
  );
}
