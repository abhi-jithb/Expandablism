"use client";

type Props = {
  exploded: boolean;
  selected: string | null;
  onPartClick: (part: string) => void;
};

const parts = [
  "rearWheel",
  "frontWheel",
  "frame",
  "engine",
  "fuelTank",
  "seat",
  "handlebar",
  "frontSuspension",
  "rearSuspension",
  "exhaust",
  "brake",
];

export default function MotorcycleSVG({
  exploded,
  selected,
  onPartClick,
}: Props) {
  const transform = (part: string, normal: string, explodedTransform: string) =>
    `${normal} ${
      exploded ? explodedTransform : ""
    }`;

  return (
    <svg
      viewBox="0 0 1000 600"
      className="h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* REAR WHEEL */}
      <g
        onClick={() => onPartClick("rearWheel")}
        className="cursor-pointer"
        transform={transform(
          "rearWheel",
          "",
          "translate(-70 -70)"
        )}
      >
        <circle
          cx="220"
          cy="410"
          r="105"
          fill="#111"
          stroke={selected === "rearWheel" ? "#fff" : "#777"}
          strokeWidth="14"
        />
        <circle
          cx="220"
          cy="410"
          r="72"
          fill="none"
          stroke="#333"
          strokeWidth="8"
        />
        <circle cx="220" cy="410" r="18" fill="#aaa" />

        <line
          x1="220"
          y1="410"
          x2="220"
          y2="315"
          stroke="#555"
          strokeWidth="4"
        />
        <line
          x1="220"
          y1="410"
          x2="220"
          y2="505"
          stroke="#555"
          strokeWidth="4"
        />
        <line
          x1="220"
          y1="410"
          x2="145"
          y2="410"
          stroke="#555"
          strokeWidth="4"
        />
        <line
          x1="220"
          y1="410"
          x2="295"
          y2="410"
          stroke="#555"
          strokeWidth="4"
        />
      </g>

      {/* FRONT WHEEL */}
      <g
        onClick={() => onPartClick("frontWheel")}
        className="cursor-pointer"
        transform={transform(
          "frontWheel",
          "",
          "translate(70 -70)"
        )}
      >
        <circle
          cx="780"
          cy="410"
          r="105"
          fill="#111"
          stroke={selected === "frontWheel" ? "#fff" : "#777"}
          strokeWidth="14"
        />
        <circle
          cx="780"
          cy="410"
          r="72"
          fill="none"
          stroke="#333"
          strokeWidth="8"
        />
        <circle cx="780" cy="410" r="18" fill="#aaa" />

        <line
          x1="780"
          y1="410"
          x2="780"
          y2="315"
          stroke="#555"
          strokeWidth="4"
        />
        <line
          x1="780"
          y1="410"
          x2="780"
          y2="505"
          stroke="#555"
          strokeWidth="4"
        />
        <line
          x1="780"
          y1="410"
          x2="705"
          y2="410"
          stroke="#555"
          strokeWidth="4"
        />
        <line
          x1="780"
          y1="410"
          x2="855"
          y2="410"
          stroke="#555"
          strokeWidth="4"
        />
      </g>

      {/* FRAME */}
      <g
        onClick={() => onPartClick("frame")}
        className="cursor-pointer"
        transform={transform(
          "frame",
          "",
          "translate(0 -55)"
        )}
      >
        <path
          d="M220 410 L360 230 L610 230 L780 410"
          fill="none"
          stroke={selected === "frame" ? "#fff" : "#aaa"}
          strokeWidth="24"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M360 230 L470 410 L610 230"
          fill="none"
          stroke={selected === "frame" ? "#fff" : "#777"}
          strokeWidth="18"
          strokeLinejoin="round"
        />

        <path
          d="M470 410 L220 410"
          stroke="#777"
          strokeWidth="16"
        />
      </g>

      {/* ENGINE */}
      <g
        onClick={() => onPartClick("engine")}
        className="cursor-pointer"
        transform={transform(
          "engine",
          "",
          "translate(0 85)"
        )}
      >
        <rect
          x="395"
          y="290"
          width="180"
          height="135"
          rx="22"
          fill="#181818"
          stroke={selected === "engine" ? "#fff" : "#888"}
          strokeWidth="10"
        />

        <circle
          cx="485"
          cy="355"
          r="45"
          fill="none"
          stroke="#aaa"
          strokeWidth="10"
        />

        <circle
          cx="485"
          cy="355"
          r="12"
          fill="#aaa"
        />

        <path
          d="M420 300 L440 265 L465 300"
          stroke="#aaa"
          strokeWidth="12"
        />

        <path
          d="M500 300 L525 265 L550 300"
          stroke="#aaa"
          strokeWidth="12"
        />
      </g>

      {/* FUEL TANK */}
      <g
        onClick={() => onPartClick("fuelTank")}
        className="cursor-pointer"
        transform={transform(
          "fuelTank",
          "",
          "translate(0 -100)"
        )}
      >
        <path
          d="M330 205 Q485 115 640 205 L600 285 L375 285 Z"
          fill="#252525"
          stroke={selected === "fuelTank" ? "#fff" : "#999"}
          strokeWidth="12"
        />

        <path
          d="M360 205 Q485 150 610 205"
          fill="none"
          stroke="#d44"
          strokeWidth="8"
        />

        <circle
          cx="485"
          cy="170"
          r="15"
          fill="#111"
          stroke="#aaa"
          strokeWidth="6"
        />
      </g>

      {/* SEAT */}
      <g
        onClick={() => onPartClick("seat")}
        className="cursor-pointer"
        transform={transform(
          "seat",
          "",
          "translate(-20 -120)"
        )}
      >
        <path
          d="M290 155 Q400 115 535 155 L580 205 L320 205 Z"
          fill="#171717"
          stroke={selected === "seat" ? "#fff" : "#888"}
          strokeWidth="12"
          strokeLinejoin="round"
        />
      </g>

      {/* HANDLEBAR */}
      <g
        onClick={() => onPartClick("handlebar")}
        className="cursor-pointer"
        transform={transform(
          "handlebar",
          "",
          "translate(100 -100)"
        )}
      >
        <path
          d="M620 225 L700 120 L800 120"
          fill="none"
          stroke={selected === "handlebar" ? "#fff" : "#aaa"}
          strokeWidth="14"
          strokeLinecap="round"
        />

        <line
          x1="700"
          y1="120"
          x2="665"
          y2="85"
          stroke="#aaa"
          strokeWidth="12"
        />

        <line
          x1="800"
          y1="120"
          x2="835"
          y2="85"
          stroke="#aaa"
          strokeWidth="12"
        />
      </g>

      {/* FRONT SUSPENSION */}
      <g
        onClick={() => onPartClick("frontSuspension")}
        className="cursor-pointer"
        transform={transform(
          "frontSuspension",
          "",
          "translate(100 60)"
        )}
      >
        <line
          x1="625"
          y1="220"
          x2="770"
          y2="400"
          stroke={selected === "frontSuspension" ? "#fff" : "#d6a72c"}
          strokeWidth="22"
        />

        <line
          x1="655"
          y1="220"
          x2="800"
          y2="400"
          stroke="#777"
          strokeWidth="10"
        />
      </g>

      {/* REAR SUSPENSION */}
      <g
        onClick={() => onPartClick("rearSuspension")}
        className="cursor-pointer"
        transform={transform(
          "rearSuspension",
          "",
          "translate(-100 60)"
        )}
      >
        <line
          x1="300"
          y1="250"
          x2="250"
          y2="390"
          stroke={selected === "rearSuspension" ? "#fff" : "#d6a72c"}
          strokeWidth="20"
        />

        {Array.from({ length: 7 }).map((_, i) => (
          <circle
            key={i}
            cx="300"
            cy={270 + i * 17}
            r="10"
            fill="none"
            stroke="#d6a72c"
            strokeWidth="5"
          />
        ))}
      </g>

      {/* EXHAUST */}
      <g
        onClick={() => onPartClick("exhaust")}
        className="cursor-pointer"
        transform={transform(
          "exhaust",
          "",
          "translate(-80 130)"
        )}
      >
        <path
          d="M430 410 C350 450 290 455 250 430"
          fill="none"
          stroke={selected === "exhaust" ? "#fff" : "#777"}
          strokeWidth="28"
          strokeLinecap="round"
        />

        <path
          d="M430 410 C350 450 290 455 250 430"
          fill="none"
          stroke="#aaa"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>

      {/* BRAKE */}
      <g
        onClick={() => onPartClick("brake")}
        className="cursor-pointer"
        transform={transform(
          "brake",
          "",
          "translate(120 100)"
        )}
      >
        <circle
          cx="780"
          cy="410"
          r="48"
          fill="none"
          stroke={selected === "brake" ? "#fff" : "#aaa"}
          strokeWidth="8"
        />

        <circle
          cx="780"
          cy="410"
          r="10"
          fill="#aaa"
        />

        {Array.from({ length: 6 }).map((_, i) => {
          const angle = (i * Math.PI) / 3;

          return (
            <line
              key={i}
              x1={780 + Math.cos(angle) * 12}
              y1={410 + Math.sin(angle) * 12}
              x2={780 + Math.cos(angle) * 42}
              y2={410 + Math.sin(angle) * 42}
              stroke="#aaa"
              strokeWidth="4"
            />
          );
        })}
      </g>
    </svg>
  );
}