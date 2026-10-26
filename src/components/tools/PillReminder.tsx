import React, { useState } from 'react';
import { Bell, Plus, Trash2, CheckCircle2, Clock, Pill } from 'lucide-react';
import { PillReminderItem } from '../../types';
import { storageService } from '../../services/storageService';

export const PillReminder: React.FC = () => {
  const [reminders, setReminders] = useState<PillReminderItem[]>(() =>
    storageService.getReminders()
  );
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('০৮:০০ AM');
  const [frequency, setFrequency] = useState('প্রতিদিন');

  const handleToggle = (id: string) => {
    const updated = reminders.map((r) =>
      r.id === id ? { ...r, isActive: !r.isActive } : r
    );
    setReminders(updated);
    storageService.saveReminders(updated);
  };

  const handleDelete = (id: string) => {
    const updated = reminders.filter((r) => r.id !== id);
    setReminders(updated);
    storageService.saveReminders(updated);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newReminder: PillReminderItem = {
      id: `pill-${Date.now()}`,
      medicineName: name.trim(),
      dosage: dosage.trim() || '১টি ট্যাবলেট',
      time,
      frequency,
      isActive: true,
    };

    const updated = [...reminders, newReminder];
    setReminders(updated);
    storageService.saveReminders(updated);

    setName('');
    setDosage('');
    setShowAddForm(false);
  };

  return (
    <div className="p-4 rounded-3xl bg-[#151d33] border border-[#243257] shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              ওষুধের রিমাইন্ডার ও শিডিউল
            </h3>
            <p className="text-[11px] text-gray-400">
              নিয়মিত ওষুধ খাওয়ার সময়সূচী ট্র্যাকার
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="p-1.5 rounded-xl bg-[#0b1020] border border-[#243257] text-[#61e7f5] hover:bg-[#1a2542] transition-all"
          title="নতুন ওষুধ যোগ করুন"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form
          onSubmit={handleAdd}
          className="p-3 rounded-2xl bg-[#0b1020] border border-[#61e7f5]/30 space-y-2 animate-fade-in text-xs"
        >
          <div className="font-semibold text-white">নতুন ওষুধ যুক্ত করুন:</div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="ওষুধের নাম (যেমন: প্যারাসিটামল ৫০০ মিগ্রা)"
            className="w-full bg-[#151d33] border border-[#243257] rounded-xl px-3 py-1.5 text-white placeholder-gray-500 focus:outline-none focus:border-[#61e7f5]/60"
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              placeholder="ডোজ (যেমন: ১টি ট্যাবলেট)"
              className="bg-[#151d33] border border-[#243257] rounded-xl px-3 py-1.5 text-white placeholder-gray-500 focus:outline-none"
            />
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="সময় (যেমন: ০৮:০০ AM)"
              className="bg-[#151d33] border border-[#243257] rounded-xl px-3 py-1.5 text-white placeholder-gray-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center space-x-2 pt-1">
            <button
              type="submit"
              className="flex-1 py-1.5 bg-[#61e7f5] text-black font-semibold rounded-xl hover:opacity-95"
            >
              সংরক্ষণ করুন
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 bg-[#151d33] text-gray-400 rounded-xl hover:text-white"
            >
              বাতিল
            </button>
          </div>
        </form>
      )}

      {/* List of Reminders */}
      <div className="space-y-2">
        {reminders.length === 0 ? (
          <p className="text-center text-xs text-gray-500 py-4">
            কোনো ওষুধের রিমাইন্ডার যুক্ত নেই। উপরে '+' বাটনে চাপুন।
          </p>
        ) : (
          reminders.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                item.isActive
                  ? 'bg-[#0b1020] border-[#243257]'
                  : 'bg-[#0b1020]/40 border-transparent opacity-60'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <button
                  onClick={() => handleToggle(item.id)}
                  className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-all ${
                    item.isActive
                      ? 'bg-emerald-500 border-emerald-400 text-black'
                      : 'border-gray-600 bg-transparent'
                  }`}
                >
                  {item.isActive && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {item.medicineName}
                  </h4>
                  <div className="flex items-center space-x-2 text-[10px] text-gray-400">
                    <span className="flex items-center space-x-0.5">
                      <Clock className="w-3 h-3 text-[#61e7f5]" />
                      <span>{item.time}</span>
                    </span>
                    <span>• {item.dosage}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 text-gray-500 hover:text-rose-400 transition-colors"
                title="মুছুন"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
