import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Minus, Plus } from 'lucide-react';
import { Button, Input, Group, NumberField } from 'react-aria-components';
import { cn } from '@/lib/utils';
import type { Control, FieldValues, Path } from 'react-hook-form';

interface FormNumberProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  minValue?: number;
  maxValue?: number;
  step?: number;
}

const FormNumber = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder = '请输入',
  step = 1,
  minValue = 0,
  maxValue = 65535
}: FormNumberProps<TFieldValues>) => {
  const buttonClass = cn(
    '-ms-px flex aspect-square h-[inherit] items-center justify-center bg-transparent text-button-foreground cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50'
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel className='text-sm w-fit'>{label}</FormLabel>}
          <FormControl>
            <NumberField
              aria-label={label}
              minValue={minValue}
              maxValue={maxValue}
              step={step}
              value={field.value}
              onChange={field.onChange}
              formatOptions={{ useGrouping: false }}
            >
              <Group
                className={cn(
                  'relative inline-flex h-9 w-full items-center overflow-hidden whitespace-nowrap rounded-md border text-sm transition-colors data-focus-within:border-ring data-disabled:opacity-50 data-focus-within:outline-none data-focus-within:ring-3 data-focus-within:ring-ring/50'
                )}
              >
                <Button
                  slot='decrement'
                  className={cn(buttonClass, 'border-r')}
                >
                  <Minus
                    size={16}
                    strokeWidth={2}
                    aria-hidden='true'
                  />
                </Button>
                <Input
                  className={cn(
                    'w-full grow bg-transparent px-2.5 py-1 text-center tabular-nums focus:outline-none',
                    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                    'placeholder:text-muted selection:bg-primary selection:text-white'
                  )}
                  placeholder={placeholder}
                  autoComplete='off'
                />
                <Button
                  slot='increment'
                  className={cn(buttonClass, 'border-l')}
                >
                  <Plus
                    size={16}
                    strokeWidth={2}
                    aria-hidden='true'
                  />
                </Button>
              </Group>
            </NumberField>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormNumber;
