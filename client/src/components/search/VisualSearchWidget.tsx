import React, { useState, useRef } from 'react';
import { trpc } from '../../lib/trpc';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2, Camera, Upload, X, Search, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface VisualSearchWidgetProps {
  onResults?: (results: any[]) => void;
}

export const VisualSearchWidget: React.FC<VisualSearchWidgetProps> = ({
  onResults,
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [textQuery, setTextQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const searchByTextMutation = trpc.visualSearch.searchByText.useMutation();
  const searchByImageMutation = trpc.visualSearch.searchByImage.useMutation();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setSelectedImage(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImageSearch = async () => {
    if (!selectedImage) {
      toast.error('Please select an image first');
      return;
    }

    setIsSearching(true);

    try {
      // For demo purposes, we'll use the preview URL
      // In production, upload to server first
      const result = await searchByImageMutation.mutateAsync({
        imageUrl: imagePreview!,
        limit: 12,
      });

      setSearchResults(result.results);
      
      if (onResults) {
        onResults(result.results);
      }

      toast.success(`Found ${result.results.length} similar products in ${result.queryTime}ms`);
    } catch (error) {
      toast.error('Image search failed. Please try again.');
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleTextSearch = async () => {
    if (!textQuery.trim()) {
      toast.error('Please enter a search query');
      return;
    }

    setIsSearching(true);

    try {
      const result = await searchByTextMutation.mutateAsync({
        query: textQuery,
        limit: 12,
      });

      setSearchResults(result.results);
      
      if (onResults) {
        onResults(result.results);
      }

      toast.success(`Found ${result.results.length} matching products`);
    } catch (error) {
      toast.error('Text search failed. Please try again.');
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const clearResults = () => {
    setSearchResults([]);
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            AI Visual Search
          </CardTitle>
          <CardDescription>
            Upload an image or describe what you're looking for
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Image Upload Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Search by Image</label>
            
            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition-colors"
              >
                <Camera className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm text-muted-foreground mb-2">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP up to 5MB
                </p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Selected"
                  className="w-full h-64 object-contain rounded-lg border"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={clearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            {selectedImage && (
              <Button
                onClick={handleImageSearch}
                disabled={isSearching}
                className="w-full"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Find Similar Products
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or
              </span>
            </div>
          </div>

          {/* Text Search Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Search by Description</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={textQuery}
                onChange={(e) => setTextQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTextSearch()}
                placeholder="e.g., vintage blue denim jacket"
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <Button
                onClick={handleTextSearch}
                disabled={isSearching || !textQuery.trim()}
              >
                {isSearching ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Describe the item you're looking for in natural language
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Search Results</CardTitle>
                <CardDescription>
                  Found {searchResults.length} visually similar products
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={clearResults}>
                Clear
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.map((result) => (
                <div
                  key={result.productId}
                  className="group relative border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                >
                  {result.product?.images && (
                    <img
                      src={JSON.parse(result.product.images)[0]}
                      alt={result.product.name}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-3">
                    <h4 className="font-medium text-sm truncate">
                      {result.product?.name}
                    </h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-semibold">
                        ₹{result.product?.price}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {(result.similarity * 100).toFixed(0)}% match
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* How It Works */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="text-blue-700 dark:text-blue-300 text-base">
            How Visual Search Works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-blue-700 dark:text-blue-300">
            <div className="flex gap-2">
              <span className="font-bold">1.</span>
              <span>Upload a photo or describe what you're looking for</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold">2.</span>
              <span>AI analyzes visual features and style</span>
            </div>
            <div className="flex gap-2">
              <span className="font-bold">3.</span>
              <span>Get instantly matched with similar products</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
