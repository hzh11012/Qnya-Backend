import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRequest } from 'ahooks';
import { fetchFileTree, ingestFile } from '@/apis/tasks';
import {
  FileTree,
  type FileTreeNewFolder
} from '@/components/custom/file-tree';
import { Folder, FolderPlus, X } from 'lucide-react';

interface IngestDialogProps {
  id: number;
  onRefresh: () => void;
}

const IngestDialog: React.FC<IngestDialogProps> = ({ id, onRefresh }) => {
  const [open, setOpen] = useState(false);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [newFolders, setNewFolders] = useState<FileTreeNewFolder[]>([]);
  const [newFolderInput, setNewFolderInput] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');

  const {
    data: rootNodes,
    loading: rootLoading,
    run: loadRoot
  } = useRequest(() => fetchFileTree({}), {
    manual: true
  });

  const { run: runIngest, loading: ingestLoading } = useRequest(ingestFile, {
    manual: true,
    onSuccess() {
      handleClose();
      onRefresh();
    }
  });

  const handleOpen = (val: boolean) => {
    if (val) {
      setOpen(true);
      loadRoot();
    } else {
      handleClose();
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPath(null);
    setNewFolders([]);
    setNewFolderInput(null);
    setNewFolderName('');
  };

  const handleSelect = useCallback((path: string) => {
    setSelectedPath(prev => (prev === path ? null : path));
  }, []);

  const handleAddFolder = useCallback((parentPath: string) => {
    setNewFolderInput(parentPath);
    setNewFolderName('');
  }, []);

  // 合法文件夹名：非空、不含路径分隔符、不以点开头、不为 ".."
  const isValidFolderName = (name: string) =>
    name.length > 0 &&
    name.length <= 25 &&
    !name.includes('/') &&
    !name.includes('\\') &&
    !name.startsWith('.') &&
    name !== '..';

  const handleConfirmNewFolder = () => {
    if (newFolderInput === null) return;
    const name = newFolderName.trim();
    if (!isValidFolderName(name)) return;
    const fullPath = newFolderInput ? `${newFolderInput}/${name}` : name;
    if (newFolders.some(f => f.fullPath === fullPath)) return;
    setNewFolders(prev => [
      ...prev,
      { name, parentPath: newFolderInput, fullPath }
    ]);
    setNewFolderInput(null);
    setNewFolderName('');
  };

  const handleRemoveFolder = useCallback((fullPath: string) => {
    setNewFolders(prev =>
      prev.filter(
        f => f.fullPath !== fullPath && !f.fullPath.startsWith(fullPath + '/')
      )
    );
    setSelectedPath(prev =>
      prev === fullPath || prev?.startsWith(fullPath + '/') ? null : prev
    );
  }, []);

  const handleConfirm = () => {
    if (!selectedPath) return;
    runIngest({ id, path: selectedPath });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant='link'
          size='link'
        >
          入库
        </Button>
      </DialogTrigger>

      <DialogContent
        aria-describedby={undefined}
        className='sm:max-w-md'
      >
        <DialogHeader>
          <DialogTitle>选择入库目录</DialogTitle>
        </DialogHeader>

        {/* 已选展示 */}
        {selectedPath && (
          <div className='flex items-center gap-1.5 rounded-md border pl-3 pr-1.25 py-1.25 text-sm overflow-auto bg-primary/10'>
            <Folder className='size-4 shrink-0 text-foreground/40' />
            <span
              className='truncate min-w-0 flex-1 text-foreground/80'
              title={selectedPath}
            >
              {selectedPath}
            </span>
            <Button
              size='icon'
              variant='outline'
              className='shrink-0 border-transparent bg-transparent size-6'
              onClick={() => setSelectedPath(null)}
            >
              <X className='size-4' />
            </Button>
          </div>
        )}

        {/* 新建目录输入 */}
        {newFolderInput !== null && (
          <div className='flex items-center gap-2'>
            <span
              className='text-sm shrink-0 truncate max-w-32'
              title={newFolderInput ? `${newFolderInput}/` : '根目录/'}
            >
              {newFolderInput ? `${newFolderInput}/` : '根目录/'}
            </span>
            <Input
              placeholder='目录名'
              value={newFolderName}
              maxLength={25}
              onChange={e => setNewFolderName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleConfirmNewFolder();
              }}
              autoFocus
            />
            <Button
              size='icon'
              variant='outline'
              className='shrink-0 border-transparent bg-transparent size-6'
              onClick={() => setNewFolderInput(null)}
            >
              <X className='size-4' />
            </Button>
          </div>
        )}

        {/* 文件树区域 */}
        <div className='rounded-md border overflow-hidden'>
          <div className='flex items-center justify-between pl-2.5 pr-1.5 py-1.5 bg-card'>
            <span className='text-sm'>文件目录</span>
            <Button
              size='icon'
              variant='outline'
              className='shrink-0 border-transparent bg-transparent size-6'
              onClick={() => handleAddFolder('')}
              title='新建目录'
            >
              <FolderPlus className='size-3.5' />
            </Button>
          </div>

          <ScrollArea className='h-72 p-2 [&>div>div]:block!'>
            <FileTree
              nodes={rootNodes ?? []}
              loading={rootLoading}
              selectedPath={selectedPath}
              onSelect={handleSelect}
              newFolders={newFolders}
              onAddFolder={handleAddFolder}
              onRemoveFolder={handleRemoveFolder}
              fetchChildren={path => fetchFileTree({ path }).then(d => d ?? [])}
            />
          </ScrollArea>
        </div>

        <DialogFooter className='flex gap-2'>
          <Button
            variant='outline'
            className='flex-1'
            onClick={handleClose}
          >
            取消
          </Button>
          <Button
            className='flex-1'
            disabled={!selectedPath || ingestLoading}
            onClick={handleConfirm}
          >
            确认入库
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IngestDialog;
