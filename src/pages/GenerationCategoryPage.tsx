import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { generations } from '../components/ShopByGeneration';

interface Category {
  name: string;
  link: string;
  image: string;
}

export default function GenerationCategoryPage() {
  const { slug } = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const currentGeneration = generations.find(g => g.link === `/generation/${slug}`);
  const title = currentGeneration ? currentGeneration.name : (slug ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Categories');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`/api/generations/${slug}/categories?t=` + Date.now());
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Breadcrumb */}
      <div className="bg-border/10 py-4">
        <div className="container-custom flex items-center justify-between">
          <div className="flex items-center gap-2 text-[12px] uppercase font-bold tracking-widest text-muted">
            <Link to="/" className="hover:text-dark">Home</Link>
            <ChevronRight size={12} />
            <span className="text-dark">{title}</span>
          </div>
          <button onClick={() => window.history.back()} className="text-[12px] uppercase font-bold tracking-widest text-muted hover:text-dark flex items-center gap-1">
            <ChevronLeft size={16} /> Back
          </button>
        </div>
      </div>

      {/* Generation Banner */}
      {currentGeneration && (
        <div className="relative h-[30vh] min-h-[300px] max-h-[400px] w-full overflow-hidden flex items-center justify-center">
          <img 
            src={currentGeneration.image} 
            alt={currentGeneration.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-t ${currentGeneration.color} to-transparent opacity-80`} />
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative z-10 text-center text-white p-6">
            <span className="text-sm md:text-base font-black uppercase tracking-[0.4em] mb-4 block opacity-90">
              {currentGeneration.years}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase drop-shadow-lg">
              {currentGeneration.name}
            </h1>
          </div>
        </div>
      )}

      <div className="container-custom pt-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">Shop By Category</h2>
          <div className="w-24 h-1 bg-primary mx-auto mt-6" />
        </div>

        {categories.length === 0 ? (
          <div className="py-20 text-center border border-border rounded-xl bg-border/5">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">No Categories Found</h2>
            <p className="text-muted font-medium">We couldn't find any categories for this generation.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link 
                key={index} 
                to={category.link}
                className="group relative overflow-hidden bg-border/10 aspect-square flex flex-col items-center justify-center p-4 hover:bg-border/20 transition-colors"
              >
                <div className="w-3/4 h-3/4 relative mb-4">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-center font-bold uppercase tracking-widest text-sm md:text-base group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
