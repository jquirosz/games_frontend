import {Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, useState} from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function GameCard(props: { game: { loaded: boolean; status:number; id: Key | null | undefined; is_expansion: boolean; image: string | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; min_players: string | number | bigint | boolean | ReactElement | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; max_players: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; min_playtime: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; max_playtime: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; playing_time: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; year: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }; loadGame: (arg0: any) => void; showExpansions: any; authenticated: any; owned: any; addGameToCollection: (arg0: any) => void; }) {
    const [status] = useState<Record<string, string>>({ "1": "Wish List", "2":"Pledged", "3":"Purchased", "4":"Shelf of shame", "5":"Played"});
    if (!props.game.loaded){
        props.loadGame(props.game.id);
    }
    return <div key={props.game.id}
            className="relative max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <a href={`/games/${props.game.id}`}>
            <img className="rounded-t-lg" src={props.game.image} alt=""/>
        </a>
        <div className="p-5 relative">
            <a href={`/games/${props.game.id}`}>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{props.game.name}</h5>
            </a>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                Player Count: {props.game.min_players} - {props.game.max_players}<br/>
                Playtime(min): {props.game.min_playtime} - {props.game.max_playtime}
                {props.game.playing_time && <>(Avg. {props.game.playing_time})</>}<br />
                {props.game.year}<br/>
                {status[props.game.status?.toString()]}<br/>
            </p>

        </div>
            {(props.authenticated && !props.owned) && <a
                onClick={() => props.addGameToCollection(props.game.id)}
                className="absolute end-2.5 bottom-2.5 items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Add to Collection
            </a>}
            {(props.authenticated && props.owned) && <a
                className="absolute bottom-2.5 end-2.5 items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                Owned
            </a>}
    </div>;
}
