import { Body, Controller, Post } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryDto } from './dto';

@Controller('history')
export class HistoryController {
    constructor(private historyService: HistoryService) {}

    @Post('')
    async addHistory(@Body() dto:HistoryDto) {
        return this.historyService.newEntry(dto);
    }
}
