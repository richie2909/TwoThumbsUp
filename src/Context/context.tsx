// ImageContext.tsx
import React, { createContext, useState, ReactNode, Dispatch, SetStateAction } from 'react';

interface SerializedBuffer {
    type: 'Buffer';
    data: number[];
}

export type ImageType = { // Export ImageType for use in other components
    _id: string;
    Name: string;
    ImageData: SerializedBuffer;
    ContentType: string;
};

interface ImageContextType {
    photo: ImageType[] | null;
    setPhoto: Dispatch<SetStateAction<ImageType[] | null>>;
}

export const ImageContext = createContext<ImageContextType>({
    photo: null,
    setPhoto: () => {},
});

interface ImageProviderProps {
    children: ReactNode;
}

export const ImageProvider: React.FC<ImageProviderProps> = ({ children }) => {
    const [photo, setPhoto] = useState<ImageType[] | null>(null);

    return (
        <ImageContext.Provider value={{ photo, setPhoto }}>
            {children}
        </ImageContext.Provider>
    );
};