import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Minus, Plus } from 'lucide-react';
import { Input, Group, NumberField } from 'react-aria-components';
import { cn } from '@/lib/utils';
import type { Control, FieldValues, Path } from 'react-hook-form';

interface FormNumberProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  minValue?: number;
  maxValue?: number;
  /** 失焦吸附/钳制的步进粒度（如 step=0.5：输 13.2 修正为 13、13.25 修正为 13.5）；加减按钮与方向键固定按 1 步进 */
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

  /** 加减按钮/方向键：固定按 1（整数）步进，与失焦吸附的 step 粒度解耦（从 13.5 加得到 14 而非 14.5） */
  const bump = (
    field: { value: unknown; onChange: (value: number) => void },
    dir: 1 | -1
  ) => {
    const { value } = field;
    const base =
      typeof value === 'number' && !Number.isNaN(value)
        ? value
        : dir === 1
          ? minValue
          : maxValue;
    const next = dir === 1 ? Math.floor(base + 1) : Math.ceil(base - 1);
    if (next === base) return;
    field.onChange(
      dir === 1 ? Math.min(next, maxValue) : Math.max(next, minValue)
    );
  };

  const canBump = (value: unknown, dir: 1 | -1) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return true;
    return dir === 1 ? value < maxValue : value > minValue;
  };

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
                onKeyDownCapture={e => {
                  // 方向键与按钮一致走整数步进：react-aria 内部步进跟随 step，
                  // 在捕获阶段接管并阻断其触发
                  if (
                    (e.key === 'ArrowUp' || e.key === 'ArrowDown') &&
                    e.target instanceof HTMLInputElement
                  ) {
                    e.preventDefault();
                    e.stopPropagation();
                    bump(field, e.key === 'ArrowUp' ? 1 : -1);
                  }
                }}
              >
                <button
                  type='button'
                  aria-label='减少'
                  className={cn(buttonClass, 'border-r')}
                  disabled={!canBump(field.value, -1)}
                  onClick={() => bump(field, -1)}
                >
                  <Minus
                    size={16}
                    strokeWidth={2}
                    aria-hidden='true'
                  />
                </button>
                <Input
                  className={cn(
                    'w-full grow bg-transparent px-2.5 py-1 text-center tabular-nums focus:outline-none',
                    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
                    'placeholder:text-muted selection:bg-primary selection:text-white'
                  )}
                  placeholder={placeholder}
                  autoComplete='off'
                />
                <button
                  type='button'
                  aria-label='增加'
                  className={cn(buttonClass, 'border-l')}
                  disabled={!canBump(field.value, 1)}
                  onClick={() => bump(field, 1)}
                >
                  <Plus
                    size={16}
                    strokeWidth={2}
                    aria-hidden='true'
                  />
                </button>
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
