"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ChevronDown, Phone, CheckCircle, XCircle } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { countries } from "@/constant/countries";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

// Phone validation utility
const validatePhoneNumber = (
  phoneNumber: string,
  countryCode: string,
): boolean => {
  const country = countries.find((c) => c.code === countryCode);
  if (!country) return false;

  // Remove spaces, dashes, parentheses for validation
  const cleanNumber = phoneNumber.replace(/[\s\-\(\)]/g, "");
  return country.pattern.test(cleanNumber);
};

const phoneInputVariants = cva(
  "flex w-full items-center gap-2 bg-transparent text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        outline: "",
        ghost: "",
      },
      size: {
        sm: "h-7 sm:h-8 px-2 text-xs",
        default: "h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm",
        lg: "h-12 sm:h-10 px-3 sm:px-4 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface PhoneInputProps
  extends VariantProps<typeof phoneInputVariants> {
  value?: string;
  onChange?: (
    value: string,
    formattedValue: string,
    countryCode: string,
    isValid?: boolean,
  ) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  defaultCountry?: string;
  showFlag?: boolean;
  showIcon?: boolean;
  error?: boolean;
  showValidation?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

export function PhoneInput({
  value = "",
  onChange,
  placeholder,
  className,
  disabled = false,
  defaultCountry = "US",
  showFlag = true,
  showIcon = true,
  error = false,
  showValidation = false,
  onValidationChange,
  variant,
  size,
  ...props
}: PhoneInputProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = React.useState(
    countries.find((c) => c.code === defaultCountry) || countries[0],
  );
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [isValid, setIsValid] = React.useState(false);

  // Use country-specific placeholder if none provided
  const effectivePlaceholder = placeholder || selectedCountry.placeholder;

  React.useEffect(() => {
    if (value) {
      // If value includes country code, try to parse it
      const countryMatch = countries.find((c) => value.startsWith(c.phoneCode));
      if (countryMatch) {
        setSelectedCountry(countryMatch);
        setPhoneNumber(value.slice(countryMatch.phoneCode.length).trim());
      } else {
        setPhoneNumber(value);
      }
    }
  }, [value]);

  // Validate phone number whenever it changes
  React.useEffect(() => {
    const valid =
      phoneNumber.length > 0
        ? validatePhoneNumber(phoneNumber, selectedCountry.code)
        : false;
    setIsValid(valid);
    onValidationChange?.(valid);
  }, [phoneNumber, selectedCountry.code, onValidationChange]);

  const handleCountryChange = (countryCode: string) => {
    const country = countries.find((c) => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
      const formattedValue = `${country.phoneCode}${
        phoneNumber ? ` ${phoneNumber}` : ""
      }`;
      const valid =
        phoneNumber.length > 0
          ? validatePhoneNumber(phoneNumber, country.code)
          : false;
      onChange?.(phoneNumber, formattedValue, country.code, valid);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value.replace(/[^\d\s\-\(\)]/g, "");

    // Apply max length limit based on country
    if (
      selectedCountry.maxLength &&
      newValue.length > selectedCountry.maxLength
    ) {
      newValue = newValue.slice(0, selectedCountry.maxLength);
    }

    setPhoneNumber(newValue);
    const formattedValue = `${selectedCountry.phoneCode}${
      newValue ? ` ${newValue}` : ""
    }`;
    const valid =
      newValue.length > 0
        ? validatePhoneNumber(newValue, selectedCountry.code)
        : false;
    onChange?.(newValue, formattedValue, selectedCountry.code, valid);
  };

  return (
    <div
      className={cn(phoneInputVariants({ variant, size }), className)}
      {...props}
    >
      {showIcon && <Phone className="text-muted-foreground h-4 w-4 shrink-0" />}

      <div className="flex shrink-0 items-center gap-1">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between"
            >
              <div className="flex items-center gap-1">
                {showFlag && (
                  <span className="text-sm">{selectedCountry.flag}</span>
                )}
                <span className="text-muted-foreground text-xs">
                  {selectedCountry.phoneCode}
                </span>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command className="rounded-md border">
              <CommandInput placeholder="Search country..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {countries.map((country) => (
                    <CommandItem
                      key={country.code}
                      value={`${country.name} ${country.code} ${country.phoneCode}`}
                      onSelect={() => {
                        setSelectedCountry(country);
                        setOpen(false);
                      }}
                    >
                      <span className="mr-2">{country.flag}</span>
                      <span>{country.name}</span>
                      <span className="text-muted-foreground ml-auto text-xs">
                        {country.phoneCode}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <Input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneChange}
        placeholder={effectivePlaceholder}
        disabled={disabled}
        className={cn(
          showValidation &&
            phoneNumber.length > 0 &&
            (isValid ? "text-green-600" : "text-red-600"),
        )}
        maxLength={selectedCountry.maxLength}
      />

      {showValidation && phoneNumber.length > 0 && (
        <div className="ml-auto shrink-0">
          {isValid ? (
            <CheckCircle className="h-4 w-4 text-green-600" />
          ) : (
            <XCircle className="h-4 w-4 text-red-600" />
          )}
        </div>
      )}
    </div>
  );
}
