"use client";
import { useState } from 'react'
import { supabase } from '../../utils/supabase-client'
import { useRouter } from 'next/navigation'

export default function CreatePoll() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [options, setOptions] = useState(['', ''])
  const router = useRouter();

  const handleOptionChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  };
  
  const addOption = () => {
    setOptions([...options, ''])
  }

  const removeOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index)
    setOptions(newOptions)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const { data: poll, error: pollError } = await supabase
      .from('polls')
      .insert({ title, description })
      .select('*')
      .single()

    if (pollError) {
      console.error('Error creating poll:', pollError)
      return
    }

    const optionsToInsert = options
      .filter(option => option.trim() !== '')
      .map(option => ({ poll_id: poll.id, text: option }))

    const { error: optionsError } = await supabase
      .from('options')
      .insert(optionsToInsert)

    if (optionsError) {
      console.error('Error creating options:', optionsError)
      return
    }

    router.push(`/poll/${poll.id}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Poll</h1>
      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded text-black"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block mb-2">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border rounded text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Options:</label>
          {options.map((option, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
                className="flex-grow px-3 py-2 border rounded-l text-black"
              />
              <button
                type="button"
                onClick={() => removeOption(index)}
                className="bg-red-500 text-white px-4 py-2 rounded-r"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addOption}
            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
          >
            Add Option
          </button>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Create Poll
        </button>
      </form>
    </div>
  )


}