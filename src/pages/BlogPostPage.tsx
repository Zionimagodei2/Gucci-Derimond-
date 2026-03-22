import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, ChevronRight, ArrowLeft } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  created_at: string;
}

export default function BlogPostPage() {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blogs/${id}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Post Not Found</h1>
        <p className="text-muted mb-8">The blog post you are looking for does not exist.</p>
        <Link to="/blogs/news" className="btn-primary px-8">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-24">
      <div className="bg-border/10 py-4">
        <div className="container-custom flex items-center gap-2 text-[12px] uppercase font-bold tracking-widest text-muted">
          <Link to="/" className="hover:text-dark">Home</Link>
          <ChevronRight size={12} />
          <Link to="/blogs/news" className="hover:text-dark">Blog</Link>
          <ChevronRight size={12} />
          <span className="text-dark line-clamp-1">{post.title}</span>
        </div>
      </div>

      <article className="container-custom pt-12">
        <div className="max-w-3xl mx-auto">
          <Link to="/blogs/news" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted hover:text-primary transition-colors mb-8">
            <ArrowLeft size={14} /> Back to all posts
          </Link>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted mb-12 border-b border-border pb-8">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-primary" />
              {new Date(post.created_at).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <User size={14} className="text-primary" />
              {post.author}
            </div>
          </div>
        </div>

        {post.image && (
          <div className="max-w-5xl mx-auto mb-16 aspect-video overflow-hidden rounded-xl">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-full object-cover"
              
            />
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
            <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
          </div>
        </div>
      </article>
    </div>
  );
}
