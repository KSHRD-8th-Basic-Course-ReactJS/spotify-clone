import { ChevronDownIcon } from "@heroicons/react/outline";
import { shuffle } from "lodash";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";

const colors = [
    'from-indigo-500',
    'from-purple-500',
    'from-pink-500',
    'from-red-500',
    'from-orange-500',
    'from-yellow-500',
    'from-green-500',
    'from-teal-500',
    'from-blue-500',
]

function Center() {
    const { data: session } = useSession();
    const [color, setColor] = useState("from-indigo-500");
    const playlistId = useRecoilValue(playlistIdState)
    const [playlist, setPlaylist] = useRecoilState(playlistState);
    const spotifyApi = useSpotify();

    useEffect(() => {
        setColor(shuffle(colors).pop());
    }, [playlistId])

    useEffect(() => {
        if (spotifyApi.getAccessToken()) {
            spotifyApi
                .getPlaylist(playlistId)
                .then((response) => {
                    setPlaylist(response.body);
                })
                .catch(err => console.log(err));
        }
    }, [spotifyApi, playlistId])

    return (
        <div className="text-white flex-grow h-screen overflow-y-scroll scrollbar-hide">
            <header className="absolute top-5 right-8">
                <div className="flex items-center bg-black space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2">
                    <img className="rounded-full w-10 h-10" src={session?.user.image} alt='Avatar' />
                    <h2>{session?.user.name}</h2>
                    <ChevronDownIcon className="h-5 w-5" />
                </div>
            </header>
            <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8 w-full`}>
                <img
                    className="w-44 h-44 shadow-2xl"
                    src={playlist?.images?.[0]?.url}
                    alt="Playlist Image" />
                <div>
                    <p>PLAYLIST</p>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{playlist?.name}</h1>
                </div>
            </section>
            {playlistId ? <Songs /> : <div className="flex-grow h-full">Select Playlist First.</div>}
        </div>
    )
}

export default Center;