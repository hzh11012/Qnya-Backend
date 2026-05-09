import * as React from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  ChevronRight,
  File,
  Folder,
  FolderPlus,
  Loader2,
  X
} from 'lucide-react';
import Exception from './exception';

export interface FileTreeNode {
  name: string;
  path: string;
  hasChildren: boolean;
}

export interface FileTreeNewFolder {
  name: string;
  parentPath: string;
  fullPath: string;
}

interface FileTreeContextValue {
  selectedPath: string | null;
  onSelect: (path: string) => void;
  newFolders: FileTreeNewFolder[];
  onAddFolder: (parentPath: string) => void;
  onRemoveFolder: (fullPath: string) => void;
  fetchChildren: (path: string) => Promise<FileTreeNode[]>;
}

const FileTreeContext = React.createContext<FileTreeContextValue | null>(null);

function useFileTree() {
  const ctx = React.useContext(FileTreeContext);
  if (!ctx) throw new Error('useFileTree must be used within <FileTree>');
  return ctx;
}

interface FileTreeProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'onSelect'
> {
  selectedPath: string | null;
  onSelect: (path: string) => void;
  newFolders: FileTreeNewFolder[];
  onAddFolder: (parentPath: string) => void;
  onRemoveFolder: (fullPath: string) => void;
  /** 异步拉取子节点，path 为空字符串时拉取根节点 */
  fetchChildren: (path: string) => Promise<FileTreeNode[]>;
  nodes: FileTreeNode[];
  loading?: boolean;
  empty?: React.ReactNode;
}

const FileTree = React.forwardRef<HTMLDivElement, FileTreeProps>(
  (
    {
      selectedPath,
      onSelect,
      newFolders,
      onAddFolder,
      onRemoveFolder,
      fetchChildren,
      nodes,
      loading,
      empty,
      className,
      ...props
    },
    ref
  ) => {
    const rootNewFolders = newFolders.filter(f => f.parentPath === '');

    return (
      <FileTreeContext.Provider
        value={{
          selectedPath,
          onSelect,
          newFolders,
          onAddFolder,
          onRemoveFolder,
          fetchChildren
        }}
      >
        <div
          ref={ref}
          className={cn('flex flex-col w-full', className)}
          {...props}
        >
          {loading ? (
            <Exception
              type='loading'
              className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 md:h-36 w-fit'
            />
          ) : nodes.length === 0 && rootNewFolders.length === 0 ? (
            (empty ?? (
              <Exception
                type='empty'
                className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-32 md:h-36 w-fit'
              />
            ))
          ) : (
            <>
              {nodes.map(node => (
                <FileTreeItem
                  key={node.path}
                  node={node}
                  level={0}
                />
              ))}
              {rootNewFolders.map(folder => (
                <FileTreeNewFolderItem
                  key={folder.fullPath}
                  folder={folder}
                  level={0}
                />
              ))}
            </>
          )}
        </div>
      </FileTreeContext.Provider>
    );
  }
);

interface FileTreeItemProps extends React.HTMLAttributes<HTMLDivElement> {
  node: FileTreeNode;
  level: number;
}

