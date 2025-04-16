import React, {
    useState,
    useEffect,
    useContext,
    ChangeEvent,
    FormEvent,
    useCallback,
    useMemo,
  } from 'react';
  import { ImageContext, ImageType } from '../Context/context';
  import { GoUpload } from 'react-icons/go';
  import { FaCircleNotch } from 'react-icons/fa';
  import { useAuth } from '../Context/AuthContext';
  import { useNavigate } from 'react-router-dom';
  import { IoMdClose } from 'react-icons/io';
  
  interface ApiResponse {
    img: ImageType[];
  }
  
  // Predefined categories for tags
  const SUGGESTED_TAGS = ['Inspirational', 'Motivational', 'Wisdom', 'Love', 'Success', 'Happiness', 'Life'];
  
  const Upload: React.FC = () => {
    const { setPhoto } = useContext(ImageContext);
    const [name, setName] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    
    // Tags functionality
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState<string>('');
  
    const fetchData = useCallback(async () => {
      try {
        const photos = await fetch('/img');
        if (!photos.ok) throw new Error(`HTTP error! status: ${photos.status}`);
        const json: ApiResponse = await photos.json();
        json?.img ? setPhoto(json.img) : setError('Failed to fetch image data.');
      } catch (err) {
        setError('Failed to fetch image data.');
      }
    }, [setPhoto]);
  
    useEffect(() => {
      if (!isAuthenticated || user?.role !== 'admin') navigate('/');
      else fetchData();
    }, [isAuthenticated, user, navigate, fetchData]);
  
    const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      setImageFile(e.target.files?.[0] || null);
    }, []);
  
    // Tag handling functions
    const addTag = useCallback(() => {
      if (tagInput.trim() && !tags.includes(tagInput.trim())) {
        setTags(prev => [...prev, tagInput.trim()]);
        setTagInput('');
      }
    }, [tagInput, tags]);
  
    const handleTagInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        addTag();
      }
    }, [addTag]);
  
    const removeTag = useCallback((tagToRemove: string) => {
      setTags(prev => prev.filter(tag => tag !== tagToRemove));
    }, []);
  
    const selectSuggestedTag = useCallback((tag: string) => {
      if (!tags.includes(tag)) {
        setTags(prev => [...prev, tag]);
      }
    }, [tags]);
  
    const handleSubmit = useCallback(async (e: FormEvent) => {
      e.preventDefault();
      if (!imageFile) return setError('No image file selected.');
      
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('Image', imageFile);
      
      // Add tags to formData
      if (tags.length > 0) {
        formData.append('tags', JSON.stringify(tags));
      }

      try {
        const response = await fetch('/img', { method: 'POST', body: formData });
        if (!response.ok) throw new Error(await response.text());
        
        setSuccess('Image uploaded successfully!');
        await fetchData();
        setName('');
        setImageFile(null);
        setTags([]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setLoading(false);
      }
    }, [imageFile, name, tags, fetchData]);
  
    const formContent = useMemo(
      () => (
        <div className="w-full max-w-2xl px-4 md:px-0">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
            Upload Image
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            {error && (
              <div className="p-3 bg-red-50 rounded-lg">
                <p className="text-red-500 text-center text-sm">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-green-500 text-center text-sm">{success}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Image Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder="Enter image name"
              />
            </div>
  
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Select Image
              </label>
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center gap-2 w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors"
              >
                <GoUpload className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {imageFile ? imageFile.name : 'Click to upload file'}
                </span>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            </div>
            
            {/* Tags Section */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Tags (Categories)
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map(tag => (
                  <div key={tag} className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-indigo-500 hover:text-indigo-700"
                    >
                      <IoMdClose size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInputKeyDown}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add a tag and press Enter"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-2">Suggested tags:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED_TAGS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => selectSuggestedTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        tags.includes(tag)
                          ? 'bg-indigo-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
  
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaCircleNotch className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <GoUpload />
                  Upload Image
                </>
              )}
            </button>
          </form>
        </div>
      ),
      [error, success, name, loading, handleSubmit, handleFileChange, imageFile, tags, tagInput, addTag, removeTag, handleTagInputKeyDown, selectSuggestedTag]
    );
  
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-6 md:p-8 transition-all">
          {formContent}
        </div>
      </div>
    );
  };
  
  export default React.memo(Upload);