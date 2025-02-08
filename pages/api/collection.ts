import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const base_url = process.env.NEXT_PUBLIC_SERVICE_HOST;
    const url =`${base_url}/users/${req.query.userId}/games/${req.query.gameId}`;
    let data = {};
    if (req.method === 'POST') {
        const headers = new Headers({ 'Content-Type': 'application/json' });
        const response:Response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: req.body
        });

        data = await response.json();

    } else if (req.method === 'DELETE'){
        const response:Response = await fetch(url, {
            method: 'DELETE',
            body: JSON.stringify(req.body)
        });
        data = await response.json();
    }

    res.status(200).json(data) ;
}