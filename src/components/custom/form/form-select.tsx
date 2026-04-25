import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import type { Control, FieldValues, Path } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface FormSelectProps<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  options: {
    label: string;
    value: string;
  }[];
}

const FormSelect = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder = '请选择',
  options
}: FormSelectProps<TFieldValues>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel className='text-sm w-fit'>{label}</FormLabel>}
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                {options.map(item => {
                  const { label, value } = item;
                  return (
                    <SelectItem
                      key={value}
                      value={value}
                    >
                      {label}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormSelect;
