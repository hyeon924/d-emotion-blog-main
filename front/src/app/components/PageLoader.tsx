'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import LoadingSpinner from './LoadingSpinner';

export default function PageLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // 초기 로드 시에는 로딩 표시 안 함
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }

    // 페이지 전환 시작
    setLoading(true);

    // 페이지 전환 완료 (약간의 지연을 주어 자연스럽게)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname, searchParams, isInitialLoad]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-700 font-medium">로딩 중...</p>
      </div>
    </div>
  );
}

