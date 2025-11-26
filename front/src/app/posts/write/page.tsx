'use client';

import PostForm from '@/app/components/PostForm';
import { useRouter } from 'next/navigation';

export default function PostWritePage() {
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!API_BASE_URL) {
    // console.error('NEXT_PUBLIC_API_BASE_URL이 설정되지 않았습니다.');
  }

  const handleSubmit = async (title: string, content: string, emotion: string) => {
    const token = localStorage.getItem('token');

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
    }
  };

  return (
    <PostForm
      mode="create"
      initialTitle=""
      initialContent=""
      initialEmotion="happy"
      onSubmit={handleSubmit}
    />
  );
}
