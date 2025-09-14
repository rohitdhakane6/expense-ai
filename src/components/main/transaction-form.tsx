"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

import {
  transactionInsertSchema,
  transactionSelectSchema,
  typeOptions,
  categoryOptions,
  recurringIntervalOptions,
} from "@/db/schema";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { CalendarIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ReceiptScanner } from "@/components/main/receipt-scanner";
import {
  useCreateTransaction,
  useUpdateTransaction,
} from "@/hooks/useTransaction";

interface TransactionFormProps {
  isEdit?: boolean;
  transactionData?: z.infer<typeof transactionSelectSchema>;
  children: React.ReactNode;
  onSuccess?: () => void;
}

// Schema with string amount
const schema = transactionInsertSchema
  .extend({
    amount: z.string().refine((val) => /^\d+(\.\d{1,2})?$/.test(val), {
      message: "Enter a valid decimal (up to 2 places)",
    }),
    name: z.string().min(3, {
      message: "This is required",
    }),
    userId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.isRecurring && !data.recurringInterval) {
      ctx.addIssue({
        path: ["recurringInterval"],
        code: z.ZodIssueCode.custom,
        message: "Recurring interval is required when recurring is enabled",
      });
    }
  });

export default function TransactionForm({
  isEdit = false,
  transactionData,
  children,
  onSuccess,
}: TransactionFormProps) {
  const { mutateAsync: createTransaction, isPending: isCreating } =
    useCreateTransaction();

  const { mutateAsync: updateTransaction, isPending: isUpdating } =
    useUpdateTransaction();

  const [open, setOpen] = useState(false);
  const isPending = isCreating || isUpdating;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues:
      isEdit && transactionData
        ? {
            name: transactionData.name || "",
            amount: transactionData.amount?.toString() || "",
            type: transactionData.type || "expense",
            description: transactionData.description || null,
            category: transactionData.category || "other",
            isRecurring: transactionData.isRecurring || false,
            recurringInterval: transactionData.recurringInterval || "monthly",
            transactionDate: transactionData.transactionDate
              ? new Date(transactionData.transactionDate)
              : new Date(),
          }
        : {
            name: "",
            amount: "",
            type: "expense",
            category: "other",
            isRecurring: false,
            transactionDate: new Date(),
          },
  });

  const { watch, reset, control, handleSubmit, setValue } = form;

  const isRecurring = watch("isRecurring");

  async function handleCreate(values: z.infer<typeof schema>) {
    try {
      const safeValues = {
        ...values,
        description: values.description ?? undefined,
        recurringInterval:
          values.recurringInterval === null
            ? undefined
            : values.recurringInterval,
      };

      await createTransaction(safeValues);

      reset();
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create transaction:", error);
    }
  }

  async function handleEdit(values: z.infer<typeof schema>) {
    if (!transactionData?.id) return;

    try {
      const safeValues = {
        ...values,
        id: transactionData.id,
        description: values.description ?? undefined,
        recurringInterval:
          values.recurringInterval === null
            ? undefined
            : values.recurringInterval,
      };

      await updateTransaction(safeValues);

      setOpen(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to update transaction:", error);
    }
  }

  async function onSubmit(values: z.infer<typeof schema>) {
    console.log("Submitted ✅", values);

    if (isEdit) {
      await handleEdit(values);
    } else {
      await handleCreate(values);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          reset(); // reset when dialog closes
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the details below and save changes."
              : "Fill in the details to add a new transaction."}
          </DialogDescription>

          {/* Receipt Scanner - Only show for new transactions */}
          {!isEdit && (
            <ReceiptScanner
              onScanComplete={(data) => {
                setValue("amount", data.amount?.toFixed(2) || "", {
                  shouldValidate: true,
                });
                setValue("name", data.name || "", {
                  shouldValidate: true,
                });
                setValue("description", data.description || "");
                setValue(
                  "category",
                  categoryOptions.includes(data.category)
                    ? data.category
                    : "other",
                );
                setValue("type", data.type === "income" ? "income" : "expense");
                setValue(
                  "transactionDate",
                  data.date ? new Date(data.date) : new Date(),
                );
              }}
            />
          )}
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name */}
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Transaction Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      inputMode="decimal"
                      placeholder="0.00"
                      {...field}
                      onBlur={(e) => {
                        const val = e.target.value;
                        if (val && !isNaN(Number(val))) {
                          setValue("amount", Number(val).toFixed(2));
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={control}
              name="transactionDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 size-4" />
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => date && field.onChange(date)}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type + Category */}
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {typeOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-48 overflow-y-auto">
                        {categoryOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Optional description"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Recurring */}
            <FormField
              control={control}
              name="isRecurring"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Recurring Transaction</FormLabel>
                      <p className="text-muted-foreground text-sm">
                        Set up a recurring schedule
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />

            {/* Recurring Interval */}
            {isRecurring && (
              <FormField
                control={control}
                name="recurringInterval"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recurring Interval</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value as string}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />

                      <SelectContent>
                        {recurringIntervalOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            )}

            <DialogFooter className="flex justify-end gap-2 pt-4">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending
                  ? isEdit
                    ? "Updating..."
                    : "Creating..."
                  : isEdit
                    ? "Update"
                    : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
