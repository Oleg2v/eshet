import { useId } from "react";
export default function Landscape({
  kind = "sea",
  className = "",
}: {
  kind?: "sea" | "desert" | "mountain";
  className?: string;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      className={`landscape ${className}`}
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-sky`} x2="0" y2="1">
          <stop
            stopColor={
              kind === "sea"
                ? "#b7d4cf"
                : kind === "desert"
                  ? "#ded3bd"
                  : "#aabeb4"
            }
          />
          <stop offset="1" stopColor="#f0debc" />
        </linearGradient>
        <linearGradient id={`${id}-water`} x2="0" y2="1">
          <stop stopColor="#82aba4" />
          <stop offset="1" stopColor="#375e57" />
        </linearGradient>
        <linearGradient id={`${id}-sand`} x2="1" y2="1">
          <stop stopColor="#e9d9b7" />
          <stop offset="1" stopColor="#ad8662" />
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill={`url(#${id}-sky)`} />
      <circle cx="605" cy="140" r="64" fill="#fcf1d1" opacity=".8" />
      {kind === "sea" ? (
        <>
          <path d="M0 270 Q140 220 300 270 T800 252V600H0Z" fill="#a1a68e" />
          <rect y="310" width="800" height="290" fill={`url(#${id}-water)`} />
          <path
            d="M0 430C180 480 200 320 370 360S620 570 800 460V600H0Z"
            fill="#e6d8ba"
          />
          <path
            d="M0 448C180 500 200 345 368 380S620 590 800 480"
            fill="none"
            stroke="#f4ede0"
            strokeWidth="12"
          />
          <path
            d="M440 321L630 321M470 334L600 334M30 350L150 350M690 400L800 400"
            stroke="#cae2d8"
            strokeWidth="2"
            opacity=".5"
          />
        </>
      ) : kind === "desert" ? (
        <>
          <path
            d="M0 350L170 195 350 360 510 250 800 380V600H0Z"
            fill="#c7ac8d"
          />
          <path
            d="M0 445Q220 250 430 460T850 380V600H0Z"
            fill={`url(#${id}-sand)`}
          />
          <path
            d="M0 510Q240 300 470 540T820 480"
            fill="none"
            stroke="#f6e5c5"
            strokeWidth="3"
          />
          <path
            d="M480 600Q400 480 590 410"
            fill="none"
            stroke="#8d7458"
            strokeWidth="2"
            opacity=".35"
          />
        </>
      ) : (
        <>
          <path
            d="M0 400L180 155 340 350 500 160 800 420V600H0Z"
            fill="#688b7c"
          />
          <path
            d="M103 260L180 155 248 253 192 233 165 260 145 233Z"
            fill="#eee8d6"
          />
          <path
            d="M430 260L500 160 572 265 520 240 491 263 464 242Z"
            fill="#eee8d6"
          />
          <path d="M0 490Q200 310 390 470T800 370V600H0Z" fill="#365d50" />
          <path
            d="M370 600Q300 530 440 490T490 415"
            fill="none"
            stroke="#bdd2ba"
            strokeWidth="16"
          />
        </>
      )}
      <rect width="800" height="600" fill="#f7f2ea" opacity=".04" />
    </svg>
  );
}
