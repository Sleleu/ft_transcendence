import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError} from 'axios';
import { catchError } from 'rxjs';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class IntraService {
	constructor	(private prisma: PrismaService,
				 private readonly httpService: HttpService,
				 private readonly logger = new Logger(IntraService.name)) {}

	async login(dto: AuthDto)
	{
		const data = this.httpService
		  .get('https://api.intra.42.fr/oauth/token').pipe(
			catchError((error: AxiosError) => {
			  this.logger.error(error.response?.data);
			  throw 'Error ' + error + ' happened!';
			}),
		  );
		console.log(data.pipe.name);
		return data;
	}
}
