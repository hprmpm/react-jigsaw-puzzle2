import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="container flex flex-col justify-center mx-auto px-4 py-8 flex-1">
        <div className="flex justify-between items-center">
          <div className='flex flex-col items-center'>
            <Image
              src="/logo.svg"
              alt="Virtual Festival Logo"
              width={500}
              height={100}
              className='mb-8'
            />
            <p className='font-semibold text-3xl text-center text-shadow'>ひとつの出会いが、心を通わせる物語になる。</p>=
          </div>
          <div>
            <div className="flex justify-center gap-10 mt-12">
              <Link
                href="/dashboard"
                className="block mt-8 text-center text-2xl bg-white text-gray-800 px-6 py-3 rounded-lg shadow-md hover:bg-blue-100 hover:shadow-lg"
              >
                Dashboard
              </Link>
              <Link
                href="/qrpage"
                className="block mt-8 text-center text-2xl bg-white text-gray-800 px-6 py-3 rounded-lg shadow-md hover:bg-blue-100 hover:shadow-lg"
              >
                QR Page
              </Link>
              <Link
                href="/venue"
                className="block mt-8 text-center text-2xl bg-white text-gray-800 px-6 py-3 rounded-lg shadow-md hover:bg-blue-100 hover:shadow-lg"
              >
                Venue
              </Link>
            </div>
          </div>
        </div>

      </main>
      <footer className="text-center mb-2">
        <p>Virtual Festival. &copy; {new Date().getFullYear()} All rights reserved.</p>
      </footer>
    </div>
  );
}
