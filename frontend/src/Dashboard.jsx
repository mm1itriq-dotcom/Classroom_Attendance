export default function Dashboard({ checkins, alerts, wsStatus, wsIcon }) {
  return (
    <div className="p-8 h-full flex flex-col">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 leading-tight">Live Attendance Monitor</h2>
          <p className="text-base text-slate-500 mt-1">Real-time student behavior feed</p>
        </div>
        <div className={`px-4 py-2 rounded-full text-sm font-bold flex items-center ${wsStatus === 'Live' ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-rose-100 text-rose-700 border border-rose-300'}`}>
          <span className="material-symbols-outlined mr-2 text-base">{wsIcon}</span> {wsStatus}
        </div>
      </header>
      
      <div className="flex flex-1 gap-8 min-h-0">
        <div className="flex-1 flex flex-col bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-slate-800 mb-4 border-b border-slate-200 pb-3 flex items-center">
            <span className="material-symbols-outlined mr-2">badge</span> Live Check-ins
          </h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {checkins.map((sub, i) => (
              <div key={i} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center transition-all">
                <div>
                  <p className="text-sm text-slate-500">Room: <span className="text-slate-800">{sub.room}</span></p>
                  <p className="text-sm text-slate-500">Student: <span className="text-slate-800 font-medium">{sub.student_name}</span></p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono text-indigo-600">{new Date(sub.timestamp).toLocaleTimeString()}</span>
                  <p className={`text-xs font-bold uppercase tracking-wider ${sub.badge_status === 'OK' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    Badge: {sub.badge_status}
                  </p>
                </div>
              </div>
            ))}
            {checkins.length === 0 && <p className="text-slate-400 text-center mt-8 text-base">Waiting for check-ins...</p>}
          </div>
        </div>

        <div className="w-96 flex flex-col bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
           <h3 className="text-xl font-semibold text-amber-600 mb-4 border-b border-slate-200 pb-3 flex items-center">
             <span className="material-symbols-outlined mr-2 animate-pulse text-2xl">warning</span> Behavior Alerts
           </h3>
           <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {alerts.map((alert, i) => (
              <div key={i} className={`p-4 rounded-xl border shadow-sm ${alert.risk_score >= 90 ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${alert.risk_score >= 90 ? 'bg-rose-200 text-rose-800' : 'bg-amber-200 text-amber-800'}`}>
                    {alert.rule_triggered}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">Risk: {alert.risk_score}</span>
                </div>
                <p className="text-sm text-slate-700 mb-2">{alert.description}</p>
                <p className="text-xs text-slate-500 font-mono">Student: {alert.student_name}</p>
              </div>
            ))}
            {alerts.length === 0 && <p className="text-slate-400 text-center mt-8 text-base">No alerts yet. Campus clear.</p>}
           </div>
        </div>
      </div>
    </div>
  );
}
