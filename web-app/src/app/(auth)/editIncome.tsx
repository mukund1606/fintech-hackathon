"use client";

import IncomeForm from "@/components/income";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { Pencil } from "lucide-react";
import React from "react";

type EditIncomeProps = {
  income: number;
  totalBudget: number;
};
export default function EditIncome({ income, totalBudget }: EditIncomeProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <Tooltip content="Edit Income and Budget" placement="left">
        <Button isIconOnly onPress={onOpen} color="primary" size="lg">
          <Pencil />
        </Button>
      </Tooltip>
      <Modal
        isDismissable={false}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="max-w-[85%] overflow-y-auto"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Edit Budget</ModalHeader>
          <ModalBody>
            <IncomeForm income={income} totalBudget={totalBudget} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
