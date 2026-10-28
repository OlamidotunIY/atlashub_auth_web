import { useState } from 'react';
import { Field, FieldLabel, Input } from '@/shared/ui';
import { Eye, EyeOff } from 'lucide-react';

export interface AuthFieldWidgetProps {
  id: string;
  label: string;
  labelAction?: React.ReactNode;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  errors?: unknown[];
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function AuthFieldWidget({
  id,
  label,
  labelAction,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  errors,
  disabled,
  required,
  className,
}: AuthFieldWidgetProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <Field className={className}>
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor={id}>
          {label}
          {required && <span className="text-destructive"> *</span>}
        </FieldLabel>
        {labelAction && <div>{labelAction}</div>}
      </div>
      <div className="relative">
        <Input
          id={id}
          name={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          autoComplete={isPassword ? 'new-password' : undefined}
          className={isPassword ? 'pr-10' : ''}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
      {errors && errors.length > 0 ? (
        <p className="text-[0.8rem] font-medium text-destructive">
          {errors.map((err) => {
            if (typeof err === 'string') return err;
            if (err && typeof err === 'object' && 'message' in err) {
              return String((err as { message: unknown }).message);
            }
            return JSON.stringify(err);
          }).join(', ')}
        </p>
      ) : null}
    </Field>
  );
}
