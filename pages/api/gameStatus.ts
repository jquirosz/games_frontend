import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    const response:Response = await fetch(`${process.env.NEXT_PUBLIC_SERVICE_HOST}/users/${req.query.userId}/games/${req.query.gameId}/status/${req.query.status}`, {
        method: 'PUT'
    });
    const textResponse = await response.json();

    res.status(200).json(textResponse)
}
