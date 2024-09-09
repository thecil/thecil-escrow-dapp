"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ModeToggle } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useScreenSize } from "@/hooks/use-screen-size";
import { Menu } from "lucide-react";

const Header: React.FC = () => {
  const { isMobile } = useScreenSize();

  return (
    <header className="container mb-4 border-b md:p-4">
      <div className="flex items-center justify-between">
        <Link href={"/"} className="flex items-center space-x-2">
          <video autoPlay loop muted className="w-12 rounded">
            <source src="/au_video.mp4" />
          </video>
          <p className={"text-3xl"}>Escrow Dapp</p>
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
            <ConnectButton label="Connect" accountStatus={"address"} />
            <ModeToggle />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
