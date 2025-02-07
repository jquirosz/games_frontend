'use client';

import {
    useEffect,
    useState
} from "react";
import {useRouter} from 'next/navigation';
import {useAuth} from "react-oidc-context";
import {GameCard} from "../components/GameCard";
import {Header} from "../components/Header";
import {SearchHeader} from "../components/Search";

export interface Game{
    id: number
    image: string
    name: string
    year: string
    min_players: number
    max_players: number
    min_playtime: number
    max_playtime: number
    playing_time: number
    is_expansion: boolean
    loaded: boolean
    owned: boolean
    description: string
    parent_game: []
    expansions: []
}

export default function Home() {
    const base_url = process.env.NEXT_PUBLIC_SERVICE_HOST;
    const auth = useAuth();
  const [cardData, setCardData] = useState<Game[]>([]);

  const [loading, setLoading] = useState(false);
  const [userGames, setUserGames] = useState<number[]>([]);
  const [userGameDetails, setUserGameDetails] = useState<Game[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [expansions_chk, setExpansions_chk] = useState(true);
  const [refreshToggle, setRefreshToggle] = useState(true);
  const [resultCount, setResultCount] = useState(0);

  const router = useRouter();

  const loadGame = (gameId:number) =>{
      fetch(`api/games?gameId=${gameId}`)
          .then((response) => response.json())
          .then((responseData) => {
              cardData.forEach((game: Game) => {
                  if (game.id === gameId) {
                    game.loaded = true;
                    game.image = responseData.image;
                    game.min_players = responseData.min_players;
                    game.max_players = responseData.max_players;
                    game.max_playtime = responseData.max_playtime;
                    game.playing_time = responseData.playing_time;
                    game.is_expansion = responseData.is_expansion;
                    setRefreshToggle(!refreshToggle);
                  }
              })
          }).catch((error) => {
          console.error(error);
      });
  }

  const loadUserGames = () => {
      const sorted: Game[] =userGameDetails.sort((a : Game, b : Game) => {return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);});
      setUserGameDetails(sorted);
      setCardData(sorted);
      setResultCount(userGameDetails.length);
  }

  const addGameToCollection = (gameId: number) => {
        const url =`${base_url}/users/${auth.user?.profile.sub}/games/${gameId}`;
        const headers = new Headers({ 'Content-Type': 'application/json' });

        const bodyData = cardData.find((game: Game) => {return game.id == gameId});
        if(bodyData){
            fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(bodyData),
            })
                .then((response) => response.json())
                .then(() => {
                    userGames.push(gameId);
                    userGameDetails.push(bodyData);
                    setRefreshToggle(!refreshToggle);
                });
        }
    }

    useEffect(() => {
        loadUserGames();
    }, [userGames, loadUserGames]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    if (!isNaN(parseInt(searchTerm))) {
      router.push(`/games/${searchTerm}`);
    } else {
      fetch(`${base_url}/games?name=${searchTerm}`)
        .then((response) => response.json())
        .then((data) => {
            setCardData(data);
            setResultCount(data.length);
            setLoading(false);
        }).catch((fetchError) => {
          setLoading(false);
          console.error(fetchError);
        });
    }
  }

  return (
    <div>
        <header>
            <Header setUserGames={setUserGames} setUserGameDetails={setUserGameDetails} />
            <SearchHeader handleSearch={handleSearch} searchTerm={searchTerm} setSearchTerm={setSearchTerm} expansions_chk={expansions_chk} setExpansions_chk={setExpansions_chk} loadUserGames={loadUserGames}/>
        </header>
        <main className="flex min-h-svh flex-col items-center justify-between p-24">
        {loading && <p>Loading...</p>}
            <p className="font-bold p-2" >Showing {resultCount} results</p>
        {cardData && <div id="card-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {cardData.map((game: Game) => (
            <GameCard key={game.id} showExpansions={expansions_chk} game={game} authenticated={auth.isAuthenticated} owned={userGames.includes(game.id)} addGameToCollection={addGameToCollection} loadGame={loadGame} />
        ))}
    </div>
}
</main>
</div>
)
    ;
}
