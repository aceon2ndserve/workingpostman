import { Table, Model, Column } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column
  address: string;
  @Column
  city: string;
  @Column
  postalCode: string;
}
