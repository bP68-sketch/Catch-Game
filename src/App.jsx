import React, { useEffect, useRef, useState } from "react";

export default function MonsterHeadCatcherGame() {
  const BASE_WIDTH = 900;
  const BASE_HEIGHT = 500;
  const MAX_MISSES = 10;
  const GAME_TIME = 60;
  const SPEED_UP_TIME = 15;
  const SPECIAL_TARGET_CHANCE = 0.12;
  const SPEED_BOOST_DURATION = 2000;
  const BIRTHDAY_TARGET_IMAGE = "/BDBhead.PNG";

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
  const [speedBoostUntil, setSpeedBoostUntil] = useState(0);

  const gameLoopRef = useRef(null);
  const spawnLoopRef = useRef(null);
  const timerLoopRef = useRef(null);
  const timeLeftRef = useRef(GAME_TIME);
  const speedBoostUntilRef = useRef(0);

  useEffect(() => {
    const checkScreen = () => setIsSmallScreen(window.innerWidth < 700);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return <div>Game Ready</div>;
}
