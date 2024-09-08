"use client";
import { useEffect, useState } from 'react'
import { supabase } from '../utils/supabase-client'
import Link from 'next/link'
import { ArrowRight, Star, TrendingUp } from 'lucide-react'

type Poll = {
  id: string
  title: string
  description: string
  image?: string
}

export default function Home() {
  const [polls, setPolls] = useState<Poll[]>([])
  const [featuredPoll, setFeaturedPoll] = useState<Poll | null>(null)

  useEffect(() => {
    fetchPopularPolls()
    fetchFeaturedPoll()
  }, [])

  async function fetchPopularPolls() {
    const { data, error } = await supabase
      .from('polls')
      .select('*, vote_count:vote_records(count)')
      .order('vote_count', { ascending: false })
      .limit(3)
    
    if (error) {
      console.log('Error fetching popular polls:', error)
    } else {
      setPolls(data)
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
      setFeaturedPoll(data)
    } else {
      console.log('No featured poll found.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-indigo-900 mb-12">
          Welcome to PollMaster
        </h1>
        
        <div className="flex justify-center mb-12">
          <Link href="/create-poll" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
            Create New Poll
            <ArrowRight className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
          </Link>
        </div>
  
        {featuredPoll && (
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-800 flex items-center justify-center">
              <Star className="mr-2 text-yellow-400" />
              Featured Poll
            </h2>
            <Link href={`/poll/${featuredPoll.id}`} className="block">
              <div className="bg-white overflow-hidden shadow-xl rounded-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{featuredPoll.title}</h3>
                  <p className="text-gray-600 mb-4">{featuredPoll.description}</p>
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    Featured
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-800 flex items-center justify-center">
            <TrendingUp className="mr-2 text-indigo-600" />
            Popular Polls
          </h2>
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {polls.map((poll, index) => (
            <Link href={`/poll/${poll.id}`} key={poll.id} className="block">
              <div className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-gray-900">{poll.title}</h3>
                  <p className="text-gray-600 mb-4">{poll.description}</p>
                  <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                    #{index + 1} Popular
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}