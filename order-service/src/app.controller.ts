import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { StoreMenuDto, StoreOrderDto } from './dto/order.dto';
import { RmqService } from './rmq/rmq.service';

@Controller('order')
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly rmqService: RmqService,
  ) {}

  @Get('/menu')
  @UseGuards(AuthGuard)
  async findAllmenu(@Res() res): Promise<JSON> {
    try {
      const findAllmenu = await this.appService.findAllmenu();
      return res.status(HttpStatus.OK).json({
        data: findAllmenu,
        message: 'Successfully',
        statusCode: HttpStatus.OK,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        error: err.message,
      });
    }
  }

  @Post('/menu')
  @UseGuards(AuthGuard)
  async createMenu(
    @Res() res,
    @Body() storeMenuDto: StoreMenuDto,
  ): Promise<JSON> {
    try {
      const menu = await this.appService.findAllmenuByName(storeMenuDto.name);
      if (menu) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Name Alredy Exists',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }
      const storemenu = await this.appService.storeMenu(storeMenuDto);
      return res.status(HttpStatus.OK).json({
        data: storemenu,
        message: 'Successfully',
        statusCode: HttpStatus.OK,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        error: err.message,
      });
    }
  }

  @Post()
  @UseGuards(AuthGuard)
  async createOrder(
    @Req() req,
    @Res() res,
    @Body() payload: StoreOrderDto,
  ): Promise<JSON> {
    try {
      payload.email = req.user.email;
      payload.status = 'PENNDING';
      let total = 0;
      await Promise.all(
        payload.menu.map(async (item, idx) => {
          try {
            const menu = await this.appService.findAllmenuById(item.menu_id);
            const tt = menu.price * item.qty;
            payload.menu[idx].sub_total = tt;
            payload.menu[idx].name = menu.name;
            total = total + tt;
          } catch (err) {
            return res.status(HttpStatus.BAD_REQUEST).json({
              message: 'Menu Id Not Found',
              statusCode: HttpStatus.BAD_REQUEST,
            });
          }
        }),
      );
      payload.total = total;
      const storeorder = await this.appService.storeOrder(payload);
      this.rmqService.setMessage('orders', JSON.stringify(storeorder));
      return res.status(HttpStatus.OK).json({
        data: storeorder,
        message: 'Successfully',
        statusCode: HttpStatus.OK,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        error: err.message,
      });
    }
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAllOrder(@Res() res): Promise<JSON> {
    try {
      const findAllOrder = await this.appService.findAllOrder();
      return res.status(HttpStatus.OK).json({
        data: findAllOrder,
        message: 'Successfully',
        statusCode: HttpStatus.OK,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        error: err.message,
      });
    }
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  async findOrderById(@Res() res, @Param('id') id): Promise<JSON> {
    try {
      const findAllOrder = await this.appService.findOrderById(id);
      return res.status(HttpStatus.OK).json({
        data: findAllOrder,
        message: 'Successfully',
        statusCode: HttpStatus.OK,
      });
    } catch (err) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal Server Error',
        error: err.message,
      });
    }
  }
}
