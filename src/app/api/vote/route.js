import { supabase } from '../../../utils/supabase-client'

export async function POST(req) {
  const { pollId, optionId, vote_count } = await req.json(); // Parse JSON body from the request
  const ip = req.headers.get('x-forwarded-for') || req.ip;

  console.log('Voting on poll:', pollId, 'with option:', optionId, 'from IP:', ip);

  try {
    const { data, error } = await supabase.rpc('vote_with_cooldown', {
      p_poll_id: pollId,
      p_option_id: optionId,
      p_ip_address: ip,
      p_cooldown_hours: 5
    });

  

    if (error) throw error;

    if (data) {
      const { data: pollData, error: pollError } = await supabase
        .from('polls')
        .update({ vote_count: vote_count + 1 }) // Increment by 1
        .eq('id', pollId)
        .single();
      return new Response(JSON.stringify({ message: 'Vote recorded successfully' }), {
        status: 200,
      });
    } else {
      return new Response(JSON.stringify({ message: 'You can only vote once every 5 hours on this poll' }), {
        status: 429,
      });
    }
  } catch (error) {
    console.error('Error voting:', error);
    return new Response(JSON.stringify({ message: 'An error occurred while voting' }), {
      status: 500,
    });
  }
}
