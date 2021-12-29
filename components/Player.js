import { FastForwardIcon, PauseIcon, PlayIcon, ReplyIcon, RewindIcon, SwitchHorizontalIcon, VolumeUpIcon, VolumeOffIcon } from "@heroicons/react/outline";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify";

function Player() {
    const spotifyApi = useSpotify();
    const { data: session, status } = useSession();
    const [currentTrackId, setCurrentTrackId] = useRecoilState(currentTrackIdState);
    const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const songInfo = useSongInfo();

    const [volume, setVolume] = useState(50);

    const fetchCurrentSong = () => {
        if (!songInfo) {
            spotifyApi.getMyCurrentPlayingTrack().then(res => {
                setCurrentTrackId(res.body?.item?.id);
                spotifyApi.getMyCurrentPlaybackState().then(res => {
                    setIsPlaying(res.body?.is_playing);
                });
            });
        }
    }

    const handlePlayPause = () => {
        spotifyApi.getMyCurrentPlaybackState().then(data => {
            if (data.body.is_playing) {
                spotifyApi.pause()
                setIsPlaying(false)
            } else {
                spotifyApi.play()
                setIsPlaying(true)
            }
        });
    }

    const debouncedAdjustVolume = useCallback(
        debounce(volume => {
            spotifyApi.setVolume(volume).catch(err => console.error(err));
        }, 500)
    )

    useEffect(() => {
        if (volume >= 0 && volume <= 100) {
            debouncedAdjustVolume(volume);
        }
    }, [volume])

    useEffect(() => {
        if (spotifyApi.getAccessToken() && !currentTrackId) {
            fetchCurrentSong()
        }
    }, [currentTrackIdState, spotifyApi, session])

    return (
        <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            <div className="flex items-center space-x-4">
                <div>
                    <img
                        className="hidden md:inline h-10 w-10"
                        src={songInfo?.album.images?.[0]?.url}
                    />
                </div>
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>
            <div className="flex items-center justify-evenly">
                <SwitchHorizontalIcon className="button" />
                <RewindIcon className="button" />
                {isPlaying ? (
                    <PauseIcon onClick={handlePlayPause} className="h-10 w-10" />
                ) : (<PlayIcon onClick={handlePlayPause} className="h-10 w-10" />
                )}
                <FastForwardIcon className="button" />
                <ReplyIcon className="button" />
            </div>

            <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
                <VolumeOffIcon className="button" onClick={() => setVolume(0)} />
                <input className="range range-secondary" type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(e.target.value)} />
                <VolumeUpIcon className="button" onClick={() => setVolume(100)} />
            </div>
        </div>
    )
}

export default Player;