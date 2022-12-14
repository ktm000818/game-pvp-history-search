import axios from "axios";

export type Version = 'v1' | 'v2';
export type Region = 'eu' | 'na' | 'ap' | 'kr';
export type MatchFilter = 'escalation' | 'spikerush' | 'deathmatch' | 'competitive' | 'unrated' | 'replication';

export interface AllProps {
    name?: string;
    tag?: string;
    onlyname?: boolean;
    version?: Version;
    region?: Region;
    puuid?: string;
    matchId?: string;
    matchFilter?: MatchFilter;
}

const baseUrl = "https://api.henrikdev.xyz";

export function getAllUserData(props: AllProps) {

    let arr = [
        getMatchHistoryByPUUID(props),
        getAccountDataTest(props),
        // getMMRData(props),
        // getMMRHistory(props),
        getMMRDataByPUUID(props),
        getMMRHistoryByPUUID(props),
        getAllAvailableOffers(),
        getFeaturedBundle(),
    ]

    return Promise.all(arr)

}

export async function getAccountData(name: string, tag: string, onlyname?: boolean): Promise<object> {
    try {
        const response = await axios.get(`${baseUrl}/valorant/v1/account/${name}/${tag}`);

        if (onlyname) {
            if (response.status === 200) {
                const { name, tag } = response.data.data;
                return { name: `${name}#${tag}` }
            } else {
                return {};
            }

        } else {
            if (response.status === 200) {
                return response.data?.data;
            } else {
                return {};
            }
        }
    } catch (error) {
        console.log(error)
        return { name: "검색결과가 없습니다." };
    }

}

export function getAccountDataTest(props: AllProps) {
    return axios.get(`${baseUrl}/valorant/v1/account/${props.name}/${props.tag}`)
}

//MMR
export function getMMRData(props: AllProps) {
    return axios.get(`${baseUrl}/valorant/${props.version}/mmr/${props.region}/${props.name}/${props.tag}`);
}

export function getMMRDataByPUUID(props: AllProps) {
    return axios.get(`${baseUrl}/valorant/${props.version}/by-puuid/mmr/${props.region}/${props.puuid}`);
}

export function getMMRHistory(props: AllProps) {
    return axios.get(`${baseUrl}/valorant/v1/mmr-history/${props.region}/${props.name}/${props.tag}`);
}

export function getMMRHistoryByPUUID(props: AllProps) {
    return axios.get(`${baseUrl}/valorant/v1/by-puuid/mmr-history/${props.region}/${props.puuid}`);
}
//MMR

//MATCH
export function getMatchHistoryByPUUID(props: AllProps) {
    return axios.get(`${baseUrl}/valorant/v3/by-puuid/matches/${props.region}/${props.puuid}?filter=${props.matchFilter}`);
}

export function getMatchData(props: AllProps){
    return axios.get(`${baseUrl}/valorant/v2/match/${props.matchId}`);
}
//MATCH

// non params 
export function getAllAvailableOffers() {
    return axios.get('https://api.henrikdev.xyz/valorant/v1/store-offers');
}

export function getFeaturedBundle() {
    return axios.get('https://api.henrikdev.xyz/valorant/v1/store-featured');
}
