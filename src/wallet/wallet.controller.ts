import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Response, Request } from 'express';


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

    @Get('get-account-name')
    async getAccountName(@Res() res: Response, @Req() req: Request) {
      try {
        const accountName = await this.walletService.getAccountName(req);
        res.json(accountName);
      } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Error fetching account name" });
      }
    }

    @Post('bank-transfer')
    async bankTransfer(@Res() res: Response, @Req() req: Request) {
      try {
        const transferStatus = await this.walletService.bankTransfer(req);
        res.json(transferStatus);
      } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Error transferring funds" });
      }
    }
}
