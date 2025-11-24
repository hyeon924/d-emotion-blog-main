/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ResetPasswordPage() {
  const router = useRouter();

  // 공통상태
  const [email, setEmail] = useState('');

  // step 1 이메일 전송
  const [step, setStep] = useState(1);

  // step 2 코드 입력 + 새 비밀번호
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // loading 상태
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleLoginPage = () => {
    console.log('로그인 페이지로 이동');
    router.push('/users/login');
  };

  // step 1 : 비밀번호 재설정 코드 이메일 전송
  const handleSendCode = async () => {
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch(`${API_BASE_URL}/email/request-verification-code?email=${email}`, {
        method: 'POST',
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = data?.message || '이메일 전송 실패';
        throw new Error(msg);
      }
      alert('이메일 전송 완료');
      setStep(2);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('이메일 전송 실패');
      }
    } finally {
      setIsLoading(false);
    }
  };

  //  step2 : 코드 입력 + 새 비밀번호 입력
  const handleResetPassword = async () => {
    if (!code || !newPassword || !confirmPassword) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch(
        `${API_BASE_URL}/users/reset-password?username=${email}&code=${code}&newPassword=${newPassword}`,
        {
          method: 'POST',
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = data?.message || '비밀번호 재설정 실패';
        throw new Error(msg);
      }
      alert('비밀번호 재설정 완료');
      router.push('/users/login');
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('비밀번호 재설정 실패');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-lg shadow-md space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-center">비밀번호 재설정</h2>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">이메일</label>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
          />
        </div>

        {/* step 1 : 비밀번호 재설정 코드 이메일 전송 */}
        {step === 1 && (
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 sm:py-3 rounded transition text-sm sm:text-base"
            onClick={handleSendCode}
            disabled={isLoading}
          >
            {isLoading ? '이메일 전송중...' : '비밀번호 재설정 링크 전송'}
          </button>
        )}

        {/* step 2 : 코드 입력 + 새 비밀번호 입력 */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">인증 코드</label>
              <input
                type="text"
                placeholder="이메일로 받은 인증 코드를 입력하세요"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">새 비밀번호</label>
              <input
                type="password"
                placeholder="새 비밀번호"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">새 비밀번호 확인</label>
              <input
                type="password"
                placeholder="새 비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 sm:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm sm:text-base"
              />
            </div>
            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 sm:py-3 rounded transition text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? '변경 중...' : '비밀번호 재설정'}
            </button>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={handleLoginPage}
            className="text-blue-500 hover:underline text-sm sm:text-base"
          >
            로그인으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
