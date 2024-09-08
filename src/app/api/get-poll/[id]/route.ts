import { NextResponse } from 'next/server'
import { supabase } from '../../../../utils/supabase-client'

// async function fetchPollAndOptions() {
//     const { data: pollData, error: pollError } = await supabase
//       .from('polls')
//       .select('*')
//       .eq('id', id)
//       .single()

//     if (pollError) {
//       console.error('Error fetching poll:', pollError)
//       return
//     }

//     setPoll(pollData)

//     const { data: optionsData, error: optionsError } = await supabase
//       .from('options')
//       .select('*')
//       .eq('poll_id', id)
//       .order('votes', { ascending: false })

//     if (optionsError) {
//       console.error('Error fetching options:', optionsError)
//       return
//     }

//     setOptions(optionsData)
//   }

const getVotes = async (id) => {
     const { data: optionsData, error: optionsError } = await supabase
      .from('options')
      .select('*')
      .eq('poll_id', id)
      .order('votes', { ascending: false })

    if (optionsError) {
      console.error('Error fetching options:', optionsError)
      return
    }

  return optionsData;
}

const getPoll = async (id) => {
    const { data: pollData, error: pollError } = await supabase
      .from('polls')
      .select('*')
      .eq('id', id)
      .single()

    if (pollError) {
      console.error('Error fetching poll:', pollError)
      return
    }

  return pollData;
}

export async function GET(req, { params }) {
  const { id } = params;
  console.log('id:', id);

  try {
    const poll = await getPoll(id);
    const options = await getVotes(id);

    return NextResponse.json({ poll, options }, { status: 200 });
  }
    catch (error) {
        console.error('Error:', error.message);
        return NextResponse.json({ error: 'An error occurred while fetching the poll' }, { status: 500 });
    }
}