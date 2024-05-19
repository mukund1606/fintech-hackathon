"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Select, SelectItem } from "@nextui-org/react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import * as React from "react";
import { DayPicker } from "react-day-picker";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  // classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps & { onChange?: React.ChangeEventHandler<HTMLSelectElement> }) {
  const handleCalendarChange = (
    _value: string | number,
    _e: React.ChangeEventHandler<HTMLSelectElement>,
  ) => {
    const _event = {
      target: {
        value: String(_value),
      },
    } as React.ChangeEvent<HTMLSelectElement>;
    _e(_event);
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption_start: "is-start",
        caption_between: "is-between",
        caption_end: "is-end",
        caption: "flex justify-center pt-1 relative items-center gap-1",
        caption_label:
          "flex h-7 text-sm font-medium justify-center items-center grow [.is-multiple_&]:flex",
        caption_dropdowns: "flex justify-center gap-1 grow dropdowns pl-8 pr-9",
        multiple_months: "is-multiple",
        vhidden:
          "hidden [.is-between_&]:flex [.is-end_&]:flex [.is-start.is-end_&]:hidden",
        nav: "flex items-center [&:has([name='previous-month'])]:order-first [&:has([name='next-month'])]:order-last gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 text-muted-foreground",
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1 flex flex-col items-center",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md",
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
        ),
        day_range_start: "day-range-start",
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
      }}
      components={{
        IconLeft: ({ ...props }) => (
          <ChevronLeftIcon className="h-4 w-4" {...props} />
        ),
        IconRight: ({ ...props }) => (
          <ChevronRightIcon className="h-4 w-4" {...props} />
        ),
        Dropdown: ({ ...props }) => (
          <Select
            {...props}
            onChange={(value) => {
              if (value.target.value) {
                if (props.onChange) {
                  handleCalendarChange(value.target.value, props.onChange);
                }
              }
            }}
            selectedKeys={[String(props.value)]}
            className="w-28"
            classNames={{
              label: "text-sm font-medium",
              innerWrapper: "h-fit w-full",
            }}
            labelPlacement="outside"
            items={props.children as Array<React.ReactElement>}
          >
            {(child) => (
              <SelectItem
                key={child.key!}
                className="w-full px-1"
                classNames={{
                  description: "text-sm px-1",
                }}
                value={
                  (child.props as { value: number; children: string }).value
                }
              >
                {(child.props as { value: number; children: string }).children}
              </SelectItem>
            )}
          </Select>
        ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
