import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Lock, Play, X } from 'lucide-react';
import {
  fetchWatchRoomBans,
  fetchWatchRoomMembers,
  fetchWatchRoomMessages,
  liftWatchRoomBan,
  type RoomMessage,
  type WatchRoomListItem
} from '@/apis/watch-rooms';
import { DataTableActionDialog } from '@/components/custom/data-table/data-table-action-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { cn, formatDate } from '@/lib/utils';

const MESSAGE_PAGE_SIZE = 20;

type DetailTab = 'members' | 'bans' | 'messages';
type MessageFilter = 'all' | 'chat' | 'system';

const TABS: Array<{ value: DetailTab; label: string }> = [
  { value: 'members', label: '成员' },
  { value: 'bans', label: '黑名单' },
  { value: 'messages', label: '消息' }
];

const MESSAGE_FILTERS: Array<{ value: MessageFilter; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'chat', label: '聊天' },
  { value: 'system', label: '系统' }
];

/** 系统通知的事件类型 → 中文标签（与 watch_room_messages.event_type 对应） */
const EVENT_TYPE_LABELS: Record<string, string> = {
  member_joined: '成员加入',
  member_left: '成员离开',
  member_kicked: '成员被移出',
  room_updated: '房间变更',
  video_changed: '切换视频'
};

const EmptyHint: React.FC<{ text: string }> = ({ text }) => (
  <div className='text-muted-foreground flex h-28 items-center justify-center text-xs'>
    {text}
  </div>
);

const ListSkeleton: React.FC = () => (
  <div className='text-muted-foreground flex h-28 items-center justify-center text-xs'>
    加载中…
  </div>
);

const UserAvatar: React.FC<{ nickname: string; avatar: string | null }> = ({
  nickname,
  avatar
}) => (
  <Avatar size='sm'>
    {avatar && (
      <AvatarImage
        src={avatar}
        alt={nickname}
      />
    )}
    <AvatarFallback>{nickname.slice(0, 1)}</AvatarFallback>
  </Avatar>
);

/** 解除拉黑：二次确认后调接口，成功后刷新黑名单 */
const BanLiftAction: React.FC<{
  roomId: string;
  userId: string;
  nickname: string;
  onDone: () => void;
}> = ({ roomId, userId, nickname, onDone }) => {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: liftWatchRoomBan,
    onSuccess() {
      setOpen(false);
      onDone();
    }
  });

  return (
    <DataTableActionDialog
      open={open}
      onOpenChange={setOpen}
      text='解除'
      title='解除拉黑'
      description={`解除后「${nickname}」可以重新加入该房间，房间内的其他设置不受影响。`}
      disabled={isPending}
      onClick={() => {
        if (isPending) return;
        mutate({ roomId, userId });
      }}
    />
  );
};

