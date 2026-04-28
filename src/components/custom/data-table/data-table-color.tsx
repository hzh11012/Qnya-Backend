import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface DataTableColorProps extends HTMLAttributes<HTMLDivElement> {
  color: string;
}

const DataTableColor = ({ className, color }: DataTableColorProps) => {
  const colorComp = (
    <>
      <i
        className={cn('inline-block align-middle size-3.5 border rounded')}
        style={{
          backgroundColor: color
        }}
      ></i>
      <span className={cn('inline-block ml-2 align-middle')}>{color}</span>
    </>
  );

  return <div className={cn('inline-block', className)}>{colorComp}</div>;
};

export default DataTableColor;
