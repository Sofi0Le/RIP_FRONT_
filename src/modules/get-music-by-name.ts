export interface ITunesMusic {
    wrapperType: string
    artworkUrl100: string
    artistName: string
    collectionCensoredName: string
    trackViewUrl: string
}

export interface ITunesResult {
    resultCount: number
    results: ITunesMusic[]
}

export const getMusicByName = async (name = ''): Promise<ITunesResult> =>{
    return fetch(`https://itunes.apple.com/search?term=${name}`)
        .then((response) => response.json())
        .catch(()=> ({ resultCount:0, results:[] }))
}