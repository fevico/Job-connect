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
}
