type LocationParams = {
    latitude: number,
    longtitude: number,
    address: string,
};

export default class Location {
    latitude: number;
    longtitude: number;
    address: string;

    constructor({ latitude, longtitude, address }: LocationParams) {
        this.latitude = latitude;
        this.longtitude = longtitude;
        this.address = address;
    }
    
    toJSON(): Record<string, unknown> {
        return {
            latitude: this.latitude,
            longtitude: this.longtitude,
            address: this.address,
        };
    }

    static fromJSON(json: Record<string, unknown>): Location {
        return new Location({
            address: json.address as string,
            latitude: json.latitude as number,
            longtitude: json.longtitude as number,
        });
    }
}