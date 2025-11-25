'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emailId, setEmailId] = useState('');
  const [domainSelect, setDomainSelect] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [showCustomDomain, setShowCustomDomain] = useState(false);
  const domainOptions = ['gmail.com', 'naver.com', 'daum.net', '직접 입력'];
  const customDomainInputRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!API_BASE_URL) {
    console.error('NEXT_PUBLIC_API_BASE_URL이 설정되지 않았습니다.');
  }

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error('로그인 실패');
      const data = await res.json();
      localStorage.setItem('token', data.data);
      router.push('/posts');
    } catch (error) {
      alert('로그인 실패');
    }
  };

  const handleEmailIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailId(e.target.value);
    const domain = domainSelect === '직접 입력' ? customDomain : domainSelect;
    setUsername(e.target.value && domain ? `${e.target.value}@${domain}` : '');
  };

  const handleDomainSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDomainSelect(value);
    if (value === '직접 입력') {
      setShowCustomDomain(true);
      setCustomDomain('');
      setUsername(emailId ? `${emailId}@` : '');
    } else {
      setShowCustomDomain(false);
      setCustomDomain('');
      setUsername(emailId && value ? `${emailId}@${value}` : '');
    }
  };

  const handleCustomDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomDomain(e.target.value);
    setUsername(emailId && e.target.value ? `${emailId}@${e.target.value}` : '');
  };

  // 직접 입력 필드로 돌아가기 버튼
  const handleBackToSelect = () => {
    setShowCustomDomain(false);
    setDomainSelect('');
    setCustomDomain('');
    setUsername('');
  };

  // showCustomDomain이 true가 되면 포커스 설정
  useEffect(() => {
    if (showCustomDomain && customDomainInputRef.current) {
      // 더 긴 지연 시간으로 시도
      const timer = setTimeout(() => {
        if (customDomainInputRef.current) {
          customDomainInputRef.current.focus();
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [showCustomDomain]);

  const handleSignupClick = () => {
    console.log('회원가입 버튼 클릭됨');
    router.push('/users/signup');
  };

  const handlePasswordResetClick = () => {
    console.log('비밀번호 찾기 버튼 클릭됨');
    router.push('/users/reset-password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-md space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-center">로그인</h2>

        {/* 이메일 입력 영역 */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">이메일</label>

          {/* 이메일 입력 필드들 - 모바일에서도 가로 배치 */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="이메일 아이디"
              value={emailId}
              onChange={handleEmailIdChange}
              className="flex-1 min-w-0 border border-gray-300 rounded px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
            />
            <span className="self-center text-gray-500">@</span>
            {showCustomDomain ? (
              <div className="flex-1 flex gap-1">
                <input
                  ref={customDomainInputRef}
                  type="text"
                  placeholder="example.com"
                  value={customDomain}
                  onChange={handleCustomDomainChange}
                  className="flex-1 min-w-0 border border-gray-300 rounded px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                />
                <button
                  type="button"
                  onClick={handleBackToSelect}
                  className="px-2 py-2 text-gray-500 hover:text-gray-700 text-sm"
                >
                  ↩
                </button>
              </div>
            ) : (
              <select
                className="flex-1 min-w-0 border border-gray-300 rounded px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
                value={domainSelect}
                onChange={handleDomainSelect}
              >
                <option value="" disabled>
                  도메인 선택
                </option>
                {domainOptions.map((domain) => (
                  <option key={domain} value={domain}>
                    {domain}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 rounded transition text-sm sm:text-base"
        >
          로그인
        </button>

        <div className="text-center">
          <span className="text-gray-600 text-sm sm:text-base">비밀번호를 잊으셨나요?</span>
          <button
            onClick={handlePasswordResetClick}
            className="text-red-500 hover:underline text-sm sm:text-base ml-2"
          >
            비밀번호 찾기
          </button>
        </div>
        <div className="text-center">
          <span className="text-gray-600 text-sm sm:text-base">계정이 없으신가요?</span>
          <button
            onClick={handleSignupClick}
            className="ml-2 text-blue-500 hover:underline text-sm sm:text-base"
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}
