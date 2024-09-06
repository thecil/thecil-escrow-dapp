"use client";

import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ModeToggle } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useScreenSize } from "@/hooks/use-screen-size";
import { Menu } from "lucide-react";

const Header: React.FC = () => {
  const { isMobile } = useScreenSize();

  return (
    <header className="container mb-4 border-b md:p-4">
      <div className="flex items-center justify-between">
        <Link href={"/"} className="flex items-center space-x-2">
          <Image
            alt="ddmesh-logo"
            src="/logo.svg"
            width={25}
            height={25}
            className={"h-10 w-10"}
          />
          <p className={"text-3xl text-green-500"}>Escrow Dapp</p>
        </Link>
        {isMobile ? (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Menu />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <ConnectButton />
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ModeToggle />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center space-x-2">
            <ConnectButton
                label="Connect"
            />
            <ModeToggle />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
