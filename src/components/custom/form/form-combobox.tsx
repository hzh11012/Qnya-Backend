import * as React from 'react';
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { VirtualizedCommand } from '@/components/ui/virtualized-combobox';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import type { Control, FieldValues, Path } from 'react-hook-form';

interface FormComboboxProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  options: {
    label: string;
    value: string;
  }[];
}

const FormCombobox = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder = '请选择',
  options
}: FormComboboxProps<TFieldValues>) => {
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selectedLabel = options.find(o => o.value === field.value)?.label;

        return (
          <FormItem>
            {label && <FormLabel className='text-sm w-fit'>{label}</FormLabel>}
            <Popover
              open={open}
              onOpenChange={setOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant='ghost'
                  role='combobox'
                  className='w-full justify-between font-normal border-border bg-background text-foreground py-2 pr-2 pl-2.5 active:translate-y-0'
                >
                  <span
                    className={cn('truncate', !selectedLabel && 'text-muted')}
                  >
                    {selectedLabel ?? placeholder}
                  </span>
                  <ChevronDown className='text-button-foreground ml-2 size-4 shrink-0' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-(--radix-popper-anchor-width) p-0'>
                <VirtualizedCommand
                  options={options}
                  value={field.value}
                  onChange={value => {
                    field.onChange(value);
                    setOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FormCombobox;
