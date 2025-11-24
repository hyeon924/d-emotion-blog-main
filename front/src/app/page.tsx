import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/users/login'); // ✅ / → /users/login으로 리디렉션
}
