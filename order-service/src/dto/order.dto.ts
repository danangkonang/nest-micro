import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StoreOrderDto {
  email: string;
  status: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => Menu)
  menu: Menu[];
  total: number;
}

export class Menu {
  menu_id: string;
  name: string;
  qty: number;
  sub_total: number;
}

export class FindMenuDto {
  name: string;
  price: number;
}

export class StoreMenuDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;
}
