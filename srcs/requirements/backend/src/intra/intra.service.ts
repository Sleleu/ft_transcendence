import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiToken } from './intra.interface';
import { ConfigService } from '@nestjs/config';

interface User42 {
  
  client_id : string;
  redirect_uri : string;
  scope : string;
  state : string;
  response_type : string;

}

@Injectable()
export class IntraService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}
	async getToken(code : string) {
		const data = {
			grant_type : 'authorization_code',
			client_id : this.configService.get('CLIENT_ID'),
			client_secret : this.configService.get('CLIENT_SECRET'),
			code : code,
			redirect_uri : this.configService.get('REDIRECT_URI'),	
		};
		const config = {
			headers: {
			  'Content-Type': 'application/x-www-form-urlencoded',
			},
		  };
		  return axios.post('https://api.intra.42.fr/oauth/token', data, config)
		  .then((response)=> {
			// console.log(response.data)
			return (response.data);
		  })
		  .catch(error => {
			console.error(error);
		  });	  
	}

	async getProfile(accessToken : ApiToken) {
		const config = {
			headers : {
				'Authorization' : `Bearer ${accessToken.access_token}`
			}
		}
		// console.log("TOKEN TEST", accessToken.access_token);
		return axios.get('https://api.intra.42.fr/v2/me', config)
		.then((response)=> {
			const User = {
				email: response.data.email,
				login: response.data.login,
				avatar: response.data.image.link,
				id: response.data.id}
			//console.log('response.data : ', response.data);
			// console.log('User : ', User);
			return User;
		})
		.catch(error => {
			console.log('An error occured : ', error);
		});
	}

//   async getToken() : Promise<ApiData> {

//     const params = new URLSearchParams();
//     params.append('grant_type', 'client_credentials');
//     params.append('client_id', process.env.CLIENT_ID ? process.env.CLIENT_ID : 'null');
//     params.append('client_secret', process.env.CLIENT_SECRET ? process.env.CLIENT_SECRET : 'null');
//     params.append('response_type', 'code');
//     const config = {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//     };
  
//     return axios.post('https://api.intra.42.fr/oauth/token', params, config)
//     .then((response)=> {
//       console.log(response.data)
//       return (response.data);
//     })
//     .catch(error => {
//       console.error(error);
//     });
//   }

//   async getUser() {

//     const params = new URLSearchParams();
//     params.append('client_id', process.env.CLIENT_ID ? process.env.CLIENT_ID : 'null');
//     params.append('client_secret', process.env.CLIENT_SECRET ? process.env.CLIENT_SECRET : 'null');
//     params.append('response_type', 'code');
//     params.append('redirect_uri', process.env.REDIRECT_URI ? process.env.REDIRECT_URI : 'null');
//     params.append('scope', 'public');
//     const config = {
//       headers: {
//         'Content-Type': 'application/x-www-form-urlencoded',
//       },
//       params : params,
//     };

//     axios.get('https://api.intra.42.fr/oauth/authorize')
//     .then((response)=> {
//       console.log(response.data)
//       return (response.data);
//     })
//     .catch(error => {
//       console.error(error);
//     });
//   }

}
