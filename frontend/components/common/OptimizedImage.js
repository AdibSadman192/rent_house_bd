import Image from 'next/image';
import { Box } from '@mui/material';

const OptimizedImage = ({ src, alt, width, height, layout, objectFit, ...props }) => {
  // For external URLs that don't support optimization
  if (src?.startsWith('http') || src?.startsWith('https')) {
    return (
      <Box component="img" 
        src={src} 
        alt={alt}
        width={width}
        height={height}
        sx={{
          objectFit: objectFit || 'cover',
          ...props.sx
        }}
        {...props}
      />
    );
  }

  // For local images that can be optimized
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      layout={layout}
      objectFit={objectFit}
      {...props}
    />
  );
};

export default OptimizedImage;
