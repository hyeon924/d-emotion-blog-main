'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Post {
  id: number;
  title: string;
  content: string;
  author: string;
  emotion: string | null;
  createDate: string;
  modifyDate: string;
}

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState('');

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/users/login');
      return;
    }

    fetch(`${API_BASE_URL}/api/v1/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('글 조회 실패');
        const data = await res.json();
        setPost(data.data);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [id, router]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/posts/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        alert('삭제 완료');
        router.push('/posts');
      } else {
        const data = await res.json();
        alert(data.message || '삭제 실패');
      }
    } catch {
      alert('서버 오류');
    }
  };

  const renderEmotion = (emotion: string | null) => {
    if (!emotion) return '-';
    const emoji =
      emotion === 'happy'
        ? '😊'
        : emotion === 'sad'
          ? '😢'
          : emotion === 'angry'
            ? '😠'
            : emotion === 'anxious'
              ? '😨'
              : emotion === 'neutral'
                ? '😐'
                : '❔';

    const bgColor =
      emotion === 'happy'
        ? 'bg-yellow-100 text-yellow-800'
        : emotion === 'sad'
          ? 'bg-blue-100 text-blue-800'
          : emotion === 'angry'
            ? 'bg-red-100 text-red-800'
            : emotion === 'surprised'
              ? 'bg-purple-100 text-purple-800'
              : 'bg-gray-100 text-gray-800';

    return (
      <div
        className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${bgColor} font-semibold flex items-center gap-1 sm:gap-2 text-sm sm:text-base`}
      >
        <span className="text-base sm:text-lg">{emoji}</span>
        <span>{emotion}</span>
      </div>
    );
  };

  if (error) {
    return <div className="p-4 text-red-500 text-sm sm:text-base">{error}</div>;
  }

  if (!post) {
    return <div className="p-4 text-sm sm:text-base">로딩 중...</div>;
  }

  const isModified = post.createDate !== post.modifyDate;

  return (
    <div className="max-w-4xl mx-auto mt-4 sm:mt-8 px-4 font-bmjua">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
        {/* 헤더 영역 - 모바일에서는 세로 배치 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start mb-4 sm:mb-6 gap-3">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800 break-words">{post.title}</h1>
          {renderEmotion(post.emotion)}
        </div>

        {/* <div className="mb-6">
          <p className="text-sm text-gray-600 font-medium">
            작성자: {post.author}
          </p>
        </div> */}

        <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <p className="whitespace-pre-wrap text-gray-800 leading-relaxed text-sm sm:text-lg">
            {post.content}
          </p>
        </div>

        <div className="text-xs sm:text-sm text-gray-500 space-y-2 border-t border-gray-100 pt-4">
          <p className="flex items-center gap-2">
            <span className="text-gray-400">📅</span>
            <span>작성일: {formatDate(post.createDate)}</span>
          </p>
          <p className="flex items-center gap-2">
            <span className="text-gray-400">🛠</span>
            <span>수정일: {isModified ? formatDate(post.modifyDate) : '-'}</span>
          </p>
        </div>

        {/* 버튼 영역 - 모바일에서는 세로 배치 */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
          <button
            onClick={() => router.push('/posts')}
            className="w-full sm:w-auto bg-gray-500 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            📋 목록으로
          </button>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={() => router.push(`/posts/${post.id}/edit`)}
              className="w-full sm:w-auto bg-blue-500 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              ✒️ 수정하기
            </button>
            <button
              onClick={handleDelete}
              className="w-full sm:w-auto bg-red-500 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              🗑️ 삭제하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
