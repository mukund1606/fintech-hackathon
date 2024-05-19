"use client";

import { ChevronRight } from "lucide-react";

import { Button, Divider } from "@nextui-org/react";

import { cn } from "@/lib/utils";

import { useSidebar } from "@/hooks/useSidebar";

import { type User } from "next-auth";
import SideNav from "./sidenav";

export default function Sidebar({ user }: { user: User }) {
  const { isOpen, toggle, setIsOpen } = useSidebar();
  return (
    <div
      className={cn(
        "transform-all fixed top-[64px] z-20 hidden h-[calc(100dvh-65px)] flex-col justify-between border-r border-divider bg-background pb-2 pt-2 duration-500 md:flex",
        isOpen ? "w-64" : "w-16",
      )}
    >
      <div className="flex w-full flex-col items-center gap-1 overflow-y-auto p-1">
        <SideNav user={user} isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
      <div className="bottom-5 w-full space-y-1">
        <Divider />
        <div className="p-1">
          <Button onClick={toggle} className="h-10 w-full" isIconOnly>
            <ChevronRight
              className={cn("h-4 w-4 transition-all", isOpen && "rotate-180")}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
