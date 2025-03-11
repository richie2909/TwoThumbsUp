import React from 'react';
import { ImageType } from '../Context/context';
import { RiDeleteBinLine } from 'react-icons/ri';
import { CiEdit } from 'react-icons/ci';

interface CardItemMobileProps {
  item: ImageType;
  getImageSrc: (item: ImageType) => string;
  isAuthenticated: boolean;
  user: any;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onImageClick: (src: string) => void;
}

const CardItemMobile: React.FC<CardItemMobileProps> = React.memo(
  ({ item, getImageSrc, isAuthenticated, user, onDelete, onEdit, onImageClick }) => {
    const imageSrc = getImageSrc(item);

    return (
      <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-full h-64">
          <img
            src={imageSrc}
            alt={item.Name}
            className="w-full h-full object-contain cursor-pointer"
            onClick={() => onImageClick(imageSrc)}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent px-4 py-2">
          <div className="flex justify-between items-center">
            <p className="text-white font-bold truncate">{item.Name}</p>
            {isAuthenticated && user?.role === 'admin' && (
              <div className="flex space-x-2">
                <button
                  onClick={() => onDelete(item._id)}
                  className="bg-red-500 p-2 rounded-full"
                >
                  <RiDeleteBinLine className="text-white" />
                </button>
                <button
                  onClick={() => onEdit(item._id)}
                  className="bg-blue-500 p-2 rounded-full"
                >
                  <CiEdit className="text-white" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default CardItemMobile;
