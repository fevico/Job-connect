import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { HttpStatus } from '@nestjs/common';

@Injectable()
export class WalletService {
    
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
      const {bank_code, account_number} = req.body

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

    async bankTransfer(req) {
      const {bank_code, account_number, narration, amount, name_enquiry_reference} = req.body
        const options = {
          method: 'POST',
          url: `https://strowallet.com/api/banks/request/`,
          params: {
            public_key: process.env.PUBLIC_KEY,
            account_number: account_number,
            bank_code: bank_code,
            name_enquiry_reference: name_enquiry_reference,
            narration: narration,
            amount: amount
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
}
