import { Controller, Get, Post, Res } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Response } from 'express';


@Controller('wallet')
export class WalletController {
    constructor(private walletService: WalletService){}

    @Get('get-bank-list')
    async getBankList(@Res() res: Response) {
      try {
        const bankList = await this.walletService.getBankList();
        res.json(bankList);
      } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Error fetching bank list" });
      }
    }
}
