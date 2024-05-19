"use client";
import { useCallback, useMemo, useState } from "react";

import { api, isTRPCClientError } from "@/trpc/react";

import { parseAsInteger, useQueryStates } from "next-usequerystate";

import { EyeIcon, PlusIcon, TrashIcon } from "lucide-react";

import { format } from "date-fns";

import { toast } from "sonner";

import Webcam from "react-webcam";

import ErrorComponent from "@/components/errorComponent";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  getKeyValue,
  useDisclosure,
  type SortDescriptor,
} from "@nextui-org/react";

import { DefaultService, type orcReturnRype } from "@/client";
import type { categorySchema, modeOfPaymentSchema } from "@/types/forms";
import { type ExpensesTableCellData } from "@/types/tableCells";
import type { z } from "zod";
import CreateExpenseForm from "./createExpenseForm";

export const tableColumns: Array<{ key: string; label: string }> = [
  {
    key: "actions",
    label: "ACTIONS",
  },
  {
    key: "category",
    label: "CATEGORY",
  },
  {
    key: "amount",
    label: "AMOUNT",
  },
  {
    key: "modeOfPayment",
    label: "MODE OF PAYMENT",
  },
  {
    key: "isIncome",
    label: "INCOME/EXPENSE",
  },
  {
    key: "date",
    label: "DATE",
  },
];

