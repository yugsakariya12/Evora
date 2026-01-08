"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UnsplashImagePicker({ isOpen, onClose, onSelect }) {
  const [query, setQuery] = useState("event");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- Fetch Images ---------------- */

  const searchImages = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          searchQuery
        )}&per_page=30&client_id=${
          process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
        }`
      );
      const data = await response.json();
      setImages(data.results || []);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      searchImages("event");
    }
  }, [isOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    searchImages(query);
  };

  /* ---------------- UI ---------------- */

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-6xl h-[85vh] flex flex-col">
        {/* Header */}
        <DialogHeader>
          <DialogTitle>Choose Cover Image</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for images..."
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </Button>
        </form>

        {/* IMAGE GRID */}
        <div className="flex-1 overflow-y-auto pr-2">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
          ) : images.length > 0 ? (
            <div
              className="
                grid 
                grid-cols-2 
                sm:grid-cols-3 
                md:grid-cols-4 
                lg:grid-cols-5 
                gap-4
              "
            >
              {images.map((image) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => onSelect(image.urls.regular)}
                  className="relative aspect-square rounded-lg overflow-hidden border hover:border-purple-500 transition"
                >
                  <Image
                    src={image.urls.small}
                    alt={image.description || "Unsplash image"}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-16">
              No images found. Try another search.
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-xs text-muted-foreground mt-3">
          Photos from{" "}
          <a
            href="https://unsplash.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Unsplash
          </a>
        </p>
      </DialogContent>
    </Dialog>
  );
}
