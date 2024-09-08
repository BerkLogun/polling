import { supabase } from '../../../utils/supabase-client';
import { NextResponse } from 'next/server';

export async function POST(req) {
  if (req.method === 'POST') {
    try {
      const { title, description, options } = await req.json();

      // Validate input
      if (!title || !description || !options || options.length < 2) {
        return NextResponse.json({ error: 'Title, description, and at least two options are required' }, { status: 400 });
      }

      // Insert poll
      const { data: poll, error: pollError } = await supabase
        .from('polls')
        .insert({ title, description })
        .select('*')
        .single();

      if (pollError) {
        throw new Error(pollError.message);
      }

      // Prepare options for insertion
      const optionsToInsert = options
        .filter(option => option.trim() !== '')
        .map(option => ({ poll_id: poll.id, text: option }));

      // Insert options
      const { error: optionsError } = await supabase
        .from('options')
        .insert(optionsToInsert);

      if (optionsError) {
        throw new Error(optionsError.message);
      }

      // Respond with the created poll
      return NextResponse.json({ poll }, { status: 201 });
    } catch (error) {
      console.error('Error:', error.message);
      return NextResponse.json({ error: 'An error occurred while creating the poll' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: `Method ${req.method} Not Allowed` }, { status: 405 });
  }
}
