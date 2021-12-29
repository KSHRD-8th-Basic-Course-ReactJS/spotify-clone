import { useRecoilValue } from "recoil";
import { playlistState } from "../atoms/playlistAtom";
import Song from "./Song";

function Songs() {
    const playlist = useRecoilValue(playlistState);
    return (
        <div className="px-8 flex flex-col space-y-1 pb-28 text-white">
            {playlist?.tracks.items.map((item, index) => (
                <Song key={index} order={index} track={item} />
            ))}
        </div>
    )
}
export default Songs;