import React, { useEffect, useRef, useState } from "react";

export default function MonsterHeadCatcherGame() {
  const BASE_WIDTH = 900;
  const BASE_HEIGHT = 500;
  const MAX_MISSES = 10;

  const monsterImages = [
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/151.png",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/143.png",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/54.png"
  ];

  const [heads, setHeads] = useState([]);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const gameLoopRef = useRef(null);
  const spawnLoopRef = useRef(null);

  useEffect(() => {
    const checkScreen = () => setIsSmallScreen(window.innerWidth < 700);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const createHead = () => {
    const size = isSmallScreen
      ? Math.floor(Math.random() * 28) + 78
      : Math.floor(Math.random() * 45) + 60;

    return {
      id: Math.random().toString(36).substring(2),
      x: Math.random() * (BASE_WIDTH - size),
      y: -size,
      size,
      speed: isSmallScreen ? Math.random() * 1.7 + 2.1 : Math.random() * 2 + 2,
      rotation: Math.random() * 20 - 10,
      image: monsterImages[Math.floor(Math.random() * monsterImages.length)]
    };
  };

  const startGame = () => {
    setHeads([]);
    setScore(0);
    setMissed(0);
    setGameOver(false);
    setStarted(true);
  };

  useEffect(() => {
    if (!started || gameOver) return;

    spawnLoopRef.current = setInterval(() => {
      setHeads((prev) => [...prev, createHead()]);
    }, isSmallScreen ? 950 : 850);

    gameLoopRef.current = setInterval(() => {
      setHeads((prev) =>
        prev
          .map((head) => ({ ...head, y: head.y + head.speed }))
          .filter((head) => {
            if (head.y > BASE_HEIGHT) {
              setMissed((m) => m + 1);
              return false;
            }
            return true;
          })
      );
    }, 20);

    return () => {
      clearInterval(spawnLoopRef.current);
      clearInterval(gameLoopRef.current);
    };
  }, [started, gameOver, isSmallScreen]);

  useEffect(() => {
    if (missed >= MAX_MISSES) {
      setGameOver(true);
      clearInterval(spawnLoopRef.current);
      clearInterval(gameLoopRef.current);
    }
  }, [missed]);

  const catchHead = (id) => {
    if (gameOver) return;
    setHeads((prev) => prev.filter((head) => head.id !== id));
    setScore((s) => s + 1);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 p-3 sm:p-6 overflow-hidden touch-none">
      <div className="w-full max-w-5xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 text-white">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold leading-tight">Can You Catch Them All???</h1>
            <p className="text-xs sm:text-sm opacity-80 mt-1">
              How many can you catch before they get away!
            </p>
          </div>

          <div className="flex gap-2 sm:gap-4 text-sm sm:text-lg font-semibold">
            <div className="bg-black/40 px-3 sm:px-4 py-2 rounded-2xl">Score: {score}</div>
            <div className="bg-black/40 px-3 sm:px-4 py-2 rounded-2xl">Missed: {missed} / {MAX_MISSES}</div>
          </div>
        </div>

        <div className="w-full mx-auto max-h-[78vh] aspect-[9/5] sm:aspect-[9/5]">
          <div
            className="relative overflow-hidden border-4 border-white rounded-3xl shadow-2xl w-full h-full bg-sky-300"
            style={{ touchAction: "manipulation" }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, #55cfff 0%, #6ed8ff 34%, #b9f0ff 60%, #8ee36e 61%, #73cf58 76%, #6d4a2a 76%, #4b321d 100%)",
                imageRendering: "pixelated"
              }}
            >
              <div className="absolute top-[8%] left-[8%] w-[10%] h-[7%] bg-white/90 rounded-full" />
              <div className="absolute top-[11%] left-[15%] w-[15%] h-[8%] bg-white/90 rounded-full" />
              <div className="absolute top-[7%] left-[28%] w-[8%] h-[5%] bg-white/80 rounded-full" />
              <div className="absolute top-[17%] right-[32%] w-[12%] h-[6%] bg-white/85 rounded-full" />
              <div className="absolute top-[12%] right-[12%] w-[15%] h-[8%] bg-white/90 rounded-full" />

              <div className="absolute bottom-[29%] left-0 w-full h-[19%] bg-[#3ba75a] opacity-80" />
              <div className="absolute bottom-[30%] left-0 w-[15%] h-[25%] bg-[#26884a] rounded-full" />
              <div className="absolute bottom-[31%] left-[12%] w-[20%] h-[28%] bg-[#32a052] rounded-full" />
              <div className="absolute bottom-[30%] right-[15%] w-[22%] h-[30%] bg-[#2f9b50] rounded-full" />
              <div className="absolute bottom-[32%] right-0 w-[17%] h-[28%] bg-[#237a43] rounded-full" />

              <div className="absolute bottom-[22%] left-0 w-full h-[13%] bg-[#91ee6f]" />
              <div className="absolute bottom-[24%] left-0 w-full h-[3%] bg-[#b6ff86]" />
              <div className="absolute bottom-[20%] left-0 w-full h-[6%] bg-[#62bd4c]" />

              <div className="absolute bottom-[27%] left-[10%] w-[4%] h-[1.5%] bg-[#d7ff9a]" />
              <div className="absolute bottom-[25%] left-[28%] w-[6%] h-[1.5%] bg-[#d7ff9a]" />
              <div className="absolute bottom-[28%] right-[28%] w-[5%] h-[1.5%] bg-[#d7ff9a]" />
              <div className="absolute bottom-[26%] right-[12%] w-[7%] h-[1.5%] bg-[#d7ff9a]" />

              <div className="absolute bottom-[21%] left-[1%] w-[20%] h-[45%]">
                <div className="absolute bottom-0 left-[46%] w-[8%] h-[50%] bg-[#6d3f21]" />
                <div className="absolute bottom-[34%] left-[2%] w-[70%] h-[45%] bg-[#2f944c] rounded-full" />
                <div className="absolute bottom-[65%] left-[58%] w-[55%] h-[36%] bg-[#3aaa58] rounded-full" />
                <div className="absolute bottom-[72%] left-[67%] w-[40%] h-[23%] bg-[#8bea66] rounded-full opacity-70" />
              </div>

              <div className="absolute bottom-[21%] right-0 w-[23%] h-[51%]">
                <div className="absolute bottom-0 left-[40%] w-[8%] h-[53%] bg-[#5e351c]" />
                <div className="absolute bottom-[35%] left-[5%] w-[75%] h-[44%] bg-[#237f45] rounded-full" />
                <div className="absolute bottom-[66%] left-[46%] w-[60%] h-[36%] bg-[#35a653] rounded-full" />
                <div className="absolute bottom-[76%] left-[54%] w-[45%] h-[18%] bg-[#86e964] rounded-full opacity-70" />
              </div>

              <div className="absolute bottom-0 left-0 w-full h-[22%] bg-[#6b4a2a]">
                <div className="absolute top-0 left-0 w-full h-[18%] bg-[#7b5630]" />
                <div className="absolute top-[22%] left-[6%] w-[6%] h-[28%] bg-[#4a2d19]" />
                <div className="absolute top-[48%] left-[28%] w-[4%] h-[22%] bg-[#4a2d19]" />
                <div className="absolute top-[28%] left-[48%] w-[7%] h-[28%] bg-[#4a2d19]" />
                <div className="absolute top-[52%] right-[28%] w-[5%] h-[23%] bg-[#4a2d19]" />
                <div className="absolute top-[24%] right-[8%] w-[8%] h-[32%] bg-[#4a2d19]" />
                <div className="absolute top-[58%] right-[3%] w-[4%] h-[22%] bg-[#3f2616]" />
              </div>
            </div>

            {!started && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white z-20 px-5 text-center">
                <h2 className="text-3xl sm:text-5xl font-black mb-4">Get Ready Trainer!</h2>
                <p className="text-base sm:text-lg mb-6 max-w-md">
                  Don't let them escape! Miss {MAX_MISSES} and it's game over.
                </p>
                <button
                  onClick={startGame}
                  className="px-8 py-4 rounded-2xl bg-yellow-400 text-black font-bold text-xl active:scale-95 sm:hover:scale-105 transition"
                >
                  Start Game
                </button>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white z-30 px-5 text-center">
                <h2 className="text-4xl sm:text-5xl font-black mb-3">Better Luck Next Time</h2>
                <p className="text-xl sm:text-2xl mb-6">Final Score: {score}</p>
                <button
                  onClick={startGame}
                  className="px-8 py-4 rounded-2xl bg-green-400 text-black font-bold text-xl active:scale-95 sm:hover:scale-105 transition"
                >
                  Play Again
                </button>
              </div>
            )}

            {heads.map((head) => (
              <button
                key={head.id}
                onPointerDown={() => catchHead(head.id)}
                className="absolute z-10 select-none active:scale-95 sm:hover:scale-110 transition-transform bg-transparent border-0 p-0"
                style={{
                  left: `${(head.x / BASE_WIDTH) * 100}%`,
                  top: `${(head.y / BASE_HEIGHT) * 100}%`,
                  width: `${(head.size / BASE_WIDTH) * 100}%`,
                  aspectRatio: "1 / 1",
                  minWidth: isSmallScreen ? 58 : 44,
                  transform: `rotate(${head.rotation}deg)`,
                  touchAction: "manipulation"
                }}
                aria-label="Catch monster head"
              >
                <img
                  src={head.image}
                  alt="monster head"
                  className="w-full h-full object-contain drop-shadow-2xl pointer-events-none"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
