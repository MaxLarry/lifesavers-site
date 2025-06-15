// pages/api/book.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/src/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, date, time } = req.body;

  // Optional: Check if slot already exists
  const { count } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true })
    .eq('date', date)
    .eq('time', time);

  if (count && count >= 1) {
    return res.status(400).json({ message: 'Slot already taken.' });
  }

  const { data, error } = await supabase.from('bookings').insert([
    { name, email, date, time },
  ]);

  if (error) return res.status(500).json({ error: error.message });

  res.status(200).json({ message: 'Booking successful!', data });
}
