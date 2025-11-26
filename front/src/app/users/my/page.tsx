'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MyPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState('닉네임');
  const [postCount, setPostCount] = useState(0);

  //  비밀번호 변경 상태관리(전체)
  const [isPasswordForm, setIsPasswordForm] = useState(false); //  비밀번호 변경 폼 상태
  const [currentPassword, setCurrentPassword] = useState(''); //  현재 비밀번호
  const [newPassword, setNewPassword] = useState(''); //  새 비밀번호
  const [confirmPassword, setConfirmPassword] = useState(''); //  새 비밀번호 확인 값
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!API_BASE_URL) {
    // console.error('NEXT_PUBLIC_API_BASE_URL이 설정되지 않았습니다.');
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/users/login');
      return;
    }

    fetch(`${API_BASE_URL}/my`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('인증 실패');
        return res.json();
      })
      .then((json) => {
        setNickname(json.data.nickname);
        setPostCount(json.data.postCount);
      })
      .catch(() => {
        alert('로그인이 필요합니다.');
        router.push('/users/login');
      });
  }, [router]);

  //  비밀번호 변경 폼 핸들러
  const resetPasswordForm = async () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  //  비밀번호 변경 핸들러
  const handlePasswordChange = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/users/login');
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('비밀번호를 모두 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/users/me/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        const msg = data?.message || '비밀번호 변경 실패';
        throw new Error(msg);
      }

      alert('비밀번호 변경 완료되었습니다. 다시 로그인 해주세요');

      //  비밀번호 변경 후 로그아웃 처리
      localStorage.removeItem('token');
      router.push('/users/login');
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('비밀번호 변경 실패');
      }
    } finally {
      resetPasswordForm();
      setIsPasswordForm(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/users/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 px-4 py-8 font-bmjua">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 sm:space-y-8 border border-gray-100">
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => router.push('/posts')}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 border border-gray-200 shadow transition mb-2 outline-none focus:ring-2 focus:ring-blue-300"
            aria-label="홈으로 가기"
            style={{ fontSize: '20px' }}
          >
            🏠
          </button>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-blue-100 flex items-center justify-center text-3xl sm:text-4xl shadow">
            <span role="img" aria-label="avatar">
              👤
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mt-2">{nickname}</h2>
          <p className="text-gray-500 text-xs sm:text-sm">총 게시글 {postCount}개</p>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {/* 비밀번호 변경 버튼 */}
          <button
            className="w-full bg-green-500 text-white py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-green-600 transition text-sm sm:text-base"
            onClick={() => setIsPasswordForm((prev) => !prev)}
          >
            {isPasswordForm ? '비밀번호 변경 닫기' : '비밀번호 변경'}
          </button>

          {/* 비밀번호 변경 폼 */}
          {isPasswordForm && (
            <div className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3 text-sm sm:text-base">
              <div className="space-y-1">
                <label className="block text-gray-700 mb-1">현재 비밀번호</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-green-400"
                    value={currentPassword}
                    placeholder="현재 비밀번호를 입력하세요"
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center text-xs text-gray-500 hover:text-gray-700"
                  >
                    {showCurrentPassword ? '숨기기' : '보기'}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-gray-700 mb-1">새 비밀번호</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-green-400"
                    value={newPassword}
                    placeholder="새 비밀번호를 입력하세요"
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center text-xs text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? '숨기기' : '보기'}
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-gray-700 mb-1">새 비밀번호 확인</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-green-400"
                    value={confirmPassword}
                    placeholder="새 비밀번호를 다시 입력하세요"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-2 flex items-center text-xs text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? '숨기기' : '보기'}
                  </button>
                </div>
              </div>
              <button
                className="w-full mt-2 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition"
                onClick={handlePasswordChange}
              >
                비밀번호 변경 완료
              </button>
            </div>
          )}

          <button
            className="w-full bg-gray-400 text-white py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-gray-500 transition text-sm sm:text-base"
            onClick={handleLogout}
          >
            로그아웃
          </button>
          <button
            className="w-full bg-red-500 text-white py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-red-600 transition text-sm sm:text-base"
            onClick={() => alert('회원탈퇴 기능은 준비 중입니다.')}
          >
            회원탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}
