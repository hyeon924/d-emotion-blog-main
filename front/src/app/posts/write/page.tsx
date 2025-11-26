'use client';

import { useState } from 'react';
import PostForm from '@/app/components/PostForm';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/app/components/LoadingSpinner';

export default function PostWritePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!API_BASE_URL) {
    // console.error('NEXT_PUBLIC_API_BASE_URL이 설정되지 않았습니다.');
  }

  const handleSubmit = async (title: string, content: string, emotion: string) => {
    const token = localStorage.getItem('token');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content, emotion }),
      });

      if (res.ok) {
        router.push('/posts');
      } else {
        const result = await res.json();
        alert(result.message || '작성 실패');
      }
    } catch {
      alert('서버 오류');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 shadow-2xl flex flex-col items-center gap-4 border border-gray-100">
            <LoadingSpinner size="lg" />
            <p className="text-gray-700 font-medium">작성 중...</p>
          </div>
        </div>
      )}
      <PostForm
        mode="create"
        initialTitle=""
        initialContent=""
        initialEmotion="happy"
        onSubmit={handleSubmit}
      />
    </>
  );
}
