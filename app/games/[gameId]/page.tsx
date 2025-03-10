'use client';

import { useParams } from 'next/navigation'
import {useState} from "react";
import Link from "next/link";
import {Header} from "../../../components/Header";
import {useAuth} from "react-oidc-context";
import {Game} from "../../page";
import {LinearSelector} from "../../../components/LinearSelector";


export default function GameDetailsPage() {
    const base_url = process.env.NEXT_PUBLIC_SERVICE_HOST;

    const auth = useAuth();
  const params = useParams<{ gameId: string; }>();
  const [data, setData] = useState<Game|null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
    const [refreshToggle, setRefreshToggle] = useState(true);

  const [userGames, setUserGames] = useState<number[]>([]);

    const updateGameStatus = (status: number) => {
        const bodyData = data;
        fetch(`../api/gameStatus?gameId=${data?.id}&userId=${auth.user?.profile.sub}&status=${status}`, {
            method: 'POST',
            body: JSON.stringify(bodyData)
        })
            .then((response) => response.json())
            .then(() => {
                if (data !== null) {
                    data.status = status;
                    setRefreshToggle(!refreshToggle);
                }
            });
    }

    const addGameToCollection = (gameId: number) => {
        const bodyData = data;
        fetch(`../api/collection?gameId=${gameId}&userId=${auth.user?.profile.sub}`,{
            method: 'POST',
            body: JSON.stringify(bodyData)
        })
            .then((response) => response.json())
            .then(() => {
                userGames.push(gameId);
                if(data!==null) {
                    data.owned = true;
                }
                setRefreshToggle(!refreshToggle);
            });
    }

    const removeGameFromCollection = (gameId: number) => {
        fetch(`../api/collection?gameId=${gameId}&userId=${auth.user?.profile.sub}`,{
            method: 'DELETE',
        })
            .then((response) => response.json())
            .then(() => {
                const index = userGames.indexOf(5);
                if (index > -1) { // only splice array when item is found
                    userGames.splice(index, 1); // 2nd parameter means remove one item only
                }
                if(data!==null) {
                    data.owned = false;
                }

                setRefreshToggle(!refreshToggle);
            });
    }


    if (auth.isLoading) {
        return <p>Loading...</p>;
    }

    if (auth.error) {
        return <div>Encountering error... {auth.error.message}</div>;
    }

    if (!auth.isAuthenticated) {
        auth.signinRedirect();
    }

    if(data== null) {
        fetch(`${base_url}/users/${auth.user?.profile.sub}`)
            .then((response) => {
                    return response.json();
                }
            ).then((data) => {
            setUserGames(data.games);
            console.dir(userGames);
            setRefreshToggle(!refreshToggle);
        });
        fetch(`${base_url}/games/${params?.gameId}?user_id=${auth.user?.profile.sub}`)
            .then((response) => response.json())
            .then((data) => {
                setData(data);
                setLoading(false);
                console.dir(data);
            }).catch((error) => {
            setError(true);
            setLoading(false);
            console.error(error);
        });
    }
  if (loading) return <p>Loading...</p>;
  if (error) return <p>There is no game for that id...</p>;
  if (!data) return null;
  return (
      <>
          <header>
              <Header setUserGames={setUserGames} setUserGameDetails={()=>{}} />
          </header>
          <main className="flex min-h-screen flex-col items-center justify-between p-5 md:p-24" >
              <div className="w-full col-span-full md:w-8/12 m-auto">
                  <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                      <div
                          className="content-center bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                          <img className="rounded-t-lg" src={data.image} alt=""/>
                      </div>
                      <div className="p-5 md:col-span-2">
                          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{data.name} ({data.year})</h5>
                          <LinearSelector title="" selectedItem={data.status} setSelectedItem={updateGameStatus} data={[
                              { name: "Wish List", id: 1},
                              { name: "Pledged", id: 2},
                              { name: "Purchased", id: 3},
                              { name: "Shelf of shame", id: 4},
                              { name: "Played", id: 5}]} />
                          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                              Player Count: {data.min_players} to {data.max_players}<br/>
                              Playtime(minutes): {data.min_playtime} to {data.max_playtime} Average: {data.playing_time} <br />
                              <a className="text-green-800" href={"https://boardgamegeek.com/boardgame/"+data.id}>BGG Link</a>
                          </p>
                          {(auth.isAuthenticated && !data.owned) && <a
                              onClick={() => addGameToCollection(data.id)}
                              className="col-span-1 items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                              Add to Collection
                          </a>}
                          {(auth.isAuthenticated && data.owned) && <><a
                              className="col-span-1 items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                              Owned
                          </a>
                              <a
                                  onClick={() => removeGameFromCollection(data.id)}
                                  className="items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                  Remove From Collection
                              </a></>}
                      </div>

                  </div>

              <div className="p-5 col-span-full">
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400" dangerouslySetInnerHTML={{__html: data.description}}>
                  </p>

              </div>

              {data.is_expansion && <div className="p-5 col-span-full">
              <h2 className="col-span-full">Expansion of</h2>
                  <ul className="space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400 columns-1 sm:columns-1 md:columns-2 lg:columns-3">
                      {data.parent_game.map((parent: { id:string
                      name:string}) => (
                          <li className={userGames.includes(parseInt(parent.id))? "list-item col-span-2 text-green-600" : "list-item col-span-2"} key={parent.id}><Link
                              href={`/games/${parent.id}`}>{parent.name}</Link></li>
                      ))}
                  </ul>
              </div>}

              {data.expansions.length > 0 && <div className="p-5 col-span-full">
                  <h2>Expansions</h2>
              <ul className="space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400 columns-1 sm:columns-1 md:columns-2 lg:columns-3">
                  {data.expansions.map((expansion: { id:string
                      name:string}) => (

                  <li className={userGames.includes(parseInt(expansion.id))? "list-item col-span-2 text-green-600" : "list-item col-span-2"} key={expansion.id}><Link
                      href={`/games/${expansion.id}`}>{expansion.name}</Link></li>
              ))}
              </ul>
              </div>}
              </div>
          </main>
          <footer>
              <img src="https://boardgamegeek.com/image/7779581/dakarp" className="w-5" />
          </footer>
      </>

);
}
