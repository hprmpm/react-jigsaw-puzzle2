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
  const [showNextPrompt, setShowNextPrompt] = useState(false);

  // デバイス幅に応じてキャンバスサイズを計算する
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  useEffect(() => {
    const updateSize = () => {
      const width = Math.min(800, window.innerWidth - 32); // モバイルでは画面幅から余白を引く
      const height = Math.floor(width * 0.75);             // 4:3 の比率
      setCanvasSize({ width, height });
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const container = puzzleRef.current;
    if (!container || level >= imageList.length || showNextPrompt) return;
    container.innerHTML = '';

    // キャンバスサイズとピースサイズを計算
    const { width, height } = canvasSize;
    const horiz = 5;
    const vert = 4;
    const pieceSize = Math.min(
      Math.floor(width / horiz),
      Math.floor(height / vert)
    );

    const img = new Image();
    img.src = imageList[level];
    img.onload = () => {
      const canvas = new headbreaker.Canvas(container.id, {
        width,
        height,
        pieceSize,
        proximity: 20,
        borderFill: 5,
        strokeWidth: 2,
        lineSoftness: 0.25,
        painter: new headbreaker.painters.Konva(),
        outline: new headbreaker.outline.Rounded(),
        image: img,
        preventOffstageDrag: true,
        fixed: true                    // 盤面を固定:contentReference[oaicite:1]{index=1}
      });

      canvas.adjustImagesToPuzzleHeight();
      canvas.autogenerate({
        horizontalPiecesCount: horiz,
        verticalPiecesCount: vert
      });
      canvas.reframeWithinDimensions();
      canvas.shuffle(0.7);
      canvas.draw();

      canvas.attachSolvedValidator();
      canvas.onValid(() => {
        // 完成したらオーバーレイを表示して、次のステージへ進む準備
        setShowNextPrompt(true);
      });
    };

    // コンポーネントのクリーンアップ
    return () => {
      container.innerHTML = '';
    };
  }, [level, canvasSize, showNextPrompt]);

  // 次のレベルへ進むボタンのハンドラ
  const handleNextLevel = () => {
    setShowNextPrompt(false);
    if (level < imageList.length - 1) {
      setLevel(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Header />
      <div className="w-full h-16 flex items-center justify-between px-4">
        <Link href="/controller">
          <button className="p-2 px-4 bg-gray-200/80 rounded-lg text-black font-semibold">
            Back
          </button>
        </Link>
        <MuteBtn />
      </div>
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 text-center space-y-4">
        <h1 className="text-2xl font-bold">富士山パズルゲーム</h1>
        {isFinished ? (
          <div className="text-xl text-green-500 font-semibold">
            恭喜完成所有關卡！
          </div>
        ) : (
          <div
            ref={puzzleRef}
            id="puzzle"
            style={{
              width: `${canvasSize.width}px`,
              height: `${canvasSize.height}px`,
              backgroundColor: 'rgba(128,128,128,0.5)',
              border: '1px solid #ccc'
            }}
          />
        )}
        <div className="text-md font-semibold">
          関卡：{level + 1} / {imageList.length}
        </div>
      </main>

      {/* 次ステージへ進む確認モーダル */}
      {showNextPrompt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-4 rounded shadow-md text-center">
            <p className="mb-4 font-medium">完成！次の関卡へ進みますか？</p>
            <button
              onClick={handleNextLevel}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              次の関卡へ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
