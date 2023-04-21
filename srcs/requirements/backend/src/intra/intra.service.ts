import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { AxiosError, AxiosResponse } from 'axios';
import { Observable, catchError, map } from 'rxjs';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';

interface Props {
	fact: string;
	length: number;
}

interface Test extends Observable<AxiosResponse<any, any>> {
	fact: string;
	length: number;
}

@Injectable()
export class IntraService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  async login() {
    const request = this.httpService
      .get('https://api.intra.42.fr/oauth/authorize')
	  .pipe(map((res) => res.data))
	  .pipe(
        catchError((error: AxiosError) => {
          console.log(error);
          throw new ForbiddenException(error.status);
        }),
      );
    console.log(request);
    return request;
  }
}
