import React, { useState, useEffect } from 'react';

interface MarqueeImage {
  id: number;
  image_url: string;
}

export default function Marquee() {
  const [images, setImages] = useState<MarqueeImage[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch('/api/marquee');
        const data = await res.json();
        if (Array.isArray(data)) {
          setImages(data);
        } else {
          console.error('Failed to fetch marquee images:', data);
          setImages([]);
        }
      } catch (error) {
        console.error('Error fetching marquee images:', error);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="bg-dark text-white py-4 overflow-hidden whitespace-nowrap border-y border-white/10">
      <div className="flex animate-[marquee_30s_linear_infinite]">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-8 px-4">
            {images.length > 0 ? (
              images.map(img => (
                <React.Fragment key={img.id}>
                  <img src={img.image_url} alt="Brand" className="h-8 object-contain" />
                  <span className="w-2 h-2 bg-primary rounded-full" />
                </React.Fragment>
              ))
            ) : (
              <>
                <span className="text-[12px] font-bold uppercase tracking-[0.2em]">FREE SHIPPING OVER $99</span>
                <span className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-[12px] font-bold uppercase tracking-[0.2em]">ENTHUSIAST OWNED</span>
                <span className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-[12px] font-bold uppercase tracking-[0.2em]">SHIPS FAST</span>
                <span className="w-2 h-2 bg-primary rounded-full" />
                <span className="text-[12px] font-bold uppercase tracking-[0.2em]">OFFICIAL DEALER</span>
                <span className="w-2 h-2 bg-primary rounded-full" />
              </>
            )}
          </div>
        ))}
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
    </div>
  );
}
