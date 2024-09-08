"use client";
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '../../../utils/supabase-client'

type Option = {
  id: string;
  text: string;
  votes: number;
}

type Poll = {
  id: string
  title: string
  description: string
  image?: string
  vote_count: number
}

export default function PollDetail() {
  const [poll, setPoll] = useState<Poll | null>(null)
  const [options, setOptions] = useState<Option[]>([])
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [voteMessage, setVoteMessage] = useState('')
  const [isVoting, setIsVoting] = useState(false)
  const { id } = useParams()

  useEffect(() => {
    if (id) {
        getPollData(id);
    }
  }, [id])

//   async function fetchPollAndOptions() {
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
    const getPollData = async (id) => {
        try {

            const res = await fetch(`/api/get-poll/${id}`);
            const data = await res.json();
            setOptions(data.options);
            setPoll(data.poll);

        } catch (error) {
        console.error('Error fetching poll:', error)
        return
        }
    }

  const handleVote = async () => {
    if (!selectedOption || isVoting) return

    setIsVoting(true)
    setVoteMessage('')

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pollId: id,
          optionId: selectedOption,
          vote_count: poll?.vote_count || 0, // Ensure vote_count is provided
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setVoteMessage(data.message)
        // fetchPollAndOptions() // Refresh the poll data
        getPollData(id);
      } else {
        setVoteMessage(data.message)
      }
    } catch (error) {
      console.error('Error voting:', error)
      setVoteMessage('An error occurred while voting. Please try again.')
    } finally {
      setIsVoting(false)
    }
  }

  if (!poll) return <div>Loading...</div>

  // Calculate total votes and percentages for options
  const totalVotes = poll.vote_count
  const optionsWithPercentage = options.map(option => ({
    ...option,
    percentage: totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0,
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{poll.title}</h1>
      <p className="text-gray-600 mb-6">{poll.description}</p>
      <p className="text-lg font-semibold mb-4">Total Votes: {totalVotes}</p>

      <div className="mb-6">
        {optionsWithPercentage.map(option => (
          <div key={option.id} className="mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="poll-option"
                value={option.id}
                checked={selectedOption === option.id}
                onChange={() => setSelectedOption(option.id)}
                className="mr-2"
              />
              <span className="flex-1">{option.text}</span>
              <span className="ml-2 text-gray-500">({option.votes} votes)</span>
            </label>
            <div className="relative w-full mt-2">
              <div
                className="absolute inset-0 bg-gray-200 rounded"
                style={{ height: '8px' }}
              ></div>
              <div
                className="absolute inset-0 bg-blue-500 rounded"
                style={{ width: `${option.percentage}%`, height: '8px' }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={handleVote}
        disabled={!selectedOption || isVoting}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {isVoting ? 'Voting...' : 'Vote'}
      </button>

      {voteMessage && (
        <p className={`mt-4 text-sm font-medium ${
          voteMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'
        }`}>
          {voteMessage}
        </p>
      )}
    </div>
  )
}
