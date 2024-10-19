import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-400 py-6">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-4 text-xl font-semibold text-white">Generous</p>
        <div className="flex justify-center space-x-8">
          <div className="text-center">
            <p className="text-white font-bold">Kareem</p>
            <div className="flex justify-center space-x-4">
              <Link href="www.linkedin.com/in/kareem-salam-290786301" className="hover:text-blue-400" target="_blank">
              LinkedIn
              </Link>
              <Link href="https://github.com/in/kareemAlqubati" className="hover:text-blue-400" target="_blank">
              GitHub
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-500">© {new Date().getFullYear()} Movie Kareem. All rights reserved.</p>
      </div>
    </footer>
  );
}
