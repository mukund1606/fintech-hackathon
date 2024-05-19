"use client";

import React from "react";

import Image from "next/image";
import NextLink from "next/link";

import { type User } from "next-auth";
import { signOut } from "next-auth/react";

import { MenuIcon } from "lucide-react";

import { ThemeToggle } from "@/components/themeToggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";

import Link from "next/link";
import SideNav from "./sidenav";

interface HeaderProps {
  user?: User;
}

export default function Header({ user }: HeaderProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <Navbar isBordered>
          {user && (
            <NavbarContent className="md:hidden" justify="start">
              <SheetTrigger asChild>
                <div className="flex items-center justify-center gap-2">
                  <MenuIcon />
                </div>
              </SheetTrigger>
            </NavbarContent>
          )}

          <NavbarContent className="pr-3 sm:hidden" justify="center">
            <NavbarBrand as={NextLink} href="/" className="gap-2">
              <Image
                src="/logo.png"
                alt="SSA Logo"
                width={380}
                height={380}
                className="h-10 w-10 rounded-full"
              />
              <p className="text-base font-bold text-foreground">Nexus</p>
            </NavbarBrand>
          </NavbarContent>

          <NavbarContent className="hidden gap-4 sm:flex" justify="center">
            <NavbarBrand as={NextLink} href="/" className="gap-2">
              <Image
                src="/logo.png"
                alt="Logo"
                width={380}
                height={380}
                className="h-12 w-12 rounded-full"
                priority
              />
              <p className="text-base font-bold text-foreground">Nexus</p>
            </NavbarBrand>
          </NavbarContent>

          <NavbarContent justify="end">
            {!user ? (
              <NavbarItem>
                <Button as={NextLink} href="/auth/login" color="default">
                  Login
                </Button>
              </NavbarItem>
            ) : (
              <NavbarItem>
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <Avatar
                      as={Button}
                      className="m-0 h-12 min-h-0 w-12 min-w-0 p-0 transition-transform"
                      isBordered
                      src={`https://utfs.io/f/${user.image}`}
                      showFallback
                    />
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem key="details" className="h-14 gap-2">
                      <p className="font-semibold">Signed in as</p>
                      <p className="font-semibold">{user.name ?? "User"}</p>
                    </DropdownItem>
                    <DropdownItem as={Link} href="/" key="dashboard">
                      Dashboard
                    </DropdownItem>
                    <DropdownItem
                      key="logout"
                      color="danger"
                      variant="shadow"
                      onClick={() => {
                        void signOut({
                          callbackUrl: "/",
                          redirect: true,
                        });
                      }}
                    >
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavbarItem>
            )}
            <NavbarItem className="hidden sm:flex">
              <ThemeToggle />
            </NavbarItem>
          </NavbarContent>

          {user && (
            <SheetContent side="left" className="flex w-72 flex-col px-0 pb-0">
              <div className="absolute left-4 top-4">
                <ThemeToggle />
              </div>
              <div className="z-0 mt-10 flex h-full w-full flex-col gap-1 overflow-y-auto p-4 pb-8">
                <SideNav user={user} isOpen={open} setIsOpen={setOpen} />
              </div>
            </SheetContent>
          )}
        </Navbar>
      </Sheet>
    </>
  );
}