export default function DataTable() {
  const {
    isOpen: isCreateModalOpen,
    onOpen: onCreateModalOpen,
    onOpenChange: onCreateModalOpenChange,
  } = useDisclosure();

  const {
    isOpen: isOCRModalOpen,
    onOpen: onOCRModalOpen,
    onOpenChange: onOCRModalOpenChange,
  } = useDisclosure();

  const {
    data: allData,
    isPending,
    isError,
    error,
  } = api.expenses.getExpenses.useQuery(undefined, {
    retry: 0,
  });

  const ocrRoute = api.expenses.createMultipleExpenses.useMutation({
    onSuccess() {
      toast.success("Expenses created successfully");
    },
    onError() {
      toast.error("Failed to create expenses");
    },
  });

  const [imageSrc, setImageSrc] = useState<string | null>("");
  const [ocrData, setOCRData] = useState<orcReturnRype>();

  const [searchCategory, setSearchCategory] = useState<
    z.infer<typeof categorySchema>[]
  >([
    "FOOD",
    "ELECTRICITY",
    "TRANSPORT",
    "SUBSCRIPTION",
    "PROPERTY",
    "MEDICAL",
    "OTHER",
  ]);

  const [modeOfPayment, setModeOfPayment] = useState<
    z.infer<typeof modeOfPaymentSchema>[]
  >(["CASH", "CREDIT_CARD", "DEBIT_CARD"]);

  const [pageStates, setPageStates] = useQueryStates(
    {
      page: parseAsInteger.withDefault(1),
      rows: parseAsInteger.withDefault(10),
    },
    {
      history: "push",
    },
  );
  if (pageStates.page < 1) {
    void setPageStates({ page: 1, rows: pageStates.rows ?? 10 });
    pageStates.page = 1;
    pageStates.rows = pageStates.rows ?? 10;
  } else if (![10, 25, 50, 100].includes(pageStates.rows)) {
    void setPageStates({ page: pageStates.page ?? 1, rows: 10 });
    pageStates.rows = 10;
    pageStates.page = pageStates.page ?? 1;
  }

  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "username",
    direction: "ascending",
  });

  const col = sortDescriptor.column as keyof ExpensesTableCellData;

  const filteredData = useMemo(() => {
    if (!allData) return [];
    return allData.filter(
      (data) =>
        searchCategory.includes(data.category) &&
        modeOfPayment.includes(data.modeOfPayment),
    );
  }, [allData, searchCategory, modeOfPayment]);

  const data = useMemo(() => {
    return sortDescriptor.direction === "ascending"
      ? filteredData?.sort((a, b) => {
          if (getKeyValue(a, col) > getKeyValue(b, col)) return 1;
          if (getKeyValue(a, col) < getKeyValue(b, col)) return -1;
          return 0;
        })
      : filteredData?.sort((a, b) => {
          if (getKeyValue(a, col) < getKeyValue(b, col)) return 1;
          if (getKeyValue(a, col) > getKeyValue(b, col)) return -1;
          return 0;
        });
  }, [col, filteredData, sortDescriptor.direction]);

  const handleSortChange = (e: SortDescriptor) => {
    setSortDescriptor(e);
  };

  const totalPages = useMemo(() => {
    if (!data) return 0;
    return Math.ceil(data.length / pageStates.rows);
  }, [data, pageStates.rows]);

  const renderTableCells = useCallback(
    (
      cellData: ExpensesTableCellData,
      columnKey: keyof ExpensesTableCellData | "actions",
    ) => {
      let cellValue: string | number | null = null;
      if (columnKey === "actions") {
        cellValue = null;
      } else if (columnKey === "date") {
        cellValue = format(cellData[columnKey], "dd/MM/yyyy");
      } else if (columnKey === "isIncome") {
        cellValue = cellData[columnKey] ? "INCOME" : "EXPENSE";
      } else {
        cellValue = cellData[columnKey];
      }
      switch (columnKey) {
        case "actions":
          return <ActionsComponent data={cellData} />;
        default:
          return cellValue?.toString().replace("_", " ") ?? "N/A";
      }
    },
    [],
  );

  if (!allData && isError) {
    return <ErrorComponent message={error.message} />;
  }

  return (
    <>
      <div>
        <div className="flex items-start justify-between gap-4">
          <div className="flex w-full flex-wrap gap-2">
            <Select
              className="w-full max-w-[15rem]"
              label="Category"
              aria-label="Category"
              variant="bordered"
              selectionMode="multiple"
              selectedKeys={searchCategory}
              onChange={(e) => {
                void setSearchCategory(
                  e.target.value.split(",") as z.infer<typeof categorySchema>[],
                );
              }}
            >
              <SelectItem key="FOOD" value="FOOD">
                FOOD
              </SelectItem>
              <SelectItem key="ELECTRICITY" value="ELECTRICITY">
                ELECTRICITY
              </SelectItem>
              <SelectItem key="TRANSPORT" value="TRANSPORT">
                TRANSPORT
              </SelectItem>
              <SelectItem key="SUBSCRIPTION" value="SUBSCRIPTION">
                SUBSCRIPTION
              </SelectItem>
              <SelectItem key="PROPERTY" value="PROPERTY">
                PROPERTY
              </SelectItem>
              <SelectItem key="MEDICAL" value="MEDICAL">
                MEDICAL
              </SelectItem>
              <SelectItem key="OTHER" value="OTHER">
                OTHER
              </SelectItem>
            </Select>
            <Select
              className="w-full max-w-[15rem]"
              label="Mode of Payment"
              aria-label="Mode of Payment"
              variant="bordered"
              selectionMode="multiple"
              selectedKeys={modeOfPayment}
              onChange={(e) => {
                void setModeOfPayment(
                  e.target.value.split(",") as z.infer<
                    typeof modeOfPaymentSchema
                  >[],
                );
              }}
            >
              <SelectItem key="CASH" value="CASH">
                CASH
              </SelectItem>
              <SelectItem key="CREDIT_CARD" value="CREDIT_CARD">
                CREDIT CARD
              </SelectItem>
              <SelectItem key="DEBIT_CARD" value="DEBIT_CARD">
                DEBIT CARD
              </SelectItem>
            </Select>
          </div>
          <div className="flex flex-col items-end gap-2 md:flex-row">
            <Select
              label="Rows"
              aria-label="Rows"
              className="max-w-[5rem]"
              classNames={{
                trigger: "h-14 w-[5rem]",
              }}
              variant="bordered"
              selectedKeys={[String(pageStates.rows)]}
              onChange={(e) => {
                if (
                  !e.target.value ||
                  parseInt(e.target.value) === pageStates.rows
                )
                  return;
                void setPageStates({
                  page: pageStates.page,
                  rows: parseInt(e.target.value),
                });
              }}
            >
              <SelectItem key="10" value="10">
                10
              </SelectItem>
              <SelectItem key="25" value="25">
                25
              </SelectItem>
              <SelectItem key="50" value="50">
                50
              </SelectItem>
              <SelectItem key="100" value="100">
                100
              </SelectItem>
            </Select>
            <Button
              isIconOnly
              variant="bordered"
              size="lg"
              className="h-14 w-14"
              onPress={onCreateModalOpen}
            >
              <PlusIcon className="h-8 w-8" />
            </Button>
            <Button
              isIconOnly
              variant="bordered"
              size="lg"
              className="h-14 w-14"
              onPress={onOCRModalOpen}
            >
              <EyeIcon className="h-8 w-8" />
            </Button>
          </div>
        </div>
      </div>
      <Table
        className="w-[calc(100vw-60px)] overflow-x-scroll  md:w-[calc(100vw-125px)]"
        aria-label="All Expenses Table"
        removeWrapper
        sortDescriptor={sortDescriptor}
        onSortChange={handleSortChange}
      >
        <TableHeader columns={tableColumns}>
          {(column) => (
            <TableColumn
              allowsSorting={column.key !== "actions"}
              key={column.key}
              align="center"
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={data.slice(
            (pageStates.page - 1) * pageStates.rows,
            pageStates.page * pageStates.rows,
          )}
          isLoading={isPending}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell className="w-fit">
                  {renderTableCells(
                    item,
                    columnKey as keyof ExpensesTableCellData,
                  )}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {isPending ? (
        <Spinner size="lg" label="Loading Expenses..." />
      ) : (
        <div className="flex w-full justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="secondary"
            page={pageStates.page}
            total={totalPages}
            onChange={(page) =>
              void setPageStates({
                page,
                rows: pageStates.rows,
              })
            }
          />
        </div>
      )}
      <Modal
        isOpen={isCreateModalOpen}
        onOpenChange={onCreateModalOpenChange}
        isDismissable={false}
        size="5xl"
        className="max-h-[85vh] max-w-[98vw]"
        placement="center"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-lg">
            Create Expense
          </ModalHeader>
          <ModalBody className="overflow-y-auto">
            <CreateExpenseForm />
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOCRModalOpen}
        onOpenChange={onOCRModalOpenChange}
        isDismissable={false}
        size="5xl"
        className="max-h-[85vh] max-w-[98vw]"
        placement="center"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 text-lg">
            Create Expense using OCR
          </ModalHeader>
          <ModalBody className="overflow-y-auto">
            <div className="flex flex-col gap-4">
              <input
                type="file"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = async (e) => {
                    const imageSrc = e.target?.result as string;
                    setImageSrc(imageSrc);
                    const data = await DefaultService.ocrOcrPost({
                      file: imageSrc ?? "",
                    });
                    setOCRData(data);
                  };
                  reader.readAsDataURL(file);
                }}
              />
              {imageSrc ? (
                <>
                  <Image
                    src={imageSrc}
                    alt="Captured Image"
                    className="max-h-[500px]"
                  />
                  {
                    <div className="flex flex-col gap-6">
                      <div>
                        Date: {ocrData?.date?.year}-{ocrData?.date?.month}-
                        {ocrData?.date?.day}
                      </div>
                      <div className="flex flex-col gap-4">
                        {ocrData?.data.map((data, i) => (
                          <div className="flex flex-col gap-2" key={i}>
                            <div>Category: {data.category}</div>
                            <div>Amount: {data.amount}</div>
                            <div>Description: {data.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  }
                  <div className="flex gap-4">
                    <Button
                      onPress={() => {
                        setImageSrc(null);
                      }}
                    >
                      Retake photo
                    </Button>
                    <Button
                      onPress={async () => {
                        if (!ocrData?.date || !ocrData?.data) return;
                        if (ocrData.data.length === 0) return;
                        await ocrRoute.mutateAsync({
                          date: ocrData.date,
                          expenses: ocrData.data,
                        });
                        setImageSrc(null);
                      }}
                    >
                      Save Expenses
                    </Button>
                  </div>
                </>
              ) : (
                <Webcam
                  audio={false}
                  screenshotFormat="image/png"
                  className="max-h-[500px]"
                  videoConstraints={{
                    facingMode: "environment",
                  }}
                >
                  {/* @ts-expect-error getScreenshot is not available in the types */}
                  {({ getScreenshot }) => (
                    <Button
                      onPress={async () => {
                        const imageSrc = getScreenshot();
                        setImageSrc(imageSrc);
                        const data = await DefaultService.ocrOcrPost({
                          file: imageSrc ?? "",
                        });
                        setOCRData(data);
                      }}
                    >
                      Capture photo
                    </Button>
                  )}
                </Webcam>
              )}
            </div>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function ActionsComponent({ data }: { data: ExpensesTableCellData }) {
  const apiUtils = api.useUtils();
  const deleteExpenseRoute = api.expenses.deleteExpense.useMutation({
    async onSuccess() {
      await apiUtils.expenses.invalidate();
    },
  });

  return (
    <>
      <div className="flex w-fit gap-2">
        <>
          <Popover placement="bottom-start">
            <PopoverTrigger>
              <span>
                <Tooltip color="danger" content="Delete Expense">
                  <TrashIcon className="cursor-pointer text-lg text-danger active:opacity-50" />
                </Tooltip>
              </span>
            </PopoverTrigger>
            <PopoverContent>
              <div className="flex flex-col items-center justify-center gap-2 px-1 py-2">
                <div className="text-wrap text-small font-bold">
                  Are you sure you want to delete this expense
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    color="secondary"
                    size="sm"
                    onClick={async () => {
                      try {
                        await deleteExpenseRoute.mutateAsync({ id: data.id });
                        toast.success("Expense deleted successfully");
                      } catch (e) {
                        if (isTRPCClientError(e)) {
                          toast.error(e.message);
                        }
                      }
                    }}
                  >
                    Yes
                  </Button>
                  <Button color="danger" size="sm">
                    No
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </>
      </div>
    </>
  );
}
