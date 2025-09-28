import Musics from "@/components/UI/Musics.tsx";
import { useSearchParams } from "react-router-dom";

function HomePage() {
    const [searchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    return(
        <div className="mt-20 w-full h-full flex justify-center items-center">
            <Musics searchQuery={searchQuery} />
        </div>
    )
}

export default HomePage;