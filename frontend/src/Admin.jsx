import { useState, useEffect } from 'react';
import ToastNotification from './components/ToastNotification';

export default function Admin() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ first_name: '', last_name: '', student_number: '' });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/students/')
      .then(r => r.json())
      .then(data => setStudents(data))
      .catch(err => console.error(err));
  }, []);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:8000/students/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const newStudent = await res.json();
        setStudents([...students, newStudent]);
        setFormData({ first_name: '', last_name: '', student_number: '' });
        showNotification('success', 'Student successfully added!');
      } else {
        showNotification('error', "Failed to add student (ID might exist)");
      }
    } catch (error) {
      showNotification('error', "Network Error: Is backend running?");
    }
  };

  return (
    <div className="p-8 h-full relative overflow-y-auto">
      <ToastNotification notification={notification} />
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900">Class Roster Setup</h2>
        <p className="text-base text-slate-500 mt-1">Register student badge IDs</p>
      </header>

      <div className="flex gap-8">
        <div className="w-1/3 bg-white border border-slate-200 shadow-sm rounded-2xl p-6 h-fit">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Add Student</h3>
          <form onSubmit={handleAddStudent} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-500 mb-1">First Name</label>
              <input required type="text" className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-800"
                value={formData.first_name} onChange={e => setFormData({...formData, first_name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-slate-500 mb-1">Last Name</label>
              <input required type="text" className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-800"
                value={formData.last_name} onChange={e => setFormData({...formData, last_name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-slate-500 mb-1">Student Badge ID</label>
              <input required type="text" className="w-full bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-slate-800 font-mono"
                value={formData.student_number} onChange={e => setFormData({...formData, student_number: e.target.value})} />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded-lg font-semibold mt-4">Register Student</button>
          </form>
        </div>

        <div className="flex-1 bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden h-fit">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Name</th>
                <th className="px-6 py-4 font-semibold">Badge ID</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-800 font-medium">{s.first_name} {s.last_name}</td>
                  <td className="px-6 py-4 font-mono">{s.student_number}</td>
                </tr>
              ))}
              {students.length === 0 && <tr><td colSpan="2" className="px-6 py-8 text-center text-slate-400">No students registered yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
