import Link from "next/link";
import Image from 'next/image'; 
import logo from "../public/synthesis.png";

export function Logo() {
  return (
    <div>
      <Link
        className="relative z-20 flex items-center text-lg font-medium mr-4"
        href="/"
      >
        <Image src={logo} alt="VeriScope" width={32} height={32} className="mr-2" />
        <h1>VeriScope</h1>
      </Link>
    </div>
  );
}