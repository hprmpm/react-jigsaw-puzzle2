'use client';
import { useEffect, useRef, useState } from 'react';
import * as headbreaker from 'headbreaker';
import Header from '@/components/layout/Header';
import MuteBtn from '@/components/ui/MuteBtn';
import Link from 'next/link';

const imageList = [
  '/images/zone_4/zone_4_pz01.jpg',
  '/images/zone_4/zone_4_pz02.jpg',
  '/images/zone_4/zone_4_pz03.jpg',
  '/images/zone_4/zone_4_pz04.jpg',
  '/images/zone_4/zone_4_pz05.jpg'
];

export default function Zone4() {
  const puzzleRef = useRef<HTMLDivElement>(null);
  const [level, setLevel] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const container = puzzleRef.current;
    if (!container || level >= imageList.length) return;

    container.innerHTML = '';

    // 画像読み込み → Canvas 作成
    const img = new Image();
    img.src = imageList[level];
    img.onload = () => {
      const canvas = new headbreaker.Canvas(container.id, {
        width: 800,
        height: 650,
        pieceSize: 80,
        proximity: 30,
        borderFill: 10,
        strokeWidth: 2,
        lineSoftness: 0.25,
        painter: new headbreaker.painters.Konva(),
        outline: new headbreaker.outline.Rounded(),
        image: img,
        maxPiecesCount: { x: 5, y: 4 },
        preventOffstageDrag: true,
        fixed: true               // 盤面を固定:contentReference[oaicite:4]{index=4}
      });

      canvas.adjustImagesToPuzzleHeight();
      canvas.autogenerate({ horizontalPiecesCount: 5, verticalPiecesCount: 4 });
      canvas.shuffle(0.7);
      canvas.draw();
      canvas.reframeWithinDimensions();  // ピースを表示範囲内に収める

      // 完成判定を有効にして処理を登録:contentReference[oaicite:5]{index=5}
      canvas.attachSolvedValidator();
      canvas.onValid(() => {
        setTimeout(() => {
          canvas.stop();
          if (level < imageList.length - 1) {
            setLevel(prev => prev + 1);
          } else {
            setIsFinished(true);
          }
        }, 1000); // 1 秒待って次へ
      });
    };
  }, [level]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Header />
      <div className="w-full h-16 flex items-center justify-between px-8">
        <Link href="/controller">
          <button className="p-2 px-6 bg-gray-200/80 rounded-lg text-black font-semibold">
            Back
          </button>
        </Link>
        <MuteBtn />
      </div>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-6 text-center space-y-4">
        <h1 className="text-3xl font-bold">富士山パズルゲーム</h1>
        {isFinished ? (
          <div className="text-2xl text-green-500 font-semibold">恭喜完成所有關卡！</div>
        ) : (
          // 半透明グレーの作業エリア
          <div
            ref={puzzleRef}
            id="puzzle"
            className="relative w-[800px] h-[650px] bg-gray-200/50 border border-gray-300"
          />
        )}
        <div className="text-lg font-semibold">
          関卡：{level + 1} / {imageList.length}
        </div>
      </main>
    </div>
  );
}
