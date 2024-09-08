import { NextResponse } from 'next/server'
import { supabase } from '../../../utils/supabase-client'



async function fetchPopularPolls() {
    const { data, error } = await supabase
      .from('polls')
      .select('*, vote_count:vote_records(count)')
      .order('vote_count', { ascending: false })
      .limit(4)
    
    if (error) {
      console.log('Error fetching popular polls:', error)
    } else {
      return data
    }
  }

  async function fetchFeaturedPoll() {
    const { data, error } = await supabase
      .from('polls')
      .select('*')
      .eq('featured', true)
      .limit(1)
      .single()
  
    if (error) {
      console.log('Error fetching featured poll:', error)
    } else if (data) {
        return data
    } else {
      console.log('No featured poll found.')
    }
  }

export async function GET(req, { params }) {
    try {
        const popularPolls = await fetchPopularPolls();
        const featuredPoll = await fetchFeaturedPoll();

        return NextResponse.json({ popularPolls, featuredPoll }, { status: 200 });
    } catch (error) {
        console.error('Error:', error.message);
        return NextResponse.json({ error: 'An error occurred while fetching the polls' }, { status: 500 });
    }

    
}