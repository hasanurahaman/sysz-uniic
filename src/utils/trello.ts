interface TrelloCardData {
    title: string;
    description: string;
    email?: string;
}

type RequestType = 'feature' | 'tool' | 'bug';

export async function submitTrelloCard(type: RequestType, data: TrelloCardData): Promise<void> {
    const apiKey = import.meta.env.VITE_TRELLO_API_KEY;
    const token = import.meta.env.VITE_TRELLO_TOKEN;

    let listId = '';
    switch (type) {
        case 'feature':
            listId = import.meta.env.VITE_TRELLO_LIST_FEEDBACK;
            break;
        case 'tool':
            listId = import.meta.env.VITE_TRELLO_LIST_TOOLS;
            break;
        case 'bug':
            listId = import.meta.env.VITE_TRELLO_LIST_BUGS;
            break;
    }

    if (!apiKey || !token || !listId) {
        throw new Error('Missing Trello configuration');
    }

    const description = `
**Sender:** ${data.email || 'Anonymous'}

**Description:**
${data.description}
    `.trim();

    const params = new URLSearchParams({
        key: apiKey,
        token: token,
        idList: listId,
        name: data.title,
        desc: description,
        pos: 'top'
    });

    const response = await fetch(`https://api.trello.com/1/cards?${params.toString()}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to submit feedback to Trello');
    }
}
