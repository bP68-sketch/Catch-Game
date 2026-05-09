import React, { useEffect, useRef, useState } from "react";

export default function MonsterHeadCatcherGame() {
  const BASE_WIDTH = 900;
  const BASE_HEIGHT = 500;
  const MAX_MISSES = 10;
  const GAME_TIME = 60;
  const SPEED_UP_TIME = 15;

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
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [wonGame, setWonGame] = useState(false);

  const gameLoopRef = useRef(null);
  const spawnLoopRef = useRef(null);
  const timerLoopRef = useRef(null);
  const timeLeftRef = useRef(GAME_TIME);

  useEffect(() => {
    const checkScreen = () => setIsSmallScreen(window.innerWidth < 700);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const createHead = () => {
    const isFinalRush = timeLeftRef.current <= SPEED_UP_TIME;
    const size = isSmallScreen
      ? Math.floor(Math.random() * 28) + 78
      : Math.floor(Math.random() * 45) + 60;

    const baseSpeed = isFinalRush
      ? isSmallScreen
        ? Math.random() * 1.7 + 3.2
        : Math.random() * 2.2 + 4.0
      : isSmallScreen
        ? Math.random() * 1.1 + 1.8
        : Math.random() * 1.8 + 2.0;

    const side = Math.floor(Math.random() * 4);
    let x = 0;
    let y = 0;
    let dx = 0;
    let dy = 0;

    if (side === 0) {
      x = Math.random() * (BASE_WIDTH - size);
      y = -size;
      dx = (Math.random() - 0.5) * baseSpeed;
      dy = baseSpeed;
    } else if (side === 1) {
      x = Math.random() * (BASE_WIDTH - size);
      y = BASE_HEIGHT + size;
      dx = (Math.random() - 0.5) * baseSpeed;
      dy = -baseSpeed;
    } else if (side === 2) {
      x = -size;
      y = Math.random() * (BASE_HEIGHT - size);
      dx = baseSpeed;
      dy = (Math.random() - 0.5) * baseSpeed;
    } else {
      x = BASE_WIDTH + size;
      y = Math.random() * (BASE_HEIGHT - size);
      dx = -baseSpeed;
      dy = (Math.random() - 0.5) * baseSpeed;
    }

    return {
      id: Math.random().toString(36).substring(2),
      x,
      y,
      dx,
      dy,
      size,
      image: monsterImages[Math.floor(Math.random() * monsterImages.length)]
    };
  };

  const startGame = () => {
    setHeads([]);
    setScore(0);
    setMissed(0);
    setTimeLeft(GAME_TIME);
    timeLeftRef.current = GAME_TIME;
    setWonGame(false);
    setGameOver(false);
    setStarted(true);
  };

  useEffect(() => {
    if (!started || gameOver) return;

    spawnLoopRef.current = setInterval(() => {
      setHeads((prev) => [...prev, createHead()]);
    }, timeLeftRef.current <= SPEED_UP_TIME ? (isSmallScreen ? 650 : 575) : (isSmallScreen ? 950 : 850));

    timerLoopRef.current = setInterval(() => {
      setTimeLeft((current) => {
        const nextTime = current - 1;
        timeLeftRef.current = nextTime;

        if (nextTime <= 0) {
          clearInterval(spawnLoopRef.current);
          clearInterval(gameLoopRef.current);
          clearInterval(timerLoopRef.current);
          setHeads([]);
          setWonGame(true);
          setGameOver(true);
          return 0;
        }

        return nextTime;
      });
    }, 1000);

    gameLoopRef.current = setInterval(() => {
      setHeads((prev) =>
        prev
          .map((head) => {
            return {
              ...head,
              x: head.x + head.dx,
              y: head.y + head.dy
            };
          })
          .filter((head) => {
            const escaped =
              head.x < -head.size * 2 ||
              head.x > BASE_WIDTH + head.size * 2 ||
              head.y < -head.size * 2 ||
              head.y > BASE_HEIGHT + head.size * 2;

            if (escaped) {
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
      clearInterval(timerLoopRef.current);
    };
  }, [started, gameOver, isSmallScreen]);

  useEffect(() => {
    if (missed >= MAX_MISSES) {
      setGameOver(true);
      clearInterval(spawnLoopRef.current);
      clearInterval(gameLoopRef.current);
      clearInterval(timerLoopRef.current);
    }
  }, [missed]);

  const catchHead = (id) => {
    if (gameOver) return;

    setHeads((prev) => prev.filter((head) => head.id !== id));
    setScore((s) => s + 1);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(circle_at_center,_#7dd3fc_0%,_#38bdf8_35%,_#2563eb_70%,_#1e3a8a_100%)] p-3 sm:p-6 overflow-hidden touch-none">
      <div className="w-full max-w-5xl flex flex-col justify-center min-h-screen sm:min-h-0 py-2 sm:py-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-2 sm:mb-3 text-white">
          <div>
            <h1
              className="text-3xl sm:text-4xl font-black tracking-tight sm:tracking-wide text-yellow-300 leading-none text-center sm:text-left"
              style={{
                WebkitTextStroke: isSmallScreen ? "0.6px white" : "1px white",
                textShadow: isSmallScreen
                  ? "2px 2px 0 #000"
                  : "3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000"
              }}
            >
              Can You Catch'em All???
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-4 text-base sm:text-lg font-bold w-full sm:w-auto">
            <div className="bg-black/40 px-2 sm:px-4 py-2 rounded-2xl text-center leading-tight">Score: {score}</div>
            <div className="bg-black/40 px-2 sm:px-4 py-2 rounded-2xl text-center leading-tight">Time: {timeLeft}s</div>
            <div className={`px-2 sm:px-4 py-2 rounded-2xl text-center leading-tight ${timeLeft <= SPEED_UP_TIME && started && !gameOver ? "bg-red-500/80 animate-pulse" : "bg-black/40"}`}>
              Missed: {missed} / {MAX_MISSES}
            </div>
          </div>
        </div>

        <div className="w-full mx-auto max-h-[48vh] sm:max-h-[78vh] aspect-[9/5]">
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
                <p className="text-lg sm:text-2xl mb-6 max-w-md">
                  How many can you catch in 1 minute.
                  <br />
                  Miss 10 and it's GAME OVER!
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
                <h2 className="text-4xl sm:text-5xl font-black mb-3 leading-tight">
                  {wonGame ? "Time's Up!" : "Better Luck Next Time"}
                </h2>
                <p className="text-lg sm:text-2xl mb-2">Final Score: {score}</p>
                <p className="text-sm sm:text-lg mb-4 sm:mb-6 opacity-90">
                  {wonGame ? "Great Job!" : "Too many got away!"}
                </p>
                <button
                  onClick={startGame}
                  className="px-8 py-3 sm:py-4 rounded-2xl bg-green-400 text-black font-bold text-lg sm:text-xl active:scale-95 sm:hover:scale-105 transition"
                >
                  Play Again
                </button>
              </div>
            )}

            {heads.map((head) => (
              <button
                key={head.id}
                onPointerDown={() => catchHead(head.id)}
                className="absolute z-10 select-none active:scale-95 bg-transparent border-0 p-0"
                style={{
                  left: `${(head.x / BASE_WIDTH) * 100}%`,
                  top: `${(head.y / BASE_HEIGHT) * 100}%`,
                  width: `${(head.size / BASE_WIDTH) * 100}%`,
                  aspectRatio: "1 / 1",
                  minWidth: isSmallScreen ? 58 : 44,
                  transform: "translateZ(0)",
                  willChange: "left, top",
                  touchAction: "manipulation"
                }}
                aria-label="Catch monster head"
              >
                <img
                  src={head.image}
                  alt="monster head"
                  className="w-full h-full object-contain pointer-events-none drop-shadow-2xl"
                  draggable={false}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 sm:mt-5 flex flex-col items-center justify-center text-center text-white px-3 sm:px-4">
          <h2
            className="text-3xl sm:text-4xl font-black tracking-tight sm:tracking-wide text-yellow-300 leading-tight"
            style={{
              WebkitTextStroke: isSmallScreen ? "0.6px white" : "1px white",
              textShadow: isSmallScreen
                ? "2px 2px 0 #000"
                : "3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000"
            }}
          >
            Thank You For Coming To Oziel's Birthday Party.
          </h2>

          <p
            className="text-xl sm:text-2xl opacity-95 mt-2 max-w-xl font-bold leading-tight"
            style={{
              WebkitTextStroke: isSmallScreen ? "0px black" : "0.5px black",
              textShadow: "1.5px 1.5px 0 #000"
            }}
          >
            Hope you had an awesome time!
          </p>
        </div>
      </div>
    </div>
  );
}
