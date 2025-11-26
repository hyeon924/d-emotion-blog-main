'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/app/components/LoadingSpinner';

export default function SignupPage() {
  const router = useRouter();
  const [emailId, setEmailId] = useState('');
  const [domainSelect, setDomainSelect] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [showCustomDomain, setShowCustomDomain] = useState(false);
  const domainOptions = ['gmail.com', 'naver.com', 'daum.net', '직접 입력'];
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [sendComplete, setSendComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [username, setUsername] = useState('');
  const [nickname, setNickname] = useState('');
  const customDomainInputRef = useRef<HTMLInputElement>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!API_BASE_URL) {
    // console.error('NEXT_PUBLIC_API_BASE_URL이 설정되지 않았습니다.');
  }

  // username은 emailId와 domainSelect/customDomain을 합쳐서 관리
  // 기존 username 관련 인풋/로직 제거

  const handleEmailIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailId(e.target.value);
    const domain = showCustomDomain ? customDomain : domainSelect;
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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, nickname, password, code }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || '회원가입 실패');
        return;
      }

      alert('회원가입 성공! 로그인 페이지로 이동합니다.');
      router.push('/users/login');
    } catch {
      setError('서버 오류');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (!username) {
      alert('이메일을 입력해주세요.');
      return;
    }
    setIsSendingCode(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/email/request-verification-code?email=${username}`,
        {
          method: 'POST',
        }
      );

      if (!response.ok) throw new Error('이메일 전송 실패');

      setSendComplete(true);
      setTimeout(() => setSendComplete(false), 5000);
    } catch (error) {
      alert('이메일 전송 실패');
      // console.error(error);
    } finally {
      setIsSendingCode(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-lg bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">회원가입</h2>
        <p className="text-xs sm:text-sm text-center text-gray-500">계정을 생성해보세요 🚀</p>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>

            {/* 이메일 입력 영역 - 모바일에서도 가로 배치 */}
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="이메일 아이디"
                  value={emailId}
                  onChange={handleEmailIdChange}
                  className="flex-1 min-w-0 border border-gray-300 rounded px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
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
                      className="flex-1 min-w-0 border border-gray-300 rounded px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
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
                    className="flex-1 min-w-0 border border-gray-300 rounded px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
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

              {/* 인증번호 받기 버튼 - 모바일에서는 전체 너비 */}
              <button
                type="button"
                className="w-full sm:w-auto bg-green-500 text-white text-sm px-4 py-2 rounded hover:bg-green-600 transition font-medium whitespace-nowrap disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                onClick={handleSendCode}
                disabled={sendComplete || isSendingCode}
              >
                {isSendingCode ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>전송 중...</span>
                  </>
                ) : sendComplete ? (
                  '전송완료'
                ) : (
                  '인증번호 받기'
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">인증번호</label>
            <input
              type="text"
              placeholder="인증번호를 입력하세요"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">닉네임</label>
            <input
              type="text"
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">비밀번호</label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
            />
          </div>

          <div className="flex justify-center sm:justify-end mt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-green-500 text-white text-sm sm:text-base px-6 py-2 sm:py-3 rounded hover:bg-green-600 transition font-semibold shadow disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>처리 중...</span>
                </>
              ) : (
                '회원가입'
              )}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>

        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <button
              type="button"
              onClick={() => router.push('/users/login')}
              className="text-blue-500 hover:underline ml-1"
            >
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
