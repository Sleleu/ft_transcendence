import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryDto, HistoryID } from './dto';

@Controller('history')
export class HistoryController {
    constructor(private historyService: HistoryService) {}

    @Post('')
    async getHistory(@Body() dto:HistoryID) {
        return this.historyService.getUserHistory(dto.id);
    }

    @Post('/add')
    async addHistory(@Body() dto:HistoryDto) {
        return this.historyService.newEntry(dto);
    }

}
