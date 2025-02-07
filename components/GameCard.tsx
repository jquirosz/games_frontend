
export function GameCard(props) {
    if (!props.game.loaded){
        props.loadGame(props.game.id);
    }
    return (props.showExpansions || (!props.showExpansions && !props.game.is_expansion)) &&
        <div id={props.game.id} key={props.game.id}
            className="relative max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        <a href={`/games/${props.game.id}`}>
            <img className="rounded-t-lg" src={props.game.image} alt=""/>
        </a>
        <div className="p-5 relative">
            <a href={`/games/${props.game.id}`}>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{props.game.name}</h5>
            </a>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                Player Count: {props.game.min_players} to {props.game.max_players}<br/>
                Playtime(minutes): {props.game.min_playtime} to {props.game.max_playtime}<br />
                Average time {props.game.playing_time} minutes <br />
                {props.game.year}<br/>
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
