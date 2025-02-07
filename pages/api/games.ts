import type { NextApiRequest, NextApiResponse } from 'next'
// @ts-expect-error Server-side request
import xml2json from 'xml2json';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const response:Response = await fetch(`${process.env.NEXT_PUBLIC_BGG_URL}/boardgame/${req.query.gameId}`);
    const textResponse = await response.text();
    const jsonString = xml2json.toJson(textResponse);
    const json = JSON.parse(jsonString);
    const boardgame = json.boardgames.boardgame

    let name:Array<object>|string|undefined = boardgame.name;
    if (Array.isArray(name)) {
        const names:Array<{ primary:string }> = boardgame.name;
        const nameTemp:object = names.filter(name => name.primary === 'true')[0];
        // @ts-expect-error the datasource has it as a key
        name = nameTemp['$t'];
    }
    let isExpansion = false;
    if (Array.isArray(boardgame.boardgameexpansion)) {
        const filterExpansions = boardgame.boardgameexpansion.filter((expansion: { inbound: string; }) => expansion.inbound === 'true');
        if (filterExpansions.length > 0) {
            isExpansion = true;
        }
    } else {
        isExpansion = boardgame.boardgameexpansion?.inbound === 'true';
    }

    const game = {
            id: boardgame.id,
            image: boardgame.image,
            name: name,
            year: boardgame.yearpublished,
            min_players: boardgame.minplayers,
            max_players: boardgame.maxplayers,
            min_playtime: boardgame.minplaytime,
            max_playtime: boardgame.maxplaytime,
            playing_time: boardgame.playing_time,
            is_expansion: isExpansion,
            loaded: true
        }

    res.status(200).json(game)
}
