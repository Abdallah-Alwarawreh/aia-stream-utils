import axios, { AxiosResponse } from 'axios';

const client = axios.create();

interface APIItem {
    _id: string;
    ItemId: string;
    Address: string;
    CreationTime: string;
    CreationTick: number;
    UserId: string;
    UserPlatform: Platform;
    DisplayName: string;
    EventType: EventType;
    EventRedeemValue: number;
    TimeModifier: number;
    PositionX: number;
    PositionY: number;
    PositionZ: number;
    RotationX: number;
    RotationY: number;
    RotationZ: number;
    ImageUrl: string;
}

interface APIScrap {
    _id: string;
    UserId: string;
    DisplayName: string;
    Platform: Platform;
    ScrapTotal: number;
    ScrapCurrent: number;
}

interface StreamStatistics {
    rank: number;
    minutes_streamed: number;
    avg_viewers: number;
    max_viewers: number;
    hours_watched: number;
    followers: number;
    followers_total: number;
}

enum Platform {
    Twitch = 0,
    Youtube = 1,
}

enum EventType {
    Bits = 0,
    Donation = 1,
    Subscription = 2,
    GiftedSubscription = 3,
    ChannelPoints = 4
}

const GetScrapData = async (): Promise<APIScrap[]> => {
    // /scrap
    const response: AxiosResponse<APIScrap[]> = await client.get('https://aiastream.onrender.com/scrap');
    return response.data;
}

const GetItemData = async (): Promise<APIItem[]> => {
    // /item
    const response: AxiosResponse<APIItem[]> = await client.get('https://aiastream.onrender.com/item');
    return response.data;
}


const GetStreamData = async (): Promise<StreamStatistics> => {
    // https://twitchtracker.com/api/channels/summary/the_aia
    const response: AxiosResponse<StreamStatistics> = await client.get('https://twitchtracker.com/api/channels/summary/the_aia');
    return response.data;
}

export { GetScrapData, GetItemData, APIItem, APIScrap, EventType, Platform, GetStreamData };