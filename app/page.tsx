import AllSongs from '@/components/AllSongs'
import MusicPlayer from '@/components/MusicPlayer'
import UploadSong from '@/components/UploadSong'
import React from 'react'

const page = () => {
  return (
    <>
      <div className='flex flex-col md:flex-row h-screen justify-center items-center gap-2 bg-[#000000]'>
        <AllSongs />
        <UploadSong />
      </div>
    </>
  )
}

export default page