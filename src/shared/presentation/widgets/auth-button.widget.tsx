import { Button, Field } from '@/shared/ui';

export interface AuthButtonWidgetProps {
  type?: 'button' | 'submit' | 'reset';
  text: string;
  loadingText?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

export function AuthButtonWidget({
  type = 'submit',
  text,
  loadingText,
  isLoading = false,
  disabled = false,
  onClick,
  className,
}: AuthButtonWidgetProps) {
  return (
    <Field className={className}>
      <Button type={type} disabled={disabled || isLoading} onClick={onClick}>
        {isLoading ? loadingText || text : text}
      </Button>
    </Field>
  );
}
