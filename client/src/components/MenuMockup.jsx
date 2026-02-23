import React from 'react';

const MenuMockup = () => {
  return (
    <div className="relative mx-auto border-zinc-900 bg-zinc-900 border-[12px] rounded-[3rem] h-[640px] w-[320px] shadow-2xl overflow-hidden font-sans">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-zinc-900 rounded-b-3xl z-30"></div>
      
      <div className="bg-white h-full w-full overflow-y-auto overflow-x-hidden flex flex-col">
        {/* Header */}
        <div className="pt-10 pb-4 px-6 border-b border-zinc-50">
           <div className="flex items-center gap-2 justify-center">
              <span className="text-2xl">🍣</span>
              <h1 className="text-lg font-black text-zinc-900">Sushi House</h1>
           </div>
           <div className="flex gap-2 justify-center mt-4 overflow-x-auto no-scrollbar py-2">
              {['הכל', 'ראשונות', 'סושי פרימיום', 'שתייה'].map((cat, i) => (
                <span key={i} className={`text-[10px] whitespace-nowrap px-4 py-1.5 rounded-full font-bold transition-all ${i === 2 ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                  {cat}
                </span>
              ))}
           </div>
        </div>

        {/* Hero Product */}
        <div className="p-6">
           <div className="relative rounded-3xl overflow-hidden shadow-lg h-44 mb-6">
              <img 
                src="https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&q=80&w=800" 
                alt="Gourmet Sushi Platter" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white" dir="rtl">
                 <h2 className="text-sm font-bold">קומבינציית שף פרימיום</h2>
                 <p className="text-[10px] opacity-80">חשיבה יצירתית בכל ביס</p>
              </div>
           </div>

           {/* Dishes List */}
           <div className="space-y-6" dir="rtl">
              <div>
                 <h3 className="text-xs font-black text-zinc-400 mb-4 tracking-widest uppercase">סושי פרימיום</h3>
                 <div className="space-y-4">
                    <div className="flex gap-4 items-center">
                       <div className="w-16 h-16 rounded-2xl bg-zinc-100 overflow-hidden flex-shrink-0">
                          <img 
                            src="https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?auto=format&fit=crop&q=80&w=400" 
                            alt="Gourmet Roll" 
                            className="w-full h-full object-cover"
                          />
                       </div>
                       <div className="flex-1">
                          <div className="flex justify-between items-start">
                             <h4 className="text-xs font-bold text-zinc-900">רול כמהין ופטריות</h4>
                             <span className="text-xs font-black text-emerald-600">₪68</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 leading-tight mt-1 ml-4">אבוקדו, פטריות שיטאקי במרינדה, איולי כמהין ושבבי בטטה</p>
                          <div className="flex gap-1 mt-2">
                             <span className="text-[10px]">✨</span>
                             <span className="text-[10px]">🥬</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex gap-4 items-center">
                       <div className="w-16 h-16 rounded-2xl bg-zinc-100 overflow-hidden flex-shrink-0">
                          <img 
                            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=400" 
                            alt="Tartare" 
                            className="w-full h-full object-cover"
                          />
                       </div>
                       <div className="flex-1">
                          <div className="flex justify-between items-start">
                             <h4 className="text-xs font-bold text-zinc-900">טרטר דג לבן בקרם יוזו</h4>
                             <span className="text-xs font-black text-emerald-600">₪72</span>
                          </div>
                          <p className="text-[10px] text-zinc-400 leading-tight mt-1 ml-4">קוביות דג ים, בצל סגול, עירית, וקרם יוזו לימוני על מצע פריך</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Footer CTAs */}
        <div className="mt-auto p-6 bg-zinc-50 border-t border-zinc-100">
           <div className="bg-white p-4 rounded-2xl shadow-sm border border-zinc-100 flex flex-col items-center">
              <p className="text-[10px] font-bold text-zinc-400 mb-2 underline tracking-widest uppercase">סרוק אותי</p>
              <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center text-white text-xl shadow-lg">🤳</div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default MenuMockup;
