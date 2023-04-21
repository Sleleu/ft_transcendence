import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { AxiosError} from 'axios';
import { catchError } from 'rxjs';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class IntraService {
	constructor	(private prisma: PrismaService,
				 private readonly httpService: HttpService) {}

	async login(dto: AuthDto)
	{
		const data = this.httpService
		  .get('https://api.intra.42.fr/oauth/token').pipe(
			catchError((error: AxiosError) => {
			  throw new ForbiddenException(error.message);
			}),
		  );
		console.log(data.pipe.name);
		return data;
	}
}
