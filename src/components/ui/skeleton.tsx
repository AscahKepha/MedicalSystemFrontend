// src/components/ui/skeleton.tsx
import React from 'react';
import classNames from 'classnames';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={classNames(
        'animate-pulse rounded-md bg-gray-300 dark:bg-gray-700',
        className
      )}
    />
  );
};

export default Skeleton;
