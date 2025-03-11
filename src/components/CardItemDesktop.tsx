import React from 'react';
import { motion } from 'framer-motion';
import { RiDeleteBinLine } from 'react-icons/ri';
import { CiEdit } from 'react-icons/ci';
import { ImageType } from '../Context/context';

interface CardItemDesktopProps {
  item: ImageType;
  getImageSrc: (item: ImageType) => string;
  isAuthenticated: boolean;
  user: any;
  actionLoading: string | null;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onImageClick: (src: string) => void;
}

const CardItemDesktop: React.FC<CardItemDesktopProps> = React.memo(
  ({
    item,
    getImageSrc,
    isAuthenticated,
    user,
    actionLoading,
    onDelete,
    onEdit,
    onImageClick,
  }) => (
    <motion.div
      key={item._id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className="relative bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="w-full h-64">
        <img
          src={getImageSrc(item)}
          alt={item.Name}
          className="w-full h-full object-contain cursor-pointer"
          onClick={() => onImageClick(getImageSrc(item))}
        />
      </div>
      <div className="p-4">
        <p className="text-center font-semibold truncate">{item.Name}</p>
      </div>
      {isAuthenticated && user?.role === 'admin' && (
        <>
          <button
            onClick={() => onDelete(item._id)}
            className={`absolute top-2 right-10 bg-red-500 text-white p-1 rounded-full ${
              actionLoading === item._id ? 'animate-spin' : ''
            }`}
            disabled={actionLoading === item._id}
          >
            {actionLoading === item._id ? '...' : <RiDeleteBinLine />}
          </button>
          <button
            onClick={() => onEdit(item._id)}
            className="absolute top-2 right-2 bg-blue-500 text-white p-1 rounded-full"
          >
            <CiEdit />
          </button>
        </>
      )}
    </motion.div>
  )
);

export default CardItemDesktop;
