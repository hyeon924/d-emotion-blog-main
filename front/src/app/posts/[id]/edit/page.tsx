'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PostForm from '@/app/components/PostForm';
import LoadingSpinner from '@/app/components/LoadingSpinner';

export default function PostEditPage() {
  const { id } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [emotion, setEmotion] = useState('happy');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!API_BASE_URL) {
    // console.error('NEXT_PUBLIC_API_BASE_URL이 설정되지 않았습니다.');
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API_BASE_URL}/api/v1/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('불러오기 실패');
        const data = await res.json();
        setTitle(data.data.title);
        setContent(data.data.content);
        setEmotion(data.data.emotion || 'happy');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, API_BASE_URL]);

  const handleUpdate = async (newTitle: string, newContent: string, newEmotion: string) => {
    const token = localStorage.getItem('token');
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          emotion: newEmotion,
        }),
      });

      if (res.ok) {
        alert('수정 완료');
        router.push(`/posts/${id}`);
      } else {
        const result = await res.json();
        alert(result.message || '수정 실패');
      }
    } catch {
      alert('서버 오류');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-700 font-medium">로딩 중...</p>
        </div>
      </div>
    );
  if (error) return <div className="p-4 text-red-500 text-sm sm:text-base">{error}</div>;

  return (
    <>
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-gray-700 font-medium">수정 중...</p>
          </div>
        </div>
      )}
      <PostForm
        mode="edit"
        initialTitle={title}
        initialContent={content}
        initialEmotion={emotion}
        onSubmit={handleUpdate}
      />
    </>
  );
}
