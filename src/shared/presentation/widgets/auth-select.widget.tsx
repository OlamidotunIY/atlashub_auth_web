import React from 'react';
import { Field, FieldLabel, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/shared/ui';

export interface AuthSelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

export interface AuthSelectWidgetProps {
  id: string;
  label: string;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  options: AuthSelectOption[];
  errors?: unknown[];
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function AuthSelectWidget({
  id,
  label,
  placeholder,
  value,
  onChange,
  options,
  errors,
  disabled,
  required,
  className,
}: AuthSelectWidgetProps) {
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Field className={className}>
      <FieldLabel htmlFor={id}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </FieldLabel>
      <Select value={value} onValueChange={(val) => { if (val !== null) onChange(val); }}>
        <SelectTrigger id={id} className="w-full" disabled={disabled}>
          {selectedOption ? (
            <span data-slot="select-value" className="flex flex-1 text-left items-center gap-2">
              {selectedOption.icon}
              <span>{selectedOption.label}</span>
            </span>
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.icon ? (
                <div className="flex items-center gap-2">
                  {opt.icon}
                  <span>{opt.label}</span>
                </div>
              ) : (
                opt.label
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors && errors.length > 0 ? (
        <p className="text-[0.8rem] font-medium text-destructive">
          {errors
            .map((err) => {
              if (typeof err === 'string') return err;
              if (err && typeof err === 'object' && 'message' in err) {
                return String((err as { message: unknown }).message);
              }
              return JSON.stringify(err);
            })
            .join(', ')}
        </p>
      ) : null}
    </Field>
  );
}
