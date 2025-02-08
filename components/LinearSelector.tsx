export function LinearSelector(props:{selectedItem:number; setSelectedItem: (id: number) => void; data: {name:string; id:number;}[]; title:string}) {

    return <div className="m-1 rounded-full bg-stone-600 pt-0.5 pb-0.5 pl-2 pr-2 w-fit">
            {(props.title) && <span className="pr-2 pl-2 font-bold">{props.title}</span>}
            <div className="relative inline-flex cursor-pointer items-center peer flex h-8 items-center gap-4 rounded-full px-3 border-slate-600 bg-slate-700 text-sm text-white">
        {props.data.map((item) => (
                <span className={item.id==props.selectedItem ? "pl-2 pr-2 pt-0.5 rounded-full w-fit m-auto h-6 bg-stone-600" : "" } key={item.id} onClick={()=>{props.setSelectedItem(item.id)}}>{item.name}</span>
            ))}
            </div>
        </div>
;
}