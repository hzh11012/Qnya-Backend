import { cn } from '@/lib/utils';
import Loading from '@/components/custom/loading';
import { PhotoProvider, PhotoView } from 'react-photo-view';

interface DataTablePhotoViewProps {
  label: string;
  photos?: string[];
  className?: string;
}

const DataTablePhotoView: React.FC<DataTablePhotoViewProps> = ({
  label,
  photos,
  className
}) => {
  if (!photos || !photos.length) return label;

  return (
    <PhotoProvider
      speed={() => 150}
      easing={() => 'cubic-bezier(0.4, 0, 0.2, 1)'}
      loadingElement={<Loading />}
    >
      <PhotoView src={photos[0]}>
        <span className={cn('cursor-pointer', className)}>{label}</span>
      </PhotoView>
      {photos.slice(1).map((photo, index) => (
        <PhotoView
          key={index}
          src={photo}
        >
          {undefined}
        </PhotoView>
      ))}
    </PhotoProvider>
  );
};

export { DataTablePhotoView };
