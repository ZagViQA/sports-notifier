import axios from 'axios';

export default async function handler(req, res) {
    try {
        const response = await axios.get('https://tennisapi1.p.rapidapi.com/api/tennis/events/live', {
            headers: {
                'x-rapidapi-key': '599fc0fb66msh1c07f6da9e19873p1425cbjsn2aab4a95cf01',
                'x-rapidapi-host': 'tennisapi1.p.rapidapi.com'
            }
        });
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ error: err.message, data: err.response?.data });
    }
}
