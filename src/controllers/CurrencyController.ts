import { Request, Response } from "express";
// Ignore TypeScript check
// @ts-ignore
// import Freecurrencyapi from '@everapi/freecurrencyapi-js';

import FreeCurrencyService from '../services/FreeCurrencyService';
import { MESSAGES } from "../constants/messages"; // Constants ka path
import ResponseHandler from "../utils/response";
import { STATUS_CODES } from "../constants/statusCodes";
import { FREECURRENCYAPI_KEY } from "../constants/environment";

// Freecurrencyapi instance
// const freecurrencyapi = new FreeCurrencyService(FREECURRENCYAPI_KEY);

// export const convertCurrency = async (req: Request, res: Response): Promise<void> => {
//     try {
//         const { from, to, amount } = req.body;

//         if (!from || !to || !amount) {
//             ResponseHandler.error("Please provide from, to, and amount");
//             return;
//         }

//         // Fetch exchange rate
//         const response = await freecurrencyapi.latest({
//             base_currency: from,
//             currencies: [to],
//         });

//         const rate = response.data[to];
//         if (!rate) {
//             ResponseHandler.error("Invalid currency code");
//             return;
//         }

//         const convertedAmount = amount * rate;

//         ResponseHandler.success("Currency converted successfully", {
//             from,
//             to,
//             amount,
//             convertedAmount,
//             rate,
//         });
//     } catch (err) {
//         console.error("Currency Conversion Error:", err);
//         ResponseHandler.error(MESSAGES.INTERNAL_SERVER_ERROR, STATUS_CODES.INTERNAL_SERVER_ERROR);
//     }
// };

const currencyService = new FreeCurrencyService(FREECURRENCYAPI_KEY || '');

interface RawLatestResponse {
    data: {
        data: {
            [currency: string]: number;
        };
    };
}
export const getLatestRates = async (req: Request, res: Response): Promise<void> => {
    const params = req.query as any;
    const result = await currencyService.latest(params);

    if (result.error) {
        ResponseHandler.error(result.error);
        return;
    }

    ResponseHandler.success("Currency Rate successfully", result.data);
};

export const convertCurrency = async (req: Request, res: Response): Promise<void> => {
    try {
        const { from, to, amount } = req.query;
        if (!from || !to || !amount) {
            ResponseHandler.error('Missing required query parameters: from, to, amount');
            return;
        }

        // Cast the response to LatestResponse to let TypeScript know about the rates property
        const data = await currencyService.latest({ base_currency: from as string }) as RawLatestResponse;


        console.log('data', data);
        if (!data || !data.data || !data.data.data) {
            ResponseHandler.error('Error fetching conversion rates');
            return;
        }

        // The API returns the rates object under data.data.data.
        const rates = data.data.data;
        const toRate = rates[to as string];
        if (!toRate) {
            ResponseHandler.error(`Conversion rate for ${to} not available`);
            return;
        }

        const convertedAmount = Number(amount) * toRate;

        ResponseHandler.success("Currency converted successfully", {
            from,
            to,
            amount,
            convertedAmount,
            toRate,
        });

        // res.json({ from, to, amount, convertedAmount });
    } catch (error) {
        ResponseHandler.error('Error converting currencies');
        return;
    }
};