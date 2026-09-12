import { memo } from 'react';
import { WifiOff } from 'lucide-react';

/** 服务健康状态：正常为呼吸脉冲点，异常为警示图标 */
export const StatusDot = memo(function StatusDot({
  status
}: {
  status: 'ok' | 'error';
}) {
  return status === 'error' ? (
    <span className='flex items-center gap-1.5 text-xs font-medium text-destructive'>
      <WifiOff className='size-3.5' />
      异常
    </span>
  ) : (
    <span className='flex items-center gap-1.5 text-xs font-medium text-emerald-500'>
      <span className='relative flex size-2'>
        <span className='absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60' />
        <span className='relative inline-flex size-2 rounded-full bg-emerald-500' />
      </span>
      正常
    </span>
  );
});
