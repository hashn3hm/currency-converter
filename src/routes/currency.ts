import { Router } from 'express';
import {  convertCurrency, getLatestRates } from '../controllers/CurrencyController';

const router = Router();

router.get("/currencies", getLatestRates);
router.get("/convert", convertCurrency);

export default router;
