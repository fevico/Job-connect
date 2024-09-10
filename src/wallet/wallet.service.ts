import { HttpException, Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import axios from 'axios';
import { HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Wallet } from './shema/wallet.schema';
import { Model } from 'mongoose';

@Injectable()
export class WalletService {
  constructor(
    @InjectModel(Wallet.name) private walletModel: Model<Wallet>,

  ){}
    
    async getBankList() {
        const options = {
          method: 'GET',
          url: `https://strowallet.com/api/banks/lists/`,
          params: {
            public_key: process.env.PUBLIC_KEY,
          },
          headers: {
            'Content-Type': 'application/json',
          },
        };
    
        try {
          const response = await axios(options);
          return response.data;
        } catch (error) {
          console.error('Error fetching bank list:', error);
          throw new HttpException('Error fetching bank list', HttpStatus.INTERNAL_SERVER_ERROR); 
        }
      }

    async getAccountName(req) {
      const {bank_code, account_number} = req.query

        const options = {
          method: 'GET',
          url: `https://strowallet.com/api/banks/get-customer-name/`,
          params: {
            public_key: process.env.PUBLIC_KEY,
            account_number: account_number,
            bank_code: bank_code
          },
          headers: {
            'Content-Type': 'application/json',
          },
        };
    
        try {
          const response = await axios(options);
          return response.data;
        } catch (error) {
          console.error('Error fetching bank list:', error);
          throw new HttpException('Error fetching bank list', HttpStatus.INTERNAL_SERVER_ERROR); 
        }
      }

      async bankTransfer(req: any) {
        const { bank_code, account_number, narration, amount, name_enquiry_reference } = req.body;
    
        const options = {
            method: 'POST',
            url: `https://strowallet.com/api/banks/request/`,
            params: {
                public_key: process.env.PUBLIC_KEY,
                account_number,
                bank_code,
                name_enquiry_reference,
                narration,
                amount,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        };
    
        try {
            const response = await axios(options);
    
            // Check if the response indicates failure
            if (response.data.success === false) {
                // Throw an error with the specific message from the response
                throw new UnprocessableEntityException(response.data.message || 'Error making transfer, please try again later');
            }
    
            console.log(response.data);
            return response.data;
    
        } catch (error) {
    
            // If the error is an AxiosError (network issues, etc.)
            if (axios.isAxiosError(error)) {
                throw new HttpException('Error making bank transfer, please check your network connection or try again later', HttpStatus.INTERNAL_SERVER_ERROR);
            }
    
            // If it's some other error (like an unhandled response error)
            throw new UnprocessableEntityException("withdrawer filed please try again later");
        }
    }
    
    

      async getBalance(userId: string) {
        const walletBalance = await this.walletModel.findOne({ owner: userId });
        if (!walletBalance) {
          throw new UnauthorizedException("No wallet found for the user");
        }
        return walletBalance.balance;
      }
}
