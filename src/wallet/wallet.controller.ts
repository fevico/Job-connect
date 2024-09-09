import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Response, Request } from 'express';
import { AuthenitcationGuard } from 'src/guards/auth.guard';


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

    @Get('get-balance')
    @UseGuards(AuthenitcationGuard)
    async getBalance(@Res() res: Response, @Req() req: Request) {
      const userId = req.user.id; // Assuming the user ID is stored in the request object
      try {
        const balance = await this.walletService.getBalance(userId);
        res.json(balance);
      } catch (error) {
        res.status(error.status || 500).json({ message: error.message || "Error fetching balance" });
      }
    }
}
