"use client";
import React, { useMemo } from "react";

import { type User } from "next-auth";
import { usePathname } from "next/navigation";

import { AnimatePresence, motion } from "framer-motion";

import NextLink from "next/link";

import { cn } from "@/lib/utils";
import { Button, Link, Tooltip } from "@nextui-org/react";

import { ChevronDownIcon } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { getSideNavData } from "@/data/sidebar";

interface SideNavProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: User;
}

export default function SideNav({ user, isOpen, setIsOpen }: SideNavProps) {
  const path = usePathname();

  const sideNav = useMemo(() => getSideNavData(user), [user]);

  const [openItem, setOpenItem] = React.useState<string>();
  const [lastOpenItem, setLastOpenItem] = React.useState<string>();

  React.useEffect(() => {
    const openItem = sideNav.find((item) => item.href === path)?.title;
    if (!openItem) return;
    if (isOpen) {
      setOpenItem(lastOpenItem);
    } else {
      setLastOpenItem(openItem);
      setOpenItem("");
    }
  }, [isOpen, lastOpenItem, sideNav, path]);

  return (
    <>
      {sideNav.map((item) => {
        if (!item.hasChildren) {
          return (
            <Tooltip
              key={item.title}
              content={item.title}
              placement="right"
              offset={15}
              delay={100}
            >
              <Button
                as={path === "/tools/orals" ? Link : NextLink}
                href={item.href}
                onClick={() => {
                  setIsOpen(false);
                }}
                variant="bordered"
                className={cn(
                  "text-md group relative flex min-h-14 w-full min-w-0 items-center justify-between px-4 py-2 duration-200 hover:bg-muted",
                  path === item.href &&
                    "bg-primary-50/80 font-bold hover:bg-muted",
                  !isOpen && "justify-center",
                )}
                isIconOnly={!isOpen}
              >
                <div>
                  {path === item.href && item.activeIcon ? (
                    <item.activeIcon className={cn("h-6 w-6", item.color)} />
                  ) : (
                    <item.icon className={cn("h-6 w-6", item.color)} />
                  )}
                </div>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={cn(
                        "w-full text-wrap text-left duration-200",
                        isOpen && "left-20",
                      )}
                    >
                      {item.title.slice(0, 15) +
                        (item.title.length > 15 ? "..." : "")}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </Tooltip>
          );
        } else {
          return (
            <Accordion
              type="single"
              collapsible
              className="w-full space-y-1"
              key={item.title}
              value={openItem}
              onValueChange={setOpenItem}
            >
              <AccordionItem value={item.title ?? ""} className="border-none">
                <Tooltip
                  content={item.title}
                  placement="right"
                  offset={15}
                  delay={100}
                  className="w-full"
                >
                  <AccordionTrigger asChild>
                    <Button
                      variant="bordered"
                      className={cn(
                        "text-md group relative flex min-h-14 w-full min-w-0 items-center justify-between px-4 py-2 duration-200 hover:bg-muted hover:no-underline",
                        path === item.href &&
                          "bg-primary-50/80 font-bold hover:bg-muted",
                        !isOpen && "justify-center",
                      )}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setOpenItem(item.title);
                        }
                      }}
                    >
                      <div>
                        {path === item.href && item.activeIcon ? (
                          <item.activeIcon
                            className={cn("h-6 w-6", item.color)}
                          />
                        ) : (
                          <item.icon className={cn("h-6 w-6", item.color)} />
                        )}
                      </div>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{
                              opacity: isOpen ? 1 : 0,
                              x: isOpen ? 0 : -20,
                            }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className={cn(
                              "text-md w-full text-wrap text-left duration-200",
                              isOpen && "left-20",
                            )}
                          >
                            {item.title.slice(0, 15) +
                              (item.title.length > 15 ? "..." : "")}
                          </motion.div>
                        )}
                      </AnimatePresence>
                      {isOpen && (
                        <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                      )}
                    </Button>
                  </AccordionTrigger>
                </Tooltip>
                <AccordionContent className={cn("mx-1 mt-2 space-y-1 pb-1")}>
                  {item.children?.map((child) => (
                    <Tooltip
                      key={child.title}
                      content={child.title}
                      placement="right"
                      offset={15}
                      delay={100}
                    >
                      <Button
                        as={path === "/tools/orals" ? Link : NextLink}
                        variant="bordered"
                        href={child.href}
                        onClick={() => {
                          setIsOpen(false);
                        }}
                        className={cn(
                          "text-md group relative flex min-h-14 w-full min-w-0 items-center justify-start px-4 py-2 duration-200 hover:bg-muted",
                          path === child.href &&
                            "bg-primary-50/80 font-bold hover:bg-muted",
                          !isOpen && "justify-center px-2",
                        )}
                      >
                        {path === child.href && child.activeIcon ? (
                          <child.activeIcon
                            className={cn("h-6 w-6", child.color)}
                          />
                        ) : (
                          <child.icon className={cn("h-6 w-6", child.color)} />
                        )}
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{
                                opacity: isOpen ? 1 : 0,
                                x: isOpen ? 0 : -20,
                              }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className={cn(
                                "text-wrap duration-200",
                                isOpen && "left-20",
                              )}
                            >
                              {child.title.slice(0, 15) +
                                (child.title.length > 15 ? "..." : "")}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>
                    </Tooltip>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        }
      })}
    </>
  );
}
