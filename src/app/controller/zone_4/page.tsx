'use client'
import { useEffect, useRef, useState } from 'react'
import { Canvas, painters } from 'headbreaker'
import Header from '@/components/layout/Header'
import MuteBtn from '@/components/ui/MuteBtn'
import Link from 'next/link'

const imageList = [
  '/images/zone_4/zone_4_pz01.jpg',
  '/images/zone_4/zone_4_pz02.jpg',
  '/images/zone_4/zone_4_pz03.jpg',
  '/images/zone_4/zone_4_pz04.jpg',
  '/images/zone_4/zone_4_pz05.jpg'
]

export default function Zone4() {
  const puzzleRef = useRef<HTMLDivElement>(null)
  const [level, setLevel] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    const node = puzzleRef.current
    if (!node || level >= imageList.length) return

    // 清除上一關的內容（若有）
    node.innerHTML = ''

    // 初始化 Headbreaker Canvas
    const canvas = new Canvas(node.id, {
      width: 800,
      height: 650,
      pieceSize: 80,
      proximity: 30,
      borderFill: 10,
      strokeWidth: 2,
      lineSoftness: 0.25,
      painter: new painters.Konva()
    })

    // 載入當前關卡圖片
    const img = new Image()
    img.src = imageList[level]
    img.onload = () => {
      canvas.settings.image = img
      canvas.autogenerate({
        horizontalPiecesCount: 5,
        verticalPiecesCount: 4
      })
      canvas.shuffle(0.7)
      canvas.draw()

      // 當所有拼圖就位時觸發 solved 事件
      canvas.on('solve', () => {
        canvas.stop()
        if (level < imageList.length - 1) {
          setLevel(level + 1)      // 進下一關
        } else {
          setIsFinished(true)      // 全部完成
        }
      })
    }

    return () => {
      canvas.stop()
    }
  }, [level])

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
          <div className="text-2xl text-green-500 font-semibold">
            恭喜完成所有關卡！
          </div>
        ) : (
          <div ref={puzzleRef} id="puzzle" style={{ width: '800px', height: '650px' }} />
        )}
        <div className="text-lg font-semibold">
          關卡：{level + 1} / {imageList.length}
        </div>
      </main>
    </div>
  )
}
