import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, ChevronRight } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  created_at: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/blogs');
        const data = await res.json();
        if (Array.isArray(data)) {
          setPosts(data);
        } else {
          console.error('Failed to fetch blog posts:', data);
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="bg-border/10 py-4">
        <div className="container-custom flex items-center gap-2 text-[12px] uppercase font-bold tracking-widest text-muted">
          <Link to="/" className="hover:text-dark">Home</Link>
          <ChevronRight size={12} />
          <span className="text-dark">Marco Talk Blog</span>
        </div>
      </div>

      <div className="container-custom pt-16">
        <div className="max-w-4xl mx-auto mb-16">
          <span className="text-primary text-[12px] font-black uppercase tracking-[0.3em] mb-4 block">Marco Talk</span>
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            Latest News & Builds
          </h1>
        </div>

        {posts.length === 0 ? (
          <div className="py-20 text-center border border-border rounded-xl bg-border/5">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">No Posts Yet</h2>
            <p className="text-muted font-medium">Check back soon for the latest updates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post) => (
              <article key={post.id} className="group">
                <Link to={`/blogs/news/${post.id}`} className="block relative aspect-[16/10] overflow-hidden mb-6">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                </Link>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-crossed">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="text-primary" />
                      {new Date(post.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={12} className="text-primary" />
                      {post.author}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-black uppercase tracking-tight group-hover:text-primary transition-colors leading-tight">
                    <Link to={`/blogs/news/${post.id}`}>{post.title}</Link>
                  </h3>
                  
                  <p className="text-sm text-crossed leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <Link to={`/blogs/news/${post.id}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:gap-4 transition-all">
                    Read More <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