const MessageRow: React.FC<{ message: RoomMessage }> = ({ message }) => {
  const isChat = message.type === 'chat';
  const eventLabel = message.system
    ? (EVENT_TYPE_LABELS[message.system.eventType] ?? '系统通知')
    : '系统通知';

  return (
    <div className='flex items-start gap-3 py-2.5'>
      <Badge
        variant={isChat ? 'muted' : 'default'}
        className='mt-0.5 shrink-0'
      >
        {isChat ? '聊天' : eventLabel}
      </Badge>
      <div className='min-w-0 flex-1'>
        <div className='text-sm break-words whitespace-pre-wrap'>
          {message.content}
        </div>
        <div className='text-muted-foreground mt-1 flex flex-wrap items-center gap-x-2 text-xs'>
          {isChat && message.user && <span>{message.user.nickname}</span>}
          <span>{formatDate(message.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

interface DetailSheetProps {
  row: WatchRoomListItem;
}

/**
 * 房间详情抽屉：成员 / 黑名单 / 消息记录。
 * 三个分区各自按需拉取（抽屉打开才请求），消息单独分页；
 * 这些数据在房间解散后会随房间级联删除，所以只对现存房间有意义。
 */
const DetailSheet: React.FC<DetailSheetProps> = ({ row }) => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<DetailTab>('members');
  const [messagePage, setMessagePage] = useState(1);
  const [messageFilter, setMessageFilter] = useState<MessageFilter>('all');
  const queryClient = useQueryClient();

  const membersQuery = useQuery({
    queryKey: ['watch-room-members', row.id],
    queryFn: () => fetchWatchRoomMembers({ roomId: row.id }),
    enabled: open
  });

  const bansQuery = useQuery({
    queryKey: ['watch-room-bans', row.id],
    queryFn: () => fetchWatchRoomBans({ roomId: row.id }),
    enabled: open
  });

  const messagesQuery = useQuery({
    queryKey: ['watch-room-messages', row.id, messagePage, messageFilter],
    queryFn: () =>
      fetchWatchRoomMessages({
        roomId: row.id,
        page: messagePage,
        pageSize: MESSAGE_PAGE_SIZE,
        ...(messageFilter === 'all' ? {} : { type: messageFilter })
      }),
    enabled: open
  });

  const counts: Record<DetailTab, number | undefined> = {
    members: membersQuery.data?.total,
    bans: bansQuery.data?.total,
    // 消息总数只在「全部」视图下准确（筛选后 total 变成筛选结果数），
    // 筛选时交给底部「共 N 条」，避免 tab 上的数字来回跳
    messages: messageFilter === 'all' ? messagesQuery.data?.total : undefined
  };

  const messageTotal = messagesQuery.data?.total ?? 0;
  const messagePages = Math.max(1, Math.ceil(messageTotal / MESSAGE_PAGE_SIZE));

  return (
    <Sheet
      open={open}
      onOpenChange={next => {
        setOpen(next);
        if (next) {
          // 每次重新打开都从第一页、第一个分区看起，避免停在上一间房的滚动位置
          setTab('members');
          setMessagePage(1);
          setMessageFilter('all');
        }
      }}
    >
      <SheetTrigger asChild>
        <Button
          variant='link'
          size='link'
        >
          详情
        </Button>
      </SheetTrigger>
      <SheetContent className='data-[side=right]:w-full data-[side=right]:sm:max-w-xl'>
        <SheetHeader className='relative border-b pr-12'>
          <SheetTitle className='truncate pr-2 text-base'>
            {row.name}
          </SheetTitle>
          <SheetClose asChild>
            <Button
              variant='ghost'
              size='icon'
              aria-label='关闭'
              className='text-muted-foreground hover:text-foreground absolute top-3 right-3 size-8'
            >
              <X className='size-4' />
            </Button>
          </SheetClose>
          <div className='text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs'>
            <Badge
              variant={
                row.visibility === 'private' ? 'subtle-warning' : 'subtle'
              }
            >
              {row.visibility === 'private' && <Lock />}
              {row.visibility === 'private' ? '私人' : '公开'}
            </Badge>
            {row.currentVideo &&
              (row.isPlaying ? (
                <Badge variant='subtle-success'>
                  <Play />
                  播放中
                </Badge>
              ) : (
                <Badge variant='subtle'>已暂停</Badge>
              ))}
            <span>房主 {row.owner.nickname}</span>
            <span>
              成员 {row.memberCount}/{row.maxMembers}
            </span>
            <span>创建于 {formatDate(row.createdAt)}</span>
          </div>
        </SheetHeader>

        <div className='flex min-h-0 flex-1 flex-col px-4 pb-4'>
          {/* 分区 tab：下划线式（不抢 header 的视觉重量），数字做小圆点跟在文字后面 */}
          <div className='border-border -mx-4 flex flex-none gap-6 border-b px-4'>
            {TABS.map(item => {
              const active = tab === item.value;
              const count = counts[item.value];

              return (
                <button
                  key={item.value}
                  type='button'
                  onClick={() => setTab(item.value)}
                  className={cn(
                    '-mb-px flex cursor-pointer items-center gap-1.5 border-b-2 border-transparent pb-2.5 text-sm transition-colors',
                    active
                      ? 'border-primary text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.label}
                  {count !== undefined && (
                    <span
                      className={cn(
                        'rounded-full px-1.5 py-0.5 text-[11px] leading-none font-normal tabular-nums',
                        active
                          ? 'bg-primary/10 text-primary'
                          : 'bg-muted/15 text-muted-foreground'
                      )}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className='flex min-h-0 flex-1 flex-col gap-3 pt-3'>
            {tab === 'members' && (
              <ScrollArea className='min-h-0 flex-1'>
                {membersQuery.isLoading ? (
                  <ListSkeleton />
                ) : !membersQuery.data?.items.length ? (
                  <EmptyHint text='房间里还没有成员' />
                ) : (
                  <div className='divide-border divide-y pr-2'>
                    {membersQuery.data.items.map(member => (
                      <div
                        key={member.userId}
                        className='flex items-center gap-3 py-2.5'
                      >
                        <UserAvatar
                          nickname={member.nickname}
                          avatar={member.avatar}
                        />
                        <div className='min-w-0 flex-1'>
                          <div className='flex items-center gap-2'>
                            <span className='truncate text-sm font-medium'>
                              {member.nickname}
                            </span>
                            {member.role === 'owner' && (
                              <Badge variant='subtle-warning'>房主</Badge>
                            )}
                          </div>
                          <div className='text-muted-foreground mt-0.5 text-xs'>
                            加入于 {formatDate(member.joinedAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            )}

            {tab === 'bans' && (
              <ScrollArea className='min-h-0 flex-1'>
                {bansQuery.isLoading ? (
                  <ListSkeleton />
                ) : !bansQuery.data?.items.length ? (
                  <EmptyHint text='没有被移出的成员' />
                ) : (
                  <div className='divide-border divide-y pr-2'>
                    {bansQuery.data.items.map(ban => (
                      <div
                        key={ban.userId}
                        className='flex items-center gap-3 py-2.5'
                      >
                        <UserAvatar
                          nickname={ban.nickname}
                          avatar={ban.avatar}
                        />
                        <div className='min-w-0 flex-1'>
                          <div className='truncate text-sm font-medium'>
                            {ban.nickname}
                          </div>
                          <div className='text-muted-foreground mt-0.5 text-xs'>
                            移出于 {formatDate(ban.bannedAt)}
                          </div>
                        </div>
                        <BanLiftAction
                          roomId={row.id}
                          userId={ban.userId}
                          nickname={ban.nickname}
                          onDone={() => {
                            void queryClient.invalidateQueries({
                              queryKey: ['watch-room-bans', row.id]
                            });
                            void queryClient.invalidateQueries({
                              queryKey: ['watch-room-messages', row.id]
                            });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            )}

            {tab === 'messages' && (
              <>
                <div className='flex items-center gap-1'>
                  {MESSAGE_FILTERS.map(item => {
                    const active = messageFilter === item.value;

                    return (
                      <button
                        key={item.value}
                        type='button'
                        onClick={() => {
                          setMessageFilter(item.value);
                          setMessagePage(1);
                        }}
                        className={cn(
                          'h-7 cursor-pointer rounded-full px-3 text-xs transition-colors',
                          active
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:bg-muted/10 hover:text-foreground'
                        )}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                <ScrollArea className='min-h-0 flex-1'>
                  {messagesQuery.isLoading ? (
                    <ListSkeleton />
                  ) : !messagesQuery.data?.items.length ? (
                    <EmptyHint text='还没有任何消息' />
                  ) : (
                    <div className='divide-border divide-y pr-2'>
                      {messagesQuery.data.items.map(message => (
                        <MessageRow
                          key={message.messageId}
                          message={message}
                        />
                      ))}
                    </div>
                  )}
                </ScrollArea>

                <div className='text-muted-foreground flex items-center justify-between text-xs'>
                  <span>共 {messageTotal} 条</span>
                  <div className='flex items-center gap-2'>
                    <Button
                      type='button'
                      variant='outline'
                      className='h-7 px-2 text-xs'
                      disabled={messagePage <= 1 || messagesQuery.isFetching}
                      onClick={() =>
                        setMessagePage(page => Math.max(1, page - 1))
                      }
                    >
                      上一页
                    </Button>
                    <span>
                      {messagePage} / {messagePages}
                    </span>
                    <Button
                      type='button'
                      variant='outline'
                      className='h-7 px-2 text-xs'
                      disabled={
                        messagePage >= messagePages || messagesQuery.isFetching
                      }
                      onClick={() => setMessagePage(page => page + 1)}
                    >
                      下一页
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DetailSheet;
