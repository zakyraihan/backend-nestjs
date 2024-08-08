import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/app/auth/auth.guard';
import { QueryBuilderService } from './query-builder.service';

@UseGuards(JwtGuard)
@Controller('query-builder')
export class QueryBuilderController {
    constructor(private readonly queryBuilderService: QueryBuilderService) {}
    @Get('/latihan')
    async latihanController() {
        return this.queryBuilderService.latihan()
    }
}
