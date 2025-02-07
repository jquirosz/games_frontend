import type { NextApiRequest, NextApiResponse } from 'next'
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

    let name = boardgame.name;
    if (Array.isArray(name)) {
        const names:Array<object> = boardgame.name;
        name = names.filter(name => name.primary === 'true')[0]['$t'];
    }
    let isExpansion = false;
    if (Array.isArray(boardgame.boardgameexpansion)) {
        const filterExpansions = boardgame.boardgameexpansion.filter(expansion => expansion.inbound === 'true');
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
