interface DataTableTotalProps {
  total: number;
}

const DataTableTotal: React.FC<DataTableTotalProps> = ({ total }) => {
  return (
    <div className='text-sm font-medium items-center gap-2 hidden sm:flex select-none'>
      <span>总数</span>
      <span>{total}</span>
    </div>
  );
};

DataTableTotal.displayName = 'DataTableTotal';

export default DataTableTotal;
