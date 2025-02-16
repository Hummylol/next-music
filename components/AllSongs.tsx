'use client';

import { useEffect, useState } from "react";
import { getUploadedSongs } from "@/utils/uploadMusic";
import MusicPlayer from "@/components/MusicPlayer";

export default function AllSongs() {
  const [songs, setSongs] = useState<string[]>([]);
  const [selectedSong, setSelectedSong] = useState<string | null>(null);

  useEffect(() => {
    const fetchSongs = async () => {
      const fetchedSongs = await getUploadedSongs();
      setSongs(fetchedSongs);
    };

    fetchSongs();
  }, []);

  return (
    <div className="w-full h-[50%] max-w-lg p-6 bg-[#131313] text-white rounded-xl shadow-lg space-y-4">
      <h2 className="text-lg font-semibold">Uploaded Songs</h2>
      {songs.length === 0 ? (
        <p className="text-white">No songs uploaded yet.</p>
      ) : (
        <ul className="space-y-2">
          {songs.map((song, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 bg-[#333333] rounded-md cursor-pointer hover:bg-[#444444]"
              onClick={() => setSelectedSong(song)}
            >
              <span className="truncate w-3/4">{decodeURIComponent(song.split("/").pop() || "")}</span>
            </li>
          ))}
        </ul>
      )}

      {selectedSong && <MusicPlayer songUrl={selectedSong}/>}
    </div>
  );
}