const FileTreeItem = React.forwardRef<HTMLDivElement, FileTreeItemProps>(
  ({ node, level, className, ...props }, ref) => {
    const { selectedPath, onSelect, newFolders, onAddFolder, fetchChildren } =
      useFileTree();

    const [expanded, setExpanded] = useState(false);
    const [children, setChildren] = useState<FileTreeNode[] | null>(null);
    const [loading, setLoading] = useState(false);

    const isSelected = selectedPath === node.path;
    const childNewFolders = newFolders.filter(f => f.parentPath === node.path);
    const isFolder = node.hasChildren || childNewFolders.length > 0;

    const handleExpand = async () => {
      if (expanded) {
        setExpanded(false);
        return;
      }
      if (children !== null) {
        setExpanded(true);
        return;
      }
      setLoading(true);
      try {
        const data = await fetchChildren(node.path);
        setChildren(data ?? []);
        setExpanded(true);
      } finally {
        setLoading(false);
      }
    };

    const showChildren = expanded || (!expanded && childNewFolders.length > 0);

    return (
      <div
        ref={ref}
        className={cn('overflow-hidden select-none', className)}
        {...props}
      >
        {/* Row */}
        <div
          className={cn(
            'flex items-center gap-1.5 rounded-md pl-2 pr-1.5 py-1.5 my-0.5 cursor-pointer transition-colors hover:bg-border text-sm group',
            isSelected && 'bg-border'
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={() => {
            if (node.hasChildren) {
              handleExpand();
            } else {
              onSelect(node.path);
            }
          }}
        >
          {/* Chevron / Loader */}
          <span className='flex items-center justify-center size-4 shrink-0'>
            {node.hasChildren &&
              (loading ? (
                <Loader2 className='size-4 animate-spin ' />
              ) : (
                <ChevronRight
                  className={cn(
                    'size-4 transition-transform',
                    expanded && 'rotate-90'
                  )}
                />
              ))}
          </span>

          {/* Icon */}
          {isFolder ? (
            <Folder className='size-4 shrink-0 text-amber-500' />
          ) : (
            <File className='size-4 shrink-0' />
          )}

          {/* Name */}
          <span
            className='truncate min-w-0 flex-1'
            title={node.name}
          >
            {node.name}
          </span>

          {/* Add folder btn */}
          <Button
            variant='outline'
            size='icon'
            className='shrink-0 ml-auto border-transparent bg-transparent size-6 opacity-0 group-hover:opacity-100 transition-opacity'
            onClick={e => {
              e.stopPropagation();
              onAddFolder(node.path);
            }}
            title='新建子目录'
          >
            <FolderPlus className='size-3.5' />
          </Button>
        </div>

        {/* Children */}
        {showChildren && (
          <div>
            {expanded &&
              children?.map(child => (
                <FileTreeItem
                  key={child.path}
                  node={child}
                  level={level + 1}
                />
              ))}
            {childNewFolders.map(folder => (
              <FileTreeNewFolderItem
                key={folder.fullPath}
                folder={folder}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

interface FileTreeNewFolderItemProps extends React.HTMLAttributes<HTMLDivElement> {
  folder: FileTreeNewFolder;
  level: number;
}

const FileTreeNewFolderItem = React.forwardRef<
  HTMLDivElement,
  FileTreeNewFolderItemProps
>(({ folder, level, className, ...props }, ref) => {
  const { selectedPath, onSelect, newFolders, onAddFolder, onRemoveFolder } =
    useFileTree();

  const childNewFolders = newFolders.filter(
    f => f.parentPath === folder.fullPath
  );
  const isSelected = selectedPath === folder.fullPath;

  return (
    <div
      ref={ref}
      className={cn('overflow-hidden select-none', className)}
      {...props}
    >
      {/* Row */}
      <div
        className={cn(
          'flex items-center gap-1.5 rounded-md pl-2 pr-1.5 py-1.5 my-0.5 cursor-pointer transition-colors hover:bg-border text-sm group',
          isSelected && 'bg-border'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => onSelect(folder.fullPath)}
      >
        <span className='flex items-center justify-center size-4 shrink-0' />

        {childNewFolders.length > 0 ? (
          <Folder className='size-4 shrink-0 text-amber-500' />
        ) : (
          <File className='size-4 shrink-0' />
        )}

        <span
          className='truncate min-w-0 flex-1 italic'
          title={folder.name}
        >
          {folder.name}
        </span>

        <Button
          variant='outline'
          size='icon'
          className='shrink-0 ml-auto border-transparent bg-transparent size-6 opacity-0 group-hover:opacity-100 transition-opacity'
          onClick={e => {
            e.stopPropagation();
            onAddFolder(folder.fullPath);
          }}
          title='新建子目录'
        >
          <FolderPlus className='size-3.5' />
        </Button>
        <span className='shrink-0 text-xs text-button-foreground'>新建</span>
        <Button
          variant='outline'
          size='icon'
          className='shrink-0 border-transparent bg-transparent size-6'
          onClick={e => {
            e.stopPropagation();
            onRemoveFolder(folder.fullPath);
          }}
          title='删除'
        >
          <X className='size-4' />
        </Button>
      </div>

      {/* Children */}
      {childNewFolders.length > 0 && (
        <div>
          {childNewFolders.map(child => (
            <FileTreeNewFolderItem
              key={child.fullPath}
              folder={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
});

export { FileTree, FileTreeItem, FileTreeNewFolderItem };
