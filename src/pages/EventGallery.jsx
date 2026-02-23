import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Image as ImageIcon, Calendar,
  Maximize2, X, ArrowUpRight
} from 'lucide-react';

const EventGallery = () => {
  // Sample Data
  const eventData = [
    {
      id: 1,
      title: "BASF Innovation Day 2024",
      category: "basf",
      type: "image",
      url: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&auto=format&fit=crop",
      description: "Annual innovation showcase with industry partners.",
      date: "2024-10-15",
    },
    {
      id: 2,
      title: "BASF Sustainability Conference",
      category: "basf",
      type: "video",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      thumbnail: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&auto=format&fit=crop",
      description: "Discussions on green chemistry initiatives.",
      date: "2024-09-22"
    },
    {
      id: 3,
      title: "Sunshine School Science Fair",
      category: "shine-school",
      type: "image",
      url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop",
      description: "Student projects showcasing scientific innovations.",
      date: "2024-11-05",
    },
    {
      id: 4,
      title: "Sunshine School Annual Day",
      category: "shine-school",
      type: "video",
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop",
      description: "Cultural performances and awards ceremony.",
      date: "2024-12-10"
    },
    {
      id: 5,
      title: "BASF Tech Symposium",
      category: "basf",
      type: "image",
      url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&auto=format&fit=crop",
      description: "Technical presentations on new materials.",
      date: "2024-08-30"
    },
    {
      id: 6,
      title: "Sunshine School Sports Meet",
      category: "shine-school",
      type: "image",
      url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop",
      description: "Annual inter-house sports competition.",
      date: "2024-10-28"
    },
    {
      id: 7,
      title: "BASF Community Outreach",
      category: "basf",
      type: "image",
      url: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format&fit=crop",
      description: "Volunteer activities and community development.",
      date: "2024-11-18"
    },
    {
      id: 8,
      title: "Sunshine School Art Exhibition",
      category: "shine-school",
      type: "image",
      url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&auto=format&fit=crop",
      description: "Student artwork showcase featuring paintings.",
      date: "2024-09-14"
    }
  ];

  const categories = [
    { id: "all", name: "All Moments" },
    { id: "basf", name: "BASF" },
    { id: "shine-school", name: "Sunshine School" }
  ];

  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredEvents, setFilteredEvents] = useState(eventData);
  const [heroItem, setHeroItem] = useState(eventData[0]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const filtered = activeCategory === 'all' 
        ? eventData 
        : eventData.filter(e => e.category === activeCategory);
    setFilteredEvents(filtered);
    setHeroItem(filtered[0] || null);
  }, [activeCategory]);

  const handleCardClick = (item) => {
      setSelectedItem(item);
      setModalOpen(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black pt-24 pb-20">
        
        {/* --- 1. Hero Section (Cinematic Preview) --- */}
        <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden mx-auto max-w-[95%] rounded-[2.5rem]">
            <AnimatePresence mode='wait'>
                <motion.div 
                    key={heroItem?.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    {/* Background Image/Video */}
                    {heroItem?.type === 'video' ? (
                        <div className="w-full h-full relative">
                             <img src={heroItem.thumbnail} alt={heroItem.title} className="w-full h-full object-cover opacity-60" />
                             <div className="absolute inset-0 flex items-center justify-center">
                                <button 
                                    onClick={() => handleCardClick(heroItem)}
                                    className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center group hover:scale-110 transition-transform cursor-pointer"
                                >
                                    <Play className="w-8 h-8 text-white fill-white" />
                                </button>
                             </div>
                        </div>
                    ) : (
                        <img src={heroItem?.url} alt={heroItem?.title} className="w-full h-full object-cover opacity-60" />
                    )}
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                </motion.div>
            </AnimatePresence>

            {/* Hero Content */}
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-10 flex flex-col items-start max-w-4xl">
                <motion.div
                    key={heroItem?.id + "-text"}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest bg-white/10 backdrop-blur-md">
                            {heroItem?.category}
                        </span>
                        <span className="text-white/70 text-sm flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {heroItem && formatDate(heroItem.date)}
                        </span>
                    </div>
                    
                    <h1 className="text-3xl md:text-6xl font-black leading-tight mb-4">
                        {heroItem?.title}
                    </h1>
                    
                    <p className="text-base md:text-lg text-white/70 line-clamp-2 max-w-2xl mb-8">
                        {heroItem?.description}
                    </p>

                    <button 
                        onClick={() => handleCardClick(heroItem)}
                        className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2 cursor-pointer"
                    >
                        {heroItem?.type === 'video' ? <Play className="w-4 h-4 fill-black" /> : <Maximize2 className="w-4 h-4" />}
                        Open Media
                    </button>
                </motion.div>
            </div>
        </section>

        {/* --- 2. Filter Bar --- */}
        <section className="px-4 md:px-12 py-10 flex flex-col items-center justify-center gap-6">
            <div className="flex gap-2 p-1 bg-white/10 rounded-full backdrop-blur-sm">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`
                            px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all cursor-pointer
                            ${activeCategory === cat.id 
                                ? 'bg-white text-black shadow-lg' 
                                : 'text-white/60 hover:text-white'}
                        `}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>
        </section>

        {/* --- 3. Uniform Grid Gallery --- */}
        <section className="px-4 md:px-12 pb-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredEvents.map((item) => (
                    <motion.div
                        key={item.id}
                        layoutId={`card-${item.id}`}
                        onClick={() => handleCardClick(item)}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`
                            group relative rounded-2xl overflow-hidden cursor-pointer bg-neutral-900 border border-white/5 aspect-[3/4]
                            ${heroItem?.id === item.id ? 'ring-2 ring-white/50' : ''}
                        `}
                    >
                        {/* Image */}
                        <img 
                            src={item.type === 'video' ? item.thumbnail : item.url} 
                            alt={item.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                        />
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                        
                        {/* Type Icon */}
                        <div className="absolute top-3 right-3 bg-black/40 p-2 rounded-full backdrop-blur-md border border-white/10">
                            {item.type === 'video' ? <Play className="w-3 h-3 text-white" /> : <ImageIcon className="w-3 h-3 text-white" />}
                        </div>

                        {/* Hover Overlay Icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                             <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                <ArrowUpRight className="w-6 h-6 text-white" />
                             </div>
                        </div>

                        {/* Text Content */}
                        <div className="absolute bottom-0 left-0 p-5 w-full transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <span className="text-[10px] font-bold text-white/50 uppercase tracking-wider mb-1 block">
                                {formatDate(item.date)}
                            </span>
                            <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 mb-1 group-hover:text-blue-300 transition-colors">
                                {item.title}
                            </h3>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>

        {/* --- Fullscreen Detail Popup --- */}
        <AnimatePresence>
            {modalOpen && selectedItem && (
                <motion.div 
                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }} 
                    animate={{ opacity: 1, backdropFilter: "blur(20px)" }} 
                    exit={{ opacity: 0, backdropFilter: "blur(0px)" }} 
                    className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 md:p-8 cursor-pointer"
                    onClick={() => setModalOpen(false)} // Close on overlay click
                >
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()} // Prevent close on content click
                        className="w-full max-w-5xl bg-[#111] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh] cursor-default"
                    >
                        
                        {/* Media Section */}
                        <div className="md:w-2/3 bg-black relative flex items-center justify-center p-4 md:p-0">
                             {selectedItem.type === 'video' ? (
                                <video 
                                    src={selectedItem.url} 
                                    controls 
                                    autoPlay 
                                    className="w-full h-full max-h-[60vh] md:max-h-full object-contain" 
                                />
                            ) : (
                                <img 
                                    src={selectedItem.url} 
                                    alt={selectedItem.title} 
                                    className="w-full h-full max-h-[60vh] md:max-h-full object-contain" 
                                />
                            )}
                            
                            {/* Close Button (Mobile overlay) */}
                            <button 
                                onClick={() => setModalOpen(false)} 
                                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white md:hidden z-10 cursor-pointer"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Details Section */}
                        <div className="md:w-1/3 p-8 flex flex-col relative bg-[#111]">
                            {/* Close Button (Desktop) */}
                            <button 
                                onClick={() => setModalOpen(false)} 
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-white transition-colors hidden md:block cursor-pointer"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="mt-4 md:mt-12">
                                <span className="inline-block px-3 py-1 rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest text-blue-400 mb-4">
                                    {selectedItem.category}
                                </span>
                                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 leading-tight">
                                    {selectedItem.title}
                                </h2>
                                
                                <div className="flex items-center gap-2 text-white/50 text-sm mb-6 pb-6 border-b border-white/10">
                                    <Calendar className="w-4 h-4" />
                                    {formatDate(selectedItem.date)}
                                </div>

                                <p className="text-white/70 text-base leading-relaxed">
                                    {selectedItem.description}
                                </p>
                            </div>
                        </div>

                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>

    </div>
  );
};

export default EventGallery;