import React from "react";
import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <>
      <footer className=" border-t">
        <div className=" container p-4 flex items-center justify-between ">
          <p className="font-bold">Alchemy University</p>
          <p className="text-center">Escrow Dapp</p>
          <div className="flex space-x-1">
            <Link href="https://github.com/thecil" target="_blank">
              <Github />
            </Link>
            <Link
              href="https://www.linkedin.com/in/carlos-zambrano-thecil/"
              target="_blank"
            >
              <Linkedin />
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
