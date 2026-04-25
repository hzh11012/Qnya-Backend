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
import { MultipleCommand } from '@/components/ui/multiple-command';
import { cn } from '@/lib/utils';
import { ChevronDown, X } from 'lucide-react';
import type { Control, FieldValues, Path } from 'react-hook-form';

interface FormMultiSelectProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  options: {
    label: string;
    value: string;
  }[];
}

const FormMultiSelect = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder = '请选择',
  options
}: FormMultiSelectProps<TFieldValues>) => {
  const [open, setOpen] = React.useState(false);
  const optionMap = React.useMemo(
    () => new Map(options.map(o => [o.value, o.label])),
    [options]
  );

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selected: string[] = field.value ?? [];

        return (
          <FormItem>
            {label && <FormLabel className='text-sm w-fit'>{label}</FormLabel>}
            <Popover
              open={open}
              onOpenChange={setOpen}
            >
              <PopoverTrigger asChild>
                <div
                  role='combobox'
                  tabIndex={0}
                  className={cn(
                    'cursor-pointer data-placeholder:text-muted focus-visible:border-ring focus-visible:ring-ring/50 gap-1 rounded-md border bg-transparent py-1 pr-2 text-sm transition-colors select-none focus-visible:ring-3 min-h-9 flex w-full items-center justify-between outline-none',
                    selected.length > 0 ? 'pl-1' : 'pl-2.5'
                  )}
                >
                  <span
                    className={cn(
                      'flex flex-wrap gap-1 items-center',
                      selected.length === 0 && 'text-muted'
                    )}
                  >
                    {selected.length > 0
                      ? selected.map(val => (
                          <div
                            key={val}
                            className='animate-fadeIn bg-background dark:bg-input/30 text-secondary-foreground relative inline-flex h-6.5 cursor-default items-center rounded-lg border ps-2 pe-7 text-xs font-medium transition-all'
                          >
                            {optionMap.get(val) ?? val}
                            <span
                              className='text-button-foreground hover:text-foreground absolute -inset-y-px -end-px flex size-6.5 items-center justify-center rounded-e-md p-0 cursor-pointer transition-colors'
                              onPointerDown={e => {
                                e.preventDefault();
                                e.stopPropagation();
                              }}
                              onClick={e => {
                                e.preventDefault();
                                e.stopPropagation();
                                field.onChange(selected.filter(v => v !== val));
                              }}
                            >
                              <X className='size-3.5' />
                            </span>
                          </div>
                        ))
                      : placeholder}
                  </span>
                  <ChevronDown className='text-button-foreground ml-2 size-4 shrink-0' />
                </div>
              </PopoverTrigger>
              <PopoverContent className='w-(--radix-popper-anchor-width) p-0'>
                <MultipleCommand
                  options={options}
                  value={selected}
                  onChange={field.onChange}
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

export default FormMultiSelect;
