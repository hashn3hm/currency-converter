import axios, { AxiosInstance } from 'axios';

interface CurrencyParams {
    base_currency?: string;
    currencies?: string;
    date?: string;
}

interface ApiResponse<T> {
    data: T;
    error?: string;
}

class FreeCurrencyService {
    private baseUrl: string;
    private apiKey: string;
    private axiosInstance: AxiosInstance;

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error('API key is required for FreeCurrencyService');
        }

        this.apiKey = apiKey;
        this.baseUrl = 'https://api.freecurrencyapi.com/v1/';

        this.axiosInstance = axios.create({
            baseURL: this.baseUrl,
            headers: { apikey: this.apiKey }
        });
    }

    private async call<T>(endpoint: string, params: CurrencyParams = {}): Promise<ApiResponse<T>> {
        try {
            const response = await this.axiosInstance.get<T>(endpoint, { params });
            return { data: response.data };
        } catch (error: any) {
            console.error('API Error:', error.message);
            return { data: {} as T, error: error.message };
        }
    }

    async status() {
        return this.call('status');
    }

    async currencies(params?: CurrencyParams) {
        return this.call('currencies', params);
    }

    async latest(params?: CurrencyParams) {
        return this.call('latest', params);
    }

    async historical(params?: CurrencyParams) {
        return this.call('historical', params);
    }
}

export default FreeCurrencyService;
