import React, { createContext, useState, Dispatch, SetStateAction } from 'react';

interface SerializedBuffer {
    type: 'Buffer';
    data: number[];
}

export interface ImageType {
    _id: string;
    Name: string;
    ImageData: SerializedBuffer;
    ContentType: string;
}

interface ImageContextType {
    photo: ImageType[] | null;
    setPhoto: Dispatch<SetStateAction<ImageType[] | null>>;
}

export const ImageContext = createContext<ImageContextType>({
    photo: null,
    setPhoto: () => {},
});

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [photo, setPhoto] = useState<ImageType[] | null>(null);

    return (
        <ImageContext.Provider value={{ photo, setPhoto }}>
            {children}
        </ImageContext.Provider>
    );
};