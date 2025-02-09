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
    status: number
}

export default function Home() {
  const base_url = process.env.NEXT_PUBLIC_SERVICE_HOST;
  const auth = useAuth();

  const [cardData, setCardData] = useState<Game[]>([]);
  const [displayGames, setDisplayGames] = useState<Game[]>([]);
  const [userGameDetails, setUserGameDetails] = useState<Game[]>([]);

  const [loading, setLoading] = useState(false);
  const [userGames, setUserGames] = useState<number[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [expansions_chk, setExpansions_chk] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(-1);
  const [selectedPlayerCount, setSelectedPlayerCount] = useState(-1);
  const [selectedLetter, setSelectedLetter] = useState(-1);
  const [refreshToggle, setRefreshToggle] = useState(true);


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
                    game.status = -1
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
      showResults(userGameDetails);
  }

  const addGameToCollection = (gameId: number) => {
    const bodyData = cardData.find((game: Game) => {return game.id == gameId});
    if(bodyData){
        fetch(`api/collection?gameId=${gameId}&userId=${auth.user?.profile.sub}`,{
            method: 'POST',
            body: JSON.stringify(bodyData)
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
        showResults(displayGames);
    }, [selectedStatus, selectedPlayerCount, expansions_chk, selectedLetter]);

    useEffect(() => {
        loadUserGames();
    }, [userGames]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    if (!isNaN(parseInt(searchTerm))) {
      router.push(`/games/${searchTerm}`);
    } else {
      fetch(`${base_url}/games?name=${searchTerm}`)
        .then((response) => response.json())
        .then((data) => {
            showResults(data);
            setLoading(false);
        }).catch((fetchError) => {
          setLoading(false);
          console.error(fetchError);
        });
    }
  }

  const showResults = (games: Game[]) => {
    setDisplayGames(games);
    let filteredGames: Game[] = games;
    if (!expansions_chk) {
        filteredGames = filteredGames.filter((game: Game) => !game.is_expansion);
    }
    if (selectedStatus != -1) {
        filteredGames = filteredGames.filter((game: Game) => game.status === selectedStatus);
    }
    if (selectedPlayerCount != -1) {
        filteredGames = filteredGames.filter((game: Game) => selectedPlayerCount>=game.min_players && selectedPlayerCount<=game.max_players);
    }
    if (selectedLetter != -1) {
        const letter = String.fromCharCode(65+selectedLetter);
        console.log(letter);
        filteredGames = filteredGames.filter((game: Game) => game.name.toUpperCase().startsWith(letter));
    }

    setCardData(filteredGames);
  }

  return (
    <div>
        <header>
            <Header setUserGames={setUserGames} setUserGameDetails={setUserGameDetails} />
            <SearchHeader handleSearch={handleSearch} searchTerm={searchTerm} setSearchTerm={setSearchTerm} expansions_chk={expansions_chk} setExpansions_chk={setExpansions_chk}
                          loadUserGames={loadUserGames} selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}
                          selectedPlayerCount={selectedPlayerCount} setSelectedPlayerCount={setSelectedPlayerCount}
                          selectedLetter={selectedLetter} setSelectedLetter={setSelectedLetter} />
        </header>
        <main className="flex min-h-svh flex-col items-center justify-between p-24 pt-0">
        {loading && <p>Loading...</p>}
            <p className="font-bold p-2" >Showing {cardData.length} of {displayGames.length} results</p>
        {cardData && <div id="card-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {cardData.map((game: Game) => (
            <GameCard key={game.id} showExpansions={expansions_chk} game={game} authenticated={auth.isAuthenticated} owned={userGames.includes(game.id)} addGameToCollection={addGameToCollection} loadGame={loadGame} />
        ))}
    </div>
}
</main>
        <footer>
            <img src="https://cf.geekdo-images.com/HZy35cmzmmyV9BarSuk6ug__thumb/img/gbE7sulIurZE_Tx8EQJXnZSKI6w=/fit-in/200x150/filters:strip_icc()/pic7779581.png" className="w-48 m-auto rounded-2xl bg-white" />
        </footer>
</div>
)
    ;
}
