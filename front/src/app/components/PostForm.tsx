'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const EMOTIONS = [
  { value: 'happy', label: '😄 행복' },
  { value: 'sad', label: '😢 슬픔' },
  { value: 'angry', label: '😡 화남' },
  { value: 'anxious', label: '😨 불안' },
  { value: 'neutral', label: '😐 그저 그럼' },
];

interface Props {
  mode: 'create' | 'edit';
  initialTitle: string;
  initialContent: string;
  initialEmotion: string;
  onSubmit: (title: string, content: string, emotion: string) => void;
}

export default function PostForm({
  mode,
  initialTitle,
  initialContent,
  initialEmotion,
  onSubmit,
}: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [emotion, setEmotion] = useState(initialEmotion);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(title, content, emotion);
  };

  return (
    <div className="max-w-3xl mx-auto mt-4 sm:mt-8 px-4 font-bmjua">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex items-center gap-2">
          {mode === 'edit' ? '✒️ 게시글 수정' : '📝 게시글 작성'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none text-sm sm:text-base"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="제목을 입력해주세요"
            />
          </div>

          <div>
            <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-2">
              내용
            </label>
            <textarea
              className="w-full border-2 border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 h-32 sm:h-48 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none resize-none text-sm sm:text-base"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="내용을 입력해주세요"
            />
          </div>

          <div>
            <label className="block text-base sm:text-lg font-semibold text-gray-700 mb-3">
              오늘의 감정
            </label>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {EMOTIONS.map((e) => (
                <button
                  key={e.value}
                  type="button"
                  onClick={() => setEmotion(e.value)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border-2 transition-all duration-200 text-xs sm:text-sm ${
                    emotion === e.value
                      ? 'bg-blue-500 text-white border-blue-500 scale-105 shadow-md'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-sm sm:text-lg font-semibold hover:bg-blue-600 transition-colors shadow-md hover:shadow-lg"
            >
              {mode === 'edit' ? '✒️ 수정하기' : '📝 작성하기'}
            </button>
          </div>
        </form>

        {/* 목록으로 돌아가는 버튼 */}
        <div className="text-center pt-6 border-t border-gray-200 mt-6">
          <button
            onClick={() => router.push('/posts')}
            className="text-gray-500 hover:text-gray-700 text-sm sm:text-base flex items-center justify-center gap-2 mx-auto"
          >
            <span>📋</span>
            <span>목록으로 돌아가기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
