export const metadata = {
  title: 'Sign In - WEI IN SIGHT CMS',
};

export default function AdminLoginPage() {
  // In a real implementation, this would handle Supabase Auth
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-widest text-pink-500">WEI IN SIGHT</h1>
          <p className="text-sm text-white/40 tracking-widest uppercase mt-2">Control Room Access</p>
        </div>

        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/50 ml-1">Email</label>
            <input 
              type="email" 
              placeholder="jackyho@weiinsight.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-widest text-white/50 ml-1">Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all"
            />
          </div>

          <button 
            type="button"
            className="w-full bg-pink-500 text-white rounded-xl py-3 font-medium tracking-wide hover:bg-pink-400 transition-colors shadow-[0_0_20px_rgba(255,105,180,0.3)] hover:shadow-[0_0_30px_rgba(255,105,180,0.5)]"
          >
            Authenticate
          </button>
        </form>
      </div>
    </div>
  );
}
