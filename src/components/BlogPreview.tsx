import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  author: string;
  created_at: string;
}

export default function BlogPreview() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/blogs');
        const data = await res.json();
        if (Array.isArray(data)) {
          setPosts(data.slice(0, 3)); // Show only latest 3
        } else {
          console.error('Failed to fetch blog posts:', data);
          setPosts([]);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };
    fetchPosts();
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-primary text-[12px] font-black uppercase tracking-[0.3em] mb-4 block">Marco Talk</span>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">Latest From The Blog</h2>
          </div>
          <Link to="/blogs/news" className="group flex items-center gap-3 font-black uppercase tracking-widest text-sm hover:text-primary transition-colors">
            View All Posts <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
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
      </div>
    </section>
  );
}
