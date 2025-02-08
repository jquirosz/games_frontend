import { FormEventHandler } from "react";
import {LinearSelector} from "./LinearSelector";

export function SearchHeader(props: { handleSearch: FormEventHandler<HTMLFormElement> | undefined; searchTerm: string | number | readonly string[] | undefined; setSearchTerm: (searchTerm: string) => void; expansions_chk: boolean | undefined; setExpansions_chk: (expansions: boolean) => void; loadUserGames: () => void; selectedStatus:number; setSelectedStatus: (status: number) => void; selectedPlayerCount:number; setSelectedPlayerCount:(selectedPlayerCount: number) => void;} ) {
    return <div className="p-5 m-auto rounded-3xl mt-5 bg-slate-700 w-fit ">
        <form className="max-w-md mx-auto mb-5" onSubmit={props.handleSearch}>
            <label htmlFor="default-search"
                   className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
            <div className="relative">
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                    </svg>
                </div>
                <input type="search" id="default-search"
                       value={props.searchTerm}
                       onChange={(e) => props.setSearchTerm(e.target.value)}
                       className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                       placeholder="Search Game name or id" required/>

                <button type="submit"
                        className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Search
                </button>
            </div>
        </form>

            <LinearSelector title="Status" selectedItem={props.selectedStatus} setSelectedItem={props.setSelectedStatus} data={[
                { name: "All", id: -1},
                { name: "Wish List", id: 1},
                { name: "Pledged", id: 2},
                { name: "Purchased", id: 3},
                { name: "Shelf of shame", id: 4},
                { name: "Played", id: 5}]} />
            <LinearSelector title="Player count" selectedItem={props.selectedPlayerCount} setSelectedItem={props.setSelectedPlayerCount} data={[
                { name: "All", id: -1},
                { name: "1", id: 1},
                { name: "2", id: 2},
                { name: "3", id: 3},
                { name: "4", id: 4},
                { name: "5", id: 5},
                { name: "6", id: 6}]} />
            <button onClick={() => props.loadUserGames()}
                    className="font-bold pl-4 pr-4 text-white rounded-full bg-stone-600 p-2">My
                games
            </button>
            <button onClick={() => {props.setExpansions_chk(!props.expansions_chk)}}
                    className={"ml-5 font-bold pl-4 pr-4 text-white rounded-full bg-stone-600 p-2" + (props.expansions_chk ? " bg-stone-800" : "")}>
                Include Expansions
            </button>
    </div>;
}