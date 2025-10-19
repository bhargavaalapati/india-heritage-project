import React, { useEffect, useState } from "react";
// Make sure your service file exports all these functions
import { getPhotos, addPhoto, toggleLike, addComment, deletePhoto, deleteComment, addReply } from "../services/communityService";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FaHeart, FaRegHeart, FaCommentAlt, FaTrash, FaPaperPlane, FaSpinner, FaCamera, FaReply } from "react-icons/fa";
import { useAuth } from "../context/useAuth";

const PostSkeleton = () => ( <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg border border-slate-100 animate-pulse"><div className="flex items-center mb-4"><div className="w-10 h-10 bg-slate-200 rounded-full mr-3"></div><div className="flex-1"><div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div><div className="h-3 bg-slate-200 rounded w-1/3"></div></div></div><div className="w-full h-80 bg-slate-200 rounded-lg mb-4"></div><div className="h-4 bg-slate-200 rounded w-1/2"></div></div>);

export default function Community() {
    const { user, token } = useAuth();
    const [posts, setPosts] = useState([]);
    const [url, setUrl] = useState("");
    const [description, setDescription] = useState("");
    const [commentInputs, setCommentInputs] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeCommentBox, setActiveCommentBox] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null); // format: { postId, commentId }
    const [replyInput, setReplyInput] = useState("");

    const updatePostInState = (updatedPost) => {
        setPosts(prev => prev.map(p => p._id === updatedPost._id ? updatedPost : p));
    };

    useEffect(() => { loadPosts(); }, []);

    async function loadPosts() { try { const data = await getPhotos(); setPosts(data); } catch { toast.error("Failed to load posts."); } finally { setIsLoading(false); } }
    async function handleSubmit(e) { e.preventDefault(); if (!url.trim()) return toast.error("Image URL is required."); setIsSubmitting(true); try { const newPost = await addPhoto({ url, description }, token); setPosts(prev => [newPost, ...prev]); setUrl(""); setDescription(""); toast.success("Post shared! 🎉"); } catch (error) { toast.error(error.message); } finally { setIsSubmitting(false); } }
    async function handleLike(postId) { setPosts(prev => prev.map(p => p._id === postId ? { ...p, likedBy: p.likedBy.includes(user._id) ? p.likedBy.filter(id => id !== user._id) : [...p.likedBy, user._id], likes: p.likedBy.includes(user._id) ? p.likes - 1 : p.likes + 1 } : p)); try { await toggleLike(postId, token); } catch{ toast.error("Like failed. Reverting."); loadPosts(); } }
    async function handleComment(postId) { const text = commentInputs[postId]?.trim(); if (!text) return; try { const updatedPost = await addComment(postId, text, token); updatePostInState(updatedPost); setCommentInputs(prev => ({ ...prev, [postId]: "" })); toast.success("Comment added!"); } catch (error) { toast.error(error.message); } }
    async function handleDeletePost(postId) { if (!window.confirm("Are you sure you want to delete this post?")) return; try { await deletePhoto(postId, token); setPosts(prev => prev.filter(p => p._id !== postId)); toast.success("Post deleted."); } catch (error) { toast.error(error.message); } }
    async function handleDeleteComment(postId, commentId) { try { const updatedPost = await deleteComment(postId, commentId, token); updatePostInState(updatedPost); toast.success("Comment deleted."); } catch (error) { toast.error(error.message); } }
    async function handleAddReply(postId, commentId) { const text = replyInput.trim(); if (!text) return; try { const updatedPost = await addReply(postId, commentId, text, token); updatePostInState(updatedPost); setReplyingTo(null); setReplyInput(""); } catch (error) { toast.error(error.message); } }

    return (
        <motion.div className="max-w-3xl mx-auto px-4 sm:px-6 py-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <header className="text-center mb-12"><h1 className="text-5xl font-extrabold text-slate-800 tracking-tight">Community Feed</h1><p className="text-lg text-slate-500 mt-4">Share and discover our vibrant heritage.</p></header>
            <motion.form onSubmit={handleSubmit} className="mb-12 p-6 bg-white rounded-2xl shadow-lg border border-slate-100 flex flex-col gap-4" layout><h2 className="text-xl font-bold text-slate-700 flex items-center gap-2"><FaCamera /> Share a Photo</h2><input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Image URL..." className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500" required /><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add a description..." rows="3" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500" /><button type="submit" disabled={isSubmitting} className="w-full bg-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 flex items-center justify-center disabled:bg-slate-400">{isSubmitting ? <FaSpinner className="animate-spin" /> : "Share Post"}</button></motion.form>
            <div className="space-y-8">
                {isLoading ? (<><PostSkeleton /><PostSkeleton /></>) : 
                 posts.length === 0 ? (<div className="text-center py-10 px-4 bg-white rounded-2xl shadow-lg"><h3 className="text-2xl font-bold text-slate-700">No posts yet!</h3><p className="text-slate-500 mt-2">Be the first to share something.</p></div>) : 
                 (<AnimatePresence>{posts.map(post => (
                    <motion.div key={post._id} className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-100" layout>
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-tr from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xl">{post.author?.username?.[0]?.toUpperCase() || '?'}</div><div><p className="font-bold text-slate-800">{post.author?.username || 'Anonymous'}</p><p className="text-xs text-slate-400">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p></div></div>
                            {user && post.author?._id === user._id && (<button onClick={() => handleDeletePost(post._id)} className="text-slate-400 hover:text-red-500 p-2 rounded-full transition-colors"><FaTrash /></button>)}
                        </div>
                        {post.description && <p className="text-slate-700 mb-4 whitespace-pre-wrap">{post.description}</p>}
                        <img src={post.url} alt={post.description || "Community post"} className="w-full max-h-[70vh] object-cover rounded-lg mb-4 border" />
                        <div className="flex items-center gap-5 py-2">
                            <motion.button onClick={() => handleLike(post._id)} className={`flex items-center gap-2 ${post.likedBy.includes(user?._id) ? "text-pink-500" : "text-slate-500 hover:text-pink-500"}`} whileTap={{ scale: 1.2 }}>
                                {post.likedBy.includes(user?._id) ? <FaHeart size={20} /> : <FaRegHeart size={20} />}
                                <span className="text-sm font-medium">{post.likes}</span>
                            </motion.button>
                            <button onClick={() => setActiveCommentBox(prev => prev === post._id ? null : post._id)} className="flex items-center gap-2 text-slate-500 hover:text-blue-500"><FaCommentAlt size={18} /><span className="text-sm font-medium">{post.comments?.length || 0}</span></button>
                        </div>
                        <AnimatePresence>{activeCommentBox === post._id && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                                <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
                                    {post.comments?.map(comment => (
                                    <div key={comment._id}>
                                        <div className="text-sm flex items-start gap-2">
                                            <div className="w-6 h-6 mt-1 bg-slate-200 rounded-full shrink-0 flex items-center justify-center text-slate-500 font-bold text-xs">{comment.author?.username?.[0]?.toUpperCase()}</div>
                                            <div className="bg-slate-100 p-2 rounded-lg w-full"><div className="flex justify-between items-center"><p className="text-slate-800"><span className="font-bold">{comment.author?.username}:</span> {comment.text}</p>{(user?._id === comment.author?._id || user?._id === post.author?._id) && (<button onClick={() => handleDeleteComment(post._id, comment._id)} className="text-slate-400 hover:text-red-500 text-xs p-1 shrink-0 ml-2"><FaTrash /></button>)}</div></div>
                                        </div>
                                        <div className="ml-8 mt-2 space-y-2">
                                            {comment.replies?.map(reply => (
                                                <div key={reply._id} className="text-sm flex items-start gap-2"><div className="w-5 h-5 mt-1 bg-white border rounded-full shrink-0 flex items-center justify-center text-slate-400 font-bold text-[10px]">{reply.author?.username?.[0]?.toUpperCase()}</div><div className="bg-white border p-2 rounded-lg w-full"><p><span className="font-bold">{reply.author.username}:</span> {reply.text}</p></div></div>
                                            ))}
                                            <button onClick={() => { setReplyingTo({ postId: post._id, commentId: comment._id }); setReplyInput(""); }} className="text-xs font-semibold text-slate-500 hover:underline flex items-center gap-1"><FaReply size={10}/> Reply</button>
                                        </div>
                                        <AnimatePresence>{replyingTo?.commentId === comment._id && (
                                            <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="ml-8 mt-2 flex gap-2" onSubmit={(e) => { e.preventDefault(); handleAddReply(post._id, comment._id); }}>
                                                <input value={replyInput} onChange={e => setReplyInput(e.target.value)} autoFocus type="text" placeholder={`Reply to ${comment.author.username}...`} className="flex-1 p-1.5 border rounded-lg text-sm focus:ring-1 focus:ring-orange-500" />
                                                <button type="submit" className="px-3 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600">Send</button>
                                            </motion.form>
                                        )}</AnimatePresence>
                                    </div>
                                    ))}
                                    <form className="flex pt-2 gap-2" onSubmit={(e) => { e.preventDefault(); handleComment(post._id); }}>
                                        <input type="text" value={commentInputs[post._id] || ''} onChange={e => setCommentInputs(prev => ({ ...prev, [post._id]: e.target.value }))} placeholder="Add a comment..." className="flex-1 p-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500" />
                                        <button type="submit" className="px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600"><FaPaperPlane /></button>
                                    </form>
                                </div>
                            </motion.div>
                        )}</AnimatePresence>
                    </motion.div>
                 ))}</AnimatePresence>)}
            </div>
        </motion.div>
    );
}