import {Navbar} from "@/components/navbar.tsx";
import Musics from "@/components/UI/Musics.tsx";


function HomePage() {
    return(
        <div>

            <div className={"flex h-auto flex-col mt-17 items-center justify-center min-h-screen"}>
                <Musics></Musics>
            </div>
        </div>
    )
}

export default HomePage;